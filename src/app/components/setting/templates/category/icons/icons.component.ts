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
  selector: 'app-icons-category',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IcnComponent implements OnInit { 
  private editiconscatid: any;
  public editiconscatname: any = '';
  private loading: boolean = false;
  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  public env = env;
  public CountBackgrounds: any[];
  public Icons: any[];
  public CountImages: any[];
  public CountTemplates: any[];
  constructor(private http: Http, private fb: FormBuilder) {
    this.getIcons();
    this.getCountBackground();
    this.getCountImages();
    this.getCountTemplates();
  }
  ngOnInit() {}
  editIconscat(icon){
     this.editiconscatname = icon.name;
     this.editiconscatid = icon.id;
     this.editIconscatmodal();
  }
  deleteIconscat(icon){
    this.editiconscatid = icon.id;
    $(".se-pre-con").fadeIn("slow");    
    this.http.delete(Utils.getBaseURL('/api/iconcategorydelete/') + this.editiconscatid, {
      headers: this.headers
    }).subscribe(data => {
      this.getIcons();
      $(".se-pre-con").fadeOut("slow");    
    });
  }
  addiconcatgy() {
      $("#iconscategorymodal").modal('show');
  }
  editIconscatmodal() {
      $("#editIconscatmodal").modal('show');
  }
  getIcons() {
    this.http.get(Utils.getBaseURL('/api/iconcategoryget'), {
      headers: this.headers
    }).subscribe(data => {
      this.Icons = JSON.parse(( < any > data)._body);
    });
  }
  getCountBackground() {
      this.http.get(Utils.getBaseURL('/api/bgimagecategoryget'), {
          headers: this.headers
      }).subscribe(data => {
          this.CountBackgrounds = JSON.parse(( < any > data)._body);
      });
  }
  getCountImages() {
      this.http.get(Utils.getBaseURL('/api/imagecategoryget'), {
        headers: this.headers
      }).subscribe(data => {
        this.CountImages = JSON.parse(( < any > data)._body);
      });
  }
  getCountTemplates() {
      this.http.get(Utils.getBaseURL('/api/templatecategoryget'), {
        headers: this.headers
      }).subscribe(data => {
        this.CountTemplates = JSON.parse(( < any > data)._body);
      });
  }
  onIconCatSubmit(iconcatForm: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/iconcategorysave'), JSON.stringify(iconcatForm.value), {
          headers: this.headers
      }).subscribe(data => {
          this.loading = false;
          this.getIcons();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#iconcatForm')[0].reset();
      $("#iconscategorymodal").modal('hide');
  }
  prepareediticonscatSave(editiconscatForm: NgForm): any {
      let input = new FormData();
      input.append('name', editiconscatForm.value.name);
      return input;
  }
  oneditIconsCatSubmit(editiconscatForm: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      const formModel = this.prepareediticonscatSave(editiconscatForm);
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/editiconscatname/'+ this.editiconscatid), formModel).subscribe(data => {
          this.loading = false;
          this.getIcons();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#editiconscat')[0].reset();
      $("#editIconscatmodal").modal('hide');
  }
}