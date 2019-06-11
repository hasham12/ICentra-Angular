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
    selector: 'app-background-category',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.css']
})
export class BgComponent implements OnInit {
    private editbgimgcatid: any;
    public editbgimgcatname: any = '';
    private loading: boolean = false;
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    public env = env;
    public Backgrounds: any[];
    public CountIcons: any[];
    public CountImages: any[];
    public CountTemplates: any[];
    constructor(private http: Http, private fb: FormBuilder) {
        this.getBackground();
        this.getCountIcons();
        this.getCountImages();
        this.getCountTemplates();
    }
    ngOnInit() {}
    editbgImgcat(background) {
        this.editbgimgcatname = background.name;
        this.editbgimgcatid = background.id;
        this.editbgimgcatmodal();
    }
    deletebgImgcat(background) {
        this.editbgimgcatid = background.id;
        $(".se-pre-con").fadeIn("slow");
        this.http.delete(Utils.getBaseURL('/api/bgimagecategorydelete/') + this.editbgimgcatid, {
            headers: this.headers
        }).subscribe(data => {
            this.getBackground();
            $(".se-pre-con").fadeOut("slow");
        });
    }
    addbgimgcatmodal() {
        $("#bgimagecategorymodal").modal('show');
    }
    editbgimgcatmodal() {
        $("#editbgimgcatmodal").modal('show');
    }
    getBackground() {
        this.http.get(Utils.getBaseURL('/api/bgimagecategoryget'), {
            headers: this.headers
        }).subscribe(data => {
            this.Backgrounds = JSON.parse(( < any > data)._body);
        });
    }
    getCountIcons() {
        this.http.get(Utils.getBaseURL('/api/iconcategoryget'), {
          headers: this.headers
        }).subscribe(data => {
          this.CountIcons = JSON.parse(( < any > data)._body);
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
    onBgimgCatSubmit(bgimgcatForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/bgimagecategorysave'), JSON.stringify(bgimgcatForm.value), {
            headers: this.headers
        }).subscribe(data => {
            this.loading = false;
            this.getBackground();
            $(".se-pre-con").fadeOut("slow");
        });
        $('#bgcatform')[0].reset();
        $("#bgimagecategorymodal").modal('hide');
    }
    prepareeditbgimgcatSave(editbgimgcatForm: NgForm): any {
        let input = new FormData();
        input.append('name', editbgimgcatForm.value.name);
        return input;
    }
    oneditBGImgCatSubmit(editbgimgcatForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        const formModel = this.prepareeditbgimgcatSave(editbgimgcatForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/editbgimgcatname/' + this.editbgimgcatid), formModel).subscribe(data => {
            this.loading = false;
            this.getBackground();
            $(".se-pre-con").fadeOut("slow");
        });
        $('#editbgimgcat')[0].reset();
        $("#editbgimgcatmodal").modal('hide');
    }
}