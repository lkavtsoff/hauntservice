import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { LoginService } from './ulogin.service';
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

  constructor ( private loginService: LoginService, private router: Router ) { }

  ngOnInit() {

  }

  verifyUser(name, pass) {
    let access: boolean = this.loginService.verifyUser(name, pass);
    if (access) {
      this.router.navigate(['timeline']);
    } else {
      this.userName = '';
      this.userPass = '';
      this.denied = true;
    }
  }

}
