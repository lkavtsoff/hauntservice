import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute} from '@angular/router';
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

    collapsed: boolean = false;
    wideScale: boolean = false;

    private dateid: number;
    private subscription: Subscription;

    constructor(private visitsService: VisitsService, private activateRoute: ActivatedRoute) {
        this.subscription = activateRoute.params.subscribe((params)=>{
            this.dateid=params['dateid'];
            this.startTableBuild();
        });
    }

    ngOnInit() {
        //this.userInfo = this.visitsService.getPermissions();
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

    startTableBuild() {
        this.visitsService.getVisits(this.dateid).subscribe((data) => {
            this.users = data[0];
            this.date = data[1];
            this.time = data[2];
            this.today = this.visitsService.checkToday(this.date);
        });
    }

    collapseTable() {
        /*this.collapsed = true;*/
        console.log (this.collapsed);
    }

}
