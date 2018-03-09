import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { VisitsService } from './uvisits.service';
import { uVisits } from './uvisits';

@Component({
    selector: 'utable',
    templateUrl: './utable.component.html',
    styleUrls: ['./utable.component.css'],
    providers: [VisitsService]
})

export class UtableComponent implements OnInit {

    allData: any = [];
    users: any = [];
    date: string;
    time: string;
    today: string;
    isToday: boolean = false;

    collapsed: boolean = false;
    wideScale: boolean = false;

    private dateid: number;
    private subscription: Subscription;

    maxToday: Date = new Date(2017, 9, 12);
    minDay: Date = new Date(2017, 9, 10);

    curPage: string = 'table';

    constructor( private router: Router, private visitsService: VisitsService, private activateRoute: ActivatedRoute ) {
        this.subscription = activateRoute.params.subscribe((params)=>{
            this.dateid = params['dateid'];
            this.getU4T();
            this.startTableBuild();
            //this.startTableBuild1();
        });
    }

    ngOnInit() {
        //this.userInfo = this.visitsService.getPermissions();
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

    /*startTableBuild1() {
        this.visitsService.getVisits1(this.dateid).subscribe((data) => {
            console.log (data);
        });
    }*/
    
    getU4T() {
        this.visitsService.getAllUsers4T().subscribe((data) => {
            //console.log (data);
        });
    }

    startTableBuild() {
        this.visitsService.getVisits(this.dateid).subscribe((data) => {
            this.users = data[0];
            this.date = data[1];
            this.time = data[2];
            this.today = this.visitsService.checkToday(this.date);
            if (this.today != '') this.isToday = true;
        });
    }

    collapseTable() {
        this.collapsed = !this.collapsed;
    }

    changeTL() {
        this.wideScale = !this.wideScale;
    }

    addNewDate(event) {
        let chDate = event.value;
        let formattedDate = (chDate.getDate() + '-' + (chDate.getMonth() + 1) + '-' + chDate.getFullYear());
        setTimeout(() => {
            this.router.navigate(['timeline/' + formattedDate]);
        }, 500);
    }

    refreshTable() {
        this.getU4T();
        this.startTableBuild();
    }

}
