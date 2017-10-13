import { Component, OnInit } from '@angular/core';

import { HauntService } from './haunt.service';
import { uProfile } from './uprofile';

@Component ({
    selector: 'haunt-cont',
    templateUrl: './haunt.component.html',
    styleUrls: ['./haunt.component.css'],
    providers: [HauntService]
})

export class HauntComponent implements OnInit {
    //userProfiles: uProfile[] = [];

    constructor ( private hauntService: HauntService ) { }

    ngOnInit() {
        this.hauntService.getUserProfiles().subscribe((data)=>{});
    }
}