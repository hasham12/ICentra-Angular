import {
	Component,
	OnInit
}
from '@angular/core';
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
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

    private headers = new Headers({
		'Content-Type': 'application/json'
	});
    pages: any = [];
    origpages: any = [];
	constructor(private http: Http, private global: CreateGlobals) {
        this.getPages();
	}
    ngOnInit() {
    }
    getPages() {
        this.http.get(Utils.getBaseURL('/api/pageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updatePageSection(data);
        });
    }

    convertMMToPX(mm) {
        return (mm * 96) / 25.4;
    }
    convertCMToPX(cm) {
        return (cm * 96) / 2.54;
    }

    convertToPX(w, h) {
        w = this.convertMMToPX(w);
        h = this.convertMMToPX(h);
        return {w: w, h: h};
    }

    initEvents() {
        let lthis = this;
        $(".pageimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            var width = $(this).data('width');
            var height = $(this).data('height');
            var wh = lthis.convertToPX(width, height);
            lthis.global.createNewCanvas(wh.w, wh.h);
            $("#pagename").html($(this).data('pname'));
        });
        CreateUtils.initDraggable();
    }
    searchpages() {            
        this.pages = this.origpages;
        var pagename = $("#pagesearch").val();
        var pages = [];
        for (let page of this.pages) {
            if(pagename == ""  || page.name.toLowerCase().indexOf(pagename.toLowerCase()) !== -1) {
                pages.push(page);
            }
        }
        this.pages = pages;
        this.updatePageSection(false);
    }
   
     updatePageSection(data) {
        let pages = [];
        if(data) {
            pages = JSON.parse((<any>data)._body);
            this.pages = pages;
            this.origpages = pages;
        } else {
            pages = this.pages;
        }
        $('#pageimgection').empty();
        var pagehtmldata = '';
        pages.sort(this.alphabeticalSort("name"));
        this.arrsort(pages);
        for (let page of pages) {
           var pagesrc = page.image;
            if(!pagesrc) 
                pagesrc = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

            var pagelist = '<div class="col-lg-6 col-md-4 col-sm-12 imgsection" style="padding: 5px;float: left;text-align:center;color:#9b9b9b;"><img  style="max-width: 100%;width: 250px;" class="pageimg pages" data-width="' + page.width + '" data-height="' +  page.height + '" data-pname="' +  page.name + '" src="' +  Utils.getBaseURL(pagesrc) + '"/><span>' + page.name + '</span><p class="size p-0" style="font-weight:500;">' + page.width + ' x ' +  page.height + ' mm</p></div>';
            pagehtmldata += pagelist;

            var pagesection = $('<div class="print-default-size pagesize" style="" data-page="' + page.name + '" data-width="' + page.width + '" data-height="' +  page.height + '"><div class="print-size-icon"><img src="' +  Utils.getBaseURL(pagesrc) + '" alt="" style="width:100px;"></div><div class="print-size-content" style="text-align:center;font-size:14px;color:#64676c;"><p style="font-weight:700;margin:0px;">'+ page.name +'</p><p class="size p-0" style="font-weight:500;">' + page.width + ' x ' +  page.height + ' mm</p></div></div>');

            if(page.type == 'Web') {
                $(".weblist").append(pagesection);
            } else {
                $(".printlist").append(pagesection);
            }
            
        }
        this.pagesizevalues();
        var $grid = $('#pageimgection');
        $grid.isotope({
            itemSelector: 'div',
            masonry: {
                columnWidth: 'div'
            }
        });
        pagehtmldata = $(pagehtmldata);
        $grid.isotope().append(pagehtmldata).isotope('appended', pagehtmldata).isotope('layout');
        CreateUtils.showpages();
        this.initEvents();
        this.global.updateIconPos();
    }
    alphabeticalSort(property) {
        var sortOrder = 1;

        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a,b) {
            if(sortOrder == -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }        
        }
    }
    arrsort(pages)
    {
        var page = pages[0];
        pages[0] = pages[5];
        pages[5] = page;
    }
    pagesizevalues()
    {
        $("#loadCanvasWid").val(this.pages[0].width);
        $("#loadCanvasHei").val(this.pages[0].height);
        $(".pagenum").val(1);
        this.global.pagewidthsize = this.pages[0].width;
        this.global.pageheightsize = this.pages[0].height;
    }

     clearvalues()
    {
      $('.search-box').val('');
      $('.close-icon').css("display","none");
      $('.searchicon').css("display","block");
      this.searchpages();
    }

}
$(function () {
    $("#pagesearch").on("keyup", function() {
        if ($('#pagesearch').val().length != 0){
            $('.close-icon').css("display","block");
            $('.searchicon').css("display","none");
        }
        else{
            $('.close-icon').css("display","none");
            $('.searchicon').css("display","block");
        }
    });
});

