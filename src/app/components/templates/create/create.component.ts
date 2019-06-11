import { AuthService } from './../../../services/auth/auth.service';
import {Component, OnInit, ElementRef, ViewChild, OnChanges, AfterViewChecked} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {NgForm, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { environment as env } from './../../../../environments/environment';
import 'fabric';
import isotope from 'isotope-layout';
import * as jsPDF from 'jspdf';
import { CreateUtils } from './create.utils';
import { CreateGlobals } from './create.globals';
import { Utils } from '../../utils';
import { EventEmitter } from '@angular/core';
declare const fabric: any;

@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit,AfterViewChecked {
    @ViewChild('templateNavChild') child;
	props: any = {
		canvasFill: '#ffffff',
		canvasImage: '',
		id: null,
		opacity: 1,
		fill: null,
		fontSize: 14,
		lineHeight: 0,
		charSpacing: 0,
		fontWeight: null,
		fontStyle: null,
		textAlign: null,
		fontFamily: null,
		strokeWidth: 1,
		TextDecoration: '',
		strokeDash: 0,
		strokeGap: 0,
        zoomPercent: 100,
        textoffsetX: 0,
        textDiameter: 250,
        textBrightness: 0,
        pathfill: null
	};
    public env = env;
    //object to hold clipboard objects during cut / copy / paste.
    clipboard: any;
    sub: any;
	private json: any;
	/**
	 * Holds the canvas state as object for undo / redo operation.
	 */
	private state: string[] = [];
	/**
	 * Holds the index of the canvas state for undo / redo operation.
	 */
	private index: number = 0;
	private form: FormGroup;
    @ViewChild('canvaswhForm') canvaswhForm: NgForm;
    @ViewChild('editcanvaswhForm') editcanvaswhForm: NgForm;
	private headers = new Headers({
		'Content-Type': 'application/json'
	});
    public inset2dark = { axis: 'y' };
    public inset1dark = { axis: 'x' };

    private vLinePatternBrush: any;
    private hLinePatternBrush: any;
    private squarePatternBrush: any;
    private diamondPatternBrush: any;
    private texturePatternBrush: any;
    private grdcolorone: any;
    private grdcolortwo: any;
    private gradientsection: boolean = false;
    private gradienttype: any = 'gradienthorizontal';
    private canvasunits: string = 'MM';
    private imgwidth: any;
    private imgheight: any;
    private wh: any;
    private orientation: any;
    private keystring: string;
    public AuthUser: any;
    private textColorval: any;
    private replaceimgFiles = [];
    private replacefileimgname: any;
    private replaceimg: any = [];
    private replaceimages: any = [];
    private favtxtcolor: any;
    
    public stepDomEnable= false;
    public Leftsidebar = false;
    public rightSideBarVisible = false;
    public leftSideBarItemVisible: string;
    public rightSideBarType: string;
    
    shareFromManager(f) {
        f.forEach(file => {
            //alert(JSON.stringify(file));
            this.global.addImageLib(file, false);
        });
        
    }

    @ViewChild('fileInput') fileInput: ElementRef;
    zoomValue: number;
    zoomSet: boolean = false;
    constructor(private http: Http, private global: CreateGlobals, private route: ActivatedRoute,
        private Auth: AuthService, private el: ElementRef) {
        global.setHttp(this.http, this.headers);
        this.getFont();
        this.getTextcolors();
    }
    close(){
        if(window.confirm('Are you sure you wish to close you will lose any unsaved work !!')){
            //Reset Canvas
            const length = this.global.canvasarray.length -1;
            this.global.canvasarray.splice(1, length); //resetting Canvas
            this.rightSideBarVisible = false; // Hide right side bar 
            this.leftSideBarItemVisible = ''; // Hide left side bar tools in-active
            this.child.ngDoCheck();      // Set leftSideBar Tab In-Active
            this.leftSideBarItemVisible = undefined; 
            this.zoomSet = false;
            this.ngOnInit()
        }
    }
    ngAfterViewChecked (){        
        console.log("ngAfterViewChecked", this.leftSideBarItemVisible);
            // Resetting Cavas Zooming and Hight/Width
        if(this.leftSideBarItemVisible == undefined 
            && !this.rightSideBarVisible 
            && !this.zoomSet){
            // console.log("zoomToPercent(140);",this.leftSideBarItemVisible);
            // console.log("zoomToPercent(140);",this.zoomSet);
            this.zoomValue = 140;         
        }
        else if(this.rightSideBarVisible && 
            this.leftSideBarItemVisible != undefined 
            && !this.zoomSet){
            this.zoomValue = 50;
        }
        else if(!this.zoomSet){
            // console.log("zoomToPercent(80);",this.leftSideBarItemVisible);
            // console.log("zoomToPercent(80);",this.rightSideBarVisible);
            // this.global.zoomToPercent(80); // Setting Hight/Width Canvas
            // this.props.zoomPercent = 80;  // Setting Zoom Percent bar
            this.zoomValue = 80;
        }
        this.global.zoomToPercent(this.zoomValue); // Setting Hight/Width Canvas
        this.props.zoomPercent = this.zoomValue ;  // Setting Zoom Percent bar
    }
	ngOnInit() {    
        console.log('foo destroy', this.el.nativeElement);
        // Checking parameter and show/Hide to Step 1 Step 2 Step 3 Div
        if(this.route.snapshot.paramMap.keys.length > 0)
            this.stepDomEnable = true;
        else
            this.stepDomEnable = false;            

       // Active Right Side Bar tools on click of Leftside bar Tools
        this.global.rightSideBarType.subscribe((value) => {
            this.rightSideBarType = value;  
            // this.global.zoomToPercent(50); // Setting Hight/Width Canvas
            // this.props.zoomPercent = 50;   // Setting Zoom Percent bar         
        });

        // Hide/show Right Bar Div
        this.global.rightSideBarVisible.subscribe((value) => {
            this.rightSideBarVisible = value;
            // this.global.zoomToPercent(50); // Setting Hight/Width Canvas
            // this.props.zoomPercent = 50;   // Setting Zoom Percent bar 
        });

        let ForleftSideHeight  = $('.ic-tools-tab').height() - 160;
        $('.editor-templates-wrap').css('height', ForleftSideHeight);   

		this.Auth.UserSub.subscribe(user => this.AuthUser = user);
        let self = this;
        self.global.getInitEventsEmitter().subscribe(item => this.initKeyboardEvents());
        self.global.resetCanvas();
        self.global.addnewpage();
        /*if(self.AuthUser.offices != undefined){
            self.AuthUser.offices = [];
        }*/
        self.sub = self.route.params.subscribe(params => {
            if(params['designid']) {
                self.canvasunits = 'MM';
                self.global.loadCanvasFromJSON(params['designid'], self.AuthUser, params['userid']);
            }
        });
        this.getGradients();
        this.getReplaceimages();
        this.props.zoomPercent = Math.round(this.global.canvasScale * 100);
       // console.log(self.AuthUser);
        self.global.adminuser = self.AuthUser.role;

        // custom tabs for print tabs
        $('.print-tog').on('click', function(e) {
            e.preventDefault();
            $('.web-tog').removeClass('active');
            $('.web-tog').removeClass('active');
            $(this).addClass('active');
            $('.web-tab').hide();
            $('.print-tab').show();
        });
        $('.web-tog').on('click', function(e) {
            e.preventDefault();
            $('.print-tog').removeClass('active');
            $('.print-tog').removeClass('active');
            $(this).addClass('active');
            $('.print-tab').hide();
            $('.web-tab').show();
        });

        $('.clicknotes, .clicknotessave').click(function()
        {
            $("#notes").toggle();
        });
        $('.orientation-tick').on('click',function(){
            $('.orientation-tick').removeClass('active');
            $(this).addClass('active');
        });
        $('.print-popup-toggler').on('click',function(){
           self.canvaswhForm.controls.loadCanvasWid.setValue(parseInt(self.global.pagewidthsize));
           self.canvaswhForm.controls.loadCanvasHei.setValue(parseInt(self.global.pageheightsize));
        });
        $(function() {
            var $image = $('#imagetocrop');
            var cropBoxData;
            var canvasData;
            // $('#crop_imagepopup').on('shown.bs.modal', function() {
            //     $image.cropper({
            //     autoCropArea: 0.5,
            //     built: function() {
            //       $image.cropper('setCanvasData', canvasData);
            //       $image.cropper('setCropBoxData', cropBoxData);
            //     }
            // });
            // }).on('hidden.bs.modal', function() {
            //     cropBoxData = $image.cropper('getCropBoxData');
            //     canvasData = $image.cropper('getCanvasData');
            //     $image.cropper('destroy');
            // });
        });

        function handleContextmenu(e) {
          e.preventDefault();
          $(".custom-menu").finish().toggle(100).
          css({
              top: e.pageY + "px",
              left: e.pageX + "px"
          });
        }

        $("#canvasbox-tab").unbind('mousedown').on('mousedown', function(e) {
            switch (e.which) {
                case 1:
                    $(".custom-menu").hide();
                    break;
            }
        });

        $("#wrapper").unbind('mousedown').on('mousedown', function(e) {
            switch (e.which) {
                case 1:
                    if($(".color-picker").is(':visible') && !$(e.target).parents('.color-picker').length)
                    $(".color-picker").css("visibility", "hidden");
                    break;
            }
        });

        $(".font-color").unbind('click').on('click', function(e) {
            $(".color-picker").css("visibility", "visible");
        });

        $("#canvasbox-tab").bind('contextmenu', function(e) {
          handleContextmenu(e);
          return false;
        });

        $('.custom-site-quantity').each(function() {
              var spinner =  $(this),
                input: any = spinner.find('input[type="number"]'),
                btnUp     = spinner.find('.btn-inc'),
                btnDown   = spinner.find('.btn-dec'),
                min       = parseFloat(input.attr('min')),
                max       = parseFloat(input.attr('max'));

              btnUp.click(function() {
                var oldValue: number | string = parseFloat(input.val());
                if(!oldValue) {
                    oldValue = 0;
                }
                if (oldValue >= max) {
                  var newVal = oldValue;
                } else {
                  var newVal = oldValue + 1;
                }
                spinner.find("input").val(newVal);
                spinner.find("input").trigger("change");
              });

              btnDown.click(function() {
                var oldValue = parseFloat(input.val());
                if (oldValue <= min) {
                  var newVal = oldValue;
                } else {
                  var newVal = oldValue - 1;
                }
                spinner.find("input").val(newVal);
                spinner.find("input").trigger("change");
              });
        });

        this.global.fitZoomEvent.subscribe((zoom) => {
            console.log(zoom);
            this.props.zoomPercent = zoom;
        });

        //For IC-329
        let showsection = localStorage.getItem('showsection');
        if(showsection) {
            $('a[href*="#'+showsection+'"]').click();
        }
        // Set CANVAS zoom 100 on Loading Page First Time
        // this.global.zoomToPercent(140);
        // this.props.zoomPercent = 140;
    }
    rightSideBarDisplay(values) {
        this.rightSideBarVisible = values.visible;
        this.leftSideBarItemVisible = values.id;
        // if(this.leftSideBarItemVisible == ''){
        //     this.global.zoomToPercent(50);
        //     this.props.zoomPercent = 50;
        // }
        // else{
        //     this.global.zoomToPercent(values.zoom);
        //     this.props.zoomPercent = values.zoom;
        // }
    }
    showimages(id:string) {
        this.child.ngDoCheck();
        this.rightSideBarVisible = false;
        this.leftSideBarItemVisible = id;
        CreateUtils.showimages();
        localStorage.setItem('showsection', 'images-content');
    }
    showProperty(value){
        this.rightSideBarType = value;
    }
    setUpperCase() {
       if (!this.global.canvas.getActiveObject()) {
            return;
        }
        var selObject = this.global.canvas.getActiveObject();
        if (selObject.type == 'textbox' || selObject.type == 'text') {
        var txtobject = selObject.text;
        txtobject = txtobject.toUpperCase();
        selObject.set({
              text : txtobject
        });
        this.global.canvas.renderAll();
        }
    }
    setLowerCase() {
       if (!this.global.canvas.getActiveObject()) {
            return;
        }
        var selObject = this.global.canvas.getActiveObject();
         if (selObject.type == 'textbox' || selObject.type == 'text') {
        var object = selObject.text;
        object = object.toLowerCase();
        console.log(object);
        selObject.set({
              text : object
        });
        this.global.canvas.renderAll();
        }
    }
    setCamelCase() {
       if (!this.global.canvas.getActiveObject()) {
            return;
        }
        var selObject = this.global.canvas.getActiveObject();
        if (selObject.type == 'textbox' || selObject.type == 'text') {
            var text = selObject.text;
            text = this.camelize(text);
            selObject.set({
                  text : text
            });
            this.global.canvas.renderAll();
        }
    }
    camelize(str) {
        return str.replace(/\W+(.)/g, function(match, chr)
        {
            return chr.toUpperCase();
        });
    }
	setFontSize() {
        this.setActiveStyle('fontSize', parseInt(this.props.fontSize), null);
        $(".fontsize").text(parseInt(this.props.fontSize)+ "px");
    }
    setTextSize() {
        var fontSize: any = $("#textsize").val();
        this.setActiveStyle('fontSize', Math.round(fontSize), null);
        this.props.fontSize = fontSize;
    }
    setCharSpacing() {
        this.setActiveStyle('charSpacing', this.props.charSpacing, null);
        $(".charSpac").text(parseInt(this.props.charSpacing)+ "px");
    }
    setTextspac() {
        var textspec: any = $("#textspac").val();
        this.setActiveStyle('charSpacing', textspec, null);
    }
    setLineHeight() {
        this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
        $(".lineHei").text(parseInt(this.props.lineHeight)+ "px");
    }
     setTextheight() {
        var textheight: any = $("#textheight").val();
        this.setActiveStyle('lineHeight', parseFloat(textheight), null);
    }
    setBold() {
        this.props.fontWeight = !this.props.fontWeight;
        this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
    }
    setItalic() {
        this.props.fontStyle = !this.props.fontStyle;
        this.setActiveStyle('fontStyle', this.props.fontStyle ? 'italic' : '', null);
    }
    setTextAlign(value) {
        this.props.textAlign = value;
        this.setActiveProp('textAlign', this.props.textAlign);
    }
    pathfill() {
        this.changeObjectColor('fill', this.props.pathfill);
    }
    setFill() {
        this.textColorval = this.props.fill;
        this.favtxtcolor = this.props.fill;
        this.changeObjectColor('fill', this.props.fill);
    }
    solidtxtcol(color) {
        this.textColorval = color;
        this.changeObjectColor('fill', color);
    }
    setStorkeWidth() {
        this.changeObjectColor('strokeWidth', parseInt(this.props.strokeWidth));
    }
    setOpacity() {
        this.setActiveStyle('opacity', parseInt(this.props.opacity) / 100, null);
    }
    setStroke() {
        this.changeObjectColor('stroke', this.props.stroke);
    }
    setGapDashSize() {
        var strokedash = this.props.strokeDash;
        var strokegap = this.props.strokeGap;
        var sda = [];
        if (strokedash) sda.push(strokedash);
        if (strokegap) {
            sda.push(strokegap);
            sda.push(strokegap);
        }
        if (strokedash) sda.push(strokedash);
        if (sda.length == 0) return;
        var obj = this.global.canvas.getActiveObject();
        if (obj.type !== 'group') {
            this.setActiveStyle('strokeDashArray', sda, obj);
            obj.setCoords();
        }
        else {
            var objects = obj.getObjects();
            for (var i = 0; i < objects.length; i++) {
                this.setActiveStyle('strokeDashArray', sda, objects[i]);
                objects[i].setCoords();
            }
        }
    }
    setActiveProp(name, value) {
        var object = this.global.canvas.getActiveObject();
        if (!object) return;
        object.set(name, value).setCoords();
        this.global.canvas.renderAll();
    }
    setTextDecoration(value) {
        let iclass = this.props.TextDecoration;
        if (iclass && iclass.includes(value)) {
            iclass = iclass.replace(RegExp(value, "g"), "");
        } else {
            iclass += ` ${value}`
        }
        this.props.TextDecoration = iclass;
        this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
        this.setActiveStyle('underline', false, null);
        this.setActiveStyle('overline', false, null);
        if(this.props.TextDecoration.indexOf('underline') !== -1) {
            this.setActiveStyle('underline', true, null);
        }
        if(this.props.TextDecoration.indexOf('overline') !== -1) {
            this.setActiveStyle('overline', true, null);
        }
        this.global.canvas.renderAll();
        this.global.saveState();
    }
    changeObjectColor(style, hex) {
        let lthis = this;
        let obj = this.global.canvas.getActiveObject();
        if (obj) {
            if (obj.paths) {
                for (let i = 0; i < obj.paths.length; i++) {
                    this.setActiveStyle(style, hex, obj.paths[i]);
                }
            }
            else if (obj.type == "group") {
                let objects = obj.getObjects();
                for (let i = 0; i < objects.length; i++) {
                    this.setActiveStyle(style, hex, objects[i]);
                }
            }
            else this.setActiveStyle(style, hex, obj);
        }
        let grpobjs = this.global.canvas.getActiveObjects();
        if (grpobjs) {
            grpobjs.forEach(function(object) {
                if (object.paths) {
                    for (let i = 0; i < object.paths.length; i++) {
                        lthis.setActiveStyle(style, hex, obj.paths[i]);
                    }
                }
                else lthis.setActiveStyle(style, hex, obj);
            });
        }
        this.global.canvas.renderAll();
        this.global.saveState();
    }
    setActiveStyle(styleName, value, object) {
        object = object || this.global.canvas.getActiveObject();
        if (!object) return;
        if (object.setSelectionStyles && object.isEditing) {
            var style = {};
            style[styleName] = value;
            object.setSelectionStyles(style);
            object.setCoords();
        } else {
            object.set(styleName, value);
        }
        object.setCoords();
        this.global.canvas.renderAll();
    }
    removeSelected() {
        let activeObject = this.global.canvas.getActiveObject(),
            activeGroup = this.global.canvas.getActiveObjects();
        if (!activeObject && !activeGroup) return;
        if (activeGroup) {
            this.global.canvas.discardActiveObject().renderAll();
            let self = this;
            activeGroup.forEach(function(object) {
                self.global.canvas.remove(object);
            });
        }
        if (activeObject) {
            this.global.canvas.remove(activeObject);
        }
        this.global.saveState();
    }
    replaceimage(){
        (<any>$('#addreplaceimagemodal')).modal('show');
        this.global.getImages();
    }
    cropimage() {
        var actobj = this.global.canvas.getActiveObject();
        console.log(actobj._originalElement.width);
        if (actobj.type == "image") {
            $("#imagetocrop").attr('src', actobj._originalElement.src);
            (<any>$('#crop_imagepopup')).modal('show');
        }
    }
    setDragMode(mode) {
        //$('#imagetocrop').cropper('setDragMode', mode);
    }

    zoom(val) {
        //$('#imagetocrop').cropper('zoom', val);
    }

    move(val1, val2) {
        //$('#imagetocrop').cropper('move', val1, val2);
    }

    rotate(val) {
        //$('#imagetocrop').cropper('rotate', val);
    }

    scaleX(val) {
        //$('#imagetocrop').cropper('scaleX', val);
    }

    scaleY(val) {
        //$('#imagetocrop').cropper('scaleY', val);
    }

    crop(mode) {
        //$('#imagetocrop').cropper('crop', mode);
    }

    clear(mode) {
        //$('#imagetocrop').cropper('clear', mode);
    }
    disable(mode) {
        //$('#imagetocrop').cropper('disable', mode);
    }

    enable(mode) {
        //$('#imagetocrop').cropper('enable', mode);
    }

    reset(mode) {
        //$('#imagetocrop').cropper('reset', mode);
    }

    bringforwarditems() {
        let activeObject = this.global.canvas.getActiveObject(),
            activeGroup = this.global.canvas.getActiveObjects();
        if (activeObject) {
            this.global.canvas.bringForward(activeObject);
        } else if (activeGroup) {
            let objectsInGroup = activeGroup.getObjects();
            this.global.canvas.discardActiveGroup();
            objectsInGroup.forEach((object) => {
                this.global.canvas.bringForward(object);
            });
        }
        this.global.saveState();
    }
    sendbackwarditems() {
        let activeObject = this.global.canvas.getActiveObject(),
            activeGroup = this.global.canvas.getActiveObjects();
        if (activeObject) {
            this.global.canvas.sendBackwards(activeObject);
        } else if (activeGroup) {
            let objectsInGroup = activeGroup.getObjects();
            this.global.canvas.discardActiveGroup();
            objectsInGroup.forEach((object) => {
                this.global.canvas.sendBackwards(object);
            });
        }
        this.global.saveState();
    }

    objectlock() {
        var activeObject = this.global.canvas.getActiveObject();
        if (!activeObject) activeObject = this.global.canvas.getActiveObjects();
        if (!activeObject) return;
        if (activeObject) {
            this.global.lockSelObject(activeObject);
        } else {
            activeObject.forEach(function(object) {
                this.global.lockSelObject(object);
            });
        }
    }

    undo() {
        this.global.savestateaction = false;
        var index = this.global.canvas.index;
        var state = this.global.canvas.state;
        if (index > 0) {
            index -= 1;
            this.removeObjects();
            var lthis = this;
            this.global.canvas.loadFromJSON(state[index], function() {
                lthis.global.canvas.renderAll();
                lthis.global.savestateaction = true;
                lthis.global.canvas.index = index;
            });
        } else {
            this.global.savestateaction = true;
        }
    }
    redo() {
        var index = this.global.canvas.index;
        var state = this.global.canvas.state;
        this.global.savestateaction = false;
        if (index < state.length - 1) {
            this.removeObjects();
            var lthis = this;
            this.global.canvas.loadFromJSON(state[index + 1], function() {
                lthis.global.canvas.renderAll();
                lthis.global.savestateaction = true;
                index += 1;
                lthis.global.canvas.index = index;
            });
        } else {
            this.global.savestateaction = true;
        }
    }
    removeObjects() {
        var objects = this.global.canvas.getObjects().filter(function(o) {
            return o.excludeFromExport == false;
        });
        for (var i = 0; i < objects.length; i++) {
            this.global.canvas.remove(objects[i]);
        }
        this.global.canvas.renderAll();
    }
    dwnloadtempfile() {
        (<any>$("#downloadfileModal")).modal('show');
    }
    savedesign() {
    console.log(this.global.loadedtemplateid);
        if(this.global.loadedtemplateid) {
            this.global.updateTemplate(this.AuthUser);
        } else {
            (<any>$('#templatesaveModal')).modal('show');
        }
    }
    saveAsdesign() {
        (<any>$('#templatesaveModal')).modal('show');
    }
    createnewdesign() {
        this.global.isNew = true;
        (<HTMLInputElement>document.getElementById('loadCanvasWid')).value = this.global.canvassize.width;
        (<HTMLInputElement>document.getElementById('loadCanvasHei')).value = this.global.canvassize.height;
        (<any>$("#canvaswh_modal")).modal('show');
    }
    editdesign() {
        $(".showlayers").toggle();
        this.global.canvas.discardActiveObject().renderAll();
        this.resetPanels();
        this.global.generateLayers();
    }
    previewcanvas() {
        $('#canvasloadimg').empty();
        for (var i = 0; i < this.global.canvasarray.length; i++)
        {
            $('#canvasloadimg').append("<img src="+this.global.canvasarray[i].toDataURL('png')+"></img>");
        }
        (<any>$('#canvasloadimg')).slick();
        (<any>$('#displaycanvasmodal')).modal('show');
        $('#displaycanvasmodal').on('shown.bs.modal', function (e) {
            $('#canvasloadimg').resize();
        })
        $('#displaycanvasmodal').on('hidden.bs.modal', function () {
            (<any>$('#canvasloadimg')).slick('unslick');
        })
    }
    setaspectratio(){
        this.global.setAspectratio();
    }
    resetPanels() {
        $(".figureEditor").toggle();
        $(".gradientEditor").toggle();
        $(".textEditor").toggle();
        $(".imageEditor").toggle();
    }
    viewLayers() {
        this.global.generateLayers();
    }

    initEvents() {
        let lthis = this;
        $(".iconimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.global.addSVG(e, false);
        });
        $(".replacepic").unbind('click').on('click', function(e) {
            e.preventDefault();
           var replaceimgfile = $(this).data('src');
           replaceimgfile = replaceimgfile.replace(env.baseUrl + "admin/uploads/images/", "");
           lthis.replacefileimgname = replaceimgfile;
            (<any>$('#addreplaceimagemodal')).modal('hide');
           lthis.replaceImg();
        });
        $(".adminimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.global.addImage(e, false);
        });
        $(".adminbgimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.global.setCanvasBG(e)
        });
        $(".importimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.global.addImage(e, true);
        });
        $(".shapeimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.global.addImage(e, false);
        });
        $(".deleteGradient").unbind('click').on('click', function(e) {
            e.preventDefault();
            var grdid = $(this).data('id');
            lthis.deleteGradients(grdid);
        });
        $(".gradientsections").unbind('click').on('click', function(e) {
            e.preventDefault();
            var selgrdcolor1 = "";
            var selgrdcolor2 = "";
            var selgrdcolortype = "";
            selgrdcolor1 = $(this).data('color1');
            selgrdcolor2 = $(this).data('color2');
            $("#txtgrdcolval1").val(selgrdcolor1);
            $("#txtgrdcolval2").val(selgrdcolor2);
            var gid = $(this).data('gid');
            $(".gradientsections").css("border","none");
            $("#"+gid).css("border","2px solid");
            selgrdcolortype = $(this).data('type');
            if($(this).data('type') == "gradienthorizontal")
            {
              lthis.grdcolorone = selgrdcolor1;
              lthis.grdcolortwo = selgrdcolor2;
              lthis.setHorizontalgradient();
            }
            if($(this).data('type') == "gradientvertical")
            {
              lthis.grdcolorone = selgrdcolor1;
              lthis.grdcolortwo = selgrdcolor2;
              lthis.setVerticalgradient();
            }
             if($(this).data('type') == "gradientradial")
            {
              lthis.grdcolorone = selgrdcolor1;
              lthis.grdcolortwo = selgrdcolor2;
              lthis.setRadialgradient();
            }
            if($(this).data('type') == "gradientdiagonal")
            {
              lthis.grdcolorone = selgrdcolor1;
              lthis.grdcolortwo = selgrdcolor2;
              lthis.setDiagonalgradient();
            }

        });
        $(".pagesize").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.canvaswhForm.controls.loadCanvasWid.setValue(parseInt($(this).data('width')));
            lthis.canvaswhForm.controls.loadCanvasHei.setValue(parseInt($(this).data('height')));
            lthis.editcanvaswhForm.controls.editCanvasWid.setValue(parseInt($(this).data('width')));
            lthis.editcanvaswhForm.controls.editCanvasHei.setValue(parseInt($(this).data('height')));
            $("#pagename").html($(this).data('page'));
        });
        $(".custom-menu li").unbind('click').on('click', function(e) {
            e.preventDefault();
              switch ($(this).attr("data-action")) {
                  case "selectall":
                      lthis.selectallobjs();
                      break;
                  case "copy":
                      lthis.copyobjs();
                      break;
                  case "cut":
                      lthis.cutobjs();
                      break;
                  case "paste":
                      lthis.pasteobjs(true);
                      break;
                  case "clone":
                      lthis.cloneobjs();
                      break;
              }
              $(".custom-menu").hide(100);
        });
        $(".fontname").unbind('click').on('click', function(e) {
            e.preventDefault();
            var selfontname = "";
            selfontname = $(this).data('font');
            console.log(selfontname);
            $('.selfontname').empty();
            $('.selfontname').text(selfontname);
            lthis.setFontFamily(selfontname);
        });
        CreateUtils.initDraggable();
        //this.initCropEvents();
        //this.initOrientation();
        this.initKeyboardEvents();

         // Set CANVAS zoom 100 on Loading Page First Time
        //  this.global.zoomToPercent(140);
        //  this.props.zoomPercent = 140;         
    }

    initKeyboardEvents() {
        let remstring = '';
        let self = this;
        $('.canvas-container').keyup(function(e) {
            switch (e.keyCode) {
                case 17:
                    remstring = 'ctrl ';
                    break;
                case 67:
                    remstring = ' c';
                    break;
                case 88:
                    remstring = ' x';
                    break;
                case 86:
                    remstring = ' v';
                    break;
                case 89:
                    remstring = ' z';
                    break;
                case 90:
                    remstring = ' y';
                    break;
                default:
                    break;
            }
            if (self.keystring && self.keystring.indexOf(remstring) != -1) self.keystring = self.keystring.replace(remstring, '');
        });
        $('.canvas-container').keydown(function(e) {
            e.stopImmediatePropagation();
            if (e.target && e.target.nodeName == 'INPUT') return false;
            switch (e.keyCode) {
                case 17: //ctrl
                    e.preventDefault();
                    self.keystring = 'ctrl';
                    break;
                case 90: // ctrl + z
                    e.preventDefault();
                    self.keystring += ' z';
                    if (self.keystring == "ctrl z") {
                        self.undo();
                        self.keystring = 'ctrl';
                    }
                    break;
                case 89: // ctrl + y
                    e.preventDefault();
                    self.keystring += ' y';
                    if (self.keystring == "ctrl y") {
                        self.redo();
                        self.keystring = 'ctrl';
                    }
                    break;
                case 37: // left
                    e.preventDefault();
                    self.moveSelected("left");
                    break;
                case 38: // up
                    e.preventDefault();
                    self.moveSelected("up");
                    break;
                case 39: // right
                    e.preventDefault();
                    self.moveSelected("right");
                    break;
                case 40: // left
                    e.preventDefault();
                    self.moveSelected("down");
                    break;
                default:
                    break;
            }
            var activeobject = self.global.canvas.getActiveObject();
            if (!activeobject) activeobject = self.global.canvas.getActiveObjects();
            //if (!activeobject && !activeObjectCopy && !activeGroupCopy) return;
            if (activeobject && activeobject.isEditing) return;
            switch (e.keyCode) {
                case 8:
                    e.preventDefault();
                    self.removeSelected();
                    break;
                case 17: //ctrl
                    e.preventDefault();
                    self.keystring = 'ctrl';
                    break;
                case 67: // ctrl + c
                    e.preventDefault();
                    self.keystring += ' c';
                    if (self.keystring == "ctrl c") {
                        self.copyobjs();
                    }
                    break;
                case 88: // ctrl + x
                    e.preventDefault();
                    self.keystring += ' x';
                    if (self.keystring == "ctrl x") {
                        self.cutobjs();
                    }
                    break;
                case 86: // ctrl + v
                    e.preventDefault();
                    self.keystring += ' v';
                    if (self.keystring == "ctrl v") {
                        self.pasteobjs(true);
                    }
                    break;
                case 46:
                    e.preventDefault();
                    self.removeSelected();
                    break;
                default:
                    break;
            }
            self.global.canvas.renderAll();
            return true;
        });
    }

    moveSelected(direction) {
        var lthis = this;
        const STEP = 1;
        let activeObject = lthis.global.canvas.getActiveObject();
        let activeGroup = lthis.global.canvas.getActiveObjects();

        if (activeObject) {
            switch (direction) {
                case "left":
                    activeObject.left = activeObject.left - STEP;
                    break;
                case "up":
                    activeObject.top = activeObject.top - STEP;
                    break;
                case "right":
                    activeObject.left = activeObject.left + STEP;
                    break;
                case "down":
                    activeObject.top = activeObject.top + STEP;
                    break;
            }
            activeObject.setCoords();

            lthis.global.canvas.renderAll();
        } else if (activeGroup) {

            switch (direction) {
                case "left":
                    activeGroup.left = activeGroup.left - STEP;
                    break;
                case "up":
                    activeGroup.top = activeGroup.top - STEP;
                    break;
                case "right":
                    activeGroup.left = activeGroup.left + STEP;
                    break;
                case "down":
                    activeGroup.top = activeGroup.top + STEP;
                    break;
            }
            activeGroup.setCoords();
            lthis.global.canvas.renderAll();
        }
    }

    getGradientcolone() {
        this.grdcolorone = this.props.colorone;
    }
    getGradientcoltwo() {
        this.grdcolortwo = this.props.colortwo;
        if($('.gradient-btns #solid-tab').hasClass('active')){
          this.linearGradient();
        }
        if($('.gradient-btns #background-tab').hasClass('active')){
          this.radialGradient();
        }
    }
    linearGradient(){
        if(this.grdcolorone == '' && this.grdcolortwo == '')
        {
        return;
        }
        var activeobject = this.global.canvas.getActiveObject();
        if(activeobject){
          this.setHorizontalgradient();
        }

    }
    radialGradient(){
        if(this.grdcolorone == '' && this.grdcolortwo == '')
        {
        return;
        }
        var activeobject = this.global.canvas.getActiveObject();
        if(activeobject){
          this.setRadialgradient();
        }

    }
    txtgrdcolval1()
        {
          this.grdcolorone = $("#txtgrdcolval1").val();
          $(".txtgrdcol").css("background",this.grdcolorone);
        }
    txtgrdcolval2()
        {
          this.grdcolortwo = $("#txtgrdcolval2").val();
          $(".txtgrdcolr").css("background",this.grdcolortwo);
        }

    setHorizontalgradient() {
        this.gradienttype = "gradienthorizontal";
        var activeobject = this.global.canvas.getActiveObject();
        if (!activeobject) return false;

        activeobject.setGradient('fill', {
            type: 'linear',
            x1: activeobject.width / 4,
            y1: 0,
            x2: activeobject.width / 2 + activeobject.width / 4,
            y2: 0,
            colorStops: {
                0: this.grdcolorone,
                1: this.grdcolortwo
            }
        });
        this.global.canvas.renderAll();
    }
    setVerticalgradient() {
        this.gradienttype = "gradientvertical";
        var activeobject = this.global.canvas.getActiveObject();

        activeobject.setGradient('fill', {
            type: 'linear',
            x1: 0,
            y1: activeobject.height / 4,
            x2: 0,
            y2: activeobject.height / 2 + activeobject.height / 4,
            colorStops: {
                0: this.grdcolorone,
                1: this.grdcolortwo
            }
        });
        this.global.canvas.renderAll();
    }
    setDiagonalgradient() {
        this.gradienttype = "gradientdiagonal";
        var activeobject = this.global.canvas.getActiveObject();

        activeobject.setGradient('fill', {
            type: 'linear',
            x1: -activeobject.width / 6,
            y1: -activeobject.height / 6,
            x2: activeobject.width / 1,
            y2: activeobject.height / 1,
            colorStops: {
                0: this.grdcolorone,
                1: this.grdcolortwo
            }
        });
        this.global.canvas.renderAll();
    }
    setRadialgradient() {
        this.gradienttype = "gradientradial";
        var activeobject = this.global.canvas.getActiveObject();
        if (!activeobject) return false;

        activeobject.setGradient('fill', {
            type: 'radial',
            r1: activeobject.width / 2,
            r2: activeobject.width / 4,
            x1: (activeobject.width / 2) - 1,
            y1: (activeobject.height / 2) - 1,
            x2: activeobject.width / 2,
            y2: activeobject.height / 2,
            colorStops: {
                0: this.grdcolorone,
                1: this.grdcolortwo
            }
        });
        this.global.canvas.renderAll();
    }
    getGradients() {
        this.http.get(Utils.getBaseURL('/api/gradientget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateGradientsSection(data);
        });
    }
    updateGradientsSection(data) {
        let gradients = JSON.parse((<any>data)._body);
        $('.gradientsec').empty();
        $('.radialgradientsec').empty();
        //var gradienthtmldata = '';
        for (let gradient of gradients) {
            if (gradient.type == "gradienthorizontal" )
            {
            var gradientslist = $('<li class="gradientsections" id="'+ gradient.id +'" data-gid="'+ gradient.id +'" style="background-image: linear-gradient(to right, ' + gradient.color1 + ', ' + gradient.color2 + ');cursor:pointer;width: 37px;height: 37px;border-radius: 2px;margin: 4px 3px;" data-type="'+ gradient.type +'" data-color1="'+ gradient.color1 +'" data-color2="'+ gradient.color2 +'"><div style="border-top-left-radius:2px;  border-top-right-radius:2px;"></div><i class="fa fa-trash-o deleteGradient" data-id="'+ gradient.id +'" style="cursor: pointer;position: relative;right: 4px;width: 15px;height: 17px;border-radius: 50%;color: #fff;background: #fc7b82;line-height: 15px;font-size: 10px;text-align: center;display: block;"></i></li>');
            }
            if (gradient.type == "gradientradial")
            {
            var gradientlists = $('<li class="gradientsections" id="'+ gradient.id +'" data-gid="'+ gradient.id +'" style="background-image: radial-gradient(' + gradient.color2 + ', ' + gradient.color1 + ');cursor:pointer;width: 37px;height: 37px;border-radius: 2px;margin: 4px 3px;" data-type="'+ gradient.type +'" data-color1="'+ gradient.color1 +'" data-color2="'+ gradient.color2 +'"><div style="border-top-left-radius:2px;  border-top-right-radius:2px;"></div><i class="fa fa-trash-o deleteGradient" data-id="'+ gradient.id +'" style="cursor: pointer;position: relative;right: 4px;width: 15px;height: 17px;border-radius: 50%;color: #fff;background: #fc7b82;line-height: 15px;font-size: 10px;text-align: center;display: block;"></i></li>');
            }
           //gradienthtmldata += gradientslist;
           $('.gradientsec').append(gradientslist);
           $('.radialgradientsec').append(gradientlists);
        }
        this.initEvents();

    }
    savetxtcolor() {
        let bgcoloroptions = {
            'bgcolor': this.favtxtcolor,
        };
        this.http.post(Utils.getBaseURL('/api/bgcolorsave'), JSON.stringify(bgcoloroptions), {
            headers: this.headers
        }).subscribe(data => {
            this.getTextcolors();
        });
    }
    getTextcolors() {
        this.http.get(Utils.getBaseURL('/api/bgcolorget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateTxtcolorSection(data);
        });
    }
    updateTxtcolorSection(data) {
        let txtcolors = JSON.parse(( < any > data)._body);
        $('#txtcolorlist').empty();
        for (let txtcolor of txtcolors) {
            var txtcolorlist = $('<li><div class="txtfavcolor" id="' + txtcolor.id + '" data-fid="' + txtcolor.id + '" data-color="' + txtcolor.bgcolor + '" style="background:' + txtcolor.bgcolor + ';width:37px;height:37px;border-radius:2px;margin: 4px 3px;"></div></li>');
            $('#txtcolorlist').append(txtcolorlist);
        }
        this.initEvents();
    }

    showgradients(){
        setTimeout(function() {
            var $grid = $('.gradientsec');
            (<any>$grid).imagesLoaded().progress(function() {
                (<any>$grid).isotope('layout');
                (<any>$grid).isotope('reloadItems');
            });
        }, 200);
    }
    deleteGradients(grdid) {
        this.http.delete(Utils.getBaseURL('/api/gradientdelete/') + grdid, {
            headers: this.headers
        }).subscribe(data => {
            this.getGradients();
        });
    }
    saveGradient(){
        if(this.grdcolorone == '' && this.grdcolortwo == '')
        {
        return;
        }

        let gradientoptions = {
            'color1': this.grdcolorone,
            'color2': this.grdcolortwo,
            'type': this.gradienttype,

        };
        this.http.post(Utils.getBaseURL('/api/gradientsave') , JSON.stringify(gradientoptions), {
            headers: this.headers
        }).subscribe(data => {
        this.getGradients();
        this.grdcolorone = '';
        this.grdcolortwo = '';

        });
   }

    /*initCropEvents() {
        var self = this;
        $("#getCroppedCanvas").click(function() {

            var cropcanvas = $('#imagetocrop').cropper('getCroppedCanvas');

            $(".se-pre-con").fadeIn('slow');
            $("#crop_imagepopup").modal('hide');
            // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`
            cropcanvas.toBlob(function(blob) {

            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var day = currentTime.getDate();
            var year = currentTime.getFullYear();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            var seconds = currentTime.getSeconds();
            var filename = month + '' + day + '' + year + '' + hours + '' + minutes + '' + seconds + ".png";

            var data = new FormData();
            data.append('file', blob);
            data.append('filename', filename);
            console.log(data.has('filename'));
            self.http.post(Utils.getBaseURL('/api/savecropimg'), data).subscribe(data => {
                console.log(data);
                $(".se-pre-con").fadeOut('slow');
            });

          });
      });
    }*/


    /*
    * Function Usage: Create new design and save the design.
    */
    onSaveTempSubmit(tempform: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        console.log("savedesign");
        this.global.loading = true;
        var jsonCanvasArray = [];
        var wh = '{\"width\": ' + this.global.canvassize.width + ', \"height\": ' + this.global.canvassize.height + ', \"scale\": ' + this.global.canvasScale + '}';
        jsonCanvasArray.push(wh);

        var firstcanvas;
        for (var i = 0; i < this.global.canvasindex; i++) {
            if (!this.global.canvasarray[i]) continue;
            if ($("#divcanvas" + i).is(":visible")) {
                if (!firstcanvas || (firstcanvas.getObjects().length < this.global.canvasarray[i].getObjects().length)) firstcanvas = this.global.canvasarray[i];
                jsonCanvasArray.push(this.global.canvasarray[i].toDatalessJSON());
            }
        }

        let json = JSON.stringify(jsonCanvasArray);
        var pngdataURL = firstcanvas.toDataURL({
            format: 'png',
            multiplier: 0.4
        });
        pngdataURL = pngdataURL.replace('data:image/png;base64,', '');

        if(!tempform.value.isPublish) tempform.value.isPublish = false;
        if(!tempform.value.isFav) tempform.value.isFav = false;

        $("#designname").html(tempform.value.name);

        let canvasoptions = {
            'cat_id': tempform.value.cat_id,
            'name': tempform.value.name,
            'thumbnail': pngdataURL,
            'json': json,
            'isPublish': tempform.value.isPublish,
            'isFav': tempform.value.isFav,
            'notes' : this.global.tempnotes
        };

        if(this.AuthUser.role == 'Master Admin') {

            // save the master admin design
            this.http.post(Utils.getBaseURL('/api/templatesave'), canvasoptions, {
                headers: this.headers
            }).subscribe(data => {
                let temp = JSON.parse((<any>data)._body);
                this.global.loading = false;
                this.global.loadedtemplateid = temp.id;
                this.global.getTemplates();
                (<any>$('#templatesaveModal')).modal('hide');
                $(".se-pre-con").fadeOut("slow");
            });
        } else {

            // save the user design
            let canvasoptions = {
                'cat_id': tempform.value.cat_id,
                'name': tempform.value.name,
                'thumbnail': pngdataURL,
                'json': json,
                'isPublish': tempform.value.isPublish,
                'isFav': tempform.value.isFav,
                'notes' : this.global.tempnotes,
                'userid': this.AuthUser.id, //user id
            };

            this.http.post(Utils.getBaseURL('/api/usertemplatesave'), canvasoptions, {
                headers: this.headers
            }).subscribe(data => {
                let temp = JSON.parse((<any>data)._body);
                this.global.loading = false;
                this.global.loadedtemplateid = temp.id;
                (<any>$('#templatesaveModal')).modal('hide');
                $(".se-pre-con").fadeOut("slow");
            });
        }
        (<any>$('#savedesign')[0]).reset();
    }

    /*
    * Function Usage: Handler function when download form is submitted.
    */
    onDownloadSubmit(donwloadForm: NgForm) {
        (<any>$("#downloadfileModal")).modal('hide');
        var dfileName = $("#designname").html();
        var fileName = dfileName;

        this.global.hideTextBorders();

        if(donwloadForm.value.downloadall) {
            donwloadForm.value.downloadaspdf = true;
            donwloadForm.value.downloadaspng = true;
            donwloadForm.value.downloadasjpeg = true;
            donwloadForm.value.downloadassvg = true;
        }

        if(donwloadForm.value.downloadaspdf) {
            /*var cwidth = this.global.canvassize.width/2;
            var cheight = this.global.canvassize.height/2;
            var pdf = new jsPDF('p', 'px', [cwidth, cheight]);
            var width = pdf.internal.pageSize.width;
            var height = pdf.internal.pageSize.height;
            for (var i = 0; i < this.global.canvasarray.length; i++) {
                var img = this.global.canvasarray[i].toDataURL("image/png");
                pdf.addPage();
                pdf.addImage(img, 'JPEG', 0, 0, width, height);
            }
            pdf.deletePage(1);
            fileName = dfileName + ".pdf";
            pdf.save(fileName);*/

            let svgCanvasArray = [];
            //svgCanvasArray.push(this.global.canvas.toSVG());
            for (var i = 0; i < this.global.canvasarray.length; i++)
            {
             svgCanvasArray.push(this.global.canvasarray[i].toSVG());
            }
            let downloadoptions = {
                'id': this.global.loadedtemplateid,
                'svgData': JSON.stringify(svgCanvasArray),
                'cwidth': this.global.canvassize.width,
                'cheight': this.global.canvassize.height,
                'savecrop': false,
                'scale': this.global.canvasScale,
                'filename': this.global.loadedtemplateid + '.pdf',
            };

            this.http.post(Utils.getBaseURL('/api/templatedownloadpdf'), downloadoptions, {
                headers: this.headers
            }).subscribe(data => {
                var pdfpath  = ( < any > data)._body;
                var pdfurl = pdfpath.replace("/var/www/html/icentra-backend/public/", "");
                window.open(env.baseUrl + pdfurl);
                this.global.loading = false;
            });

        }

        if(donwloadForm.value.downloadaspng) {
           for (var i = 0; i < this.global.canvasarray.length; i++) {
            let canvasDataUrl = this.global.canvasarray[i].toDataURL()
                    .replace(/^data:image\/[^;]*/, 'data:application/octet-stream'),
                link = document.createElement('a');
            fileName = dfileName + ".png";

            link.setAttribute('href', canvasDataUrl);
            link.setAttribute('target', '_blank');
            link.setAttribute('download', fileName);

            if (document.createEvent) {
                var evtObj = document.createEvent('MouseEvents');
                evtObj.initEvent('click', true, true);
                link.dispatchEvent(evtObj);
            } else if (link.click) {
                link.click();
            }
          }
        }

        if(donwloadForm.value.downloadasjpeg) {
            for (var i = 0; i < this.global.canvasarray.length; i++) {
            var canvasDataUrl = this.global.canvasarray[i].toDataURL()
                    .replace(/^data:image\/[^;]*/, 'data:application/octet-stream'),
                link = document.createElement('a');
            fileName = dfileName + ".jpeg";

            link.setAttribute('href', canvasDataUrl);
            link.setAttribute('target', '_blank');
            link.setAttribute('download', fileName);

            if (document.createEvent) {
                var evtObj = document.createEvent('MouseEvents');
                evtObj.initEvent('click', true, true);
                link.dispatchEvent(evtObj);
            } else if (link.click) {
                link.click();
            }
          }
        }

        if(donwloadForm.value.downloadassvg) {
            let canvasDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(this.global.canvas.toSVG()),
                link = document.createElement('a');
            fileName = dfileName + ".svg";

            link.setAttribute('href', canvasDataUrl);
            link.setAttribute('target', '_blank');
            link.setAttribute('download', fileName);

            if (document.createEvent) {
                var evtObj = document.createEvent('MouseEvents');
                evtObj.initEvent('click', true, true);
                link.dispatchEvent(evtObj);
            } else if (link.click) {
                link.click();
            }
        }

        this.global.showTextBorders();
    }
    flipvertical() {

        var activeObject = this.global.canvas.getActiveObject();

        var grpobjs = this.global.canvas.getActiveObjects();

        if (activeObject) {
            if (activeObject.flipX) activeObject.flipX = false;
            else activeObject.flipX = true;
            this.global.canvas.renderAll();
            this.global.saveState();

        } else {
            grpobjs.forEach(function(object) {
                if (object.flipX) object.flipX = false;
                else object.flipX = true;
                this.global.saveState();
            });

        }

    }
    fliphorizontal() {
        var activeObject = this.global.canvas.getActiveObject();
        var grpobjs = this.global.canvas.getActiveObjects();
        if (activeObject) {
            if (activeObject.flipY) activeObject.flipY = false;
            else activeObject.flipY = true;
            this.global.canvas.renderAll();
            this.global.saveState();

        } else {
            grpobjs.forEach(function(object) {
                if (object.flipY) object.flipY = false;
                else object.flipY = true;
                this.global.canvas.renderAll();
                this.global.saveState();
            });

        }
    }

    getSelection(){
      return this.global.canvas.getActiveObject() == null ? this.global.canvas.getActiveObjects() : this.global.canvas.getActiveObject()
    }

    groupItems() {
        if (!this.global.canvas.getActiveObject()) {
          return;
        }
        if (this.global.canvas.getActiveObject().type !== 'activeSelection') {
          return;
        }
        this.global.canvas.getActiveObject().toGroup();
        this.global.generateLayers();
        this.global.canvas.renderAll();
    }

    unGroupItems() {
        if (!this.global.canvas.getActiveObject()) {
          return;
        }
        if (this.global.canvas.getActiveObject().type !== 'group') {
          return;
        }
        this.global.canvas.getActiveObject().toActiveSelection();
        this.global.generateLayers();
        this.global.canvas.renderAll();
    }

    groupArrange(type: any) {
        let activeGroup = this.global.canvas.getActiveObjects();
        let activeObject = this.global.canvas.getActiveObject();
        this.rotateObject(0);
        if (activeGroup) {
            if(activeGroup.length == 1) return false;
            activeGroup.forEach(function(object) {
                if(type === 'VCA') {
                    object.left = 0;
                    object.originX = 'center';
                    object.setCoords();
                } else if(type === 'HCA') {
                    object.top = 0;
                    object.originY = 'center';
                    object.setCoords();
                } else if(type === 'LA') {
                    object.left = -(activeObject.width * activeObject.scaleX) / 2 + (object.width * object.scaleX) / 2;
                    object.originX = 'center';
                    object.setCoords();
                } else if(type === 'RA') {
                    object.left = activeObject.width / 2 - (object.width * object.scaleX) / 2;
                    object.originX = 'center';
                    object.setCoords();
                } else if(type === 'TA') {
                    object.top = -(activeObject.height * activeObject.scaleY) / 2 + (object.height * object.scaleY) / 2;
                    object.originY = 'center';
                    object.setCoords();
                } else if(type === 'BA') {
                    object.top = activeObject.height / 2 - (object.height * object.scaleY) / 2;
                    object.originY = 'center';
                    object.setCoords();
                }
            });
        }
        this.global.canvas.renderAll();
        this.global.saveState();
    }

    rotateObject(angleOffset: any) {
        var obj = this.global.canvas.getActiveObject(),
            resetOrigin = false;
        if (!obj) obj = this.global.canvas.getActiveObjects();
        if (!obj) return;
        var angle = parseInt(obj.angle) + parseInt(angleOffset);
        if ((obj.originX !== 'center' || obj.originY !== 'center') && obj.centeredRotation) {
            obj.setOriginToCenter && obj.setOriginToCenter();
            resetOrigin = true;
        }
        angle = angle > 360 ? 90 : angle < 0 ? 270 : angle;
        if (obj.angle == 0) {
            obj.angle = angle;
            obj.setCoords();
        }
        if (angleOffset == 0) obj.angle = angleOffset;
        obj.setCoords();
        if (resetOrigin) {
            obj.setCenterToOrigin && obj.setCenterToOrigin();
        }
        this.global.canvas.renderAll();
    }

    convertToPX(w, h) {
        console.log(w + " " + h);
        if(this.canvasunits == 'MM') {
            w = this.convertMMToPX(w);
            h = this.convertMMToPX(h);
        } else if (this.canvasunits == 'CM') {
            w = this.convertCMToPX(w);
            h = this.convertCMToPX(h);
        }
        if(this.orientation == 'portrait') {
            var tw = w;
            w = h;
            h = tw;
        }
        console.log(w + " " + h);
        return {w: w, h: h};
    }

    onCanvaswhFormSubmit(canvaswhForm: NgForm) {
        this.global.isNew = true;

        console.log(canvaswhForm.value);

        this.editcanvaswhForm.controls.editCanvasWid.setValue(canvaswhForm.value.loadCanvasWid);
        this.editcanvaswhForm.controls.editCanvasHei.setValue(canvaswhForm.value.loadCanvasHei);

        var wh = this.convertToPX(canvaswhForm.value.loadCanvasWid, canvaswhForm.value.loadCanvasHei);
        this.global.createNewCanvas(wh.w, wh.h);

        if(canvaswhForm.value.pages > 1)
        {
            for (let i = 1; i < canvaswhForm.value.pages; i++)
            {
              this.global.addnewpage();
            }
        }

        if(!canvaswhForm.value.name)
        {
          $("#designname").html('Design Name');
        }

        $("#designname").html(canvaswhForm.value.name);

        $(".print-popup-wrap").fadeOut();
    }

    oneditCanvaswhFormSubmit(editcanvaswhForm: NgForm) {
        this.global.isNew = false;

        var wh = this.convertToPX(editcanvaswhForm.value.editCanvasWid, editcanvaswhForm.value.editCanvasHei);
        this.global.createNewCanvas(wh.w, wh.h);

        if(editcanvaswhForm.value.editpages)
        {
            console.log(editcanvaswhForm.value.editpages);
            for (let i = 1; i < editcanvaswhForm.value.editpages; i++)
            {
              this.global.addnewpage();
            }
        }

        this.global.updateIconPos();
        //$(".editcanvassec").fadeOut();
        $(".textEditor").css("display","block");
    }

    portrait() {
        this.orientation = "portrait";
        var width: any = $("#editCanvasWid").val();
        var height: any = $("#editCanvasHei").val();
        this.global.setCanvasWidthHeight(width * this.global.canvasScale, height * this.global.canvasScale);
        this.global.updateIconPos();
    }
    landscape() {
        this.orientation = "landscape";
        var width: any = $("#editCanvasHei").val();
        var height: any = $("#editCanvasWid").val();
        this.global.setCanvasWidthHeight(width * this.global.canvasScale, height * this.global.canvasScale);
        this.global.updateIconPos();
    }

    setunits(event) {
        this.canvasunits = event.target.value;
        console.log(this.canvasunits);
    }

    convertMMToPX(mm) {
        return (mm * 96) / 25.4;
    }
    convertCMToPX(cm) {
        return (cm * 96) / 2.54;
    }

    convertForUnits(w, h, currentunit) {

        // MM to CM
        if(this.canvasunits == 'MM' && currentunit == 'CM') {
            w = w / 10;
            h = h / 10;
        }
        // MM to PX
        if(this.canvasunits == 'MM' && currentunit == 'PX') {
            w = this.convertMMToPX(w);
            h = this.convertMMToPX(h);
        }

        // CM to MM
        if(this.canvasunits == 'CM' && currentunit == 'MM') {
            w = w * 10;
            h = h * 10;
        }
        // CM to PX
        if(this.canvasunits == 'CM' && currentunit == 'PX') {
            w = this.convertCMToPX(w);
            h = this.convertCMToPX(h);
        }

        // PX to MM
        if(this.canvasunits == 'PX' && currentunit == 'MM') {
            w = (w * 25.4) / 96;
            h = (h * 25.4) / 96;
        }
        // PX to CM
        if(this.canvasunits == 'PX' && currentunit == 'CM') {
            w = (w * 2.54) / 96;
            h = (h * 2.54) / 96;
        }
        return {w: Math.round(w * 100)/100, h: Math.round(h * 100)/100};
    }

    onunitchange(event) {

        var w = $("#loadCanvasWid").val();
        var h = $("#loadCanvasHei").val();
        var currentunit = event.target.value;
        var wh = this.convertForUnits(w, h, currentunit);
        $("#loadCanvasWid").val(wh.w);
        $("#loadCanvasHei").val(wh.h);
        $("#editCanvasWid").val(wh.w);
        $("#editCanvasHei").val(wh.h);

        this.canvasunits = event.target.value;
        $("#editunits").val(this.canvasunits);
        $("#units").val(this.canvasunits);

        console.log(wh);

    }

    oneditunitchange(event) {

        var w = $("#editCanvasWid").val();
        var h = $("#editCanvasWid").val();
        var currentunit = event.target.value;
        var wh = this.convertForUnits(w, h, currentunit);
        $("#editCanvasWid").val(wh.w);
        $("#editCanvasHei").val(wh.h);
        $("#loadCanvasWid").val(wh.w);
        $("#loadCanvasHei").val(wh.h);

        this.canvasunits = event.target.value;
        $("#editunits").val(this.canvasunits);
        $("#units").val(this.canvasunits);
    }

    addnewpage() {
        this.global.addnewpage();
        this.props.zoomPercent = Math.round(this.global.canvasScale * 100);
    }

    fitZoom() {
        this.global.resizeUpCanvas();
        this.global.resizeDownCanvas();
        this.props.zoomPercent = Math.round(this.global.canvasScale * 100);
    }

    zoomToPercent(value) {
      this.zoomValue = value;
      this.zoomSet=true;
      if (parseInt(value) > 500) value = 500;
      if (parseInt(value) < 0) value = 1;
      this.global.zoomToPercent(value);
      this.props.zoomPercent = Math.round(this.global.canvasScale * 100);
      $('.template-canvas-wrap').scrollLeft(($('.canvas-work-area').width() - $('.template-canvas-wrap').width()) / 2);
    }
    notes()
    {
       this.global.tempnotes = $("#tempnotes").val();
    }
    setFontFamily(selfontname) {
        this.setActiveProp('fontFamily', selfontname);
    }
    getFont() {
        this.http.get(Utils.getBaseURL('/api/fontget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateFontlistSection(data);
        });
    }

    setDroptext(event) {
        if (event.target.checked) {
            var canvas = this.global.canvas;
            var activeObject = canvas.getActiveObject();
            if (!this.textColorval) this.textColorval = '#000';
            activeObject.setShadow({
                color: this.textColorval,
                blur: 1,
                offsetX: 1,
                offsetY: 1

            });
            canvas.renderAll();
        }
   }
   setBrightnessText(event) {
        if (event.target.checked) {
            if (!this.textColorval) this.textColorval = '#000';
            this.setActiveStyle('stroke', this.textColorval, null);
        }
    }
    setTextbrightness() {
        this.setActiveStyle('strokeWidth', parseInt(this.props.textBrightness), null);
    }

    setCurvedtext(event) {
        var canvas = this.global.canvas;
        if (event.target.checked) {
            var props = {};
            var obj = canvas.getActiveObject();
            if (obj) {
                if (/textbox/.test(obj.type)) {
                    props = obj.toObject();
                    delete props['type'];
                    props['textAlign'] = 'center';
                    props['diameter'] = 250;
                    props['spacing'] = 20;
                    var cText = new fabric.CurvedText(obj, props);
                    canvas.remove(obj);
                    canvas.add(cText);
                    canvas.setActiveObject(cText);
                    canvas.renderAll();
                }
            }
        } else {
            var props = {};
            var obj = canvas.getActiveObject();
            if (obj) {
                if (/curved-text/.test(obj.type)) {
                    props = obj.toObject();
                    delete props['type'];
                    props['textAlign'] = 'center';
                    var text = new fabric.Textbox(obj, props);
                    canvas.remove(obj);
                    canvas.add(text);
                    canvas.setActiveObject(text);
                    canvas.renderAll();
                }
            }
        }
    }
    setTextdiameter() {
        var canvas = this.global.canvas;
        var activeObject = canvas.getActiveObject();
        if(activeObject) {
            activeObject.set({diameter: parseInt(this.props.textDiameter)});
            canvas.discardActiveObject();
            canvas.setActiveObject(activeObject);
            canvas.requestRenderAll();
        }
    }
    setTextoffsetX() {
        var canvas = this.global.canvas;
        var activeObject = canvas.getActiveObject();
        activeObject.setShadow({
            blur: 1,
            color: this.textColorval,
            offsetX: this.props.textoffsetX,
            offsetY: ''

        });
        canvas.renderAll();
    }

    // load the dynamic fonts in fonts dropdown.
    updateFontlistSection(data) {
        let fontlist = JSON.parse(( < any > data)._body);
        $('#fontlistcontainer').empty();
        fontlist = this.removeDuplicates(fontlist, "name");
        fontlist.sort(this.alphabeticalSort("name"));
        for (let font of fontlist) {
            $("head").prepend("<style type=\"text/css\">" + "@font-face {\n" + "\tfont-family: " + font.name + ";\n" + "\tsrc: local('â˜º'), url('" + Utils.getBaseURL(font.regular) + "') format('opentype');\n" + "}\n" + "\tp.tests {\n" + "\tfont-family: Bungee Inline !important;\n" + "}\n" + "</style>");
            var fontlists = $('<a class="dropdown-item fontname" data-font="' + font.name + '" style="cursor: pointer;font-family:' + font.name + '">' + this.filtername(font.name) + '</a>');
            $('#fontlistcontainer').append(fontlists);
        }
        this.initEvents();
    }
    filtername(fontname){
        var fontval = fontname.replace("-BoldItalic", "");
        fontval = fontval.replace("-Bold", "");
        fontval = fontval.replace("-Italic", "");
        fontval = fontval.replace("-Regular", "");
        return fontval;
    }
   removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 }
    alphabeticalSort(property) {
        var sortOrder = 1;

        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a,b) {
            if(sortOrder == -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }
        }
    }

    triggerreplaceImg() {
        $('.replaceImg').trigger('click');
    }

    replaceImgSave(replaceimgForm: NgForm): any {
        let input = new FormData();
        input.append('cat_id', '6');
        for(var i = 0; i < this.replaceimgFiles.length; i++) {
            input.append('path[]', this.replaceimgFiles[i]);
        }
        return input;
    }
    onreplaceImgSubmit(replaceimgForm: NgForm) {
        const formModel = this.replaceImgSave(replaceimgForm);
        this.global.loading = true;

        this.http.post(Utils.getBaseURL('/api/imagesave'), formModel).subscribe(data => {
            this.global.loading = false;
            $(".se-pre-con").fadeIn("slow");
            this.replaceImg();
        });
        (<any>$('#replaceimgForm')[0]).slick();
        (<any>$("#addreplaceimagemodal")).modal('hide');
    }
    onreplaceFileChange(event) {
        this.replaceimgFiles = [];
        for(var i = 0; i < event.target.files.length; i++) {
            this.replaceimgFiles.push(event.target.files[i]);
            console.log(event.target.files[i].name);
            this.replacefileimgname = event.target.files[i].name;
        }
        $('.submitbtn').trigger('click');
    }
    replaceImg()
    {
        $(".se-pre-con").fadeIn("slow");
        var self = this;
        var actObj = self.global.canvas.getActiveObject();

        if (!actObj) {
            return;
        }
        var imgurl = env.baseUrl + '/admin/uploads/images/';
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function() {
            var w = actObj.width * actObj.scaleX;
            var h = actObj.height * actObj.scaleY;
            actObj.setElement(img);

            var scalex = w / img.width;
            var scaley = h / img.height;

            //actObj.scaleX = scalex;
            //actObj.scaleY = scalex;

            actObj.orgSrc = img.src;
            actObj.src = img.src;
            $(".se-pre-con").fadeOut("slow");
            actObj.setCoords();
            self.global.canvas.renderAll();
        }
        img.src = imgurl + this.replacefileimgname;
    }

    selectallobjs() {
        var canvas = this.global.canvas;
        canvas.discardActiveObject();
        var sel = new fabric.ActiveSelection(canvas.getObjects(), {
          canvas: canvas,
        });
        canvas.setActiveObject(sel);
        canvas.requestRenderAll();
    }


    copyobjs() {
        // clone what are you copying since you
        // may want copy and paste on different moment.
        // and you do not want the changes happened
        // later to reflect on the copy.
        var self = this;
        var canvas = this.global.canvas;
        canvas.getActiveObject().clone(function(cloned) {
            self.clipboard = cloned;
        });
        canvas.requestRenderAll();
    }

    cutobjs() {
        var canvas = this.global.canvas;
        var actObj = canvas.getActiveObject();
        var self = this;
        actObj.clone(function(cloned) {
            self.clipboard = cloned;
        });
        canvas.remove(actObj);
        canvas.requestRenderAll();
    }

    pasteobjs(changepos) {
        var canvas = this.global.canvas;
        var self = this;
        // clone again, so you can do multiple copies.
        self.clipboard.clone(function(clonedObj) {
            canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = canvas;
                clonedObj.forEachObject(function(obj) {
                    canvas.add(obj);
                });
                // this should solve the unselectability
                clonedObj.setCoords();
            } else {
                canvas.add(clonedObj);
            }
            self.clipboard.top += 10;
            self.clipboard.left += 10;
            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
        });
    }

    getReplaceimages() {
        this.http.get(Utils.getBaseURL('/api/imageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateReplaceimgSection(data);
        });
    }

    updateReplaceimgSection(data) {
        let imgs = [];
        if(data) {
            imgs = JSON.parse((<any>data)._body);
            this.replaceimg = imgs;
            this.replaceimages = imgs;
        } else {
            imgs = this.replaceimg;
        }
        $('#replacesection').empty();
        var htmldata = '';
        for (let img of imgs) {
            var imglist = $('<div style="margin: 10px 0px;max-width:33%;padding: 10px;overflow: hidden;width: 100%;height: 100px;display:flex;align-items:center;" class="sinlge-replacepic" data-src="' + Utils.getBaseURL(img.path) + '"><img style="max-width:100%;height:auto;"  class="replacepic img" data-src="' + Utils.getBaseURL(img.path) + '" src="' + Utils.getBaseURL(img.path) + '"/></div>');
            //htmldata += imglist;
            $('#replacesection').append(imglist);

        }
        this.initEvents();
        /*var $grid = $('#replacesection');
        if ($grid.length) { // if 'length' is non zero. Enter block...
            $grid.isotope({
                itemSelector: 'div',
                masonry: {
                    columnWidth: 'div'
                }
            });
            htmldata = $(htmldata);
            $grid.isotope().append(htmldata).isotope('appended', htmldata).isotope('layout');
            CreateUtils.showreplaceimages();
            //this.initEvents();
        }*/
    }
    searchlibraryimg() {
        this.replaceimg = this.replaceimages;
        var imgname: any = $("#imgsearch").val();
        var imgs = [];
        for (let img of this.replaceimg) {
            if(imgname == ""  || img.name.toLowerCase().indexOf(imgname.toLowerCase()) !== -1) {
                imgs.push(img);
            }
        }
        this.replaceimg = imgs;
        this.updateReplaceimgSection(false);
    }

    bringToFronts()
    {
        var canvas =  this.global.canvas;
        /*var objects = canvas.getObjects().filter(function(o) {
            return o.excludeFromExport !== true;
        });
        for (var i = 0; i < objects.length; i++) {
            canvas.bringToFront(objects[i]);
        }
        canvas.renderAll();*/

        let activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveObjects();
        if (!activeObject && !activeGroup) return;
        if (activeGroup) {
            activeGroup.forEach(function(object) {
                canvas.bringToFront(object);
            });
        }
        if (activeObject) {
            canvas.bringToFront(activeObject);
        }
    }
    sendToBacks(){
        var canvas =  this.global.canvas;
        let activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveObjects();
        if (!activeObject && !activeGroup) return;
        if (activeGroup) {
            activeGroup.forEach(function(object) {
                canvas.sendToBack(object);
            });
        }
        if (activeObject) {
            canvas.sendToBack(activeObject);
        }
    }

    closePopup()
    {
    $(".print-popup-wrap").fadeOut();
    }

    cloneobjs() {
        var canvas = this.global.canvas;
        var actObj = canvas.getActiveObject();
        var self = this;
        actObj.clone(function(clonedObj) {
            canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = canvas;
                clonedObj.forEachObject(function(obj) {
                    canvas.add(obj);
                });
                // this should solve the unselectability
                clonedObj.setCoords();
            } else {
                canvas.add(clonedObj);
            }
            self.clipboard.top += 10;
            self.clipboard.left += 10;
            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
        });
    }
}



var originalRender = fabric.Textbox.prototype._render;
fabric.Textbox.prototype._render = function(ctx) {
  originalRender.call(this, ctx);
  //Don't draw border if it is active(selected/ editing mode)
  if (this.active) return;
  if(this.showTextBoxBorder){
    var w = this.width,
      h = this.height,
      x = -this.width / 2,
      y = -this.height / 2;
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    var stroke = ctx.strokeStyle;
    ctx.strokeStyle = this.textboxBorderColor;
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.Textbox.prototype.cacheProperties = fabric.Textbox.prototype.cacheProperties.concat('active');

/*
 * CurvedText object for fabric.js
 * @author Arjan Haverkamp (av01d)
 * @date January 2018
 */

fabric.CurvedText = fabric.util.createClass(fabric.Object, {
    type: 'curved-text',
    diameter: 250,
    kerning: 0,
    text: '',
    flipped: false,
    fill: '#000',
    fontFamily: 'Times New Roman',
    fontSize: 14, // in px
    fontWeight: 'normal',
    fontStyle: '', // "normal", "italic" or "oblique".
    cacheProperties: fabric.Object.prototype.cacheProperties.concat('diameter', 'kerning', 'flipped', 'fill', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'strokeStyle', 'strokeWidth'),
    strokeStyle: null,
    strokeWidth: 0,

    initialize: function(text, options) {
        options || (options = {});
        this.text = text;

        this.callSuper('initialize', options);
        this.set('lockUniScaling', true);

        // Draw curved text here initially too, while we need to know the width and height.
        var canvas = this.getCircularText();
        this._trimCanvas(canvas);
        this.set('width', canvas.width);
        this.set('height', canvas.height);
    },

    _getFontDeclaration: function()
    {
        return [
            // node-canvas needs "weight style", while browsers need "style weight"
            (fabric.isLikelyNode ? this.fontWeight : this.fontStyle),
            (fabric.isLikelyNode ? this.fontStyle : this.fontWeight),
            this.fontSize + 'px',
            (fabric.isLikelyNode ? ('"' + this.fontFamily + '"') : this.fontFamily)
        ].join(' ');
    },

    _trimCanvas: function(canvas)
    {
        var ctx = canvas.getContext('2d'),
            w = canvas.width,
            h = canvas.height,
            pix = {x:[], y:[]}, n,
            imageData = ctx.getImageData(0,0,w,h),
            fn = function(a,b) { return a-b };

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                if (imageData.data[((y * w + x) * 4)+3] > 0) {
                    pix.x.push(x);
                    pix.y.push(y);
                }
            }
        }
        pix.x.sort(fn);
        pix.y.sort(fn);
        n = pix.x.length-1;

        w = pix.x[n] - pix.x[0];
        h = pix.y[n] - pix.y[0];
        var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

        canvas.width = w;
        canvas.height = h;
        ctx.putImageData(cut, 0, 0);
    },

    // Source: http://jsfiddle.net/rbdszxjv/
    getCircularText: function()
    {
        var text = this.text,
            diameter = this.diameter,
            flipped = this.flipped,
            kerning = this.kerning,
            fill = this.fill,
            inwardFacing = true,
            startAngle = 0,
            canvas = fabric.util.createCanvasElement(),
            ctx = canvas.getContext('2d'),
            cw, // character-width
            x, // iterator
            clockwise = -1; // draw clockwise for aligned right. Else Anticlockwise

        if (flipped) {
            startAngle = 180;
            inwardFacing = false;
        }

        startAngle *= Math.PI / 180; // convert to radians

        // Calc heigt of text in selected font:
        var d = document.createElement('div');
        d.style.fontFamily = this.fontFamily;
        d.style.whiteSpace = 'nowrap';
        d.style.fontSize = this.fontSize + 'px';
        d.style.fontWeight = this.fontWeight;
        d.style.fontStyle = this.fontStyle;
        d.textContent = text;
        document.body.appendChild(d);
        var textHeight = d.offsetHeight;
        document.body.removeChild(d);

        canvas.width = canvas.height = diameter;
        ctx.font = this._getFontDeclaration();

        // Reverse letters for center inward.
        if (inwardFacing) { text = text.split('').reverse().join('') };

        // Setup letters and positioning
        ctx.translate(diameter / 2, diameter / 2); // Move to center
        //startAngle += (Math.PI * !inwardFacing); // Rotate 180 if outward
        ctx.textBaseline = 'middle'; // Ensure we draw in exact center
        ctx.textAlign = 'center'; // Ensure we draw in exact center

        // rotate 50% of total angle for center alignment
        for (x = 0; x < text.length; x++) {
            cw = ctx.measureText(text[x]).width;
            startAngle += ((cw + (x == text.length-1 ? 0 : kerning)) / (diameter / 2 - textHeight)) / 2 * -clockwise;
        }

        // Phew... now rotate into final start position
        ctx.rotate(startAngle);

        // Now for the fun bit: draw, rotate, and repeat
        for (x = 0; x < text.length; x++) {
            cw = ctx.measureText(text[x]).width; // half letter
            // rotate half letter
            ctx.rotate((cw/2) / (diameter / 2 - textHeight) * clockwise);
            // draw the character at "top" or "bottom"
            // depending on inward or outward facing

            // Stroke
            if (this.strokeStyle && this.strokeWidth) {
                ctx.strokeStyle = this.strokeStyle;
                ctx.lineWidth = this.strokeWidth;
                ctx.miterLimit = 2;
                ctx.strokeText(text[x], 0, (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2));
            }

            // Actual text
            ctx.fillStyle = fill;
            ctx.fillText(text[x], 0, (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2));

            ctx.rotate((cw/2 + kerning) / (diameter / 2 - textHeight) * clockwise); // rotate half letter
        }
        return canvas;
    },

    _set: function(key, value) {
        switch(key) {
            case 'scaleX':
                this.fontSize *= value;
                this.diameter *= value;
                this.width *= value;
                this.scaleX = 1;
                if (this.width < 1) { this.width = 1; }
                break;

            case 'scaleY':
                this.height *= value;
                this.scaleY = 1;
                if (this.height < 1) { this.height = 1; }
                break;

            default:
                this.callSuper('_set', key, value);
                break;
        }
    },

    _render: function(ctx)
    {
        var canvas = this.getCircularText();
        this._trimCanvas(canvas);

        this.set('width', canvas.width);
        this.set('height', canvas.height);

        ctx.drawImage(canvas, -this.width / 2, -this.height / 2, this.width, this.height);

        this.setCoords();
    },

    toObject: function(propertiesToInclude) {
        return this.callSuper('toObject', ['text', 'diameter', 'kerning', 'flipped', 'fill', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'strokeStyle', 'strokeWidth'].concat(propertiesToInclude));
    }
});

fabric.CurvedText.fromObject = function(object, callback, forceAsync) {
    return fabric.Object._fromObject('CurvedText', object, callback, forceAsync, 'curved-text');
};