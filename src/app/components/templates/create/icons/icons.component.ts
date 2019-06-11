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
    CreateUtils
}
from '../create.utils';
import {
    Utils
}
from '../../../utils';
import {
	Http,
	Headers
}
from '@angular/http';
import isotope from 'isotope-layout';
declare var $: any;
declare const fabric: any;
@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {
        
    private iconFiles = [];
    icons: any = [];
    origicons: any = [];
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
	constructor(private http: Http, private global: CreateGlobals) {
		this.getIcons();
		this.getIconcategory();
	}

    ngOnInit() {
    }
    getIcons() {
        this.http.get(Utils.getBaseURL('/api/iconget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateIconSection(data);
        });
    }
    updateIconSection(data) {
        let iconlists = [];
        if(data) {
            iconlists = JSON.parse((<any>data)._body);
            this.icons = iconlists;
            this.origicons = iconlists;
        } else {
            iconlists = this.icons;
        }
        $('#iconslist').empty();
        var iconshtmldata = '';
        for (let icons of iconlists) {
            var iconlist = '<div class="col-lg-3 col-md-3 col-sm-6 imgsection" style="padding:10px;float: left;"><img style="max-width: 100%;width: 250px;" class="iconimg Icons" src="' + Utils.getBaseURL(icons.path) + '"/><i class="fa fa-trash-o deleteIcon" data-id="' + icons.id + '" style="cursor:pointer;position: absolute;top: 5px;left: 10px;width: 15px;height:15px;border-radius:50%;color:#fff;background:#fc7b82;line-height:15px;font-size:10px;text-align:center;"></i></div>';
            iconshtmldata += iconlist;
        }
        var $grid = $('#iconslist');
        $grid.isotope({
            itemSelector: 'div',
            masonry: {
                columnWidth: 'div'
            }
        });
        iconshtmldata = $(iconshtmldata);
        $grid.isotope().append(iconshtmldata).isotope('appended', iconshtmldata).isotope('layout');
        CreateUtils.showicons();
        this.initEvents();
    }
    initEvents() {
        let lthis = this;
        $(".iconimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.global.addSVG(e, false);
        });
        $(".deleteIcon").unbind('click').on('click', function(e) {
            e.preventDefault();
            var iconid = $(this).data('id');
            lthis.deleteIcons(iconid);
        });
        $(".iconid").unbind('click').on('click', function(e) {
            e.preventDefault();
            var seliconid = "";
            var seliconname = "";
            seliconid = $(this).data('id');
            seliconname = $(this).data('name');
            if($(this).data('id') == "0")
            { 
              seliconname = "Select Category";
            } 
            $('.seliconcatname').empty();
            $('.seliconcatname').text(seliconname);
            lthis.getcatIcons(seliconid);
        });        
        CreateUtils.initDraggable();
      }
     deleteIcons(iconid) {
        this.http.delete(Utils.getBaseURL('/api/icondelete/') + iconid, {
            headers: this.headers
        }).subscribe(data => {
            this.getIcons();
        });
    }
    getcatIcons(catid) {
        if(catid == "0") {
            this.icons = this.origicons;
            this.updateIconSection(false);
        } else {
            var icons = [];
            for (let icon of this.origicons) {
                if(icon.catid == catid) {
                    icons.push(icon);
                }
            }
            this.icons = icons;
            this.updateIconSection(false);
        }
    }
    getIconcategory() {

        this.http.get(Utils.getBaseURL('/api/iconcategoryget'), {
            headers: this.headers
        }).subscribe(data => {
            let iconcats = JSON.parse((<any>data)._body);
            $('.iconcatid').empty();
            $('.iconcatid').append($('<option value="">Select Category</option>'));
            $('.selecticoncatid').empty();
            $('.selecticoncatid').append($('<a class="dropdown-item iconid" href="javascript:void(0)" data-id="0">Select Category</a>'));
            for (let iconcat of iconcats) {
                var iconcategorylist = $('<a class="dropdown-item iconid" href="javascript:void(0)" data-name="' + iconcat.name + '" data-id="' + iconcat.id + '">' + iconcat.name + '</a>');
                $('#iconcategeries').append(iconcategorylist);
                var iconcatid = $('<option value="' + iconcat.id + '">' + iconcat.name + '</option>');
                $('.iconcatid').append(iconcatid);
            }
            this.initEvents();

        });
    }
    searchicons() {
        this.icons = this.origicons;
        var iconname = $("#iconsearch").val();      
        var icons = [];
        for (let icon of this.icons) {
            if(iconname == ""  || icon.name.toLowerCase().indexOf(iconname.toLowerCase()) !== -1) {
                icons.push(icon);
            }
        }
        this.icons = icons;
        this.updateIconSection(false);
    }
    addiconcatmodal() {
        $("#iconscategorymodal").modal('show');
    }
    addiconmodal() {
        $("#Addiconsmodal").modal('show');
    }
    onIconCatSubmit(iconcatForm: NgForm) {
        this.global.loading = true;
        this.http.post(Utils.getBaseURL('/api/iconcategorysave'), JSON.stringify(iconcatForm.value), {
            headers: this.headers
        }).subscribe(data => {
            this.global.loading = false;
            this.getIconcategory();
        });
        $('#iconcatForm')[0].reset();
        $("#iconscategorymodal").modal('hide');
    }
    onIconFileChange(event) {
        this.iconFiles = [];
        for(var i = 0; i < event.target.files.length; i++) {
            this.iconFiles.push(event.target.files[i]);
        }
    }
    prepareIconSave(iconForm: NgForm): any {
        let input = new FormData();
        input.append('cat_id', iconForm.value.cat_id);
        input.append('name', iconForm.value.name);
        for(var i = 0; i < this.iconFiles.length; i++) {
            input.append('path[]', this.iconFiles[i]);
        }
        return input;
    }
    onIconSubmit(iconForm: NgForm) {
        const formModel = this.prepareIconSave(iconForm);
        this.global.loading = true;

        this.http.post(Utils.getBaseURL('/api/iconsave'), formModel).subscribe(data => {
            this.global.loading = false;
            this.updateIconSection(data);
        });
        $('#iconForm')[0].reset();
        $("#Addiconsmodal").modal('hide');
    }
     clearvalues()
    {
      $('.search-box').val('');
      $('.close-icon').css("display","none");
      $('.searchicon').css("display","block");
      this.searchicons();
    }
}
$(function () {
    $("#iconsearch").on("keyup", function() {
        if ($('#iconsearch').val().length != 0){
            $('.close-icon').css("display","block");
            $('.searchicon').css("display","none");
        }
        else{
            $('.close-icon').css("display","none");
            $('.searchicon').css("display","block");
        }
    });
});
