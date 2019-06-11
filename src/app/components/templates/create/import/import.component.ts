import {
	Component,
	OnInit
}
from '@angular/core';
import {
    NgForm,
    FormBuilder,
    FormGroup,
    Validators
}
from '@angular/forms';
import {
	CreateGlobals
}
from '../create.globals';
import {
    Utils
}
from '../../../utils';
import {
    CreateUtils
}
from '../create.utils';
import {
	Http,
	Headers
}
from '@angular/http';
import isotope from 'isotope-layout';
declare var $: any;
declare const fabric: any;
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
    private imgFiles = [];
    imports: any = [];
    origimports: any = [];
    public inset2dark = { axis: 'y'};
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
	constructor(private http: Http, private global: CreateGlobals) {
		this.getImports();
	}
    ngOnInit() {
    }
    searchimports() {
        this.imports = this.origimports;
        var importname = $("#importsearch").val();
        var imports = [];
        for (let impt of this.imports) {
            if(importname == ""  || impt.name.toLowerCase().indexOf(importname.toLowerCase()) !== -1) {
                imports.push(impt);
            }
        }
        this.imports = imports;
        this.updateImportSection(false);

    }
    getImports() {
        this.http.get(Utils.getBaseURL('/api/importget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateImportSection(data);
        });
    }
   updateImportSection(data) {
        let importlists = [];
        if(data) {
            importlists = JSON.parse((<any>data)._body);
            this.imports = importlists;
            this.origimports = importlists;
        } else {
            importlists = this.imports;
        }
        $('#importimgection').empty();
        var importhtmldata = '';
        for (let imports of importlists) {
            var importlist = '<div class="col-lg-6 col-md-4 col-sm-12 imgsection" style="padding: 5px;float: left;"><img style="max-width: 100%;width: 250px;" class="importimg imports" src="' + Utils.getBaseURL(imports.path) + '"/><i class="fa fa-trash-o deleteImport" data-id="' + imports.id + '" style="cursor:pointer;position: absolute;bottom: 5px;left: 10px;width: 15px;height: 15px;border-radius: 50%;color: #000000;"></i></div>';
            importhtmldata += importlist;
        }
        var $grid = $('#importimgection');
        $grid.isotope({
            itemSelector: 'div',
            masonry: {
                columnWidth: 'div'
            }
        });
        importhtmldata = $(importhtmldata);
        $grid.isotope().append(importhtmldata).isotope('appended', importhtmldata).isotope('layout');
        CreateUtils.showimports();
        this.initEvents();
    }
    initEvents() {
       let lthis = this;

       $(".importimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.global.addImage(e, true)
        });
        $(".deleteImport").unbind('click').on('click', function(e) {
            e.preventDefault();
            var imprtid = $(this).data('id');
            lthis.deleteImports(imprtid);
        });
        CreateUtils.initDraggable();
    }
    deleteImports(imprtid) {
        this.http.delete(Utils.getBaseURL('/api/importdelete/') + imprtid, {
            headers: this.headers
        }).subscribe(data => {
            console.log(data);
            this.getImports();
        });
    }
    addimportfile() {
        $("#addimportmodal").modal('show');
    }
    prepareImportSave(importForm: NgForm): any {
        let input = new FormData();
        for(var i = 0; i < this.imgFiles.length; i++) {
            input.append('path[]', this.imgFiles[i]);
        }
        return input;
    }
    onImportSubmit(importForm: NgForm) {
        const formModel = this.prepareImportSave(importForm);
        this.global.loading = true;

        this.http.post(Utils.getBaseURL('/api/importsave'), formModel).subscribe(data => {
            this.global.loading = false;
            this.updateImportSection(data);
        });
        $('#importform')[0].reset();
        $("#addimportmodal").modal('hide');
    }
    onFileChange(event) {
        this.imgFiles = [];
        for(var i = 0; i < event.target.files.length; i++) {
            this.imgFiles.push(event.target.files[i]);
        }
    }
    clearvalues()
    {
      $('.search-box').val('');
      $('.close-icon').css("display","none");
      $('.searchicon').css("display","block");
      this.searchimports();
    }
}
$(function () {
    $("#importsearch").on("keyup", function() {
        if ($('#importsearch').val().length != 0){
            $('.close-icon').css("display","block");
            $('.searchicon').css("display","none");
        }
        else{
            $('.close-icon').css("display","none");
            $('.searchicon').css("display","block");
        }
    });
});
