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
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit { 
  private edittempcatid: any;
  public edittempcatname: any = '';
  private loading: boolean = false;
  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  public env = env;
  public Templates: any[];
  public CountImages: any[];
  public CountBackgrounds: any[];
  public CountIcons: any[];
  constructor(private http: Http, private fb: FormBuilder) {
    this.getTemplates();
    this.getCountImages();
    this.getCountBackground();
    this.getCountIcons();
  }
  ngOnInit() {  }
  editTempcat(template){
     this.edittempcatname = template.name;
     this.edittempcatid = template.id;
     this.edittempcatmodal();
  }
  deletetempcat(template){
    this.edittempcatid = template.id;
    $(".se-pre-con").fadeIn("slow");
    this.http.delete(Utils.getBaseURL('/api/templatecategorydelete/') + this.edittempcatid, {
        headers: this.headers
    }).subscribe(data => {
        this.getTemplates();
        $(".se-pre-con").fadeOut("slow");
    });
  }  
  addtempcatmodal() {
    $("#tempcategorymodal").modal('show');
  }
  edittempcatmodal() {
      $("#edittempcatmodal").modal('show');
  }
  getTemplates() {
    this.http.get(Utils.getBaseURL('/api/templatecategoryget'), {
      headers: this.headers
    }).subscribe(data => {
      this.Templates = JSON.parse(( < any > data)._body);
    });
  }
  getCountImages() {
    this.http.get(Utils.getBaseURL('/api/imagecategoryget'), {
      headers: this.headers
    }).subscribe(data => {
      this.CountImages = JSON.parse(( < any > data)._body);
    });
  }
  getCountBackground() {
      this.http.get(Utils.getBaseURL('/api/bgimagecategoryget'), {
          headers: this.headers
      }).subscribe(data => {
          this.CountBackgrounds = JSON.parse(( < any > data)._body);
      });
  }
  getCountIcons() {
      this.http.get(Utils.getBaseURL('/api/iconcategoryget'), {
        headers: this.headers
      }).subscribe(data => {
        this.CountIcons = JSON.parse(( < any > data)._body);
      });
  }
  onTempCatSubmit(tempcatForm: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/templatecategorysave'), JSON.stringify(tempcatForm.value), {
          headers: this.headers
      }).subscribe(data => {
          this.loading = false;
          this.getTemplates();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#tempcatForm')[0].reset();
      $("#tempcategorymodal").modal('hide');
  }
  prepareedittempcatSave(edittempcatForm: NgForm): any {
      let input = new FormData();
      input.append('name', edittempcatForm.value.name);
      return input;
  }
  oneditTempCatSubmit(edittempcatForm: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      const formModel = this.prepareedittempcatSave(edittempcatForm);
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/edittempcatname/'+ this.edittempcatid), formModel).subscribe(data => {
          this.loading = false;
          this.getTemplates();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#edittempcat')[0].reset();
      $("#edittempcatmodal").modal('hide');
  }
}