import { Injectable } from '@angular/core';
declare var $: any;
import { Utils } from './utils';
import 'fabric';

declare const fabric: any;

@Injectable()
export class AppGlobals {
  http: any;
  headers: any;

  constructor() {
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
          propertiesToInclude = (propertiesToInclude || []).concat(
            ['custype']
          );
          return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);
  }

  public setHttp(http, headers) {
    this.http = http;
    this.headers = headers;
  }

  public getImagecategory() {

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
    });
  }

  public getTemplatecategory() {

    this.http.get(Utils.getBaseURL('/api/templatecategoryget'), {
      headers: this.headers
    }).subscribe(data => {
      let tempcats = JSON.parse((<any>data)._body);
      $('.tempcatid').empty();
      $('.tempcatid').append($('<option value="">All Categories</option>'));
      $('.selecttempcatid').empty();
      $('.selecttempcatid').append($('<a class="dropdown-item tempcateid" href="javascript:void(0)" data-id="0">All Categories</a>'));
      for (let tempcat of tempcats) {
        var tempcategorylist = $('<a class="dropdown-item tempcateid" href="javascript:void(0)" data-name="' + tempcat.name + '" data-id="' + tempcat.id + '">' + tempcat.name + '</a>');
        $('#tmpcategeries').append(tempcategorylist);
        var tempcatid = $('<option value="' + tempcat.id + '">' + tempcat.name + '</option>');
        $('.tempcatid').append(tempcatid);
      }
    });
  }
}
