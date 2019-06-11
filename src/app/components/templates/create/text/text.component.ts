import { Component, OnInit } from '@angular/core';
import {
	CreateGlobals
}
from '../create.globals';
import {
    Utils
}
from '../../../utils';
import { NgForm, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Http, Headers } from '@angular/http';
declare const fabric: any;
declare var $: any;

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {

    private form: FormGroup;
    fonts: any = [];
    origfonts: any = [];
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    private fontFiles = [];
    public inset2dark = { axis: 'y'};

    constructor(private global: CreateGlobals, private http: Http, private fb: FormBuilder) { 
        this.getFont();
    }

    ngOnInit() {
    }

    /**
     * Function Usage: Add text in canvas on click of #add-text button.
    */    
    addText(value) {
        if(value=="heading"){
            let text = new fabric.Textbox('Add Heading', {
                fontFamily: 'LJH Lighthouse-Regular',
                fontSize: 24,
                width: 620,
                textAlign: 'center',
                top: 0,
                right: 0,
                left: 0
            });

            this.global.canvas.add(text);
            this.global.selectItemAfterAdded(text);
            this.global.saveState();
        }
        if(value=="sub_heading"){
            let text = new fabric.Textbox('Add Sub Heading', {
                fontFamily: 'LJH Lighthouse-Regular',
                fontSize: 18,
                width: 620,
                textAlign: 'center',
                top: 130,
                right: 0,
                left: 0
            });

            this.global.canvas.add(text);
            this.global.selectItemAfterAdded(text);
            this.global.saveState();
        }
        if(value=="body_text"){
            let text = new fabric.Textbox('Add Text', {
                fontFamily: 'LJH Lighthouse-Regular',
                fontSize: 14,
                width: 620,
                textAlign: 'center',
                 top: 200,
                right: 0,
                left: 0
            });

            this.global.canvas.add(text);
          //  text.center();
            this.global.selectItemAfterAdded(text);
            this.global.saveState();
        }
        
    }
    addfontfile() {
        $("#AddfontfileModal").modal('show');
    }
     triggerfiletype(){
        $('#path').trigger('click');
    }

    triggerfiletype_reg(){
        $('#regular').trigger('click');
    }

    triggerfiletype_bld(){
        $('#bold').trigger('click');
    }

    triggerfiletype_itlc(){
        $('#italic').trigger('click');
    }
    updateFontlistSection(data) {
     let fontlist = [];
        if(data) {
            fontlist = JSON.parse((<any>data)._body);
            this.fonts = fontlist;
            this.origfonts = fontlist;
        } else {
            fontlist = this.fonts;
        }
        fontlist = this.removeDuplicates(fontlist, "name");
        fontlist.sort(this.alphabeticalSort("name"));
        $('#yourfont').empty();
        for (let font of fontlist) {
            $("head").prepend("<style type=\"text/css\">" + "@font-face {\n" + "\tfont-family: " + font.name + ";\n" + "\tsrc: local('â˜º'), url('" + font.regular + "') format('opentype');\n" + "}\n" + "\tp.tests {\n" + "\tfont-family: Bungee Inline !important;\n" + "}\n" + "</style>");
            var fontlists = $('<a class="fontname" data-font="' + font.name + '" style="cursor: pointer;display: block;padding: 2px 10px;font-size: 14px;color: #9b9b9b;text-decoration: none;font-family:'+ font.name +' ">' + this.filtername(font.name) + '</a>');
            $('#yourfont').append(fontlists);
        }
        
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

    searchfonts() {
        this.fonts = this.origfonts;
        var fontname = $("#fontsearch").val();      
        var fonts = [];
        for (let font of this.fonts) {
            if(fontname == ""  || font.name.toLowerCase().indexOf(fontname.toLowerCase()) !== -1) {
                fonts.push(font);
            }
        }
        this.fonts = fonts;
        this.updateFontlistSection(false);
    }

    getFont() {
        this.http.get(Utils.getBaseURL('/api/fontget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateFontlistSection(data);
        });
    }
    createFontForm() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            regular: null,
            bold: null,
            italic: null

        });
    }
   onFontFileChange(event) {
        this.fontFiles = [];
        for(var i = 0; i < event.target.files.length; i++) {
            this.fontFiles.push(event.target.files[i]);
        }
    }
    prepareSavefont(fontform: NgForm): any {
        let input = new FormData();
        //input.append('regular', fontform.value.regular);
        console.log(this.fontFiles.length);
        for(var i = 0; i < this.fontFiles.length; i++) {
            input.append('regular[]', this.fontFiles[i]);
        }        
        return input;
    }
    onfontSubmit(fontform: NgForm) {
        const formModel = this.prepareSavefont(fontform);
        this.global.loading = true;

        this.http.post(Utils.getBaseURL('/api/fontsave'), formModel).subscribe(data => {
            this.global.loading = false;
            this.updateFontlistSection(data);
        });
        $('#fontform')[0].reset();
        $("#AddfontfileModal").modal('hide');
    }
     clearvalues()
    {
      $('.search-box').val('');
      $('.close-icon').css("display","none");
      $('.searchicon').css("display","block");
      this.searchfonts();
    }
}
$(function () {
    $("#fontsearch").on("keyup", function() {
        if ($('#fontsearch').val().length != 0){
            $('.close-icon').css("display","block");
            $('.searchicon').css("display","none");
        }
        else{
            $('.close-icon').css("display","none");
            $('.searchicon').css("display","block");
        }
    });
});