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
import { CreateUtils } from '../create.utils';
import {
    AppGlobals
}
from '../../../globals';
import {
    Utils
}
from '../../../utils';
import {
    Http,
    Headers
}
from '@angular/http';
declare var $: any;
@Component({
  selector: 'app-kits',
  templateUrl: './kits.component.html',
  styleUrls: ['./kits.component.css']
})
export class KitsComponent implements OnInit {

    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    origusertemplates: any = [];
    public inset2dark = { axis: 'y'};
    
    constructor(private http: Http, private global: CreateGlobals, private appGlobal: AppGlobals) {
        global.setHttp(this.http, this.headers);
        appGlobal.setHttp(this.http, this.headers);
        appGlobal.getTemplatecategory();
        global.getTemplates();
        this.getuserTemplates();
    }

    ngOnInit() {
    }

    searchtemplates() {
        this.global.templates = this.global.origtemplates;
        var designname = $("#templatesearch").val();
        var temps = [];
        for (let temp of this.global.templates) {
            if(designname == ""  || temp.name.toLowerCase().indexOf(designname.toLowerCase()) !== -1) {
                temps.push(temp);
            }
        }
        this.global.templates = temps;
        this.global.updateTemplateSection(false);
    }
    searchusertemplates() {


        this.global.templates = this.origusertemplates;
        var userdesignname = $("#usertemplatesearch").val();
        var usertemps = [];
        for (let temp of this.global.templates) {
            if(userdesignname == ""  || temp.name.toLowerCase().indexOf(userdesignname.toLowerCase()) !== -1) {
                usertemps.push(temp);
            }
        }
        this.global.templates = usertemps;
        this.global.updateTemplateSection(false);
    }
    
    createnewdesign() {
        this.global.isNew = true;
        (<HTMLInputElement>document.getElementById('loadCanvasWid')).value = this.global.canvassize.width;
        (<HTMLInputElement>document.getElementById('loadCanvasHei')).value = this.global.canvassize.height;
        $('.print-popup-wrap').fadeIn();
    }

    onTempCatSubmit(tempcatForm: NgForm) {
        this.global.loading = true;
        this.http.post(Utils.getBaseURL('/api/templatecategorysave'), JSON.stringify(tempcatForm.value), {
            headers: this.headers
        }).subscribe(data => {
            this.global.loading = false;
            this.appGlobal.getTemplatecategory();
        });
        $('#tempcatForm')[0].reset();
        $("#tempcategorymodal").modal('hide');
    }
    
    addtempcatmodal() {
        $("#tempcategorymodal").modal('show');
    }

     getuserTemplates() {
        var id = '4';
        this.http.get(Utils.getBaseURL('/api/usertemplategetall/') + id, {
            headers: this.headers
        }).subscribe(data => {
        console.log(data);
             //this.global.updateTemplateSection(data);
             this.origusertemplates =  JSON.parse((<any>data)._body);
        });
    }

    onWarningFormSubmit(warningForm: NgForm) {
        this.deleteTemplate($("#deletetempid").val());
        $("#alertModal").modal('hide');
    }

    /*
    * Method to delete the template based on template id and update the templates section.
    */
    deleteTemplate(tempid) {
        this.http.delete(Utils.getBaseURL('/api/templatedelete/') + tempid, {
            headers: this.headers
        }).subscribe(data => {
            this.global.updateTemplateSection(data);
        });
    }

    clearvalues()
    {
      $('.search-box').val('');
      $('.close-icon').css("display","none");
      $('.searchicon').css("display","block");
      this.searchtemplates();
    }
}
$(function () {
    $("#templatesearch").on("keyup", function() {
        if ($('#templatesearch').val().length != 0){
            $('.close-icon').css("display","block");
            $('.searchicon').css("display","none");
        }
        else{
            $('.close-icon').css("display","none");
            $('.searchicon').css("display","block");
        }
    });
});
