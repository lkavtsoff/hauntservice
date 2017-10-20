import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HauntService } from '../haunt.service';

@Component({
  selector: 'hheader',
  templateUrl: './hheader.component.html',
  styleUrls: ['./hheader.component.css']
})

export class HheaderComponent implements OnInit {

  userInfo: any;

  constructor( private hauntService: HauntService, private router: Router ) { }

  ngOnInit() {
    this.userInfo = this.hauntService.getUserInfo();
  }

  logOutUser() {
    this.router.navigate(['login']);
  }

}
