import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {ApiService} from '../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {LibraryHelper} from '../../helpers/library-helper';

@Component({
    selector: 'app-library-manager',
    templateUrl: './library-manager.component.html',
    styleUrls: ['./library-manager.component.css']
})
export class LibraryManagerComponent implements OnInit {

    @Output() TaskFileSelected = new EventEmitter<any>();
    @Output() refreshParent = new EventEmitter<any>();
    @Input() options: object;

    public inset2dark = {axis: 'y'};
    file_name: any;
    allFiles: any;
    uploadedFile: any;
    libraryData: any;
    filesList: any;
    fileTypes: any;
    selectedFile = [];
    showCreateMenu = false;
    parentID = -1;
    parentName = '';
    sortBy = null;
    byName = null;
    newSubFolderName = '';
    constructor(private api: ApiService, private toastr: ToastrService, public libHelper: LibraryHelper) {
    }

    ngOnInit() {
        //alert(JSON.stringify(this.options));
        this.api.get('/library/librariesByTwoLevels').subscribe(res => {
            this.libraryData = res;
        });
        this.getRelationFiles();
        this.fileTypes = [
            {name: 'GIF', label: 'GIF'}, {name: 'JPG', label: 'JPG'}, {name: 'PDF', label: 'PDF'}, {name: 'PNG', label: 'PNG'},
            {name: 'Word', label: 'doc'}
        ];

        $(document).on('click', 'body .level-1 > .collapser-btn', function(){
           $('.level-2 .collapser-btn').addClass('collapsed');
           $('.level-2 .fonts-collapesd').removeClass('show');
           $('.level-2 .fonts-collapesd').addClass('collapsed');
           $('.level-2 .collapser-btn').attr('aria-expanded', 'false');
        });

        $(document).on('click', 'body .level-1  .collapser-btn', function(){
            $('.level-1 .collapser-btn').removeClass('active');
            $(this).addClass('active');
        });


    }
    onSelectFile(event) {
        console.log(event.target.files);
        this.uploadedFile = event.target.files;
        let formData = new FormData();
        Object.keys(this.uploadedFile).forEach(file => {
            formData.append('uploadFile[]', this.uploadedFile[file]);
        });
        formData.append('folder', String(this.parentID));
        this.api.post('/library/upload-file', formData).subscribe(rs => {
            this.getRelationFiles();
            this.setFiles(this.parentID, this.parentName);
        });
        this.refreshParent.emit(true);
    }

    setFiles(catId, name) {
        console.log(name);
        this.parentID = catId;
        this.parentName = name;
        this.filesList = this.allFiles.filter(file => file.library_categories_id === catId);
        if (this.sortBy && this.sortBy !== '') {
            this.filesList = this.filesList.filter(file => file.file.file_name.toLowerCase().includes('.' + this.sortBy.toLowerCase()));
        }
        if (this.byName && this.byName !== '') {
            this.filesList = this.filesList.filter(file => file.file.file_name.toLowerCase().includes(this.byName.toLowerCase()));
        }
        this.selectedFile = [];
    }

    setFileSelection(id) {
        this.selectedFile.push(id);
    }

    emitNow() {
        let myFiles = [];
        this.selectedFile.forEach(sf => {
            let innner = this.filesList.filter(file => file.file.id === sf);
            myFiles.push(innner[0]);
        });
        this.TaskFileSelected.emit(myFiles);
    }

    insertNewSubFolder() {
        this.api.post('/library/create-folder', {name: this.newSubFolderName, parent_category_id: this.parentID}).subscribe(get => {
            this.api.get('/library/librariesByTwoLevels').subscribe(res => {
                this.libraryData = res;
                this.parentID = -1;
                this.showCreateMenu = false;
                this.newSubFolderName = '';
            });
            this.toastr.success('Folder Created');
        });
        this.refreshParent.emit(true);
    }

    getFilesTotal(id) {
        return this.allFiles.filter(file => file.library_categories_id === id).length;
    }

    deleteFile(file_id, parent) {
        console.log(file_id, parent);
        this.api.post('/library/deleteFile',
            { file_id: file_id, parent: parent}
        ).subscribe(
            res => {
                this.getRelationFiles();
                this.setFiles(this.parentID, this.parentName);
            },
            error => {
                this.toastr.error(error.error.message);
            }
        );
        this.getRelationFiles();
        this.setFiles(this.parentID, this.parentName);
        this.toastr.success('File Deleted');
        this.refreshParent.emit(true);
    }

    getRelationFiles() {
        this.api.get('/library/getRelationWithFiles').subscribe(res => {
            this.allFiles = res.data;
        });
    }
}
