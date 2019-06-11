import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NgForm, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../../../.././services/auth/auth.service';

import { Utils } from '../../../../utils';
import 'fabric';
import isotope from 'isotope-layout';
import { environment as env } from '../../../../../../environments/environment';

declare const fabric: any;
declare var $: any;

@Component({
  selector: 'app-fonts',
  templateUrl: './fonts.component.html',
  styleUrls: ['./fonts.component.css']
})
export class FontsComponent implements OnInit { 
  private editfontid: any;
  public Fonts: any[];
  public CountPages: any[];
  public CountTemplates: any[];  
  private loading: boolean = false;
  private fontFiles = [];
  public editfontsname:any = '';
  public Authuser: any;
  private deletefont: boolean = false;
  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  public env = env;
  constructor(private http: Http, private fb: FormBuilder, private Auth: AuthService) {
    this.getFonts();
    this.getCountPages();
    this.getCountTemplates();
  }
  ngOnInit() {
  this.Auth.UserSub.subscribe(user => this.Authuser = user);
  console.log(this.Authuser);
    if(this.Authuser.role == 'Master Admin')
    {
      this.deletefont = true;
    }
  }
  editfntname(font){
     this.editfontsname = font.name;
     this.editfontid = font.id;
     this.editfontsmodal();
  }
  deleteFont(font){
    this.editfontid = font.id;
      $(".se-pre-con").fadeIn("slow");    
    this.http.delete(Utils.getBaseURL('/api/fontdelete/') + this.editfontid, {
        headers: this.headers
    }).subscribe(data => {
        this.getFonts();
        $(".se-pre-con").fadeOut("slow");    
    });
  }
  triggerfiletype_reg(){
      $('#regular').trigger('click');
  }
  addfontfile() {
      $("#AddfontfileModal").modal('show');
  }
  editfontsmodal() {
      $("#editfontmodal").modal('show');
  }
  onFontFileChange(event) {
      $(".se-pre-con").fadeIn("slow");
      $(".fontlength").text('');
      this.fontFiles = [];
      if(event.target.files.length != 0)
      {
          $(".fontlength").text(event.target.files.length+"  files");
      } else {
          $(".fontlength").text("No files selected");
      }         
      for(var i = 0; i < event.target.files.length; i++) {
          this.fontFiles.push(event.target.files[i]);
      }
      $(".se-pre-con").fadeOut("slow");
  }
  getFonts() {
    this.http.get(Utils.getBaseURL('/api/fontget'), {
      headers: this.headers
    }).subscribe(data => {
      this.Fonts = JSON.parse(( < any > data)._body);
    });
  }
  getCountPages() {
    this.http.get(Utils.getBaseURL('/api/pageget'), {
      headers: this.headers
    }).subscribe(data => {
      this.CountPages = JSON.parse(( < any > data)._body);
    });
  }
  getCountTemplates() {
    this.http.get(Utils.getBaseURL('/api/templategetall'), {
      headers: this.headers
    }).subscribe(data => {
      this.CountTemplates = JSON.parse(( < any > data)._body);
    });
  }
  prepareSavefont(fontform: NgForm): any {
      let input = new FormData();
      for(var i = 0; i < this.fontFiles.length; i++) {
          input.append('regular[]', this.fontFiles[i]);
      }        
      return input;
  }
  onfontSubmit(fontform: NgForm) {
      const formModel = this.prepareSavefont(fontform);
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/fontsave'), formModel).subscribe(data => {
          this.loading = false;
          this.getFonts();
      });
      $('#fontform')[0].reset();
      $("#AddfontfileModal").modal('hide');
  }
  prepareeditfntSave(editFontForm: NgForm): any {
      let input = new FormData();
      input.append('name', editFontForm.value.name);
      return input;
  }
  oneditFontSubmit(editFontForm: NgForm) {
      $(".se-pre-con").fadeIn("slow");
      const formModel = this.prepareeditfntSave(editFontForm);
      this.loading = true;
      this.http.post(Utils.getBaseURL('/api/editFontname/') + this.editfontid, formModel).subscribe(data => {
          this.loading = false;
          this.getFonts();
          $(".se-pre-con").fadeOut("slow");
      });
      $('#editfnts')[0].reset();
      $("#editfontmodal").modal('hide');
  }
}