import {
    Component,
    OnInit
}
from '@angular/core';
import {
    NgForm,
    FormBuilder,
    FormGroup,
    Validators
}
from '@angular/forms';
import {
    CreateGlobals
}
from '../create.globals';
import {
    Http,
    Headers
}
from '@angular/http';
import {
    CreateUtils
}
from '../create.utils';
import {
    Utils
}
from '../../../utils';
import isotope from 'isotope-layout';
declare var $: any;
declare const fabric: any;
@Component({
    selector: 'app-background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    private imgFiles = [];
    bgimages: any = [];
    origbgimages: any = [];
    bgpatternimages: any = [];
    origbgpatternimages : any = [];
    props: any = {
        canvasFill: '#ffffff',
        canvasImage: ''
    };
    favbgcolor: any;
    grdcolone: any;
    grdcoltwo: any;
    grdcolorone: any;
    grdcolortwo: any;
    gradienttype: any;
    public inset2dark = { axis: 'y'};
    
    constructor(private http: Http, private global: CreateGlobals) {
        this.getBgimages();
        this.getBgimagecategory();
        this.getBGcolors();
        this.getGradients();
        this.getBgpatterns(); 
    }
    ngOnInit() {}
    deleteCanvasBg() {
        //this.global.canvas.backgroundColor = '';
        //this.global.canvas.renderAll();
        //if (!lcanvas) lcanvas = canvas;
        var objects = this.global.canvas.getObjects().filter(function(o) {
            return o.bg == true;
        });
        for (var i = 0; i < objects.length; i++) {
            this.global.canvas.remove(objects[i]);
        }
        this.global.canvas.bgsrc = "";
        this.global.canvas.bgcolor = "";
    }
    getBgpatterns() {
        this.http.get(Utils.getBaseURL('/api/bgpatternget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateBgpatternsSection(data);
        });
    }
    updateBgpatternsSection(data) {
        let bgpattns = [];
        if (data) {
            bgpattns = JSON.parse(( < any > data)._body);
            this.bgpatternimages = bgpattns;
            this.origbgpatternimages = bgpattns;
        }
        else {
            bgpattns = this.bgpatternimages;
        }
        $('#pattren').empty();
        var patternhtmldata = '';
        for (let bgpattn of bgpattns) {
            var bgpattrnslistsettings = '<a><img style="width:50px;height: 50px;object-fit: cover;padding: 4px;" class="adminbgpattern img" data-patternsrc="' + Utils.getBaseURL(bgpattn.path) + '" src="' + Utils.getBaseURL(bgpattn.path) + '"/></a>';
            $('#pattren').append(bgpattrnslistsettings);
        }
        var $grid = $('#pattren');
        $grid.isotope({
            itemSelector: 'div',
            masonry: {
                columnWidth: 'div'
            }
        });
        patternhtmldata = $(patternhtmldata);
        $grid.isotope().append(patternhtmldata).isotope('appended', patternhtmldata).isotope('layout');
        CreateUtils.showbgimgs();
        this.initEvents();
    }
    getBgimages() {
        this.http.get(Utils.getBaseURL('/api/bgimageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateBgimagesSection(data);
        });
    }
    updateBgimagesSection(data) {
        let bgimgs = [];
        if (data) {
            bgimgs = JSON.parse(( < any > data)._body);
            this.bgimages = bgimgs;
            this.origbgimages = bgimgs;
        }
        else {
            bgimgs = this.bgimages;
        }
        $('#photos').empty();
        var bghtmldata = '';
        for (let bgimg of bgimgs) {
            var bgimglist = '<a><img style="width:50px;height: 50px;object-fit: cover;padding: 4px;" class="adminbgimg img" src="' + Utils.getBaseURL(bgimg.path) + '"/></a>';
            $('#photos').append(bgimglist);
        }
        var $grid = $('#photos');
        $grid.isotope({
            itemSelector: 'div',
            masonry: {
                columnWidth: 'div'
            }
        });
        $(".se-pre-con").fadeOut("slow");
        bghtmldata = $(bghtmldata);
        $grid.isotope().append(bghtmldata).isotope('appended', bghtmldata).isotope('layout');
        CreateUtils.showbgimgs();
        this.initEvents();
    }
    initEvents() {
        let lthis = this;
        $(".bgimgid").unbind('click').on('click', function(e) {
            e.preventDefault();
            var selbgimgid = "";
            var selbgimgname = "";
            selbgimgid = $(this).data('id');
            selbgimgname = $(this).data('name');
            if ($(this).data('id') == "0") {
                selbgimgname = "Select Category";
            }
            $('.selbgimgcatname').empty();
            $('.selbgimgcatname').text(selbgimgname);
            lthis.getcatBgimages(selbgimgid);
        });
        $(".bgfavcolor").unbind('click').on('click', function(e) {
            e.preventDefault();
            var selbgcolor = $(this).data('color');
            var fid = $(this).data('favid');
            $(".bgfavcolor").css("border","none");
            $("#"+fid).css("border","2px solid");
            lthis.solidcanvasbg(selbgcolor);
        });
        $(".adminbgimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.global.setCanvasBG(e)
        });
         $(".adminbgpattern").unbind('click').on('click', function(e) {
            e.preventDefault();
            var bgpattern = $(this).data("patternsrc");
            lthis.applyBGPattern(bgpattern);
        });
        $(".gradientsection").unbind('click').on('click', function(e) {
            e.preventDefault();
            var selgrdcolor1 = "";
            var selgrdcolor2 = "";
            var selgrdcolortype = "";
            var selid = "";
            selgrdcolor1 = $(this).data('color1');
            $(".colsec1").val(selgrdcolor1);
            selgrdcolor2 = $(this).data('color2');
            $(".colsec2").val(selgrdcolor2);
            selgrdcolortype = $(this).data('type');
            selid = $(this).data('gid');
            $(".gradientsection").css("border","2px solid transparent");
            $("#"+selid).css("border-color","#333");
            if ($(this).data('type') == "gradientbghorizontal") {
                lthis.grdcolone = selgrdcolor1;
                lthis.grdcoltwo = selgrdcolor2;
                lthis.setHorizontalBGgradient();
            }
            if ($(this).data('type') == "gradientbgradial") {
                lthis.grdcolone = selgrdcolor1;
                lthis.grdcoltwo = selgrdcolor2;
                lthis.setRadialBGgradient();
            }
        });
        $(".deleteGradient").unbind('click').on('click', function(e) {
            e.preventDefault();
            var grdid = $(this).data('id');
            lthis.deleteGradients(grdid);
        });
        CreateUtils.initDraggable();
    }

    getGradientcolone() {
        this.grdcolone = this.props.colorone;
    }
    getGradientcoltwo() {
        this.grdcoltwo = this.props.colortwo;
        if($('.linearbtn').hasClass('active')){
          this.setHorizontalBGgradient();
        }
        if($('.radialbtn').hasClass('active')){
          this.setRadialBGgradient();
        }
    }
    linearGradient(){
        if(this.grdcolone == '' && this.grdcoltwo == '')
        {
        return;
        }
          this.setHorizontalBGgradient();

    }
    radialGradient(){
        if(this.grdcolone == '' && this.grdcoltwo == '')
        {
        return;
        }
        this.setRadialBGgradient();

    }
    grdcolval1()
        {
          this.grdcolone = $("#grdcolval1").val();
          $(".bggrdcol").css("background",this.grdcolone);
        }
    grdcolval2()
        {
          this.grdcoltwo = $("#grdcolval2").val();
          $(".bggrdcolr").css("background",this.grdcoltwo);
        }
    saveGradient(){

        if(this.grdcolone == '' && this.grdcoltwo == '')
        {
        return;
        }

        let gradientoptions = {
            'color1': this.grdcolone,
            'color2': this.grdcoltwo,
            'type': this.gradienttype,
        };
        console.log(gradientoptions);
        this.http.post(Utils.getBaseURL('/api/gradientsave') , JSON.stringify(gradientoptions), {
            headers: this.headers
        }).subscribe(data => {
        this.getGradients();
        this.grdcolone = '';
        this.grdcoltwo = '';
            
        });
    }

    setHorizontalBGgradient() {
        this.gradienttype = "gradientbghorizontal";
        this.deleteCanvasBg();
        var canvas = this.global.canvas;
        if (!canvas) return false;
        var horizontalgrad = new fabric.Gradient({
            type: 'linear',
            coords: {
                x1: 0,
                y1: canvas.height / 4,
                x2: 0,
                y2: canvas.height / 2 + canvas.height / 4,
            },
            colorStops: [{
                color: this.grdcolone,
                offset: 0,
            }, {
                color: this.grdcoltwo,
                offset: 1,
            }]
        });
        canvas.backgroundColor = horizontalgrad;
        canvas.renderAll();
    }
    setVerticalBGgradient() {
        this.deleteCanvasBg();
        var canvas = this.global.canvas;
        if (!canvas) return false;
        var verticalgrad = new fabric.Gradient({
            type: 'linear',
            coords: {
                x1: canvas.width / 4,
                y1: 0,
                x2: canvas.width / 2 + canvas.width / 4,
                y2: 0,
            },
            colorStops: [{
                color: this.grdcolone,
                offset: 0,
            }, {
                color: this.grdcoltwo,
                offset: 1,
            }]
        });
        canvas.backgroundColor = verticalgrad;
        canvas.renderAll();
    }
    setDiagonalBGgradient() {
        this.deleteCanvasBg();
        this.global.canvas.renderAll();
    }
    setRadialBGgradient() {
        this.gradienttype = "gradientbgradial";    
        this.deleteCanvasBg();
        var canvas = this.global.canvas;
        var radialgrad = new fabric.Gradient({
            type: 'radial',
            coords: {
                r1: canvas.width / 2,
                r2: canvas.width / 4,
                x1: (canvas.width / 2) - 1,
                y1: (canvas.height / 2) - 1,
                x2: canvas.width / 2,
                y2: canvas.height / 2,
            },
            colorStops: [{
                color: this.grdcolone,
                offset: 0,
            }, {
                color: this.grdcoltwo,
                offset: 1,
            }]
        });
        canvas.backgroundColor = radialgrad;
        canvas.renderAll();
    }
    applyBGPattern(bgpatternsrc) {
        var canvas = this.global.canvas;
        var fileExtension = bgpatternsrc.substr((bgpatternsrc.lastIndexOf('.') + 1));
        if(fileExtension == 'svg'){
        fabric.loadSVGFromURL(bgpatternsrc, (objects) => {
                var loadedObject = fabric.util.groupSVGElements(objects);
                loadedObject.src = bgpatternsrc;
                this.deleteCanvasBg();
                canvas.setBackgroundColor({
                    source: loadedObject.toDataURL()
                }, canvas.renderAll.bind(canvas));
            });
          }
            this.deleteCanvasBg();
            canvas.setBackgroundColor({
                source: bgpatternsrc,
                repeat: 'repeat'
            }, canvas.renderAll.bind(canvas));  
    }
    setCanvasFill() {
        this.deleteCanvasBg();
        var canvas = this.global.canvas;
         var bg = new fabric.Rect({
            originX: "center",
            originY: "center",
            strokeWidth: 1,
            fill: this.props.canvasFill,
            opacity: 1,
            selectable: false,
            width: canvas.getWidth(),
            height: canvas.getHeight()
        });
        canvas.add(bg);
        bg.center();
        canvas.sendToBack(bg);
        canvas.bgcolor = this.props.canvasFill;
        bg.bg = true;
        this.favbgcolor = this.props.canvasFill;
        canvas.backgroundColor = this.props.canvasFill;
        this.global.saveState();
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
        $('.gradientbgsec').empty();
        $('.radialbggradientsec').empty();
        //var gradienthtmldata = '';
        for (let gradient of gradients) {
            if (gradient.type == "gradientbghorizontal" )
            {
            
            var gradientslist = $('<li class="gradientsection" data-gid="'+ gradient.id +'" id="'+ gradient.id +'" style="background-image: linear-gradient(' + gradient.color1 + ', ' + gradient.color2 + ');-webkit-box-shadow: 1px 1px 6px rgba(0,0,0,.3);cursor: pointer;width: 37px;height: 37px;border-radius: 2px;margin: 4px 3px;position:relative;" data-type="'+ gradient.type +'" data-color1="'+ gradient.color1 +'" data-color2="'+ gradient.color2 +'"><div style="border-top-left-radius:2px;  border-top-right-radius:2px;"></div><i class="fa fa-trash-o deleteGradient" data-id="'+ gradient.id +'" style=" cursor: pointer;position:absolute;left:-4px;top:-4px;width: 15px;height: 17px;border-radius: 50%;color: #fff;background: #fc7b82;line-height: 15px;font-size: 10px;text-align: center;display: block;"></i></li>');
            
            }
            if (gradient.type == "gradientbgradial")
            {
            
            var gradientlists = $('<li class="gradientsection" data-gid="'+ gradient.id +'" id="'+ gradient.id +'" style="background-image: radial-gradient(' + gradient.color2 + ', ' + gradient.color1 + '); -webkit-box-shadow: 1px 1px 6px rgba(0,0,0,.3); cursor: pointer;width: 37px;height: 37px;border-radius: 2px;margin: 4px 3px;position:relative;" data-type="'+ gradient.type +'" data-color1="'+ gradient.color1 +'" data-color2="'+ gradient.color2 +'"><div style="border-top-left-radius:2px;  border-top-right-radius:2px;"></div><i class="fa fa-trash-o deleteGradient" data-id="'+ gradient.id +'" style=" cursor: pointer;position:absolute;left:-4px;top:-4px;width: 15px;height: 17px;border-radius: 50%;color: #fff;background: #fc7b82;line-height: 15px;font-size: 10px;text-align: center;display: block;"></i></li>');

            }
           //gradienthtmldata += gradientslist;
           $('.gradientbgsec').append(gradientslist);
           $('.radialbggradientsec').append(gradientlists);
        }
        this.initEvents();
       
    }
    showgradients() {
        setTimeout(function() {
            var $grid = $('.gradientbgsec');
            $grid.imagesLoaded().progress(function() {
                $grid.isotope('layout');
                $grid.isotope('reloadItems');
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
    savebgcolor() {
        console.log(this.favbgcolor);
        let bgcoloroptions = {
            'bgcolor': this.favbgcolor,
        };
        console.log(JSON.stringify(bgcoloroptions));
        this.http.post(Utils.getBaseURL('/api/bgcolorsave'), JSON.stringify(bgcoloroptions), {
            headers: this.headers
        }).subscribe(data => {
            this.getBGcolors();
        });
    }
    getBGcolors() {
        this.http.get(Utils.getBaseURL('/api/bgcolorget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateBgcolorSection(data);
        });
    }
    updateBgcolorSection(data) {
        let bgcolors = JSON.parse(( < any > data)._body);
        $('#bgcolorlist').empty();
        var bgcolorhtmldata = '';
        for (let bgcolor of bgcolors) {
            var bgcolorlist = $('<li><div class="bgfavcolor" id="' + bgcolor.id + '" data-favid="' + bgcolor.id + '" data-color="' + bgcolor.bgcolor + '" style="background:' + bgcolor.bgcolor + ';width:37px;height:37px;border-radius:2px;margin: 4px 3px;"></div></li>');
            $('#bgcolorlist').append(bgcolorlist);
        }
        this.initEvents();
    }
    solidcanvasbg(bgcolor) {
        this.deleteCanvasBg();
        var canvas = this.global.canvas;
        var bg = new fabric.Rect({
            originX: "center",
            originY: "center",
            strokeWidth: 1,
            fill: bgcolor,
            opacity: 1,
            selectable: false,
            width: canvas.getWidth(),
            height: canvas.getHeight()
        });
        canvas.add(bg);
        bg.center();
        canvas.sendToBack(bg);
        canvas.bgcolor = bgcolor;
        bg.bg = true;
        this.global.saveState();
    }
    getcatBgimages(catid) {
        if (catid == "0") {
            this.bgimages = this.origbgimages;
            this.updateBgimagesSection(false);
        }
        else {
            var bgimgs = [];
            for (let bgimg of this.bgimages) {
                if (bgimg.catid == catid) {
                    bgimgs.push(bgimg);
                }
            }
            this.bgimages = bgimgs;
            this.updateBgimagesSection(false);
        }
    }
    searchbgimages() {
        this.bgimages = this.origbgimages;
        var bgimgname = $("#bgimagesearch").val();
        var bgimgs = [];
        for (let bgimg of this.bgimages) {
            if (bgimgname == "" || bgimg.name.toLowerCase().indexOf(bgimgname.toLowerCase()) !== -1) {
                bgimgs.push(bgimg);
            }
        }
        this.bgimages = bgimgs;
        this.updateBgimagesSection(false);
    }
    prepareBGSave(bgimgForm: NgForm): any {
        let input = new FormData();
        input.append('cat_id', bgimgForm.value.cat_id);
        for (var i = 0; i < this.imgFiles.length; i++) {
            input.append('path[]', this.imgFiles[i]);
        }
        return input;
    }
    onBgimgSubmit(bgimgForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        const formModel = this.prepareBGSave(bgimgForm);
        this.global.loading = true;
        this.http.post(Utils.getBaseURL('/api/bgimagesave'), formModel).subscribe(data => {
            this.global.loading = false;
            this.updateBgimagesSection(data);
        });
        $('#bgimgform')[0].reset();
        $("#addbgimgmodal").modal('hide');
    }
    addbgimgmodal() {
        $("#addbgimgmodal").modal('show');
    }
    addbgimgcatmodal() {
        $("#bgimagecategorymodal").modal('show');
    }
    onBgimgCatSubmit(bgimgcatForm: NgForm) {
        this.global.loading = true;
        this.http.post(Utils.getBaseURL('/api/bgimagecategorysave'), JSON.stringify(bgimgcatForm.value), {
            headers: this.headers
        }).subscribe(data => {
            this.global.loading = false;
            this.getBgimagecategory();
        });
        $("#bgimagecategorymodal").modal('hide');
    }
    getBgimagecategory() {
        this.http.get(Utils.getBaseURL('/api/bgimagecategoryget'), {
            headers: this.headers
        }).subscribe(data => {
            let bgimgcats = JSON.parse(( < any > data)._body);
            $('.bgimgcatid').empty();
            $('.bgimgcatid').append($('<option value="">Select Category</option>'));
            $('.selectbgimgcatid').empty();
            $('.selectbgimgcatid').append($('<a class="dropdown-item bgimgid" href="javascript:void(0)" data-id="0">Select Category</a>'));
            for (let bgimgcat of bgimgcats) {
                var bgimgcategorylist = $('<a class="dropdown-item bgimgid" href="javascript:void(0)" data-name="' + bgimgcat.name + '" data-id="' + bgimgcat.id + '">' + bgimgcat.name + '</a>');
                $('#bgimgcategeries').append(bgimgcategorylist);
                var bgimgcatid = $('<option value="' + bgimgcat.id + '">' + bgimgcat.name + '</option>');
                $('.bgimgcatid').append(bgimgcatid);
            }
        });
    }
    onFileChange(event) {
        this.imgFiles = [];
        for (var i = 0; i < event.target.files.length; i++) {
            this.imgFiles.push(event.target.files[i]);
        }
    }
    clearvalues() {
        $('.search-box').val('');
        $('.close-icon').css("display", "none");
        $('.searchicon').css("display", "block");
        this.searchbgimages();
    }
}
$(function() {
    $("#bgimagesearch").on("keyup", function() {
        if ($('#bgimagesearch').val().length != 0) {
            $('.close-icon').css("display", "block");
            $('.searchicon').css("display", "none");
        }
        else {
            $('.close-icon').css("display", "none");
            $('.searchicon').css("display", "block");
        }
    });
    $(".allPattern").click(function() {
      $(this).find(".rightdown").toggleClass('fa-caret-right fa-caret-down');
    });
     $(".allPhotos").click(function() {
      $(this).find(".downright").toggleClass('fa-caret-down fa-caret-right');
    });
});