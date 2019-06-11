import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {AuthService} from '../../../services/auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../helpers/form-helper';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {

  submitted = false;
  todoList: any;
  webForm: FormGroup;
  fileQuery = null;
  filesByCat: any;
  originalCat: any;
  libraries: any;
  search: { [k: string]: any } = {};
  selectedLibrary: any;
  AuthUser: any;
  offices: any;
  members: any;
  public bannerList = [];
  public url: any;
  button = {
      facebook: false,
      instagram: false,
      linkedin: false,
  };
  constructor(private api: ApiService, private Auth: AuthService, private formHelper: FormHelper, private http: HttpClient) { }

    public delete() {
        this.url = null;
    }

  ngOnInit() {
    this.search['file_type'] = 'image';

    this.setForm();
    this.fetchData();
      this.api.get('/library/libraries?include=categories').subscribe(res => {
          this.libraries  = res;
          console.log(this.libraries);
      });
      this.api.get('/offices').subscribe(res => {
          this.offices  = res.data;
      });
      this.Auth.UserSub.subscribe(user => {
          this.AuthUser = user;
          Object.keys(this.AuthUser).forEach(key => {
              if (key === 'offices') {
                  let myArray = [];
                  this.AuthUser.offices.data.forEach(of => {
                      myArray.push(of.id);
                  });
                  this.webForm.controls['offices'].setValue(myArray);
                  this.toggleTeam();
              } else {
                  if (this.webForm.value.hasOwnProperty(key)) {
                      this.webForm.controls[key].setValue(this.AuthUser[key]);
                  }
              }
          });
          this.webForm.controls['url'].setValue('https://' + this.AuthUser.username + '.iproperty.com.au');
          this.webForm.controls['full_name'].setValue(this.AuthUser.first_name + ' ' + this.AuthUser.last_name);
          this.url = this.AuthUser.photo;
      });
      this.webForm.controls['facebook'].disable();
      this.webForm.controls['linkedin'].disable();
      this.webForm.controls['instagram'].disable();
   }

   setForm() {
       this.webForm = new FormGroup({
           full_name: new FormControl('', Validators.required),
           email: new FormControl('', Validators.required),
           url: new FormControl('', Validators.required),
           mobile: new FormControl('', Validators.required),
           offices: new FormControl([], Validators.required),
           members: new FormControl([], Validators.required),
           bio: new FormControl('', Validators.required),
           page_content: new FormControl('', Validators.required),
           facebook: new FormControl('', Validators.required),
           instagram: new FormControl('', Validators.required),
           linkedin: new FormControl('', Validators.required),
           photo: new FormControl()
       });
   }

   fetchData() {
     this.api.get('/library/getFilesbycategory?include=files', this.search).subscribe(res => {
       this.filesByCat = res.data;
       this.originalCat = res.data;
     });
   }

   getCats(id) {
      const find = this.libraries.filter( li => li.id === id);
      return find[0].categories;
   }

   filterItem(key, value) {
    this.search[key] = value;
    console.log(this.search);
    this.fetchData();
   }

  searchByCat(cat) {
    if (cat === undefined) {
      delete this.search['category_id'];
      this.fetchData();
    } else {
      this.filterItem('category_id', cat.id);
    }
  }

    // Image Upload
    onSelectFile(event) {
        if (event.target.files && event.target.files.length) {
            const fileReader: FileReader = new FileReader();
            fileReader.readAsDataURL(event.target.files[0]);
            fileReader.onload = (event: Event) => {
                this.url = fileReader.result;
                this.webForm.patchValue({
                    photo: fileReader.result
                });
            };
        }
    }

    toggleTeam() {
      this.api.get('/users-by-offices-manual', this.webForm.controls['offices'].value).subscribe(res => {
          this.members = res.data.map((i) => { i.full_name = i.first_name + ' ' + i.last_name; return i; });
      });
    }

    validationChanges(key) {
      if (this.button[key]) {
          this.webForm.controls[key].enable();
      } else {
          this.webForm.controls[key].disable();
      }
      console.log(this.button[key], key);
    }
    onSubmit() {
        this.submitted = true;
        this.formHelper.validateAllFormFields(this.webForm);
        if (this.webForm.valid && this.bannerList.length > 0) {
            console.log(this.webForm.value, this.bannerList, this.webForm.valid, 'if');
            // this.http.post('http://localhost:9000/api/v1/user_website', {
            //     form: this.webForm.value,
            //     banner: this.bannerList
            // }).subscribe(res => {
            //     console.log(res);
            // });
        } else {
            console.log(this.webForm.value, this.bannerList, this.webForm.valid, 'else');
        }
    }
    drop(event: CdkDragDrop<string[]>) {
      if(this.bannerList.indexOf(event.previousContainer.data[event.previousIndex]) === -1){
          console.log(event.previousContainer.data[event.previousIndex], 'in if');
          this.bannerList.push(event.previousContainer.data[event.previousIndex]);
      }
      this.filesByCat = this.originalCat;
      console.log(this.bannerList, event);
    }

    addToList(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            console.log('in');
        }
        this.filesByCat = this.originalCat;
    }

    removeBanner(index) {
        this.bannerList.splice(this.bannerList.indexOf(index), 1);
    }
}
