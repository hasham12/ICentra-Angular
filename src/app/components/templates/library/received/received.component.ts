import { AuthService } from './../../../../services/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { LibraryHelper } from 'src/app/helpers/library-helper';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css']
})
export class ReceivedComponent implements OnInit {

  constructor(private Api:ApiService, private Auth:AuthService, public libHelper: LibraryHelper) { }
  public view = 'grid';
  public receivedFiles: any;
  public selectedUser: any;
  public officeUsers: any;
  public error: any;
  public files: any;
  public AuthUser: any;
  public user_id: any;
  public library_id = 1;
  public office_id = null;
  public categories: any;
  public offices: any;
  public libraries = [{id: 1, name: 'Private'}, {id: 2, name: 'Office'}, {id: 3, name: 'iCentra'}];
  public selectedLibrary = 1;
  public fileQuery: any;
  public category_id: any;
  public allUsers:any;
  public fileterCategoires: any;
  public selectedOffice: any;
  public libCategories: any;
  public selectedCategory: any;
  ngOnInit() {
    this.Auth.UserSub.subscribe(user => {
      this.AuthUser = user;
    });
    this.Api.get('/offices').subscribe(res => {
      this.offices = res.data;
    });
    this.getReceivedFiles();
    this.getCategories(this.library_id);
    this.getPrivateCategories();
  }
  categoriesAssignCopy() {
    this.fileterCategoires = Object.assign([], this.categories);
    console.log('filer copy assinged');
  }
  deleteFile(file_id: any, category_id: any, ) {
    // let isDeleted = false;
    console.log(file_id + ' ' + category_id );
    if (file_id) {
      this.Api.post('/library/deleteFile',
      { file_id: file_id, category_id: category_id, library_id: this.library_id, user_id: this.AuthUser.id}
      ).subscribe(
        res => {
          this.getPrivateCategories();
        }
      );
    }
  }
  getReceivedFiles(){
    this.Api.post('/library/getRequestedFile',{}).subscribe(
      data => {
        if (data.data !== undefined) {
          if ( Object.keys(data.data).length > 0) {
              this.receivedFiles = Object.keys(data.data).map(function(index){
                let item = data.data[index];
                // do something with person
                return item;
            });
          } else {
            this.receivedFiles = null;
          }
          console.log('received files are' + typeof this.receivedFiles);
        } else {
          this.error = data.error;
        }
       }
    );
  }

  Accept(from_user_id, to_user_id, status){
    console.log('from_user_id' + from_user_id);
    console.log('to_user_id' + to_user_id);
      this.Api.post('/library/received/status', { from_user_id: from_user_id, to_user_id: to_user_id, status: status,
        library_id: this.library_id, category_id: this.selectedCategory, office_id: this.office_id}).subscribe(
        data => {
          console.log(data);
          this.getReceivedFiles();
        }
      );
  }
  deleteReceivedFile(share_id) {
    this.Api.delete('/library/received/delete/' + share_id).subscribe(
        res => {
          console.log(res);
          this.getReceivedFiles();
        }
      );
  }


  getPrivateCategories(search = null, category_id = null) {
    let user_id = this.user_id;
    if (this.user_id < 0) {
      user_id = this.AuthUser.id;
    }
    this.Api.get('/library/getFilesbycategory?include=files',
    {per_page: 'all', library_id: 1, search: search, category_id: category_id, user_id: user_id}
    ).subscribe(
      data => {
        this.categories = data.data;
        this.categoriesAssignCopy();
        }
    );
  }
  getofficeUsers() {
    if (!this.selectedOffice) {
      this.selectedOffice = this.AuthUser.offices.data[0].id;
    }
    this.Api.get('/users/byoffice', {office: this.selectedOffice}).subscribe(
      data => {
        this.officeUsers = data.data;
        this.officeUsers.map(
          (user: any) => {
            user.full_name = user.first_name + ' ' + user.last_name;
            return user;
          }
        );
      }
    );
  }
  filterFiles() {
    console.log('file query is ' + this.fileQuery);
    this.getPrivateCategories(this.fileQuery, this.category_id);
    }
    getAllUsers() {
      this.Api.get('/users', { per_page: 'all'}).subscribe(
        data => {
          this.allUsers = data.data;
          this.allUsers.map(
            (user: any) => {
              user.full_name = user.first_name + ' ' + user.last_name;
              return user;
            }
          )
        }
      );
    }
  checkLibrary(id) {
    if (id !== 2) {
      this.getCategories(id);
      this.office_id = this.offices[0].id;
    } else {
      this.office_id = null;
    }
  }

  getCategories(library_id){
    this.Api.get('/library/categories', { 'per_page':'all', library_id: library_id }).subscribe(
      res => {
        this.libCategories = res.data;

      }
    );
  }
}
