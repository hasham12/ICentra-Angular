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
    selector: 'app-vectoricons',
    templateUrl: './vectoricons.component.html',
    styleUrls: ['./vectoricons.component.css']
})
export class VectoriconsComponent implements OnInit {
    private editiconsid: any;
    public editicns: any = '';
    private loading: boolean = false;
    private imgFiles = [];
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    public env = env;
    public Icons: any[];
    constructor(private http: Http, private fb: FormBuilder) {
        this.getIcons();
        this.getIconcategory();
    }
    ngOnInit() {}
    initEvents() {
    }
    editIcons(icon){
        this.editicns = icon.name;
        this.editiconsid = icon.id;
        this.editiconsmodal();    
    }
    deleteIcon(icon){
        this.editiconsid = icon.id;
        $(".se-pre-con").fadeIn("slow");    
        this.http.delete(Utils.getBaseURL('/api/icondelete/') + this.editiconsid, {
            headers: this.headers
        }).subscribe(data => {
            this.getIcons();
            this.getIconcategory();
            $(".se-pre-con").fadeOut("slow");    
        });
    }
    triggerfiletype() {
        $('#path').trigger('click');
    }
    addicons() {
        $("#Addiconsmodal").modal('show');
    }
    editiconsmodal() {
        $("#editiconsmodal").modal('show');
    }
    onFileChange(event) {
        this.imgFiles = [];
        for(var i = 0; i < event.target.files.length; i++) {
            this.imgFiles.push(event.target.files[i]);
        }
    }
    getIcons() {
        this.http.get(Utils.getBaseURL('/api/iconget'), {
            headers: this.headers
        }).subscribe(data => {
            this.Icons = JSON.parse(( < any > data)._body);
        });
    }
    getIconcategory() {
        this.http.get(Utils.getBaseURL('/api/iconcategoryget'), {
            headers: this.headers
        }).subscribe(data => {
            let iconcats = JSON.parse(( < any > data)._body);
            $('.iconcatid').empty();
            $('.iconcatid').append($('<option value="">Select Category</option>'));
            for (let iconcat of iconcats) {
                var iconcatid = $('<option value="' + iconcat.id + '">' + iconcat.name + '</option>');
                $('.iconcatid').append(iconcatid);
            }
            this.initEvents();
        });
    }
    prepareIconSave(iconForm: NgForm): any {
        let input = new FormData();
        input.append('cat_id', iconForm.value.cat_id);
        input.append('name', iconForm.value.name);
        for (var i = 0; i < this.imgFiles.length; i++) {
            input.append('path[]', this.imgFiles[i]);
        }
        return input;
    }

    onIconSubmit(iconForm: NgForm) {
        const formModel = this.prepareIconSave(iconForm);
        this.loading = true;

        this.http.post(Utils.getBaseURL('/api/iconsave'), formModel).subscribe(data => {
            this.loading = false;
            this.getIcons();
        	this.getIconcategory();
        });
        $('#iconForm')[0].reset();
        $("#Addiconsmodal").modal('hide');
    }

    prepareediticnSave(editicnForm: NgForm): any {
        let input = new FormData();
        input.append('name', editicnForm.value.name);
        return input;
    }
    oneditIconSubmit(editicnForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        const formModel = this.prepareediticnSave(editicnForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/editIconname/') + this.editiconsid, formModel).subscribe(data => {
            this.loading = false;
            this.getIcons();
            this.getIconcategory();
            $(".se-pre-con").fadeOut("slow");
        });
        $('#editicn')[0].reset();
        $("#editiconsmodal").modal('hide');
    }
}