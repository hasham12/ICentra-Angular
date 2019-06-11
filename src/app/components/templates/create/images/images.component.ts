import { Component, OnInit } from '@angular/core';
import {
    AppGlobals
}
    from '../../../globals';
import {
    CreateGlobals
}
    from '../create.globals';
import {
    NgForm,
    FormBuilder,
    FormGroup,
    Validators
}
    from '@angular/forms';
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
    selector: 'app-images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    public inset2dark = { axis: 'y' };
    private imgFiles = [];
    images: any = [];
    origimages: any = [];
    constructor(private http: Http, private global: CreateGlobals, private appGlobal: AppGlobals) {
        this.getImagecategory();
        this.getImages();
    }
    ngOnInit() {
    }
    getImagecategory() {
        this.http.get(Utils.getBaseURL('/api/imagecategoryget'), {
            headers: this.headers
        }).subscribe(data => {
            let imgcats = JSON.parse((<any>data)._body);
            $('.imgcatid').empty();
            $('.imgcatid').append($('<option value="">Select Category</option>'));
            $('.selectimgcatid').empty();
            $('.selectimgcatid').append($('<a class="dropdown-item imageid" href="javascript:void(0)" data-id="0">Select Category</a>'));
            for (let imgcat of imgcats) {
                var imgcategorylist = $('<a class="dropdown-item imageid" href="javascript:void(0)" data-name="' + imgcat.name + '" data-id="' + imgcat.id + '">' + imgcat.name + '</a>');
                $('#imgcategeries').append(imgcategorylist);
                var imgcatid = $('<option value="' + imgcat.id + '">' + imgcat.name + '</option>');
                $('.imgcatid').append(imgcatid);
            }
            this.initEvents();
        });
    }

    getImages() {
        this.http.get(Utils.getBaseURL('/api/imageget'), {
            headers: this.headers
        }).subscribe(data => {
            //console.log(data);
            this.updateImagesSection(data);
        });
    }

    updateImagesSection(data) {
        let imgs = [];
        if (data) {
            imgs = JSON.parse((<any>data)._body);
            this.images = imgs;
            this.origimages = imgs;
        } else {
            imgs = this.images;
            this.images = imgs;
        }
        // CreateUtils.showimages();
        $(".se-pre-con").fadeOut("slow");
        // this.initEvents();
    }

    public clicker = false;
    adminImg(e) {
        setTimeout(() => {
            if (!this.clicker) {
                console.log(e, 'single click');
                this.global.addImage(e, false);
            }
        }, 200);
    }

    adminImgdbl(e) {
        this.clicker = true;
        console.log(e, 'dbl');
        setTimeout(() => {
            this.clicker = false;
        }, 210);
    }
    initEvents() {
        let lthis = this;

        $(".deleteImg").unbind('click').on('click', function (e) {
            e.preventDefault();
            var imageid = $(this).data('id');
            lthis.deleteImage(imageid);
        });
        $(".imageid").unbind('click').on('click', function (e) {
            e.preventDefault();
            var selimgid = "";
            var selimgname = "";
            selimgid = $(this).data('id');
            selimgname = $(this).data('name');
            if ($(this).data('id') == "0") {
                selimgname = "Select Category";
            }
            $('.selimgcatname').empty();
            $('.selimgcatname').text(selimgname);
            lthis.getcatImages(selimgid);
        });
        CreateUtils.initDraggable();
    }
    getcatImages(catid) {
        console.log(catid);
        if (catid == "0") {
            this.images = this.origimages;
            this.updateImagesSection(false);
        } else {
            var imgs = [];
            for (let img of this.origimages) {
                if (img.catid == catid) {
                    imgs.push(img);
                }
            }
            this.images = imgs;
            this.updateImagesSection(false);
        }
    }
    searchimages() {
        this.images = this.origimages;
        var imgname = $("#imagesearch").val();
        if (imgname !== '') {
            var imgs = [];
            this.images.forEach(img => {
                if (img.name.toLowerCase().includes(imgname.toLowerCase()) !== false) {
                    imgs.push(img);
                }
            });
            this.images = imgs;
            this.updateImagesSection(false);
        } else {
            this.images = this.origimages;
            this.updateImagesSection(false);
        }
    }
    getSrc(path) {
        return Utils.getBaseURL(path);
    }
    deleteImage(imgid) {
        this.http.delete(Utils.getBaseURL('/api/imagedelete/') + imgid, {
            headers: this.headers
        }).subscribe(data => {
            this.getImages();
        });
    }
    addimagecatmodal() {
        $("#imagecategorymodal").modal('show');
    }
    addimagemodal() {
        $("#addimagemodal").modal('show');
    }
    onImgCatSubmit(form: NgForm) {
        this.global.loading = true;
        this.http.post(Utils.getBaseURL('/api/imagecategorysave'), JSON.stringify(form.value), {
            headers: this.headers
        }).subscribe(data => {
            //console.log(data);
            this.global.loading = false;
            this.getImagecategory();
        });
        $("#imagecategorymodal").modal('hide');

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
        $(".se-pre-con").fadeIn("slow");
        const formModel = this.prepareSave(imgForm);
        this.global.loading = true;

        this.http.post(Utils.getBaseURL('/api/imagesave'), formModel).subscribe(data => {
            this.global.loading = false;
            this.updateImagesSection(data);
        });

        $('#imgform')[0].reset();
        $("#addimagemodal").modal('hide');
    }
    onFileChange(event) {
        this.imgFiles = [];
        for (var i = 0; i < event.target.files.length; i++) {
            this.imgFiles.push(event.target.files[i]);
        }
    }
    clearvalues() {
        $('.search-box').val('');
        $('.close-icon').css("display", "none");
        $('.searchicon').css("display", "block");
        this.searchimages();
    }
}
$(function () {
    $("#imagesearch").on("keyup", function () {
        if ($('#imagesearch').val().length != 0) {
            $('.close-icon').css("display", "block");
            $('.searchicon').css("display", "none");
        }
        else {
            $('.close-icon').css("display", "none");
            $('.searchicon').css("display", "block");
        }
    });
});

