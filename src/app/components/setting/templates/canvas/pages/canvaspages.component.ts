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
  selector: 'app-canvaspages',
  templateUrl: './canvaspages.component.html',
  styleUrls: ['./canvaspages.component.css']
})
export class CanvaspagesComponent implements OnInit { 
  private editpageid: any;
  public defaultValue = '';
  public editpagname:any = '';
  public editpagtype:any = '';
  public editpagwid:any = '';
  public editpaghei:any = '';
  private loading: boolean = false;
  private imgFiles = [];
  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  public env = env;
  public Pages: any[];
  public CountFonts: any[];
  public CountTemplates: any[];  
  constructor(private http: Http, private fb: FormBuilder) {
    this.getPages();
    this.getCountFonts();
    this.getCountTemplates();
  }
  ngOnInit() {}
  editpagevalue(page){
     this.defaultValue = page.type;
     this.editpagname = page.name;
     this.editpagwid = page.width;
     this.editpaghei = page.height;
     this.editpageid = page.id;
     this.editpagemodal();
  }
  deletePage(page){
    this.editpageid = page.id;
      $(".se-pre-con").fadeIn("slow");    
    this.http.delete(Utils.getBaseURL('/api/pagedelete/') + this.editpageid, {
        headers: this.headers
    }).subscribe(data => {
        this.getPages();
        $(".se-pre-con").fadeOut("slow");    
    });
  }
  triggerfiletype(){
    $('#image').trigger('click');
  }
  addpage() {
      this.defaultValue = 'Web';
      $("#Addpagemodal").modal('show');
  }
  editpagemodal() {
      $("#editpagemodal").modal('show');
  }
  onFileChange(event) {
      this.imgFiles = [];
      for(var i = 0; i < event.target.files.length; i++) {
          this.imgFiles.push(event.target.files[i]);
      }
  }
  getPages() {
    this.http.get(Utils.getBaseURL('/api/pageget'), {
      headers: this.headers
    }).subscribe(data => {
      this.Pages = JSON.parse(( < any > data)._body);
    });
  }
  getCountFonts() {
    this.http.get(Utils.getBaseURL('/api/fontget'), {
      headers: this.headers
    }).subscribe(data => {
      this.CountFonts = JSON.parse(( < any > data)._body);
    });
  }
  getCountTemplates() {
    this.http.get(Utils.getBaseURL('/api/templategetall'), {
      headers: this.headers
    }).subscribe(data => {
      this.CountTemplates = JSON.parse(( < any > data)._body);
    });
  }
  preparePageSave(pageForm: NgForm): any {
      let input = new FormData();
      input.append('name', pageForm.value.name);
      input.append('type', pageForm.value.type);
      input.append('width', pageForm.value.width);
      input.append('height', pageForm.value.height);
      input.append('image', this.imgFiles[0]);
      return input;
  }
  onPageSubmit(pageForm: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      const formPageModel = this.preparePageSave(pageForm);
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/pagesave'), formPageModel).subscribe(data => {
          this.loading = false;
          this.getPages();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#pageForm')[0].reset();
      $("#Addpagemodal").modal('hide');
  }
  prepareeditpageSave(editPageForm: NgForm): any {
      let input = new FormData();
      input.append('name', editPageForm.value.name);
      input.append('type', editPageForm.value.type);
      input.append('width', editPageForm.value.width);
      input.append('height', editPageForm.value.height);
      return input;
  }
  oneditPageSubmit(editPageForm: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      const formModel = this.prepareeditpageSave(editPageForm);
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/editpage/') + this.editpageid, formModel).subscribe(data => {
          this.loading = false;
          //console.logdata);
          this.getPages();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#editpage')[0].reset();
      $("#editpagemodal").modal('hide');
  }
}