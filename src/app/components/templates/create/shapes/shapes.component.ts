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
  selector: 'app-shapes',
  templateUrl: './shapes.component.html',
  styleUrls: ['./shapes.component.css']
})
export class ShapesComponent implements OnInit {

    shapes: any = [];
    origshapes: any = [];
    private headers = new Headers({
		'Content-Type': 'application/json'
	});
	constructor(private http: Http, private global: CreateGlobals) {
		this.getShapes();
	}

    ngOnInit() {
    }
    getShapes() {
        this.http.get(Utils.getBaseURL('/api/shapesget'), {
            headers: this.headers
        }).subscribe(data => {
            this.updateShapeSection(data);
        });
    }
    updateShapeSection(data) {
        let shapelists = [];
        if(data) {
            shapelists = JSON.parse((<any>data)._body);
            this.shapes = shapelists;
            this.origshapes = shapelists;
        } else {
            shapelists = this.shapes;
        }        
        $('#shapelist').empty();
        var shapehtmldata = '';
        for (let shape of shapelists) {
            var shapelist = '<div class="col-lg-3 col-md-3 col-sm-6 imgsection" style="padding:10px;float: left;"><img style="max-width: 100%;width: 250px;" class="shapeimg shape" src="' + Utils.getBaseURL(shape.path) + '"/><i class="fa fa-trash-o deleteShape" data-id="' + shape.id + '" style="cursor:pointer;position: absolute;top: 5px;left: 10px;width: 15px;height:15px;border-radius:50%;color:#fff;background:#fc7b82;line-height:15px;font-size:10px;text-align:center;"></i></div>';
            shapehtmldata += shapelist;
        }
        var $grid = $('#shapelist');
        $grid.isotope({
            itemSelector: 'div',
            masonry: {
                columnWidth: 'div'
            }
        });
        shapehtmldata = $(shapehtmldata);
        $grid.isotope().append(shapehtmldata).isotope('appended', shapehtmldata).isotope('layout');
        CreateUtils.showshapes();        
        this.initEvents();
    }
    initEvents() {
        let lthis = this;
        $(".shapeimg").unbind('click').on('click', function(e) {
            e.preventDefault();
            lthis.global.addImage(e, false);
        });
        $(".deleteShape").unbind('click').on('click', function(e) {
            e.preventDefault();
            var shapeid = $(this).data('id');
            lthis.deleteShapes(shapeid);
        });
        CreateUtils.initDraggable();
     }
     deleteShapes(shapeid) {
        this.http.delete(Utils.getBaseURL('/api/shapesdelete/') + shapeid, {
            headers: this.headers
        }).subscribe(data => {
        console.log(data);
            this.getShapes();

        });
    }
    searchshapes() {
        this.shapes = this.origshapes;
        var shapename = $("#shapesearch").val();
        var shapes = [];
        for (let shape of this.shapes) {
            if(shapename == ""  || shape.name.toLowerCase().indexOf(shapename.toLowerCase()) !== -1) {
                shapes.push(shape);
            }
        }
        this.shapes = shapes;
        this.updateShapeSection(false);
    }
    clearvalues()
    {
      $('.search-box').val('');
      $('.close-icon').css("display","none");
      $('.searchicon').css("display","block");
      this.searchshapes();
    }
}
$(function () {
    $("#shapesearch").on("keyup", function() {
        if ($('#shapesearch').val().length != 0){
            $('.close-icon').css("display","block");
            $('.searchicon').css("display","none");
        }
        else{
            $('.close-icon').css("display","none");
            $('.searchicon').css("display","block");
        }
    });
});
