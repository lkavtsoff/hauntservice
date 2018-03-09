import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { LoginService } from './ulogin.service';
import { HauntService } from '../haunt.service';
import { uProfile } from '../uprofile';

@Component({
  selector: 'ulogin',
  templateUrl: './ulogin.component.html',
  styleUrls: ['./ulogin.component.css'],
  providers: [LoginService]
})

export class UloginComponent implements OnInit {

  userName: string = '';
  userPass: string = '';
  denied: boolean = false;

  constructor ( private loginService: LoginService, private hauntService: HauntService, private router: Router ) { }

  ngOnInit() {

  }

  verifyUser(name, pass) {
    this.loginService.verifyUser(name, pass).subscribe((data)=>{
      if (data.autorized) {
        //console.log (data);
        this.hauntService.permissions.autorized = data.autorized;
        this.hauntService.permissions.shortName = data.shortName;
        if (data.role == 'admin') {
          this.hauntService.permissions.show = true;
        }
        this.router.navigate(['timeline']);
      } else {
        this.userName = '';
        this.userPass = '';
        this.denied = true;
      }
    });
  }

}
