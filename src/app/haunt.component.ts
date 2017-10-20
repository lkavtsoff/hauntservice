import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HauntService } from './haunt.service';
import { uProfile } from './uprofile';

@Component ({
    selector: 'haunt-cont',
    templateUrl: './haunt.component.html',
    styleUrls: ['./haunt.component.css'],
    //providers: [HauntService]
})

export class HauntComponent implements OnInit {
    userProfiles: uProfile[] = [];

    constructor ( private hauntService: HauntService, private router: Router ) { }

    ngOnInit() {
        this.hauntService.getUserProfiles().subscribe((data)=>{this.userProfiles = data});
        this.router.navigate(['login']);
        /*if (this.hauntService.autorized == false) {
            this.router.navigate(['login']);
        } else {
            this.router.navigate(['timeline']);
        }*/
    }
}