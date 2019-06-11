import { environment } from 'src/environments/environment';
import { AuthService } from './../../../../services/auth/auth.service';
import { Component, OnInit, EventEmitter  } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormHelper } from 'src/app/helpers/form-helper';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { TokenService } from 'src/app/services/auth/token.service';
import { User } from 'src/app/models/user.model';
import { LibraryHelper } from 'src/app/helpers/library-helper';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  /*****ngxfileupload */
  url = environment.apiUrl + '/' + environment.api_prefix + '/library/saveFiles';
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  /*****ngxfileupload end */
  public inset2dark = { axis: 'y'};
  token: string;
  constructor(
    private Api: ApiService,
    private toastr: ToastrService,
    private formhelper: FormHelper,
    private Auth: AuthService,
    private tokenService: TokenService,
    public libHelper: LibraryHelper
  ) {
    /****ngxupload */
    this.options = { concurrency: 1, maxUploads: 10 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    this.token = this.tokenService.get();
    /****ngxupload */

   }
  public view = 'grid';
  public todoList: any;
  public categories: any;
  public categoriesCopy: any;
  public officeUsers: any;
  public libfiles: any;
  // public files: any;
  public fileForm: any;
  public loading = false;
  public fileIcons = {'png':''};
  public shareUserList = [];
  public selectedUser: number;
  public shareFilesList = [];
  public allUsers: any;
  public selectedOffice: any;
  public Offices: any;
  public category_id: any;
  public user_id: any;
  public library_id = '1';
  public AuthUser: any;
  public fileQuery: any;
  public fileterCategoires: any;
  public shareEmailList = [];
  public email:any;
  public generatingZip = false;
  /*  */
  public libraryData: any;
  public allFiles: any;
  parentID = -1;
  ngOnInit() {
    this.Auth.UserSub.subscribe(user => {
      this.AuthUser = user;
    });
    
    this.getAuthUser();
    
    this.Api.get('/library/librariesByTwoLevels').subscribe(res => {
      this.libraryData = res.filter(lib => lib.id === 1)[0].categories;
      console.log(this.libraryData, res);
    });
    this.getRelationFiles();

    $(document).on('click', 'body .level-1 > .collapser-btn', function(){
         $('.level-1 .collapser-btn').addClass('collapsed');
         $('.level-1 .fonts-collapesd').removeClass('show');
         $('.level-1 .fonts-collapesd').addClass('collapsed');
         $('.level-1 .collapser-btn').attr('aria-expanded', 'false');

         // $('.level-1 > .collapser-btn').attr('aria-expanded', 'false');
         // $('.level-1 > .collapser-btn').addClass('collapsed');
         $(this).attr('aria-expanded', 'true');
         $(this).removeClass('collapsed');
         $(this + '.fonts-collapesd').removeClass('collapsed');
     });
    $(document).on('click', 'body .level-1  .collapser-btn', function(){
        $('.level-1 .collapser-btn').removeClass('active');
        $(this).addClass('active');
    });
  }

  setFiles(catId) {
    return this.allFiles.filter(file => file.library_categories_id === catId);
  }
  getFilesTotal(id) {
    return this.allFiles.filter(file => file.library_categories_id === id).length;
  }

  getRelationFiles() {
    this.Api.get('/library/getRelationWithFiles').subscribe(res => {
      this.allFiles = res.data;
    });
  }
  getAuthUser() {
    this.Api.get('/me?include=offices,permissions,groups').subscribe(
      data => {
        this.AuthUser = data.data as User;
        this.Auth.setAuthUser(this.AuthUser);
        this.getPrivateCategories();
        this.getofficeUsers();
        this.getAllUsers();
        this.getOffices();
      }
    );
  }
  categoriesAssignCopy() {
    this.fileterCategoires = Object.assign([], this.categories);
  }
  getPrivateCategories(search = null, category_id = null) {
    let user_id = this.user_id;
    if (this.user_id < 0) {
      user_id = this.AuthUser.id;
    }
    this.Api.get('/library/getFilesbycategory?include=files',
    {per_page: 'all', library_id: this.library_id, search: search, category_id: category_id, user_id: user_id}
    ).subscribe(
      data => {
        this.categories = data.data;
        this.categoriesAssignCopy();
        }
    );
  }
  getofficeUsers() {
    console.log('getofficeusers');
    console.log(this.AuthUser);
    if (!this.selectedOffice)
    {
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
  buildUsersname(){
    let i = 0;
    this.officeUsers.each(u => {
      this.officeUsers[i].name = u.first_name + ' ' + u.lastname;
      i++;
    });
  }
  onSelectFiles(event) {
    this.loading = true;
    this.fileChange(event);
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
        const file: File = fileList[0];
        const formData: FormData = new FormData();
        formData.append('file_path[]', file, file.name);
        this.fileForm = formData;
    }
}

getOffices(){
  this.Api.get('/offices',{per_page:'all'}).subscribe(
    res => {
      this.Offices = res.data;
    },
    error => { this.toastr.error('Problem loading offices.'); }
  );
}

addUserList(){
  console.log(this.selectedUser);
  if (this.selectedUser) {
    /*this.officeUsers.each(u=>{
      if (u.id === this.selectedUser) {
        this.shareUserList.push(u);
      }
    });*/
    console.log(this.shareUserList.indexOf(this.selectedUser));
    if (this.shareUserList.indexOf(this.selectedUser) === -1) {
      this.shareUserList.push(this.selectedUser);
    }
    console.log(this.shareUserList);
  }
  this.selectedUser = null;
}

removeUser(u){
  let index = this.shareUserList.indexOf(u);
  if (index > -1) {
    this.shareUserList.splice(index, 1);
  }
}

drop(event: CdkDragDrop<string[]>) {
  console.log(event);
  if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else { console.log('changed');
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      // this.changeStatus(event.container.id, event.previousContainer.id, event.currentIndex);
  }
  this.fileterCategoires = this.categories;
}
addToList(event: CdkDragDrop<string[]>) {
  if(this.shareFilesList.indexOf(event.previousContainer.data[event.previousIndex]) === -1){
    // this.shareFilesList.push(event.previousContainer.data[event.previousIndex]);
    const fileToShare = event.previousContainer.data[event.previousIndex];
    this.shareFromManager(fileToShare);
  }
  console.log(this.shareFilesList);
}
removeSharefile(file){
  const index = this.shareFilesList.indexOf(file);
  if (index !== -1) {
    this.shareFilesList.splice(index, 1);
  }
}
/*************ngx file uploader ***************/
onUploadOutput(output: UploadOutput): void {
  let category_id = this.category_id;
  let user_id = this.AuthUser.id;
  if (!category_id) {
    category_id = 1;
  }
  console.log(' category_id ' + category_id);
  if (!user_id) {
    this.user_id = this.AuthUser.id;
  }
  console.log(' user_id ' + user_id);
  if (output.type === 'allAddedToQueue') {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.url,
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + this.token },
      data: { category_id: category_id, user_id: user_id, library_id: this.library_id }
    };

    this.uploadInput.emit(event);
  } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
    this.files.push(output.file);
  } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
    const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
    this.files[index] = output.file;
  } else if (output.type === 'cancelled' || output.type === 'removed') {
    this.files = this.files.filter((file: UploadFile) => file !== output.file);
  } else if (output.type === 'dragOver') {
    this.dragOver = true;
  } else if (output.type === 'dragOut') {
    this.dragOver = false;
  } else if (output.type === 'drop') {
    this.dragOver = false;
  } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
    console.log(output.file.name + ' rejected');
  }

  this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
  if (this.files.length < 1) {
    this.getPrivateCategories();
  }
}

startUpload(): void {
  let category_id = this.category_id;
  let user_id = this.AuthUser.id;
  if (category_id < 0 ) {
    category_id = 1;
  }
  if (user_id < 0 ) {
    user_id = this.AuthUser.id;
  }
  const event: UploadInput = {
    type: 'uploadAll',
    url: this.url,
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + this.token },
    data: { category_id: category_id, user_id: user_id, library_id: this.library_id }
  };

  this.uploadInput.emit(event);
}

cancelUpload(id: string): void {
  this.uploadInput.emit({ type: 'cancel', id: id });
}

removeFile(id: string): void {
  this.cancelUpload(id);
  this.uploadInput.emit({ type: 'remove', id: id });
}

removeAllFiles(): void {
  this.uploadInput.emit({ type: 'removeAll' });
}
/****ngx file uploader *****/
deleteFile(file_id, category_id: any, ) {
  // let isDeleted = false;
  console.log(file_id + ' ' + category_id );
  if (file_id) {
    this.Api.post('/library/deleteFile',
    { file_id: file_id, category_id: category_id, library_id: this.library_id, user_id: this.AuthUser.id}
    ).subscribe(
      res => {
        this.getPrivateCategories();
        this.getRelationFiles();
        this.toastr.success('File Deleted');
      }
    );
  }
}

shareFiles(){
  let file_ids = [];
  let to_user_ids = [];
  if(this.shareFilesList.length>0){
    for(let i = 0; i < this.shareFilesList.length;i++){
      file_ids.push(this.shareFilesList[i].file_id);
    }
    if (this.shareUserList.length >0 ) {
      for(let i = 0; i < this.shareUserList.length;i++){
        to_user_ids.push(this.shareUserList[i].id);
      }
      this.Api.post('/library/shareFile', { user_id: this.AuthUser.id, 'file_id[]': file_ids, 'to_user_id[]': to_user_ids}).subscribe(
        res => {
          this.toastr.success('Files has been shared.');
          this.shareFilesList = [];
          this.shareUserList = [];
          this.getPrivateCategories();
        }
      );
    }

  if (this.shareEmailList.length > 0 ) {
      this.Api.post('/library/shareFile',
      { user_id: this.AuthUser.id, 'file_id[]': file_ids, 'email_list[]': this.shareEmailList}
      ).subscribe(
        res => {
          this.toastr.success('Files has been shared.');
          this.shareFilesList = [];
          this.shareEmailList = [];
          this.getPrivateCategories();
        }
      );
    }
  } else {
    this.toastr.info('Please select users/email and files before share.');
  }
}

filterFiles() {
  console.log('file query is ' + this.fileQuery);
  this.getPrivateCategories(this.fileQuery, this.category_id);
  }
  addShareEmail(emailvalid) {
    if (!emailvalid && this.email != null) {
      const index = this.shareEmailList.indexOf(this.email);
      if (index == -1) {
        this.shareEmailList.push(this.email);
        console.log(this.shareEmailList);
      }
      this.email = null;
    } else {
      console.log(emailvalid);
    }
  }

  removeEmail(email) {
    console.log(email);
    if (email) {
      const index = this.shareEmailList.indexOf(email);
      if (index !== -1) {
        this.shareEmailList.splice(index, 1);
      }
    }
  }


  downloadZip(){
    let files_path = [];
    if (this.shareFilesList.length > 0) {
      this.generatingZip = true;
      for (let i = 0; i < this.shareFilesList.length; i++){
        files_path.push(this.shareFilesList[i].path);
      }
      this.Api.get('/library/download', { responseType: 'blob', 'paths[]': files_path } ).subscribe(
        res => {
          if(res.file){
            window.location.href = this.Api.url + res.file;
          } else {
            this.toastr.error('Error generating zip please try again later');
          }
          this.generatingZip = false;
         },
         error => {
           this.generatingZip = false;
          this.toastr.error('Error generating zip please try again later');
         }
      );

    } else {
      this.toastr.warning('Please drag and drop some files into share area before trying to download.');
    }
  }

  checkfiles(files){
    console.log('files are ' + JSON.stringify(files));
    console.log('lenght is ' + files.length);
    return files.lenght>0;
  }

  shareFromManager(f) {
    this.shareFilesList.push({
      file_id: f.file['id'],
      file_path: f.file['file_path'],
      file_type: f.file['file_type'],
      thumb: f.file['thumb'],
      name: f.file['file_name'],
      path: f.file['file_path'],
      size: f.file['size']
    });
    console.log(this.shareFilesList);
  }

    refreshNow(e) {
        if (e) {
            this.ngOnInit();
        }
    }

    shareTheArray(e) {
    e.forEach(file => {
        this.shareFromManager(file);
    });
    }
}


