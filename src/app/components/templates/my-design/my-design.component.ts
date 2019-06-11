import { AuthService } from './../../../services/auth/auth.service';
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
  templateUrl: './my-design.component.html',
  styleUrls: ['./my-design.component.css']
})
export class MyDesignComponent implements OnInit {
    private origtemplates: any = [];
    private templates: any = [];
    private tempcatid: any;
    public AuthUser: any;
    private headers = new Headers({
        'Content-Type': 'application/json'
    });


    public inset2dark = { axis: 'y'};
    constructor(private http: Http, private fb: FormBuilder, private Auth: AuthService) {

        this.getTemplatecategory();
    }

    ngOnInit() {
        this.Auth.UserSub.subscribe(user => this.AuthUser = user);
        this.getUserTemplates();
        console.log(this.AuthUser);
        console.log(this.AuthUser.id);
    }

    initEvents() {
        let lthis = this;
        $(".selecttempcatid > option").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.tempcatid = $(this).val();
            $('#catdropdown').text($(this).data('name'));
            lthis.getSelectCatgyTemplates();
        });
        $(".deleteTemp").unbind('click').on('click', function(e) {
            e.preventDefault();
            var usertempid = $(this).data('id');
            lthis.deleteUserTemp(usertempid);
        });
    }

    /**
     * Method to fetch the logged in user templates.
     */
    getUserTemplates() {
        this.http.get(Utils.getBaseURL('/api/usertemplategetall/' + this.AuthUser.id), {
            headers: this.headers
        }).subscribe(data => {
            this.updateTemplateSection(data);
        });
    }
    deleteUserTemp(usertempid) {
        //this.http.delete(Utils.getBaseURL('/api/userdeleteTemplate/') + usertempid, {
        this.http.delete(Utils.getBaseURL('/api/usertemplatedelete/') + usertempid, {
            headers: this.headers
        }).subscribe(data => {
            this.getUserTemplates();
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
        this.http.get(Utils.getBaseURL('/api/templatecategoryget') , {
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
        $('#destext').text(this.templates.length + ' Designs');
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
        var temphtml = '<li class="col-md-2" style="cursor:pointer;"><a href="#/template/template-create/'+temp.id+'"><div align="center" style="background: transparent;"><img style="height:130px;" src="' + Utils.getBaseURL(temp.thumbnail) + '" alt=""><i class="fa fa-trash-o deleteTemp" data-id="'+temp.id+'" style="cursor:pointer;position: absolute;bottom: 70px;left: 83px;width: 15px;height: 15px;border-radius: 50%;color: #000000;"></i></div></a><div class="mydesign-s-content"><h4 style="font-weight:700;font-size:13px;color:#303030;padding:5px 0px;margin:0px;font-family: sans-serif;">' + temp.name + '</h4><a href="javascript:void(0)" class="cat-name" style="font-size:12px;margin:5px 0px;color:#9b9b9b;padding:4px 10px;background:#f4f5fa;text-decoration:none;display:inline-block;font-family: sans-serif;">'+temp.catname+'</a></div></li>';
        return temphtml;
    }
}