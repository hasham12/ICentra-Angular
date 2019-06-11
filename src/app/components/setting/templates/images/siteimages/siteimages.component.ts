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
    selector: 'app-siteimages',
    templateUrl: './siteimages.component.html',
    styleUrls: ['./siteimages.component.css']
})
export class SiteimagesComponent implements OnInit {
    public editimge: any = '';
    private editImgid: any;
    private loading: boolean = false;
    private imgFiles = [];
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    public env = env;
    public Images: any[];
    public CountImports: any[];
    public CountPatterns: any[];
    public CountBgImages: any[];
    constructor(private http: Http, private fb: FormBuilder) {
        this.getImages();
        this.getImagecategory();
        this.getCountImports();
        this.getCountPatterns();
        this.getCountBGImages();
    }
    ngOnInit() {}
    addimagemodal() {
        $("#addimagemodal").modal('show');
    }
    editimgmodal() {
        $("#editimagenamemodal").modal('show');
    }
    editImg(img) {
        this.editimge = img.name;
        this.editImgid = img.id;
        this.editimgmodal();
    }
    triggerfiletype(){
        $('#path').trigger('click');
    }
    deleteImg(img) {
        this.editImgid = img.id;
        $(".se-pre-con").fadeIn("slow");    
        this.http.delete(Utils.getBaseURL('/api/imagedelete/') + this.editImgid, {
            headers: this.headers
        }).subscribe(data => {
            this.getImages();
            this.getImagecategory();
            $(".se-pre-con").fadeOut("slow");
        });
    } 
    getImagecategory() {        
        this.http.get(Utils.getBaseURL('/api/imagecategoryget'), {
            headers: this.headers
        }).subscribe(data => {
            let imgcats = JSON.parse(( < any > data)._body);
            $('.imgcatid').empty();
            $('.imgcatid').append($('<option value="">Select Category</option>'));
            for (let imgcat of imgcats) {
                var imgcatid = $('<option value="' + imgcat.id + '">' + imgcat.name + '</option>');
                $('.imgcatid').append(imgcatid);
            }
        });
    }
    getImages() {
        this.http.get(Utils.getBaseURL('/api/imageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.Images = JSON.parse(( < any > data)._body);
        });
    }
    getCountImports() {
        this.http.get(Utils.getBaseURL('/api/importget'), {
            headers: this.headers
        }).subscribe(data => {
            this.CountImports = JSON.parse(( < any > data)._body);
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
    onFileChange(event) {
        this.imgFiles = [];
        for (var i = 0; i < event.target.files.length; i++) {
            this.imgFiles.push(event.target.files[i]);
        }
    }
    prepareSave(imgForm: NgForm): any {
        let input = new FormData();
        input.append('cat_id', imgForm.value.cat_id);
        for (var i = 0; i < this.imgFiles.length; i++) {
            input.append('path[]', this.imgFiles[i]);
        }
        return input;
    }
    onImgSubmit(imgForm: NgForm) {
        const formModel = this.prepareSave(imgForm);
        this.loading = true;

        this.http.post(Utils.getBaseURL('/api/imagesave'), formModel).subscribe(data => {
            this.loading = false;
            this.getImages();
            this.getImagecategory();
        });
        $('#imgform')[0].reset();
        $("#addimagemodal").modal('hide');
    }
    prepareeditImgnameSave(editImgForm: NgForm): any {
        let input = new FormData();
        input.append('name', editImgForm.value.name);
        return input;
    }
    oneditIMGSubmit(editImgForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        const formModel = this.prepareeditImgnameSave(editImgForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/editimagename/') + this.editImgid, formModel).subscribe(data => {
            this.loading = false;
            this.getImages();
            this.getImagecategory();
            $(".se-pre-con").fadeOut("slow");
        });
        $('#editimg')[0].reset();
        $("#editimagenamemodal").modal('hide');
    }
}