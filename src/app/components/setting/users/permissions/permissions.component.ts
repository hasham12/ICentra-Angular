import {  Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Group } from 'src/app/models/group.model';
declare var $: any;

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  constructor(private Api: ApiService, private toastr: ToastrService) { }
  public Roles: any;
  public Groups: Group[];
  public Role: string;
  public filteredRoles: any;
  public filteredGroups: any;
  public filteredOffices: any;
  public group: string;
  public office: string;
  public seleted: string;
  public Offices: any;
  public error: any;
  public permissions: any[] = [];
  public allpermissions: any[] = [];
  public selectedType: any;
  public selectedPermissions: any[] = [];
  public selectedId: any;
  public selectAll = false;
  public firstLoad = { 'role': 5, 'office': 5, 'group': 5 };
  public role_id = '';
  public type = '';
  public filterValue='';
  ngOnInit() {
    this.getAllPermissions();
    // this.getPermissions();
    this.getRoles();
    this.getGroups();
    this.getOffices();


  }

  getRoles() {
    this.Api.get('/roles', { per_page: 'all' }).subscribe(data => {
      this.Roles = data.data;
      this.AssignCopy();
    });
  }
  getGroups() {
    this.Api.get('/groups', { per_page: 'all' }).subscribe(data => {
      this.Groups = data.data;
      this.AssignCopy();
    });
  }
  getOffices() {
    this.Api.get('/offices', { per_page: 'all' }).subscribe(data => {
      this.Offices = data.data;
      this.AssignCopy();
    });
  }

  getRole(id = null) {
    if (id) {
      this.Api.get('/roles/' + id).subscribe(
        data => {
          this.Role = data.data;
        },
        error => {
          this.error = error;
        }
      );
    }
  }

  isAllChecked() {
    return this.selectAll;
  }
  onPermissionSelected(permission: any, isChecked: boolean) {
    if (isChecked) {
      this.selectedPermissions.push(permission);
    } else {
      const index = this.selectedPermissions.indexOf(permission);
      this.selectedPermissions.splice(index, 1);
    }
  }
  checkAll(ev) {
    console.log('All permissions are ');
    console.log(this.selectedPermissions);
    console.log('event is ' + ev);
    this.selectAll = ev;
    if (ev) {
      this.allpermissions.forEach(x => {
        this.selectedPermissions.push(x.name);
      });
      // this.selectedPermissions = this.allpermissions;
    } else {
      this.permissions = [];
      this.selectedPermissions = [];
    }
    console.log('All permissions end ');
    console.log(this.selectedPermissions);
  }

  permissionChecked(permission: string) {
    if (this.permissions.length > 0) {
      for (let i = 0; i < this.permissions.length; i++) {
        if (this.permissions[i].name === permission) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }
  getPermissions(type = '', id = '') {
    this.selectedPermissions = [];
    this.permissions = [];
    this.selectAll = false;
    this.checkAll(false);
    // this.selectAll = false;
    let url = '/permissions';
    if (type && id) {
      url = '/permissions/bytype';
    }
    this.selectedType = type;
    this.selectedId = id;
    this.Api.get(url, {
      type: this.selectedType,
      id: this.selectedId
    }).subscribe(response => {
      this.permissions = response.data;
      this.permissions.forEach(p => {
        this.selectedPermissions.push(p.name);
      });
    });
  }

  getAllPermissions() {
    this.selectedPermissions = [];
    this.permissions = [];
    this.allpermissions = [];
    this.Api.get('/permissions').subscribe(response => {
      return (this.allpermissions = response.data);
    });
  }

  updatePermissions() {
    if (this.selectedType && this.selectedId) {
      this.Api.post('/permissions', {
        type: this.selectedType,
        id: this.selectedId,
        'permissions[]': this.selectedPermissions
      }).subscribe(
        response => {
          if (response.message) {
            this.toastr.success(response.message);
          }
        },
        error => {
          this.toastr.error('something went wrong, please try again later');
        }
      );
    } else {
      console.log('Please select a role, group or office then select capabilities to update.');
    }
  }

  confirmDeleteRole() {

    // if (this.type === 'role' && this.role_id) {
    //   // let confirm:any;
    //   // confirm = confirm('are you sure to delete this role?');
    //   if (confirm('Please confirm you want to delete this role.')) {
    //     this.deleteRole();
    //   }
    // }
  }
  deleteRole() {
     $("#confirmDeleteRolemodel").modal('hide');
    // (<any>$("#confirmDeleteRolemodel")).modal('show');
    if (this.type === 'role' && this.role_id) {
      this.Api.delete('/roles/' + this.role_id).subscribe(
        response => { this.toastr.success('Role has been deleted', 'Updated');
        this.getRoles();
        $("#confirmDeleteRolemodel").modal('hide');
      },
        error => { this.toastr.error('Something went wrong.') }
      );
    }
  }

  AssignCopy(){
    this.filteredRoles = Object.assign([], this.Roles);
    this.filteredGroups = Object.assign([], this.Groups);
    this.filteredOffices = Object.assign([], this.Offices);
  }
 filterItem(value) {
    if (!value) {
        this.AssignCopy();
    } // when nothing has typed
    this.filteredRoles = Object.assign([], this.Roles).filter(
       item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.filteredGroups = Object.assign([], this.Groups).filter(
       item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.filteredOffices = Object.assign([], this.Offices).filter(
       item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
 }

}
