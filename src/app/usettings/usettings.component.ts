import { Component, OnInit } from '@angular/core';

//import { SettingsService } from './usettings.service';
import { HauntService } from '../haunt.service';

@Component({
  selector: 'usettings',
  templateUrl: './usettings.component.html',
  styleUrls: ['./usettings.component.css'],
  //providers: [HauntService]
})

export class UsettingsComponent implements OnInit {

  users: any = [];
  dpts: any = [];

  constructor(private hauntService: HauntService) { }

  ngOnInit() {
    let int = setInterval(() => {
      if ( (this.hauntService.getUserSettings().length != 0) && (this.hauntService.getDpts().length != 0) ) {
        clearInterval(int);
        this.users = this.hauntService.getUserSettings();
        this.dpts = this.hauntService.getDpts();
      }
    }, 10);
  }

  addNewUser() {
    this.users.push({
      cardid: "",
      dpt: "",
      name: "",
      pass: "",
      role: "",
      rules: "",
      shortName: "",
      show: ""
    });
  }

  addNewDpt() {
    this.dpts.push({
      address: "",
      name: ""
    });
    //console.log (this.dpts);
  }

  unsetUser(num) {
    this.users.splice(num, 1);
  }

  unsetDpt(num) {
    this.dpts.splice(num, 1);
  }

}
