import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SettingsService } from './usettings.service';
import { HauntService } from '../haunt.service';

@Component({
  selector: 'usettings',
  templateUrl: './usettings.component.html',
  styleUrls: ['./usettings.component.css'],
  providers: [ SettingsService ]
})

export class UsettingsComponent implements OnInit {

  users: any = [];
  dpts: any = [];

  curPage: string = 'settings';

  constructor(private settingsService: SettingsService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    /*let int = setInterval(() => {
      if ( (this.hauntService.getUserSettings().length != 0) && (this.hauntService.getDpts().length != 0) ) {
        clearInterval(int);
        this.users = this.hauntService.getUserSettings();
        this.dpts = this.hauntService.getDpts();
      }
    }, 10);*/
    this.settingsService.getDpts().subscribe((data)=>{
      this.dpts = data;
    });
    this.settingsService.getUsers().subscribe((data)=>{
      this.users = data;
    });
  }

  addNewUser() {
    this.users.push({
      _id: "",
      cardid: "",
      dpt: "",
      name: "",
      pass: "111111",
      role: "",
      shortName: "",
      edited: false,
      errors: false
    });
  }

  addNewDpt() {
    let newPos = 0;
    this.dpts.forEach(element => {
      if (element.pos > newPos) newPos = element.pos;
    });
    newPos++;
    this.dpts.push({
      _id: "",
      pos: newPos,
      address: "",
      name: ""
    });
  }

  unsetUser(num) {
    if (this.users[num]._id != '') {
      if (confirm('Are you sure to remove user?')) {
        this.settingsService.delUser(this.users[num]._id).subscribe((data) => { 
          if (data.msg == 'Deleted') {
            this.users.splice(num, 1);
            this.snackBar.open('User was removed from database', '', {
              duration: 2000,
            });
          }});
      }
    }
  }

  unsetDpt(num) {
    if (confirm('Are you sure to remove department?')) {
      this.settingsService.delDpt(this.dpts[num]._id).subscribe((data) => { 
        if (data.msg == 'Deleted') {
          this.dpts.splice(num, 1);
          this.snackBar.open('Department was removed from database', '', {
            duration: 2000,
          });
      }});
    }
  }

  updateUser(num) {
    let uInfo = this.users[num];
    if ((uInfo.cardid == '')||(uInfo.name == '')||(uInfo.shortName == '')||(uInfo.role == '')||(uInfo.dpt == '')) {
      this.users[num].errors = true;
    } else {
      this.users[num].errors = false;
      this.settingsService.updUser(this.users[num]).subscribe((data)=>{ if (data.msg == 'OK') {
        this.users[num].edited = false;
        this.snackBar.open('User\'s settings were updated successfully', '', {
          duration: 2000,
        });
      }});
    }
  }
  
  updateDpt(num) {
    let dptInfo = this.dpts[num];
    if ((dptInfo.name == '')||(dptInfo.address == '')) {
      this.dpts[num].errors = true;
    } else {
      this.dpts[num].errors = false;
      this.settingsService.updDpt(this.dpts[num]).subscribe((data)=>{ if (data.msg == 'OK') {
        this.dpts[num].edited = false;
        this.snackBar.open('Department\'s settings were updated successfully', '', {
          duration: 2000,
        });
      }});
    }
  }

  userSaveToggle(num) {
    this.users[num].edited = true;
  }

  dptSaveToggle(num) {
    this.dpts[num].edited = true;
  }

  resetPass(num) {
    if (confirm('Are you sure to reset user\'s password?')) {
      this.settingsService.resetPswd(this.users[num]).subscribe((data)=>{ if (data.msg == 'Dropped') {
        this.snackBar.open('User password was dropped to "111111"', '', {
          duration: 2000,
        });
      }});
    }
  }

}
