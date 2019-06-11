import {
    Component,
    OnInit,
    ElementRef,
    ViewChild
}
from '@angular/core';
import {
    Http,
    Headers
} from '@angular/http';
import {
    Utils
}
from '../../utils';
import {
    NgForm,
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import 'fabric';
import isotope from 'isotope-layout';
declare var $: any;

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent implements OnInit {
    private origtemplates: any = [];
    private templates: any = [];
    private userDesigns: any = [];
    private tempcatid: any;
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    public inset2dark = { axis: 'y'};

    constructor(private http: Http, private fb: FormBuilder) {
        this.getTemplates();
        this.getuserTemplates();
        this.getTemplatecategory();
    }

    ngOnInit() {}

    initEvents() {
        let lthis = this;
        $(".selecttempcatid > option").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.tempcatid = $(this).val();
            $('#catdropdown').text($(this).data('name'));
            lthis.getSelectCatgyTemplates();
        });
         $(".ispublic").unbind('click').on('click', function(e) {
            e.preventDefault();
            var id = $(this).data('id');
            lthis.publishTemp(id);
        });
        $(".deleteDesign").unbind('click').on('click', function(e) {
            e.preventDefault();
            var tempid = $(this).data('tid');
            lthis.deleteTemplate(tempid);
        });
    }
    getTemplates() {
        this.http.get(Utils.getBaseURL('/api/templategetall'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateTemplateSection(data);
        });
    }
    getuserTemplates() {
        var id = '4';
        this.http.get(Utils.getBaseURL('/api/usertemplategetall/') + id, {
            headers: this.headers
        }).subscribe(data => {
            console.log(data);
            this.userDesigns = JSON.parse(( < any > data)._body);
        });
    }
    publishTemp(id)
    {
        this.http.post(Utils.getBaseURL('/api/templatepublish/') + id, {
            headers: this.headers
        }).subscribe(data => {
            console.log(data);
        });
    }
    deleteTemplate(tempid) {
        this.http.delete(Utils.getBaseURL('/api/templatedelete/') + tempid, {
            headers: this.headers
        }).subscribe(data => {
            this.updateTemplateSection(data);
        });
    }
    updateTemplateSection(data) {
        let temps = JSON.parse(( < any > data)._body);
        this.templates = temps;
        this.origtemplates = temps;
        $('#templatesection').empty();
        var htmldata = '';
        for (let temp of temps) {        
            htmldata += this.generateTemplateHTML(temp);
        }
        $('#templatesection').append(htmldata);
        $('#destext').text(temps.length + ' Designs');
        this.initEvents();
    }
    getTemplatecategory() {
        this.http.get(Utils.getBaseURL('/api/templatecategoryget'), {
            headers: this.headers
        }).subscribe(data => {
        console.log(data);
            let tempcats = JSON.parse(( < any > data)._body);
            $('.selecttempcatid').empty();
            $('.selecttempcatid').append($('<option value="">All Category</option>'));
            for (let tempcat of tempcats) {
                var selecttempcatid = $('<option value="' + tempcat.id + '" data-name="' + tempcat.name + '">' + tempcat.name + '</option>');
                $('.selecttempcatid').append(selecttempcatid);
            }
            this.initEvents();
            $('#cattext').text(' in ' + tempcats.length + ' categories');
        });
    }
    getSelectCatgyTemplates() {
        var htmldata = '';
        for (let temp of this.templates) {
            if(temp.catid == this.tempcatid || this.tempcatid == '') {
                htmldata += this.generateTemplateHTML(temp);
            }
        }
        $('#templatesection').html(htmldata);
        this.initEvents();
    }
    searchDesigns() {
        var designname = $("#designsearch").val();
        var htmldata = '';
        for (let temp of this.templates) {
            if(designname == ""  || temp.name.toLowerCase().indexOf(designname.toLowerCase()) !== -1) {
                htmldata += this.generateTemplateHTML(temp);
            }
        }
        $('#templatesection').html(htmldata);
        this.initEvents();
    }
    searchuserDesigns() {
        var userdesignname = $("#userdesignsearch").val();
        var userhtmldata = '';
        for (let temp of this.userDesigns) {
            if(userdesignname == ""  || temp.name.toLowerCase().indexOf(userdesignname.toLowerCase()) !== -1) {
                userhtmldata += this.generateTemplateHTML(temp);
            }
        }
        $('#templatesection').html(userhtmldata);
        this.initEvents();
    }
    ascending() {
        $("#sortdropdown").text('Ascending');
        var designname = $("#designsearch").val();
        this.templates.sort(Utils.sortBy('name', false));
        var htmldata = '';
        for (let temp of this.templates) {
            if(!this.tempcatid || (this.tempcatid && temp.catid == this.tempcatid)) {
                if(designname == ""  || temp.name.toLowerCase().indexOf(designname.toLowerCase()) !== -1) {
                    htmldata += this.generateTemplateHTML(temp);
                }
            }
        }
        $('#templatesection').html(htmldata);
        this.initEvents();
    }
    descending(){
        $("#sortdropdown").text('Descending');
        var designname = $("#designsearch").val();
        this.templates.sort(Utils.sortBy('name', true));
        var htmldata = '';
        for (let temp of this.templates) {
            if(!this.tempcatid || (this.tempcatid && temp.catid == this.tempcatid)) {
                if(designname == ""  || temp.name.indexOf(designname) !== -1) {
                    htmldata += this.generateTemplateHTML(temp);
                }
            }
        }
        $('#templatesection').html(htmldata);
        this.initEvents();
    }
    initSection() {
        $('#catdropdown').text('Search Category');
        $("#sortdropdown").text('Sort By');
        $('.nav-link').removeClass('active');    
    }
    recentDesigns() {
        this.initSection();
        $("#titletext").text('Recent Designs');
        $('#recent-tab').addClass('active');
        this.templates = this.origtemplates;
        this.templates.sort(Utils.sortBy('id', true));
        var htmldata = '';
        var recenttemplates = [];
        for (let temp of this.templates) {
            if(temp.isPublish) {
                htmldata += this.generateTemplateHTML(temp);
                recenttemplates.push(temp);
            }
        }
        $('#templatesection').html(htmldata);
        $('#destext').text(recenttemplates.length + ' Designs');
        this.templates = recenttemplates;
        this.initEvents();
    }
    allDesigns() {
        this.initSection();
        $("#titletext").text('All Designs');
        $('#all-tab').addClass('active');
        this.templates = this.origtemplates;
        var htmldata = '';
        for (let temp of this.templates) {
            htmldata += this.generateTemplateHTML(temp);
        }
        $('#templatesection').html(htmldata);
        $('#destext').text(this.templates.length + ' Designs');
        this.initEvents();
    }
    favDesigns() {
        this.initSection();
        $("#titletext").text('Favourite Designs');
        $('#favourite-tab').addClass('active');
        this.templates = this.origtemplates;
        var htmldata = '';
        var favtemplates = [];
        for (let temp of this.templates) {
            if(temp.isFav) {
                htmldata += this.generateTemplateHTML(temp);
                favtemplates.push(temp);        
            }
        }
        $('#templatesection').html(htmldata);
        $('#destext').text(favtemplates.length + ' Designs');        
        this.initEvents();
        this.templates = favtemplates;
    }
    draftDesigns() {
        this.initSection();
        $("#titletext").text('Draft Designs');
        $(".public").css('display','block');
        $('#draft-tab').addClass('active');
        this.templates = this.origtemplates;
        var htmldata = '';
        var drafttemplates = [];
        for (let temp of this.templates) {
            if(!temp.isPublish) {
                htmldata += this.generateTemplateHTML(temp);
                drafttemplates.push(temp);        
            }
        }
        $('#templatesection').html(htmldata);
        $('#destext').text(drafttemplates.length + ' Designs');        
        this.initEvents();
        this.templates = drafttemplates;
    }
    generateTemplateHTML(temp) {
        var temphtml = '<li><a class="mydesign-model-toggler mydesign-s-humbnail" href="#/template/template-create/'+temp.id+'"><img src="' + Utils.getBaseURL(temp.thumbnail) + '" alt=""><i class="fa fa-trash-o deleteDesign" data-tid="'+ temp.id +'" style="cursor:pointer;position: absolute;bottom: 12px;left: 8px;width: 15px;height: 15px;border-radius: 50%;color: #000000;"></i></a><div class="mydesign-s-content"><h4>' + temp.name + '</h4><i class="fa fa-globe ispublic" data-id="'+ temp.id +'"></i><a href="javascript:void(0)" class="cat-name">'+temp.catname+'</a></div></li>';
        return temphtml;
        this.initEvents();
    }
}