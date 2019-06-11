import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NgForm, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Utils } from '../../../../utils';
import 'fabric';
import isotope from 'isotope-layout';
import { environment as env } from '../../../../../../environments/environment';

declare const fabric: any;
declare var $: any;

@Component({
  selector: 'app-templates',
  templateUrl: './canvastemplates.component.html',
  styleUrls: ['./canvastemplates.component.css']
})
export class CanvasTemplatesComponent implements OnInit { 
  private edittempid: any;
  public edittempname: any = '';
  public edittempnameid: any;
  public deletetempid: any;
  private loading: boolean = false;
  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  public env = env;
  public Templates: any[];
  public CountFonts: any[];
  public CountPages: any[];
  constructor(private http: Http, private fb: FormBuilder) {
    this.getTemplates();
    this.getCountFonts();
    this.getCountPages();
  }
  ngOnInit() {  }
  editTempname(template){
     this.edittempname = template.name;
     this.edittempid = template.id;
     this.edittempnamemodal();
  }
  deletetempl(template){
     $("#alertModal").modal('show');
     this.deletetempid = template.id;
  }
  onWarningFormSubmit(warningForm: NgForm) {
        this.deletetemplate(this.deletetempid);
        $("#alertModal").modal('hide');
    }
  deletetemplate(tempid){
    $(".se-pre-con").fadeIn("slow");
    this.http.delete(Utils.getBaseURL('/api/templatedelete/') + tempid, {
        headers: this.headers
    }).subscribe(data => {
        this.getTemplates();
        $(".se-pre-con").fadeOut("slow");
    });
  }
  
  edittempnamemodal() {
      $("#edittempnamemodal").modal('show');
  }
  getTemplates() {
    this.http.get(Utils.getBaseURL('/api/templategetall'), {
      headers: this.headers
    }).subscribe(data => {
      this.Templates = JSON.parse(( < any > data)._body);
    });
  }
  getCountFonts() {
    this.http.get(Utils.getBaseURL('/api/fontget'), {
      headers: this.headers
    }).subscribe(data => {
      this.CountFonts = JSON.parse(( < any > data)._body);
    });
  }
  getCountPages() {
      this.http.get(Utils.getBaseURL('/api/pageget'), {
          headers: this.headers
      }).subscribe(data => {
          this.CountPages = JSON.parse(( < any > data)._body);
      });
  }
  
  prepareedittempnameSave(editTempnameForm: NgForm): any {
      let input = new FormData();
      input.append('name', editTempnameForm.value.name);
      return input;
  }
  oneditTempnameSubmit(editTempnameForm: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      const formModel = this.prepareedittempnameSave(editTempnameForm);
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/edittempname/'+ this.edittempid), formModel).subscribe(data => {
          this.loading = false;
          this.getTemplates();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#editTemname')[0].reset();
      $("#edittempnamemodal").modal('hide');
  }
}