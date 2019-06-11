import {
    Component,
    OnInit,
    ElementRef,
    ViewChild
} from '@angular/core';
import {
    Http,
    Headers
} from '@angular/http';
import {
    NgForm,
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import {
    Utils
} from '../../../../utils';
import 'fabric';
import isotope from 'isotope-layout';
import {
    environment as env
} from '../../../../../../environments/environment';

declare const fabric: any;
declare var $: any;

@Component({
    selector: 'app-imports',
    templateUrl: './imports.component.html',
    styleUrls: ['./imports.component.css']
})
export class ImportsComponent implements OnInit {
    public editimport: any = '';
    private editimportid: any;
    private imgFiles = [];
    private loading: boolean = false;
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    public env = env;
    public Imports: any[];
    public CountPatterns: any[];
    public CountBgImages: any[];
    public CountImages: any[];
    constructor(private http: Http, private fb: FormBuilder) {
        this.getImports();
        this.getCountPatterns();
        this.getCountBGImages();
        this.getCountImages();
    }
    ngOnInit() {}
    editImportname(importval) {
        this.editimport = importval.name;
        this.editimportid = importval.id;
        this.editmportimgmodal();
    }
    deleteImport(importval) {
        this.editimportid = importval.id;
        $(".se-pre-con").fadeIn("slow");    
        this.http.delete(Utils.getBaseURL('/api/importdelete/') + this.editimportid, {
            headers: this.headers
        }).subscribe(data => {
            this.getImports();
            $(".se-pre-con").fadeOut("slow");    
        });
    }
    addimportfile() {
        $("#addimportmodal").modal('show');
    }
    editmportimgmodal() {
        $("#editimportnamemodal").modal('show');
    }
    triggerfiletype() {
        $('#path').trigger('click');
    }
    onFileChange(event) {
        this.imgFiles = [];
        for (var i = 0; i < event.target.files.length; i++) {
            this.imgFiles.push(event.target.files[i]);
        }
    }
    getImports() {
        this.http.get(Utils.getBaseURL('/api/importget'), {
            headers: this.headers
        }).subscribe(data => {
            this.Imports = JSON.parse(( < any > data)._body);
        });
    }
    getCountPatterns() {
        this.http.get(Utils.getBaseURL('/api/bgpatternget'), {
            headers: this.headers
        }).subscribe(data => {
            this.CountPatterns = JSON.parse(( < any > data)._body);
        });
    }
    getCountBGImages() {
        this.http.get(Utils.getBaseURL('/api/bgimageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.CountBgImages = JSON.parse(( < any > data)._body);
        });
    }
    getCountImages() {
        this.http.get(Utils.getBaseURL('/api/imageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.CountImages = JSON.parse(( < any > data)._body);
        });
    }
    prepareImportSave(importForm: NgForm): any {
        let input = new FormData();
        for (var i = 0; i < this.imgFiles.length; i++) {
            input.append('path[]', this.imgFiles[i]);
        }
        return input;
    }
    onImportSubmit(importForm: NgForm) {
        const formModel = this.prepareImportSave(importForm);
        this.loading = true;

        this.http.post(Utils.getBaseURL('/api/importsave'), formModel).subscribe(data => {
            this.loading = false;
            this.getImports();
        });
        $('#importform')[0].reset();
        $("#addimportmodal").modal('hide');
    }
    prepareeditImportnameSave(editImportForm: NgForm): any {
        let input = new FormData();
        input.append('name', editImportForm.value.name);
        return input;
    }
    oneditImportSubmit(editImportForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        const formModel = this.prepareeditImportnameSave(editImportForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/editimportname/') + this.editimportid, formModel).subscribe(data => {
            this.loading = false;
            this.getImports();
            $(".se-pre-con").fadeOut("slow");
        });
        $('#editimportname')[0].reset();
        $("#editimportnamemodal").modal('hide');
    }
}