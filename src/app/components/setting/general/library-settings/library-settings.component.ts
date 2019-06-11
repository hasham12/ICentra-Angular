import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-library-settings',
  templateUrl: './library-settings.component.html',
  styleUrls: ['./library-settings.component.css']
})
export class LibrarySettingsComponent implements OnInit {

  allFiles: any;
  libraryData: any;
  parentID = -1;
  parentName = '';
  libraryId = 1;
  filesList: any;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.get('/library/librariesByTwoLevels').subscribe(res => {
      this.libraryData = res;
    });
    this.getRelationFiles();
  }
  getRelationFiles() {
    this.api.get('/library/getRelationWithFiles').subscribe(res => {
      this.allFiles = res.data;
    });
  }

  setFiles(catId, name) {
    this.parentID = catId;
    this.parentName = name;
    this.filesList = this.allFiles.filter(file => file.library_categories_id === catId);
  }
  getFilesTotal(id) {
    return this.allFiles.filter(file => file.library_categories_id === id).length;
  }

  getCats() {
    const data = this.libraryData.filter(lib => lib.id === this.libraryId);
    if (data && data.length > 0) {
      return data[0].categories;
    } else {
      return [];
    }
  }
}
