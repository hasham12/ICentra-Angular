import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/models/pagination.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  constructor(private Api: ApiService) { }
  public Roles: any;
  public Pagination: Pagination;
  public per_page: number;
  public current_page: number;
  ngOnInit() {
    this.current_page = 1;
    this.per_page = 25;
    this.getRoles(this.current_page, this.per_page);

 
  }
  getRoles(page = null, per_page = null) {
    this.Api.get('/roles',  { page: page, per_page: per_page } ).subscribe(data => {
      this.Roles = data.data;
      console.log('data of roles inside function' + JSON.stringify(this.Roles));
      this.Pagination = data.meta.pagination;
      console.log('pagination inside function' + JSON.stringify(this.Pagination));
    }
  );
}
}
