import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-my-report',
    templateUrl: './my-report.component.html',
    styleUrls: ['./my-report.component.css']
})
export class MyReportComponent implements OnInit {


    public barChartLabels = ["July", "June", "May", "April", "March"];
    public barChartType = 'horizontalBar';
    public barChartLegend = true;
    public barChartData = [
        { data: [100, 50, 60, 70, 40], label: 'Revenue' },
    ];
    public barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
    };

    ngOnInit() {

    }

}
