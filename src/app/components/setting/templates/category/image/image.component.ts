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
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  private editimgcatid: any;
  public editimgcatname: any = '';
  private loading: boolean = false;
  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  public env = env;
  public Images: any[];
  public CountBackgrounds: any[];
  public CountIcons: any[];
  public CountTemplates: any[];
  constructor(private http: Http, private fb: FormBuilder) {
    this.getImages();
    this.getCountBackground();
    this.getCountIcons();
    this.getCountTemplates();
  }
  ngOnInit() { }
  editImgcat(image){
     this.editimgcatname = image.name;
     this.editimgcatid = image.id;
     this.editimgcatmodal();
  }
  deleteImgcat(image){
    this.editimgcatid = image.id;
    $(".se-pre-con").fadeIn("slow");
    this.http.delete(Utils.getBaseURL('/api/imagecategorydelete/') + this.editimgcatid, {
        headers: this.headers
    }).subscribe(data => {
        this.getImages();
        $(".se-pre-con").fadeOut("slow");
    });
  }
  addimagecatmodal() {
      $("#imagecategorymodal").modal('show');
  }
  editimgcatmodal() {
      $("#editimgcatmodal").modal('show');
  }
  getImages() {
    this.http.get(Utils.getBaseURL('/api/imagecategoryget'), {
      headers: this.headers
    }).subscribe(data => {
      this.Images = JSON.parse(( < any > data)._body);
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
  getCountTemplates() {
      this.http.get(Utils.getBaseURL('/api/templatecategoryget'), {
        headers: this.headers
      }).subscribe(data => {
        this.CountTemplates = JSON.parse(( < any > data)._body);
      });
  }
  onImgCatSubmit(form: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/imagecategorysave'), JSON.stringify(form.value), {
          headers: this.headers
      }).subscribe(data => {
          this.loading = false;
          this.getImages();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#imagecatform')[0].reset();
      $("#imagecategorymodal").modal('hide');
  }
  prepareeditimgcatSave(editimgcatForm: NgForm): any {
      let input = new FormData();
      input.append('name', editimgcatForm.value.name);
      return input;
  }
  oneditImgCatSubmit(editimgcatForm: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      const formModel = this.prepareeditimgcatSave(editimgcatForm);
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/editimgcatname/'+ this.editimgcatid), formModel).subscribe(data => {
          this.loading = false;
          this.getImages();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#editimgcat')[0].reset();
      $("#editimgcatmodal").modal('hide');
  }
}