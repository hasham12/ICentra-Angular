import { Component, OnInit, EventEmitter, Output,Input, DoCheck } from '@angular/core';
import {
    CreateUtils
}
from '../create.utils';

@Component({
  selector: 'app-template-nav',
  templateUrl: './template-nav.component.html',
  styleUrls: ['./template-nav.component.css']
})
export class TemplateNavComponent implements OnInit, DoCheck {
  id:string;
  active:string;
  @Input() leftSideBarItemVisible: string;
  constructor() { 
   
  }
  ngDoCheck() {
    this.active = this.leftSideBarItemVisible;
  }
  ngOnInit() { 
    // $('.ic-tools-tab a').on('click', function (e) {
    //   e.preventDefault();
       
    //    var GetTab = $(this).attr('href');
    //    if($(GetTab).hasClass('active-tab')){
    //       $(GetTab).removeClass('active-tab');
    //       $('.ic-editor-sidebar-tab-content .tab-pane').removeClass('active-tab');
    //    }else{
    //       $(GetTab).addClass('active-tab');
    //    }

    // })
    
  }
  @Output() rightSideBarVisible = new EventEmitter<{visible: boolean, id: string , leftbar:boolean}>();
  @Output() leftSideBarItemActive = new EventEmitter();
  
  showtemplates(id:string) {
    this.active='kits-tab';
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});    
  	CreateUtils.showtemplates();
    localStorage.setItem('showsection', 'kits-content')
  }

  showimages(id:string) {
    this.active='images-tab';
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
  	CreateUtils.showimages();
    localStorage.setItem('showsection', 'images-content');
  }

  showicons(id:string) {
    this.active="icons-tab";
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
  	CreateUtils.showicons();
    localStorage.setItem('showsection', 'icons-content');
  }

  showshapes(id:string) {
    this.active="shapes-tab";
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
  	CreateUtils.showshapes();
    localStorage.setItem('showsection', 'shapes-content');
  }

  showbgimgs(id:string) {
    this.active="backgrounds-tab";
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
  	CreateUtils.showbgimgs();
    localStorage.setItem('showsection', 'backgrounds-content');
  }

  showimports(id:string) {
    this.active="import-tab";
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
  	CreateUtils.showimports();
    localStorage.setItem('showsection', 'import-content');
  }

  showpages(id:string) {
    this.active="pages-tab";
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
    CreateUtils.showpages();
    localStorage.setItem('showsection', 'pages-content');
  }

  showdraw(id:string) {
    this.active="draw-tab";
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
    localStorage.setItem('showsection', 'draw-content');
  }

  showrea(id:string) {
    this.active="rea-tab";
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
    localStorage.setItem('showsection', 'rea-content');
  }

  showfieldsinfo(id:string) {
    this.active="fields-tab";
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
    localStorage.setItem('showsection', 'fields-content');
  }  

  showtext(id:string) {
    this.active="text-tab";
    this.rightSideBarVisible.emit({visible:false, id: id, leftbar:true});
    localStorage.setItem('showsection', 'text-content');
  }  
}
