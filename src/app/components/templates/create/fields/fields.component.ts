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
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {

    private AuthUser: any;
    public inset2dark = { axis: 'y'};
    public propertyfieldsearch: any;
    public userfieldsearch: any;

    private propertystructure: any = [];
    public propertyfields: any = [];
    private userstructure: any = [];
    public userfields: any = [];
  	constructor(private global: CreateGlobals, private Auth: AuthService, private api: ApiService) {
  	}

    ngOnInit() {
        this.Auth.UserSub.subscribe(user => this.AuthUser = user);
        this.getPropertyStructure();
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
            padding: 2,
            showTextBoxBorder: true,
            textboxBorderColor: 'grey',
            custype: null
        };

        var top = this.global.canvas.height / 2;
        var height = 0;
        var self = this;
        fields.forEach(function(field) {
            var fieldobj = new fabric.Textbox(field.text, options);
            console.log(fieldobj);
            fieldobj.custype = field.type;
            fieldobj.set('cust', field.type);
            console.log(fieldobj);
            self.global.canvas.add(fieldobj);

            fieldobj.width = fieldobj.calcTextWidth() + 10;

            fieldobj.top = top + height;
            fieldobj.center();
            fieldobj.setCoords();

            height = fieldobj.height;
            top = fieldobj.top;
        });
        this.global.canvas.calcOffset();
        this.global.canvas.renderAll();
    }

    // search in property structure
    searchpropertyfield() {
        var self = this;
        let fieldname = $("#propertyfieldsearch").val();
        fieldname = fieldname.toLowerCase();
        fieldname = fieldname;
        this.propertyfields = [];

        if(fieldname == "") return false;

        this.propertystructure.forEach(function(field) {
            if(field.key.indexOf(fieldname) !== -1) {
                self.propertyfields.push(field);
            }
        });
    }

    addPropertyField(propertyfield) {
        this.addpropertycontent([{type: propertyfield.key, text: propertyfield.value}]);
    }

    // get property structure
    getPropertyStructure() {
        var self = this;
        var data = new FormData();
        data.append('user', '1');
        data.append('limit', '1');

        this.api.post('/rex/listproperties', data).subscribe( res => {
            self.generatePropertyFields(res);
        });
    }

    // generate property fields
    generatePropertyFields(obj) {
        //for each object for each key
        for(let key in obj){
            if(!obj.hasOwnProperty(key)) continue;
            if(typeof obj[key] !== 'object') {
              this.propertystructure.push({key: key, value: Utils.replaceAll(key.toUpperCase(), "_", " ")});
            } else {
              this.generatePropertyFields(obj[key]);
            }
        }
    }

    // search in user structure
    searchuserfield() {
        var self = this;
        let fieldname = $("#userfieldsearch").val();
        fieldname = fieldname.toLowerCase();
        fieldname = fieldname;
        this.userfields = [];
        this.getUserStructure();
        console.log(this.userstructure);

        if(fieldname == "") return false;

        this.userstructure.forEach(function(field) {
            if(field[0].indexOf(fieldname) !== -1) {
                field[1] =  Utils.replaceAll(field[0].toUpperCase(), "_", " ");
                self.userfields.push(field);
            }
        });
    }

    //get User Structure
    getUserStructure() {
        this.userstructure = Object.entries(this.AuthUser);
    }

    addUserField(field) {
      console.log('add User Field click');
      console.log(JSON.stringify(field));
        this.addpropertycontent([{type: field[0], text: field[1]}]);
    }
}
