import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-printing',
  templateUrl: './printing.component.html',
  styleUrls: ['./printing.component.css']
})
export class PrintingComponent implements OnInit {

  searched = '';
  costs: any;
  SearchedCategories: any;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.get('/task-categories').subscribe(res => {
      this.costs = res.data;
    });
    this.fetchBySearch();
  }
  fetchBySearch() {
    this.api.get('/task-categories?s=' + this.searched).subscribe(res => {
      this.SearchedCategories = res.data;
    });
  }

}
