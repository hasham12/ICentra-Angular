import { Injectable, EventEmitter } from '@angular/core';
declare var $: any;
import { Utils } from '../../utils';
import { CreateUtils } from './create.utils';
import 'fabric';
import { createComponent } from '@angular/compiler/src/core';

declare const fabric: any;

@Injectable()
export class CreateGlobals {
    initEventsEmitter: EventEmitter<number> = new EventEmitter();
    /**
     * canvas object of the design area.
     */
    canvas: any;
    /**
     * Template id of the loaded admin template in canvas.
     */
    loadedtemplateid: any = 0;
    /**
     * Index of the canvas position to handle multiple canvases.
     */
    canvasindex: number = 0;
    /**
     * Array of canvas to handle multiple canvases.
     */
    canvasarray = [];
    /**
     * Index of the page position to handle multiple canvases.
     */
    pageindex: number = -1;
    isNew: boolean = false;
    /**
     * selected current canvas id.
     */
    currentcanvasid: number = 0;
    savestateaction: boolean = true;
    selected: any;
    //https://www.papersizes.org/a-sizes-in-pixels.htm
    canvassize: any = {
        width: 1240,
        height: 1754
    };
    templates: any = [];
    origtemplates: any = [];
    images: any = [];
    origimages: any = [];
    canvasScale: number = 1;
    tempnotes: any;
    http: any;
    headers: any;
    loading: boolean = false;
    textEditor: boolean = false;
    imageEditor: boolean = false;
    imgwidth: any;
    imgheight: any;
    wh: any;
    zoomPercent: any;
    pagewidthsize: any;
    pageheightsize: any;
    adminuser: any;
    fitZoomEvent = new EventEmitter();
    rightSideBarType = new EventEmitter();
    rightSideBarVisible = new EventEmitter();

    constructor() {
    }

    public setHttp(http, headers) {
        this.http = http;
        this.headers = headers;
    }

    // Reset Zoom Canvas - reset to original size of canvas.
    resetZoom() {
        this.resetState();
        // resize canvas to new width / height
        this.setCanvasWidthHeight(this.canvas.getWidth() * (1 / this.canvasScale), this.canvas.getHeight() * (1 / this.canvasScale));
        for (var j = 0; j < this.canvasindex; j++) {
            if (!this.canvasarray[j]) continue;
            var objects = this.canvasarray[j].getObjects();
            // iterate all objects in canvas to resize it.
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;
                var tempScaleX = scaleX * (1 / this.canvasScale);
                var tempScaleY = scaleY * (1 / this.canvasScale);
                var tempLeft = left * (1 / this.canvasScale);
                var tempTop = top * (1 / this.canvasScale);
                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;
                objects[i].setCoords();
            }
            this.canvasScale = 1;
            this.canvasarray[j].renderAll();
        }
        this.updateIconPos();
    }
    saveState() {
        if (this.savestateaction && this.canvas.state) {
            var newstate = [];
            var state = this.canvas.state;
            var index = this.canvas.index;
            for (var i = 0; i <= index; i++) {
                newstate.push(state[i]);
            }
            state = newstate;
            var myjson = JSON.stringify(this.canvas);
            state[++index] = myjson;
            if (state.length >= 80) state = state.splice(-5, 5);
            this.canvas.state = state;
            this.canvas.index = index;
        }
    }
    updateIconPos() {
        let self = this;
        $("#canvaspages").find(".page").each(function () {
            let nextid = this.id;
            nextid = nextid.replace("page", "");
            self.adjustIconPos(nextid);
            //self.adjustIconPos(nextid);
        });
    }
    adjustIconPos(id) {
        //set duplicate / delete icons left top positions.
        var p = $("#page" + id);


        var position = p.position();
        // .outerWidth() takes into account border and padding.
        var width = p.outerWidth();
        var height = p.outerHeight();

        var noteleft = width - 30;
        $("#duplicatecanvas" + id).css({
            position: "absolute",
            top: 10 + "px",
            left: (position.left + width + 10) + "px"
        }).show();
        $(".toggle").css("margin-left", noteleft + "px");
        $("#addnewpagebutton" + id).css({
            position: "absolute",
            top: 25 + "px",
            left: (position.left + width + 13) + "px"
        }).show();
        $("#deletecanvas" + id).css({
            position: "absolute",
            top: 50 + "px",
            left: (position.left + width + 15) + "px"
        }).show();
        $("#moveup" + id).css({
            position: "absolute",
            top: (height / 2 - 10) + "px",
            left: (position.left + width + 10) + "px"
        }).show();
        $("#pagenumber" + id).css({
            position: "absolute",
            top: (height / 2 + 10) + "px",
            left: (position.left + width + 10) + "px"
        }).show();
        var hiddenpages = 0;
        for (var i = 0; i < this.pageindex && i < parseInt(id) + 1; i++) {
            if (!$("#page" + i).is(":visible")) hiddenpages++;
        }
        $("#pagenumber" + id).html(parseInt(id) + 1 - hiddenpages);
        $("#movedown" + id).css({
            position: "absolute",
            top: (height / 2 + 15) + "px",
            left: (position.left + width + 10) + "px"
        }).show();
        if (id == this.pageindex) $("#movedown" + id).hide();
        if ($(".page:visible").length == 1) {
            $('.deletecanvas').css('display', 'none');
            $('.moveup').css('display', 'none');
            $('.movedown').css('display', 'none');
        }
    }
    /*
     * Function Usage: Zoom out/Resize canvas to fit the display area (right side view area).
     * check if the canvas width is greater than window right side then call zoom out function.
     */
    resizeDownCanvas() {
        if (Math.round(this.canvas.height) > ($(".template-canvas-wrap").height() - 180) * 2) {
            console.log($(".template-canvas-wrap").height());
            this.zoomOut();
            this.resizeDownCanvas();
        }
    }
    resizeCanvas() {
        if (Math.round(this.canvas.height * 1.1) > ($(".template-canvas-wrap").height() - 180) * 2) {
            this.resizeSmallerCanvas();
        }
        if (Math.round(this.canvas.height / 1.1) < ($(".template-canvas-wrap").height() - 350) * 2) {
            this.resizeBiggerCanvas();
        }
    }
    resizeSmallerCanvas() {
        if (Math.round(this.canvas.height * 1.1) > ($(".template-canvas-wrap").height() - 180) * 2) {
            this.zoomOut();
            this.resizeSmallerCanvas();
        }
    }
    resizeBiggerCanvas() {
        if (Math.round(this.canvas.height / 1.1) < ($(".template-canvas-wrap").height() - 350) * 2) {
            this.zoomIn();
            this.resizeBiggerCanvas();
        }
    }
    /*
    * Function Usage: Zoom In/Resize canvas to fit the display area (right side view area).
    * check if the canvas width is lesser than window right side then call zoom In function.
    */
    resizeUpCanvas() {
        if (Math.round(this.canvas.width) <= (window.innerWidth - $(".ic-editor-sidebar").width())) {
            this.zoomIn();
            this.resizeUpCanvas();
        }
    }

    resizeDownHeiCanvas() {
        if (Math.round(this.canvas.height) <= (window.innerHeight - $(".ic-editor-sidebar").height() - 100)) {
            console.log("CANVAS HEIGHT =" + Math.round(this.canvas.height));
            console.log(window.innerWidth - $(".ic-editor-sidebar").height());
            this.zoomOut();
            this.resizeDownHeiCanvas();
        }
    }

    resizeUpHeiCanvas() {
        if (Math.round(this.canvas.height) <= (window.innerHeight - $(".ic-editor-sidebar").height() - 100)) {
            this.zoomIn();
            this.resizeUpHeiCanvas();
        }
    }

    resetCanvas() {
        $("#canvaspages").html('');
        this.pageindex = -1;
        this.canvasindex = 0;
        this.canvasarray = [];
        this.canvasScale = 1;
        this.updateZoomPercent();

        this.setEditorWorkAreaWidth();
    }
    setEditorWorkAreaWidth() {
        var maxWidth = window.innerWidth - $(".ic-editor-sidebar").width() - $(".sidebar-left").width() - $(".ic-editor-sidebar-right").width() - 10;
        $(".canvas-work-area").css("maxWidth", maxWidth + "px");
        this.updateIconPos();
    }
    resetState() {
        this.canvas.state = [];
        this.canvas.index = 0;
    }

    initCanvasEvents() {
        //add custom properties to canvas


        var self = this;
        window.onresize = function (event) {
            window.setTimeout(function () {
                self.setEditorWorkAreaWidth();
            }, 300);
        };
        $("body").mousedown(function (e) {
            e.stopImmediatePropagation();
            console.log(e.target.nodeName);
            if (e.target.nodeName != 'CANVAS' && e.target.nodeName == 'DIV' && !$(e.target).parents('.color-picker').length) {
                self.canvas.renderAll();
            }
        });

        function limitDrag(e) {
            // 	var obj = e.target;
            //   var canvas = obj.canvas;
            //   var top = obj.top;
            //   var left = obj.left;
            //   var zoom = canvas.getZoom();
            //   var pan_x = canvas.viewportTransform[4];
            //   var pan_y = canvas.viewportTransform[5];

            //   var c_width = canvas.width / zoom;
            //   var c_height = canvas.height / zoom;


            //   var w = obj.width * obj.scaleX
            //   var left_adjust, right_adjust
            //   if(obj.originX == "center") {
            // 	left_adjust = right_adjust = w / 2;
            //   } else {
            // 	left_adjust = 0;
            // 	right_adjust = w;
            //   }

            //   var h = obj.height * obj.scaleY;
            //   var top_adjust, bottom_adjust;
            //   if(obj.originY == "center") {
            // 	top_adjust = bottom_adjust = h / 2;
            //   } else {
            // 	top_adjust = 0;
            // 	bottom_adjust = h;
            //   }

            //   var top_margin = 0;
            //   var bottom_margin = 0;
            //   var left_margin = 0;
            //   var right_margin = 0;


            //   var top_bound = top_margin + top_adjust - pan_y;
            //   var bottom_bound = c_height - bottom_adjust - bottom_margin - pan_y;
            //   var left_bound = left_margin + left_adjust - pan_x;
            //   var right_bound = c_width - right_adjust - right_margin - pan_x;

            //   if( w > c_width ) {
            // 	obj.left=(left_bound);
            //   } else {
            // 	obj.left=(Math.min(Math.max(left, left_bound), right_bound));          
            //   }

            //   if( h > c_height ) {
            // 	obj.top=(top_bound);
            //   } else {
            // 	obj.top=(Math.min(Math.max(top, top_bound), bottom_bound));          
            //   }
        }
        this.canvas.on({
            'object:moving': (e) => { },
            'object:modified': (e) => {
                this.displayProperties(e);
                this.saveState();
            },
            'selection:created': (e) => {
                this.selectCanvas('divcanvas' + this.currentcanvasid);
                this.checktxt(e);
            },
            'object:selected': (e) => {
                this.selectCanvas('divcanvas' + this.currentcanvasid);
                this.displayProperties(e);
                this.checktxt(e);
            },
            'object:scaling': (e) => {
                this.updateimageproperties();
            },
            'selection:cleared': (e) => {
                this.selected = null;
                //this.resetPanels();
            },
            'selection:added': (e) => {
                this.saveState();
            },
            'selection:updated': (e) => {
                console.log('updated');
                this.displayProperties(e);
            },
            'mousemove': (e) => {
                this.canvas.renderAll();
            },
            'mousedown': (e) => {
                this.canvas.renderAll();
            }
        });

        $(".divcanvas").unbind('click').on('click', function (e) {
            e.preventDefault();
            self.selectCanvas('divcanvas' + $(this).data('id'));
        });
        $(".addnewpagebutton").unbind('click').on('click', function (e) {
            e.preventDefault();
            self.addnewpage();
        });
        $(".newpagebtn").unbind('click').on('click', function (e) {
            e.preventDefault();
            self.addnewpage();
        });
        $(".duplicatecanvas").unbind('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).attr('id');
            id = id.replace("duplicatecanvas", "");
            self.addNewCanvasPage(true, parseInt(id));
        });
        $(".deletecanvas").unbind('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).attr('id');
            id = id.replace("deletecanvas", "");
            id = "#page" + id;
            $(id).hide();
            self.updateIconPos();
        });
        $(".canvas-work-area").scroll(function () {
            self.updateIconPos();
        });

        $(".moveup").unbind('click').on('click', function (e) {
            var id = this.id;
            id = parseInt(id.replace("moveup", ""));

            if (id - 1 >= 0) {

                var currentcanvasjson = self.canvasarray[id].toDatalessJSON();
                var upcanvasjson = self.canvasarray[id - 1].toDatalessJSON();

                self.canvasarray[id - 1].loadFromDatalessJSON(currentcanvasjson);
                self.canvasarray[id - 1].renderAll();

                self.canvasarray[id].loadFromDatalessJSON(upcanvasjson);
                self.canvasarray[id].renderAll();
            }
        });

        $(".movedown").unbind('click').on('click', function (e) {
            var id = this.id;
            id = parseInt(id.replace("movedown", ""));

            if (id + 1 <= self.pageindex) {
                var currentcanvasjson = self.canvasarray[id].toDatalessJSON();
                var downcanvasjson = self.canvasarray[id + 1].toDatalessJSON();

                self.canvasarray[id + 1].loadFromDatalessJSON(currentcanvasjson);
                self.canvasarray[id + 1].renderAll();

                self.canvasarray[id].loadFromDatalessJSON(downcanvasjson);
                self.canvasarray[id].renderAll();
            }
        });
    }
    checktxt(e: any) {
        if (!this.canvas.getActiveObject()) {
            return;
        }
        var selObject = this.canvas.getActiveObject();
        if (selObject.type == 'i-text') {
            if (selObject.fontWeight == 'bold') {
                $(".boldbtn").hide();
                $(".italicbtn").show();
            } else { }
            if (selObject.fontStyle == 'italic') {
                $(".boldbtn").hide();
                $(".italicbtn").show();
            } else { }
        }
    }
    displayProperties(e: any) {
        let selectedObject = e.target;
        this.selected = selectedObject
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        this.rightSideBarType.emit(selectedObject.type);
        this.rightSideBarVisible.emit(true);
        //this.resetPanels();
        if (selectedObject) {
            //this.getId();
            //this.getOpacity();
            // switch (selectedObject.type) {
            //     case 'rect':
            //     case 'circle':
            //     case 'triangle':
            //     case 'path':
            //     case 'group':
            //         $("#adjust-tab").css("display","none");
            //         $("#canvas-tab").css("display","none");
            //         $("#image-tab").css("display","none");
            //         $("#adjust-content").removeClass("show active");
            //         $("#image-content").removeClass("show active");
            //         $("#canvas-content").removeClass("show active");


            //         $('.taburl li a').removeClass('active');
            //         $(".taburl li a#shape-tab").addClass("active");
            //         $("#shape-content").addClass("show active");
            //         $("#shape-tab").css("display","block");
            //         $("#gradiant-tab").css("display","block");

            //         this.getGroupproperty();
            //         break;
            //     case 'textbox':
            //     case 'text':
            //     case 'curved-text':
            //         this.textEditor = true;
            //         $("#image-tab").css("display","none");
            //         $("#shape-tab").css("display","none");
            //         $("#image-content").removeClass("show active");
            //         $("#gradiant-content").removeClass("show active");
            //         $("#shape-content").removeClass("show active");

            //         $('.taburl li a').removeClass('active');
            //         $(".taburl li a#adjust-tab").addClass("active");
            //         $("#adjust-tab").css("display","block");
            //         $("#adjust-content").addClass("show active");
            //         $("#gradiant-tab").css("display","block");
            //         $("#canvas-tab").css("display","block");

            //         this.getTextproperty();
            //         break;
            //     case 'image':
            //         this.imageEditor = true;
            //         $("#shape-tab").css("display","none");
            //         $("#adjust-tab").css("display","none");
            //         $("#canvas-tab").css("display","none");
            //         $("#gradiant-tab").css("display","none");
            //         $("#adjust-content").removeClass("show active");
            //         $("#gradiant-content").removeClass("show active");
            //         $("#shape-content").removeClass("show active");

            //         $("#image-tab").css("display","block");
            //         $("#image-tab").addClass("active");
            //         $("#image-content").addClass("show active");

            //         this.getimgproperty();
            //         break;
            // }
        }
    }

    getTextproperty() {
        if (!this.canvas.getActiveObject()) {
            return;
        }
        var selObject = this.canvas.getActiveObject();
        if (selObject.type == 'textbox' || selObject.type == 'text') {
            $("#fontSize").val(selObject.fontSize);
            $("#textsize").val(selObject.fontSize);
            $("#charSpac").val(selObject.charSpacing);
            $(".charSpac").text(selObject.charSpacing + "px");
            $("#textspac").val(selObject.charSpacing);
            $("#lineHei").val(selObject.lineHeight);
            $("#textheight").val(selObject.lineHeight);
            $(".lineHei").text(selObject.lineHeight + "px");
            if (selObject.shadow) {
                $("#dropshadow").val(selObject.shadow.offsetX);
            }
            $("#textbright").val(selObject.strokeWidth);
            $("#textopacity").val(selObject.opacity);
            $(".txtbright").text(selObject.strokeWidth + "px");
            $(".selfontname").text(selObject.fontFamily);
            $(".textcolor").css("background", selObject.fill);
        }
    }
    getGroupproperty() {
        if (!this.canvas.getActiveObject()) {
            return;
        }
        var selObject = this.canvas.getActiveObject();
        if (selObject.type == 'group' || selObject.type == 'path' || selObject.type == 'rect' || selObject.type == 'circle' || selObject.type == 'triangle') {
            $(".pathcolor").css("background", selObject.fill);
            $(".pathstrokecolor").css("background", selObject.stroke);
            $(".pathstrokewidth").val(selObject.strokeWidth);
            $(".pathopacity").val(selObject.opacity);
            //$(".pathdash").val(selObject.strokeWidth);
        }
    }
    updateimageproperties() {
        if (!this.canvas.getActiveObject()) {
            return;
        }
        var selObject = this.canvas.getActiveObject();
        this.imgwidth = selObject.getScaledWidth() / this.canvasScale;
        this.imgheight = selObject.getScaledHeight() / this.canvasScale;
        $("#imgwidth").val(parseInt(this.imgwidth));
        $("#imgheight").val(parseInt(this.imgheight));
    }
    setCanvasFixedSize() {
        this.setCanvasWidthHeight(this.canvassize.width, this.canvassize.height);
    }
    setCanvasSize() {
        this.setCanvasWidthHeight(this.canvassize.width * this.canvasScale, this.canvassize.height * this.canvasScale);
    }
    setCanvasWidthHeight(width, height) {
        // console.log(width);
        // console.log(height);
        if (width) {
            for (var i = 0; i < this.canvasarray.length; i++) {
                this.canvasarray[i].width = width;
                var canvasDOM = <HTMLCanvasElement>document.getElementById('canvas' + i);
                // canvasDOM.style.width ="100%";
                canvasDOM.style.width = width / 2 + "px";
                canvasDOM.width = width;
                var elem = <HTMLCanvasElement>document.getElementsByClassName('upper-canvas')[i];
                // elem.style.width ="100%";
                elem.style.width = width / 2 + "px";
                elem.width = width;
                var elem = <HTMLCanvasElement>document.getElementsByClassName('canvas-container')[i];
                // elem.style.width ="100%";
                elem.style.width = width / 2 + "px";
                elem.width = width;
                var elem = <HTMLCanvasElement>document.getElementsByClassName('canvascontent')[i];
                // elem.style.width ="100%";
                elem.style.width = width / 2 + "px";
                elem.width = width;
                var elem = <HTMLCanvasElement>document.getElementById('page' + i);
                // elem.style.width ="100%";
                elem.style.width = width / 2 + "px";
                elem.width = width;
                this.canvasarray[i].calcOffset();
                this.canvasarray[i].renderAll();
            }
        }
        if (height) {
            for (var i = 0; i < this.canvasarray.length; i++) {
                this.canvasarray[i].height = height;
                var canvasDOM = <HTMLCanvasElement>document.getElementById('canvas' + i);
                canvasDOM.style.height = height / 2 + "px";
                // canvasDOM.style.height = "calc(100vh - 472px)";
                canvasDOM.height = height;
                var elem = <HTMLCanvasElement>document.getElementsByClassName('upper-canvas')[i];
                elem.style.height = height / 2 + "px";
                // elem.style.height = "calc(100vh - 472px)";
                elem.height = height;
                var elem = <HTMLCanvasElement>document.getElementsByClassName('canvas-container')[i];
                elem.style.height = height / 2 + "px";
                // elem.style.height = "calc(100vh - 472px)";
                elem.height = height;
                var elem = <HTMLCanvasElement>document.getElementsByClassName('canvascontent')[i];
                elem.style.height = height / 2 + "px";
                // elem.style.height = "calc(100vh - 472px)";
                elem.height = height;
                var elem = <HTMLCanvasElement>document.getElementById('page' + i);
                elem.style.height = height / 2 + "px";
                // elem.style.height = "calc(100vh - 472px)";
                elem.height = height;
                this.canvasarray[i].calcOffset();
                this.canvasarray[i].renderAll();
            }
        }
        this.updateIconPos();
    }

    zoomIn() {
        this.resetState();
        var SCALE_FACTOR = 1.1;
        this.canvasScale = this.canvasScale * SCALE_FACTOR;
        this.setCanvasWidthHeight(this.canvassize.width * this.canvasScale, this.canvassize.height * this.canvasScale);
        for (var j = 0; j < this.canvasindex; j++) {
            if (!this.canvasarray[j]) continue;
            var objects = this.canvasarray[j].getObjects();
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;
                var tempScaleX = scaleX * SCALE_FACTOR;
                var tempScaleY = scaleY * SCALE_FACTOR;
                var tempLeft = left * SCALE_FACTOR;
                var tempTop = top * SCALE_FACTOR;
                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;
                objects[i].setCoords();
            }
            this.canvasarray[j].renderAll();
        }
        $("#zoomperc").val('');
        $("#zoomperc").val(Math.round(this.canvasScale * 100));
        this.updateIconPos();
    }

    zoomOut() {
        this.resetState();
        var SCALE_FACTOR = 1.1;
        this.canvasScale = this.canvasScale / SCALE_FACTOR;
        this.setCanvasWidthHeight(this.canvassize.width * this.canvasScale, this.canvassize.height * this.canvasScale);
        for (var j = 0; j < this.canvasindex; j++) {
            if (!this.canvasarray[j]) continue;
            var objects = this.canvasarray[j].getObjects();
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;
                var tempScaleX = scaleX * (1 / SCALE_FACTOR);
                var tempScaleY = scaleY * (1 / SCALE_FACTOR);
                var tempLeft = left * (1 / SCALE_FACTOR);
                var tempTop = top * (1 / SCALE_FACTOR);
                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;
                objects[i].setCoords();
            }
            this.canvasarray[j].renderAll();
        }
        $("#zoomperc").val('');
        $("#zoomperc").val(Math.round(this.canvasScale * 100));
        this.updateIconPos();
    }
    zoomToPercent(percent) {
        //if (iszooming) return false;
        this.zoomPercent = percent;
        this.zoomPercent = parseInt(this.zoomPercent) / 100;
        console.log(this.zoomPercent);
        this.setCanvasWidthHeight(this.canvas.getWidth() * (this.zoomPercent / this.canvasScale), this.canvas.getHeight() * (this.zoomPercent / this.canvasScale));
        for (var j = 0; j < this.canvasindex; j++) {
            if (!this.canvasarray[j]) continue;
            var objects = this.canvasarray[j].getObjects();
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;
                var tempScaleX = scaleX * (this.zoomPercent / this.canvasScale);
                var tempScaleY = scaleY * (this.zoomPercent / this.canvasScale);
                var tempLeft = left * (this.zoomPercent / this.canvasScale);
                var tempTop = top * (this.zoomPercent / this.canvasScale);
                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;
                objects[i].setCoords();
            }
            this.canvasarray[j].renderAll();
        }
        //iszooming = false;
        this.resetState();
        this.canvasScale = this.zoomPercent;
        $(".zoompre").text(Math.round(this.zoomPercent * 100) + "%");
        this.updateIconPos();
    }
    selectCanvas(id: string) {
        id = id.replace("divcanvas", "");
        if (id) {
            var elem = <HTMLCanvasElement>document.getElementsByClassName('canvas-container')[id];
            elem.tabIndex = 1000;
        }
        if (this.currentcanvasid == parseInt(id)) return;
        this.savestateaction = true;
        for (var i = 0, j = 0; i < this.canvasindex; i++) {
            $("#canvas" + i).css("box-shadow", "");
        }
        $("#canvas" + id).css("box-shadow", "3px 3px 3px #888888");
        if (this.currentcanvasid == parseInt(id)) return;
        this.currentcanvasid = parseInt(id);
        var tempcanvas = this.canvasarray[parseInt(id)];
        if (tempcanvas) this.canvas = tempcanvas;
        this.canvas.renderAll();
    }
    addnewpage() {
        this.addNewCanvasPage(false, 1);
    }
    addNewCanvasPage(dupflag: boolean, pageid: number) {
        this.pageindex++;
        var style = "";
        var newpage = $("<div class='page mx-auto position-relative' id='page" + this.pageindex + "' " + style + "></div>");
        if (this.pageindex) {
            newpage.css('width', $('#canvaspages').first().css('width'));
            newpage.css('height', $('#canvaspages').first().css('height'));
        }
        $("#canvaspages").append(newpage);
        this.addCanvasToPage(dupflag, pageid);
    }
    addCanvasToPage(dupflag: boolean, pageid: number) {
        var rows = 1,
            cols = 1;
        $('.deletecanvas').css('display', 'block');
        var rc = rows * cols * pageid;
        var dupcount = 0;
        var jsonarrcount = 1;
        for (var i = 1; i <= rows; i++) {
            $("#page" + this.pageindex).append("<table><tr>");
            for (var j = 1; j <= cols; j++) {
                this.addNewCanvas();
                if (dupflag) {
                    var currentcanvasjson = this.canvasarray[rc + dupcount].toDatalessJSON();
                    this.canvas.loadFromDatalessJSON(currentcanvasjson);
                    this.canvas.renderAll();
                    dupcount++;
                }
            }
            $("#page" + this.pageindex).append("</tr></table>");
        }
        var dupcanvicon = $("#duplicatecanvas").clone(true).prop('id', 'duplicatecanvas' + this.pageindex);
        var addnewpagebutton = $("#addnewpagebutton").clone(true).prop('id', 'addnewpagebutton' + this.pageindex);
        var delcanvicon = $("#deletecanvas").clone(true).prop('id', 'deletecanvas' + this.pageindex);
        var moveupicon = $("#moveup").clone(true).prop('id', 'moveup' + this.pageindex);
        var pagenumbericon = $("#pagenumber").clone(true).prop('id', 'pagenumber' + this.pageindex);
        var movedownicon = $("#movedown").clone(true).prop('id', 'movedown' + this.pageindex);
        dupcanvicon.appendTo("#page" + this.pageindex);
        addnewpagebutton.appendTo("#page" + this.pageindex);
        delcanvicon.appendTo("#page" + this.pageindex);
        if (this.pageindex != 0) moveupicon.appendTo("#page" + this.pageindex);
        pagenumbericon.appendTo("#page" + this.pageindex);
        movedownicon.appendTo("#page" + this.pageindex);
        this.updateIconPos();
    }
    addNewCanvas() {
        console.log("addNewCanvas");
        $("#page" + this.pageindex).append("<td align='center' data-id='" + this.canvasindex + "' id='divcanvas" + this.canvasindex + "' class='divcanvas d-block'><div class='canvascontent'><canvas id='canvas" + this.canvasindex + "' class='canvas' style='border: 2px dashed #cccccc;'></canvas></div></td>");
        this.canvas = new fabric.Canvas('canvas' + this.canvasindex, {
            hoverCursor: 'pointer',
            selection: true,
            selectionBorderColor: 'blue',
            preserveObjectStacking: true,
            isDrawingMode: false
        });
        fabric.Object.prototype.cornerSize = 15;
        fabric.Object.prototype.transparentCorners = false;
        this.canvasarray.push(this.canvas);
        this.canvas.state = [];
        this.canvas.index = 0;
        this.canvas.setWidth(this.canvassize.width);
        this.canvas.setHeight(this.canvassize.height);

        if ($("#canvaspages").children().length == 1) {
            this.setCanvasSize();
            this.resizeCanvas();
            this.updateZoomPercent();
            this.fitZoomEvent.emit(this.zoomPercent);
        } else {
            this.setCanvasSize();
            // this.resizeCanvas();
            this.updateZoomPercent();
            this.fitZoomEvent.emit(this.zoomPercent);
        }
        this.canvas.calcOffset();
        this.canvas.renderAll();
        this.initCanvasEvents();
        this.initDroppable();
        this.initEventsEmitter.emit(null);
        this.canvas.index = 0;
        this.canvas.state = [];
        this.currentcanvasid = this.canvasindex;
        this.canvasindex++;
        this.saveState();
    }

    getInitEventsEmitter() {
        return this.initEventsEmitter;
    }

    updateTemplateSection(data) {

        let temps = [];
        if (data) {
            temps = JSON.parse((<any>data)._body);
            this.templates = temps;
            this.origtemplates = temps
        } else {
            temps = this.templates;
        }

        $('#templatesection').empty();
        var htmldata = '';
        for (let temp of temps) {
            if (temp.isPublish) {
                var imglist = '<div class="col-lg-6 col-md-4 col-sm-12 tempsection" style="padding: 5px;float: left;"><img class="loadtemplate" src="' + Utils.getBaseURL(temp.thumbnail) + '?v=' + Math.random() + '" data-id="' + temp.id + '"/ style="max-width:100%;width:250px;"><i class="fa fa-trash-o deleteTemp" data-id="' + temp.id + '" style="cursor:pointer;position: absolute;top:1px;right:5px;width: 15px;height:15px;border-radius:50%;color:#fff;background:#fc7b82;line-height:15px;font-size:10px;text-align:center;"></i><label style="margin-bottom:3px;">' + temp.name + '</label></div>';
                htmldata += imglist;
            }
        }
        var $grid = $('#templatesection');
        $grid.isotope({
            itemSelector: 'div',
            masonry: {
                columnWidth: 'div'
            }
        });
        htmldata = $(htmldata);
        $grid.isotope().append(htmldata).isotope('appended', htmldata).isotope('layout');
        CreateUtils.showtemplates();
        this.initEvents();
        $(".se-pre-con").fadeOut("slow");
    }

    /*
    * Function Usage: Update current template design.
    */
    updateTemplate(AuthUser) {
        $(".se-pre-con").fadeIn("slow");
        var jsonCanvasArray = [];
        var wh = '{\"width\": ' + this.canvassize.width + ', \"height\": ' + this.canvassize.height + ', \"scale\": ' + this.canvasScale + '}';
        jsonCanvasArray.push(wh);

        var firstcanvas;
        for (var i = 0; i < this.canvasindex; i++) {
            if (!this.canvasarray[i]) continue;
            if ($("#divcanvas" + i).is(":visible")) {
                if (!firstcanvas || (firstcanvas.getObjects().length < this.canvasarray[i].getObjects().length)) firstcanvas = this.canvasarray[i];
                jsonCanvasArray.push(this.canvasarray[i].toDatalessJSON());
            }
        }

        let json = JSON.stringify(jsonCanvasArray);
        var pngdataURL = firstcanvas.toDataURL({
            format: 'png',
            multiplier: 0.4
        });
        pngdataURL = pngdataURL.replace('data:image/png;base64,', '');
        let canvasoptions = {
            'thumbnail': pngdataURL,
            'json': json,
            'notes': this.tempnotes
        };

        var url = '/api/usertemplateupdate/';
        if (AuthUser.role == 'Master Admin') {
            url = '/api/templateupdate/';
        }

        this.http.post(Utils.getBaseURL(url) + this.loadedtemplateid, canvasoptions, {
            headers: this.headers
        }).subscribe(data => {
            if (AuthUser.role == 'Master Admin') {
                this.updateTemplateSection(data);
            }
            $(".se-pre-con").fadeOut("slow");
        });
    }
    initEvents() {
        let lthis = this;
        $(".tempcateid").unbind('click').on('click', function (e) {
            e.preventDefault();
            var seltempid = "";
            var seltempname = "";
            seltempid = $(this).data('id');
            seltempname = $(this).data('name');
            if ($(this).data('id') == "0") {
                seltempname = "All Categories";
            }
            $('.selcatname').empty();
            $('.selcatname').text(seltempname);
            lthis.getcatTemplates(seltempid);
        });
        $(".deleteTemp").unbind('click').on('click', function (e) {
            e.preventDefault();
            $("#deletetempid").val($(this).data('id'));
            $("#alertModal").modal('show');
        });
        $(".loadtemplate").unbind('click').on('click', function (e) {
            e.preventDefault();
            $(".se-pre-con").fadeIn("slow");
            var tempid = $(this).data('id');
            lthis.loadCanvasFromJSON(tempid, false, false);
        });
        // main wrap
        $('.print-popup-toggler').on('click', function () {
            $('.print-popup-wrap').fadeIn();
        });
        $('.print-popup-wrap').on('click', function () {
            $(this).fadeOut();
        });
        $('.print-popup-container').on('click', function (e) {
            e.stopPropagation();
        });
        $(".recentusefonts").unbind('click').on('click', function (e) {
            e.preventDefault();
            var selfontname = "";
            selfontname = $(this).data('font');
            lthis.setActiveObjectfont('fontFamily', selfontname);
        });
        if (lthis.adminuser !== 'Master Admin') {
            $(".deleteTemp").css("display", "none");
        }
        CreateUtils.initDraggable();
    }

    /*
    * Function Usage: Load and display saved tempalte design in canvas.
    * userid - user id of the logged in user.
    * tempid - selected template id value.
    */
    loadCanvasFromJSON(tempid, AuthUser, userid) {
        AuthUser = Object.assign({}, AuthUser);
        if (AuthUser.offices != undefined) {
            AuthUser.offices = [];
        }
        $(".se-pre-con").fadeIn("slow");
        let lthis = this;
        this.loadedtemplateid = 0;

        //from mydesign
        if (userid && AuthUser.role !== 1)
            this.loadedtemplateid = tempid;

        //from design //from left panel
        if (!userid && AuthUser.role == 1)
            this.loadedtemplateid = tempid;

        if (this.canvas)
            this.resetZoom();

        var url = '/api/templateget/';

        if (userid) {
            url = '/api/usertemplateget/';
        }

        this.loadedtemplateid = tempid;

        this.http.get(Utils.getBaseURL(url) + tempid, {
            headers: this.headers
        }).subscribe(data => {
            lthis.resetZoom();
            lthis.canvas.clear();

            let template = JSON.parse((<any>data)._body);
            console.log(template);

            $("#designname").empty();
            $("#designname").append(template.name);
            $("#tempnotes").val(template.notes);
            this.tempnotes = template.notes;

            let json = template.json;
            console.log(json);
            lthis.openTemplate(json, AuthUser);
        });
    }

    setActiveObjectfont(name, value) {
        var object = this.canvas.getActiveObject();
        if (!object) return;
        object.set(name, value).setCoords();
        this.canvas.renderAll();
    }

    convertPXToMM(px) {
        return (px * 25.4) / 96 + "";
    }

    openTemplate(jsons, AuthUser) {
        console.log(">>>>>>>>>>>>>");
        console.log(jsons);
        $(".se-pre-con").fadeIn('slow');
        var jsonCanvasArray = JSON.parse(jsons);
        if (!jsonCanvasArray || jsonCanvasArray.length <= 0) return;
        var wh = jsonCanvasArray[0];
        console.log(wh);
        wh = JSON.parse(wh);
        var self = this;
        //pixel to inch

        console.log(wh.width);

        this.canvassize.width = parseFloat(wh.width);
        this.canvassize.height = parseFloat(wh.height);

        (<HTMLInputElement>document.getElementById('loadCanvasWid')).value = this.convertPXToMM(this.canvassize.width);
        (<HTMLInputElement>document.getElementById('loadCanvasHei')).value = this.convertPXToMM(this.canvassize.height);

        (<HTMLInputElement>document.getElementById('editCanvasWid')).value = this.convertPXToMM(this.canvassize.width);
        (<HTMLInputElement>document.getElementById('editCanvasHei')).value = this.convertPXToMM(this.canvassize.height);

        (<HTMLInputElement>document.getElementById('pages')).value = jsonCanvasArray.length - 1 + "";
        (<HTMLInputElement>document.getElementById('editpages')).value = jsonCanvasArray.length - 1 + "";

        if (wh.scale) {
            wh.scale = parseFloat(wh.scale);
            this.canvasScale = wh.scale;
        } else
            this.canvasScale = 1;

        var rc = 1 * 1;
        this.resetCanvas();
        for (var i = 0; i < (jsonCanvasArray.length - 1) / rc; i++) {
            this.pageindex = i;
            var style = "";
            $("#canvaspages").append("<div class='page' id='page" + this.pageindex + "' " + style + "></div>");
            this.addCanvasToPage(false, i);
        }

        this.setCanvasSize();
        var json = jsonCanvasArray[1];
        var ffs = this.getValues(json, 'fontFamily');
        ffs = this.remove_duplicates(ffs);
        ffs.sort();

        $("#recentusefonts").empty();
        for (var i = 0; i < ffs.length; i++) {
            var ffshtml = $("<a href='javascript:void(0);' class='recentusefonts' data-font='" + ffs[i] + "' style='cursor: pointer;display: block;padding: 2px 10px;font-size: 14px;color: #9b9b9b;text-decoration: none;font-family:" + ffs[i] + ";'>" + ffs[i] + "</a>");
            $('#recentusefonts').append(ffshtml);
            this.initEvents();
        }

        var totalloaded = 0;
        for (var i = 0; i < this.canvasindex; i++) {
            (function (lcanvas, json, pos) {
                lcanvas.clear();

                lcanvas.loadFromJSON(json, function () {
                    //first render
                    lcanvas.renderAll.bind(lcanvas);

                    self.initCanvasEvents();

                    lcanvas.index = 0;
                    lcanvas.state = [];

                    totalloaded++;
                    if (totalloaded == self.canvasindex) {

                        self.resetState();

                        setTimeout(function () {

                            //self.resizeDownCanvas();
                            self.fitZoom();

                            lcanvas.renderAll();

                            self.updateIconPos();

                            //self.generateLayers();

                            self.showTextBorders();

                            if (AuthUser) {
                                self.updateAgentInfo(AuthUser);
                            }

                            self.saveState();

                            $(".se-pre-con").fadeOut('slow');
                        }, 1000);
                    }
                });
            })(self.canvasarray[i], jsonCanvasArray[i + 1], i + 1);
        }

        this.updateZoomPercent();
        this.fitZoomEvent.emit(this.zoomPercent);

        /*WebFont.load({
            google: {
                families: ffs
            },
            active: function() {
            },
            classes: false
        });*/
    }
    getValues(obj, key) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getValues(obj[i], key));
            } else if (i == key) {
                objects.push(obj[i]);
            }
        }
        return objects;
    }
    remove_duplicates(arr) {
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i]] = true;
        }
        arr = [];
        for (var key in obj) {
            arr.push(key);
        }
        return arr;
    }
    getTemplates() {
        this.http.get(Utils.getBaseURL('/api/templategetall'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateTemplateSection(data);
        });
    }

    getcatTemplates(catid) {
        if (catid == "0") {
            this.templates = this.origtemplates;
            this.updateTemplateSection(false);
        } else {
            var temps = [];
            for (let temp of this.templates) {
                if (temp.catid == catid) {
                    temps.push(temp);
                }
            }
            this.templates = temps;
            this.updateTemplateSection(false);
        }
    }

    getImages() {
        this.http.get(Utils.getBaseURL('/api/imageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateImagesSection(data);
        });
    }

    updateImagesSection(data) {
        let imgs = [];
        if (data) {
            imgs = JSON.parse((<any>data)._body);
            this.images = imgs;
            this.origimages = imgs;
        } else {
            imgs = this.images;
        }
        $('#imagesection').empty();
        var htmldata = '';
        for (let img of imgs) {
            var imglist = '<div class="col-lg-6 col-md-4 col-sm-12 imgsection" style="padding: 5px;float: left;"><img style="max-width: 100%;width: 250px;" class="adminimg img" src="' + Utils.getBaseURL(img.path) + '"/><i class="fa fa-trash-o deleteImg" data-id="' + img.id + '" style="cursor:pointer;position: absolute;top:2px;right:5px;width: 15px;height:15px;border-radius:50%;color:#fff;background:#fc7b82;line-height:15px;font-size:10px;text-align:center;"></i></div>';
            htmldata += imglist;

        }
        var $grid = $('#imagesection');
        if ($grid.length) { // if 'length' is non zero. Enter block...
            $grid.isotope({
                itemSelector: 'div',
                masonry: {
                    columnWidth: 'div'
                }
            });
            htmldata = $(htmldata);
            $grid.isotope().append(htmldata).isotope('appended', htmldata).isotope('layout');
            CreateUtils.showimages();
            this.initEvents();
        }
    }

    initDroppable() {
        let lthis = this;
        $("#canvas" + this.canvasindex).droppable({
            accept: ".adminimg, .iconimg, .adminbgimg, .importimg, .shapeimg, .loadtemplate",
            drop: function (event, ui) {
                CreateUtils.dropPositionX = event.pageX - $(this).offset().left;
                CreateUtils.dropPositionY = event.pageY - $(this).offset().top;
                lthis.dropDragObject(event);
                CreateUtils.dragdatasrc = "";
                CreateUtils.dragimgdata = "";
                CreateUtils.dragtemplate = "";
            }
        });
    }

    /*
    Function Usage: Handler function called when dragged element is dropped on the canvas.
    based on the type of the dropped object respective functions will be called.
    ex: addheadingText() will be called when heading text div element is dropped on the canvas.
    */
    dropDragObject(event) {
        if (CreateUtils.dragdataclass.indexOf("adminimg") != -1) {
            this.addImage(event, false);
        }
        if (CreateUtils.dragdataclass.indexOf("iconimg") != -1) {
            this.addSVG(event, false);
        }
        if (CreateUtils.dragdataclass.indexOf("adminbgimg") != -1) {
            this.setCanvasBG(event)
        }
        if (CreateUtils.dragdataclass.indexOf("importimg") != -1) {
            this.addImage(event, true);
        }
        if (CreateUtils.dragdataclass.indexOf("shapeimg") != -1) {
            this.addSVG(event, false);
        }
        if (CreateUtils.dragdataclass.indexOf("loadtemplate") != -1) {
            this.loadCanvasFromJSON(CreateUtils.dragtemplate, false, false);
        }
    }
    /**
     * Function Usage: Add clicked or dropped image to canvas.
     * @param event  event object of the clicked element which has src of the element.
     * @returns      none.
     */
    addImage(event: any, fitCanvas: any) {
        $(".se-pre-con").fadeIn("slow");
        let el = event.target;

        if (CreateUtils.dragdatasrc) el.src = CreateUtils.dragdatasrc;

        if (el.src.indexOf(".svg") !== -1) {
            this.addSVG(event, fitCanvas);
            return;
        }

        fabric.Image.fromURL(el.src, (image) => {
            image.set({
                left: 10,
                top: 10,
                padding: 10,
                cornersize: 10,
            });
            CreateUtils.extend(fabric, image, Utils.randomId());

            if (fitCanvas) {
                this.createNewCanvas(image.width, image.height);
                this.canvas.add(image);
                image.center();
                //image.scale(0.5);
                // image.left = 0;
                // image.top = 0;
                this.fitZoom();
            } else {
                this.canvas.add(image);
                this.selectItemAfterAdded(image);
            }

            this.saveState();
            $(".se-pre-con").fadeOut("slow");
        }, {
                crossOrigin: 'anonymous'
            });
    }

    /**
     * Function Usage: Insert Image from Library manager to canvas.
     * @param file  file object
     * @returns      none.
     */
    addImageLib(file: any, fitCanvas: any) {
        $(".se-pre-con").fadeIn("slow");
        /*
        if(el.src.indexOf(".svg") !== -1) {
            this.addSVG(event, fitCanvas);
            return;
        }
        */
        const src = file.file.file_path;

        if (src.indexOf(".svg") !== -1) {
            this.addSVGLib(file, fitCanvas);
            return;
        }


        fabric.util.loadImage(src, (src) => {
            let image = new fabric.Image(src);
            image.set({
                left: 10,
                top: 10,
                padding: 10,
                cornersize: 10,
            });
            CreateUtils.extend(fabric, image, Utils.randomId());

            if (fitCanvas) {
                this.createNewCanvas(image.width, image.height);
                this.canvas.add(image);
                image.center();
                this.fitZoom();
            } else {
                this.canvas.add(image);
                this.selectItemAfterAdded(image);
            }

            this.saveState();
            $(".se-pre-con").fadeOut("slow");
        }, {
                crossOrigin: 'anonymous'
            });
    }

    setCanvasBG(event: any) {
        this.deleteCanvasBg();
        let el = event.target;

        if (CreateUtils.dragdatasrc) el.src = CreateUtils.dragdatasrc;

        fabric.Image.fromURL(el.src, (bg) => {
            var canvasAspect = this.canvassize.width / this.canvassize.height;
            var imgAspect = bg.width / bg.height;
            var left, top, scaleFactor;
            if (canvasAspect >= imgAspect) {
                scaleFactor = this.canvassize.width / bg.width * 1;
            } else {
                scaleFactor = this.canvassize.height / bg.height * 1;
            }
            bg.set({
                originX: 'center',
                originY: 'center',
                opacity: 1,
                //selectable: false,
                hasBorders: false,
                hasControls: false,
                hasCorners: false,
                left: this.canvassize.width / 2,
                top: this.canvassize.height / 2,
                scaleX: scaleFactor,
                scaleY: scaleFactor,
                strokeWidth: 0
            });
            this.canvas.add(bg);
            this.canvas.sendToBack(bg);
            bg.bg = true;
            this.canvas.bgsrc = el.src;
            this.saveState();
        }, {
                crossOrigin: 'anonymous'
            });
    }

    /**
     * Function Usage: Library manager load SVG.
     * @param file  Library file object
     * @returns      none.
     */
    addSVGLib(file: any, fitCanvas: boolean) {
        const src = file.file.file_path;
        //let el = event.target;

        // if(CreateUtils.dragdatasrc) el.src = CreateUtils.dragdatasrc;
        //el.src = src;

        fabric.loadSVGFromURL(src, (objects) => {

            var self = this;
            objects.forEach(function (obj) {
                if (obj.left < -50) {
                    obj.set('left', 0);
                }
                obj.set('lockMovementX', false);
                obj.set('lockMovementY', false);
            });
            var loadedObject = fabric.util.groupSVGElements(objects);

            if (fitCanvas) {
                loadedObject.src = src;
                this.createNewCanvas(loadedObject.width, loadedObject.height);
                this.canvas.add(loadedObject);
                this.fitZoom();
                loadedObject.center();

                loadedObject.toActiveSelection();

                loadedObject.getObjects().forEach(function (obj) {
                    if (obj.type == 'textbox') {
                        self.canvas.bringToFront(obj);
                    }
                    alert(obj.lockMovementY);
                });

                self.canvas.discardActiveObject();

                //this.canvas.getActiveObject().toGroup();
            } else {
                this.canvas.add(loadedObject);
                loadedObject.center();
                this.selectItemAfterAdded(loadedObject);
            }

            this.canvas.calcOffset();
            this.saveState();
            this.canvas.renderAll();
            $(".se-pre-con").fadeOut("slow");
        }, null, { crossOrigin: 'Anonymous' });
    }

    /**
     * Function Usage: Add clicked or dropped svg element to canvas.
     * @param event  event object of the clicked element which has src of the element.
     * @returns      none.
     */
    addSVG(event: any, fitCanvas: boolean) {
        let el = event.target;

        if (CreateUtils.dragdatasrc) el.src = CreateUtils.dragdatasrc;


        fabric.loadSVGFromURL(el.src, (objects) => {
            //alert(JSON.stringify(objects));
            var self = this;
            objects.forEach(function (obj) {
                if (obj.left < -50) {
                    obj.set('left', 0);
                }
                obj.set('lockMovementX', true);
                obj.set('lockMovementY', true);
            });
            var loadedObject = fabric.util.groupSVGElements(objects);

            if (fitCanvas) {
                loadedObject.src = el.src;
                this.createNewCanvas(loadedObject.width, loadedObject.height);
                this.canvas.add(loadedObject);
                this.fitZoom();
                loadedObject.scale(this.canvasScale);
                loadedObject.center();

                loadedObject.toActiveSelection();

                loadedObject.getObjects().forEach(function (obj) {
                    if (obj.type == 'textbox') {
                        self.canvas.bringToFront(obj);
                    }
                    alert(obj.lockMovementY);
                });

                self.canvas.discardActiveObject();

                //this.canvas.getActiveObject().toGroup();
            } else {
                this.canvas.add(loadedObject);
                loadedObject.scale(this.canvasScale);
                loadedObject.center();
                this.selectItemAfterAdded(loadedObject);
            }

            this.canvas.calcOffset();
            this.saveState();
            this.canvas.renderAll();
            $(".se-pre-con").fadeOut("slow");
        });
    }

    updateZoomPercent() {
        this.zoomPercent = Math.round(this.canvasScale * 100);
        $(".zoompre").text(this.zoomPercent + "%");
        $("#zoomPercent").val(this.zoomPercent);
        $("#zoomPercent").trigger("change");
    }

    fitZoom() {
        console.log("fitZoom");
        this.resizeCanvas();
        // this.resizeUpCanvas();
        // this.resizeDownCanvas();
        //this.resizeUpHeiCanvas();
        this.updateZoomPercent();
        this.fitZoomEvent.emit(this.zoomPercent);
    }

    deleteCanvasBg() {

        this.canvas.backgroundColor = '';
        this.canvas.renderAll();

        //if (!lcanvas) lcanvas = canvas;
        var objects = this.canvas.getObjects().filter(function (o) {
            return o.bg == true;
        });
        for (var i = 0; i < objects.length; i++) {
            this.canvas.remove(objects[i]);
        }
        this.canvas.bgsrc = "";
        this.canvas.bgcolor = "";
        this.saveState();
    }
    selectItemAfterAdded(obj) {
        if (CreateUtils.dropPositionX) {
            obj.left = CreateUtils.dropPositionX * 2;
            obj.top = CreateUtils.dropPositionY * 2;
            obj.setCoords();
        }
        this.canvas.setActiveObject(obj);
        if (CreateUtils.dropPositionX) {
            CreateUtils.dropPositionX = "";
            CreateUtils.dropPositionY = "";
        }
    }

    createNewCanvas(width: number, height: number) {
        console.log("createNewCanvas");
        this.resetZoom();
        this.canvasScale = 1;

        if (width) {
            this.canvassize.width = width;
        }
        if (height) {
            this.canvassize.height = height;
        }

        if (this.isNew) {

            this.loadedtemplateid = 0;

            this.canvas.state = [];
            this.canvas.index = 0;

            this.resetCanvas();

            this.addnewpage();
            // this.generateLayers();
        }

        if (!this.isNew) {
            this.canvas.setWidth(this.canvassize.width);
            this.canvas.setHeight(this.canvassize.height);
            this.setCanvasSize();
            this.resizeCanvas();
            this.canvas.renderAll();
        }

        this.updateIconPos();
        this.updateZoomPercent();
        this.fitZoomEvent.emit(this.zoomPercent);
    }
    getimgproperty() {
        if (!this.canvas.getActiveObject()) {
            return;
        }
        var actobj = this.canvas.getActiveObject();
        if (actobj.type == 'image') {
            $("#imgwidth").val(actobj._originalElement.width);
            $("#imgheight").val(actobj._originalElement.height);
        }
    }
    setAspectratio() {
        var act_obj = this.canvas.getActiveObject();
        if (act_obj.type == 'image') {
            this.wh = Utils.calculateAspectRatioFit(parseInt($("#imgwidth").val()), parseInt($("#imgheight").val()), act_obj._originalElement.width * act_obj.scaleX, act_obj._originalElement.height * act_obj.scaleY);
            $("#imgwidth").val(parseInt(this.wh.width));
            $("#imgheight").val(parseInt(this.wh.height));
            act_obj.width = this.wh.width / act_obj.scaleX;
            act_obj.height = this.wh.height / act_obj.scaleY;
            act_obj.setCoords();
            this.canvas.renderAll();
        }
    }

    updateAgentPicture(AuthUser, photo) {
        var self = this;
        var objects = this.getObjByCustType('photo');
        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            if (!photo) {
                photo = AuthUser.photo_thumb;
                if (!photo) photo = AuthUser.photo;
            }
            if (photo)
                fabric.util.loadImage(photo, function (img) {

                    var imgobject = new fabric.Image(img, {
                        left: o.left,
                        top: o.top,
                        scaleX: o.scaleX,
                        scaleY: o.scaleY,
                        originX: o.originX,
                        originY: o.originY,
                        width: o.width * o.scaleX,
                        strokeWidth: 0,
                        lockMovementX: o.lockMovementX,
                        lockMovementY: o.lockMovementY,
                        selectable: o.selectable
                    });
                    self.canvas.add(imgobject);
                    imgobject.custype = o.custype;
                    imgobject.setCoords();
                    self.canvas.remove(o);
                    self.canvas.renderAll();
                });
        }
    }

    /* Update the border style for property information objects*/
    showTextBorders() {
        var objects = this.canvas.getObjects().filter(function (o) {
            return o.custype;
        });
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            object.showTextBoxBorder = true;
            object.textboxBorderColor = 'black';
            object.setCoords();
        }
        this.canvas.renderAll();
    }

    hideTextBorders() {
        var objects = this.canvas.getObjects().filter(function (o) {
            return o.custype;
        });
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            object.showTextBoxBorder = false;
            object.setCoords();
        }
        this.canvas.renderAll();
    }

    updateAgentInfo(AuthUser) {
        this.updatePropertyInfo(AuthUser);
        this.updateAgentPicture(AuthUser, false);
        this.canvas.renderAll();
    }

    updatePropertyInfo(obj) {
        //for each object for each key
        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            if (typeof obj[key] !== 'object') {
                console.log(key, obj[key]);
                this.changeTextOfObjects(key, obj[key]);
            } else {
                this.updatePropertyInfo(obj[key]);
            }
        }
    }

    getObjByCustType(custype) {

        var objects = this.canvas.getObjects().filter(function (o) {
            return o.custype == custype;
        });

        return objects;
    }

    changeTextOfObjects(custtype, newtext) {

        var objects = this.getObjByCustType(custtype);
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];

            if (!object.text || !newtext) continue;

            object.text = newtext;

            object.setCoords();
            this.canvas.renderAll();
        }
    }

    bringobjectforward(object, index, issendback) {
        if (issendback) {
            this.canvas.sendToBack(object);
        }
        if (index > 0) {
            this.canvas.bringForward(object);
            index--;
            this.bringobjectforward(object, index, false);
        }
    }

    initlayerdragdrop() {
        var self = this;
        $(".layers").sortable({
            update: function (event, ui) {
                var objects = self.canvas.getObjects().filter(function (o) {
                    return o.custype != 'gridline' && o.bg != true;
                });
                console.log(objects.length);
                var index = 0;
                $("#layers li").each(function () {
                    self.bringobjectforward(objects[$(this).attr('id')], index, true);
                    index++;
                });
            },
        });
        $(".layers").disableSelection();
    }

    lockSelObject(selObj) {
        if (selObj) {
            if (selObj.lockMovementY) {
                selObj.lockMovementY = selObj.lockMovementX = selObj.lockScalingY = selObj.lockScalingX = false;
                selObj.hasControls = true;
                selObj.hoverCursor = 'pointer';
                selObj.locked = false;
            } else {
                selObj.lockMovementY = selObj.lockMovementX = selObj.lockScalingY = selObj.lockScalingX = true;
                selObj.hasControls = false;
                selObj.locked = true;
                selObj.lockedleft = selObj.left;
                selObj.lockedtop = selObj.top;
            }
            this.canvas.renderAll();
            this.saveState();
        }
    }

    initlayerclickevent() {
        let lthis = this;
        $(".lock-layer").click(function () {
            var objects = lthis.canvas.getObjects().filter(function (o) {
                return o.custype != 'gridline' && o.bg != true;
            });
            var id = $(this).attr("data-index");
            if (objects[id]) lthis.lockSelObject(objects[id]);
        })
        $(".view-layer").click(function () {
            var objects = lthis.canvas.getObjects().filter(function (o) {
                return o.custype != 'gridline' && o.bg != true;
            });
            var id = $(this).attr("data-index");
            if (objects[id]) lthis.selectObject(objects[id]);
        })
    }
    selectObject(obj) {
        this.canvas.setActiveObject(obj);
        this.canvas.renderAll();
    }

    generateLayers() {

        let lthis = this;
        var layersarray = [];

        $('.layers').html('');
        var objects = this.canvas.getObjects().filter(function (o) {
            return o.custype != 'gridline' && o.bg != true;
        });

        $('#layerssection').show();

        if (objects.length > 2) {
            $('#layerdelete').css('opacity', 1);
            $('#layerdelete > img').css('cursor', 'pointer');
        }
        else {
            $('#layerdelete').css('opacity', 0.3);
            $('#layerdelete > img').css('cursor', 'not-allowed');
        }
        for (var i = 0; i < objects.length; i++) {
            (function (index) {
                var img = new Image();
                img.onload = function () {
                    layersarray[index] = new Object();
                    layersarray[index].src = img.src;
                    layersarray[index].locked = objects[index].locked;
                    if (objects.length == layersarray.length) {
                        var layershtml = '';
                        for (var i = 0; i < layersarray.length; i++) {
                            var layer = '';

                            let lockcolor = 'black';
                            let lockIcon = 'fa fa-unlock-alt';
                            if (objects[i].lockMovementY) {
                                lockIcon = 'fa fa-lock';
                                lockcolor = '#C2C2C2';
                            }
                            if (layersarray[i]) layer = '<li id="' + i + '" style="display:flex;align-items:center;border-bottom:1px solid #e6e7eb;"><a href="javascript:void(0);" class="see-layer"><img style="width:30px;" src="' + layersarray[i].src + '"alt=""></a><span style="font-weight: 400;font-size: 12px;color: #9b9b9b;border-left:1px solid #e6e7eb;margin-left:4px;padding: 8px 5px 5px 8px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">' + objects[i].type + '</span><a href="javascript:void(0);" class="view-layer" data-index="' + i + '" style="width:15px;height:18px;margin-right:30px;margin-left:auto;background-position:-124px 0px;"><i style="border:none;color:#101010;" class="fa fa-eye"></i></a><a href="javascript:void(0);" class="lock-layer" data-index="' + i + '" style="width:15px;height:18px;margin-right:0px;background-position:-124px 0px;"><i style="border:none;color:' + lockcolor + ';" class="' + lockIcon + '"></i></a></li>';
                            else if (layersarray[i]) layer = '<li id="' + i + '"><a href="javascript:void(0);"><img style="width:65px;" src="' + layersarray[i].src + '" alt=""></a></li>';
                            layershtml += layer;
                        }
                        $('.layers').html(layershtml);
                        lthis.initlayerclickevent();
                        lthis.initlayerdragdrop();
                    }
                }
                img.src = objects[index].toDataURL("image/png");
            })(i);
        }
    }

    canceldrawingmode() {
        $("#drawingmode").text('Enter drawing mode');
        $(".drawcomment").css("display", "none");
        $("#drawing-mode-options").hide();
    }
}
