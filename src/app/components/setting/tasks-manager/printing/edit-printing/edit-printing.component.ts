import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-edit-printing',
    templateUrl: './edit-printing.component.html',
    styleUrls: ['./edit-printing.component.css']
})
export class EditPrintingComponent implements OnInit {

    searched = '';
    SearchedCategories: any;
    editId: null;
    category = '';
    costList = [
        {quantity: null, cost: null}
    ];

    constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.editId = params['id'];
            this.api.get('/task-categories/' + params['id'] + '?include=printingCosts').subscribe(res => {
                this.category = res.data.name;
                this.costList = [
                    {quantity: null, cost: null}
                ];
                if(res.data.printingCosts.data.length > 0) {
                    this.costList.length = 0;
                    res.data.printingCosts.data.forEach((pc, k) => {
                        const newObj = {
                            quantity: pc.quantity,
                            cost: pc.amount_per_print
                        };
                        this.costList.push(newObj);
                    });
                    console.log(this.costList);
                }
            });
        });
        this.fetchBySearch();
    }
    fetchBySearch() {
        this.api.get('/task-categories?s=' + this.searched).subscribe(res => {
            this.SearchedCategories = res.data;
        });
    }

    costCheck() {
        let counter = 0;
        this.costList.forEach(cl => {
            if (cl.cost > 0 && cl.quantity > 0) {
                counter = counter + 1;
            }
        });
        if (counter > 0) {
            return true;
        } else {
            return false;
        }
    }

    submitThis() {
            this.api.post('/printing-costs-setting/' + this.editId, {data: this.costList}).subscribe(res => {
                this.router.navigateByUrl('/setting/tasks/printing');
            });
    }

    addMore() {
        this.costList.push({quantity: null, cost: null});
    }

    del(cost) {
        this.costList.splice(this.costList.indexOf(cost), 1);
    }

    changeQtyBox(action, row) {
        const filed = this.costList.indexOf(row);
        console.log(filed);
        if (action === 'plus') {
            this.costList[filed].quantity = this.costList[filed].quantity + 1;
        } else {
            if (this.costList[filed].quantity === 1) {
                this.costList[filed].quantity = 2;
            }
            this.costList[filed].quantity = this.costList[filed].quantity - 1;
        }
    }

    changeQtyBox2(action, row) {
        const filed = this.costList.indexOf(row);
        console.log(filed);
        if (action === 'plus') {
            this.costList[filed].cost = this.costList[filed].cost + 1;
        } else {
            if (this.costList[filed].cost === 1) {
                this.costList[filed].cost = 2;
            }
            this.costList[filed].cost = this.costList[filed].cost - 1;
        }
    }

}
