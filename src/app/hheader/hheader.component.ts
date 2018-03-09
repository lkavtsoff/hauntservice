import { Input, Component, OnInit } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { HauntService } from '../haunt.service';

@Component({
  selector: 'hheader',
  templateUrl: './hheader.component.html',
  styleUrls: ['./hheader.component.css']
})

export class HheaderComponent implements OnInit {

  userInfo: any;
  changingPass: boolean = false;
  newPswd: string;
  pswdErr: boolean = false;

  @Input() curPage: string;

  constructor( private hauntService: HauntService, private router: Router, public snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.userInfo = this.hauntService.getUserInfo();
  }

  logOutUser() {
    this.router.navigate(['login']);
  }

  openChPass() {
    this.changingPass = !this.changingPass;
  }

  closeChPass() {
    let changeConfirm = this.hauntService.validatePswd(this.newPswd);
    if (changeConfirm == true) {
      this.hauntService.changePswd(this.newPswd).subscribe((data)=>{ if (data.msg == 'Changed') {
        this.snackBar.open('Your password was changed successfully', '', {
          duration: 2000,
        });
        this.pswdErr = false;
        this.newPswd = '';
        this.changingPass = !this.changingPass;
      }});
    } else {
      this.pswdErr = true;
    }
  }

}
