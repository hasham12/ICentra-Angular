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
    selector: 'app-vectorshapes',
    templateUrl: './vectorshapes.component.html',
    styleUrls: ['./vectorshapes.component.css']
})
export class VectorshapesComponent implements OnInit {
    public editshape: any = '';
    private editshapesid: any;
    private loading: boolean = false;
    private imgFiles = [];
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    public env = env;
    public Shapes: any[];
    constructor(private http: Http, private fb: FormBuilder) {
        this.getShapes();
    }
    ngOnInit() {}
    editShapes(shape) {
        this.editshape = shape.name;
        this.editshapesid = shape.id;
        this.editshapesmodal();
    }
    deleteShapes(shape) {
        this.editshapesid = shape.id;
        $(".se-pre-con").fadeIn("slow");    
        this.http.delete(Utils.getBaseURL('/api/shapesdelete/') + this.editshapesid, {
            headers: this.headers
        }).subscribe(data => {
            $('#settingshapes').empty();
            this.getShapes();
            $(".se-pre-con").fadeOut("slow");    
        });
    }
    triggerfiletype() {
        $('#path').trigger('click');
    }
    addshapes() {
        $("#Addshapesmodal").modal('show');
    }
    editshapesmodal() {
        $("#editshapesmodal").modal('show');
    }
    onFileChange(event) {
        this.imgFiles = [];
        for (var i = 0; i < event.target.files.length; i++) {
            this.imgFiles.push(event.target.files[i]);
        }
    }
    getShapes() {
        this.http.get(Utils.getBaseURL('/api/shapesget'), {
            headers: this.headers
        }).subscribe(data => {
            this.Shapes = JSON.parse(( < any > data)._body);
        });
    }
    prepareShapeSave(shapesForm: NgForm): any {
        let input = new FormData();
        input.append('name', shapesForm.value.name);
        for (var i = 0; i < this.imgFiles.length; i++) {
            input.append('path[]', this.imgFiles[i]);
        }
        return input;
    }
    onShapeSubmit(shapesForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        const formShapeModel = this.prepareShapeSave(shapesForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/shapesave'), formShapeModel).subscribe(data => {
            this.loading = false;
            this.getShapes();
            $(".se-pre-con").fadeOut("slow");
        });
        $('#shapesForm')[0].reset();
        $("#Addshapesmodal").modal('hide');
    }
    prepareeditshpSave(editshpForm: NgForm): any {
        let input = new FormData();
        input.append('name', editshpForm.value.name);
        return input;
    }
    oneditShpSubmit(editshpForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        const formModel = this.prepareeditshpSave(editshpForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/editshapesname/') + this.editshapesid, formModel).subscribe(data => {
            this.loading = false;
            this.getShapes();
            $(".se-pre-con").fadeOut("slow");
        });
        $('#editshp')[0].reset();
        $("#editshapesmodal").modal('hide');
    }
}