import { AuthService } from './../../../../services/auth/auth.service';
import { ApiService } from './../../../../services/api.service';
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
  selector: 'app-rea',
  templateUrl: './rea.component.html',
  styleUrls: ['./rea.component.css']
})
export class REAComponent implements OnInit {

    private AuthUser: any;
    public propertysearch: any;
    public usersearch: any;
    public inset2dark = { axis: 'y'};
    public properties: any;    
    public users: any;    
    private propertystructure: any = [];
    public propertyfields: any = [];
    private userstructure: any = [];
    public userfields: any = [];
  	constructor(private global: CreateGlobals, private Auth: AuthService, private api: ApiService) {
  	}

    ngOnInit() {
        this.Auth.UserSub.subscribe(user => this.AuthUser = user);
    }

    addpropertycontent(fields) {
        var options = {
            fontFamily: 'Arial',
            fontSize: 20 * 1.2,
            textAlign: "left",
            lineHeight: 1,
            fontWeight: "bold",
            fontStyle: '',
            editable: true,
            width: 200,
            //borderColor: 'red',
            //editingBorderColor: 'blue',
            padding: 2,
            showTextBoxBorder: true,
            textboxBorderColor: 'grey'
        };

        var top = this.global.canvas.height / 2;
        var height = 0;
        var self = this;
        fields.forEach(function(field) {
            var fieldobj = new fabric.Textbox(field.text, options);
            fieldobj.custype = field.type;
            self.global.canvas.add(fieldobj);
            fieldobj.top = top + height;
            height = fieldobj.height;
            top = fieldobj.top;
            fieldobj.setCoords();
        });
        this.global.canvas.calcOffset();
        this.global.canvas.renderAll();
    }

    searchproperty () {
        let searchkey = $("#propertysearch").val();
        var data = new FormData();
        data.append('search_string', searchkey);
        data.append('limit', '10' );
        //data.append('user', this.AuthUser.id);
        data.append('user', '1');
        this.api.post('/rex/listings_autocomplete', data).subscribe( res => {
            this.properties = res.result;
        });
    }

    // get and update the property details in canvas
    getproperty(propertyid) {
        var data = new FormData();
        data.append('id', propertyid);
        //data.append('user', this.AuthUser.id);
        data.append('user', '1');
        console.log(propertyid);
        console.log(this.AuthUser.id);
        var self = this;
        this.api.post('/rex/getlisting', data).subscribe( res => {
            self.global.updatePropertyInfo(res);
        });
    }

    searchuser() {
        let searchkey = $("#usersearch").val();
        
        this.users = [];

        if(searchkey == "") return false;

        this.api.get('/users?per_page=10&search=' + searchkey).subscribe(res => {
            this.users = res.data;
        });
    }

    getuser(user) {
        this.global.updatePropertyInfo(user);
        this.global.updateAgentPicture(false, (user.photo)? user.photo : user.photo_thumb);
    }
}