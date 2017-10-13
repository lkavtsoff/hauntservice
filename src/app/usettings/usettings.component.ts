import { Component, OnInit } from '@angular/core';

//import { SettingsService } from './usettings.service';
import { HauntService } from '../haunt.service';

@Component({
  selector: 'usettings',
  templateUrl: './usettings.component.html',
  styleUrls: ['./usettings.component.css'],
  providers: [HauntService]
})

export class UsettingsComponent implements OnInit {

  users: any = [];
  dpts: any = [];

  constructor(private hauntService: HauntService) { }

  ngOnInit() {
    /*setTimeout(() => {
      //this.users = this.settingsService.getUsers();
      //this.dpts = this.settingsService.getDpts();
      this.users = this.hauntService.allUserSettings;
      this.dpts = this.hauntService.allDpts;
      console.log (this.hauntService.returnUsers(), this.hauntService.allDpts);
    }, 1000);*/
    this.hauntService.getUserProfiles().subscribe((data)=>{
      this.users = data[0];
      this.dpts = data[1];
    });
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
  }

  unsetUser(num) {
    this.users.splice(num, 1);
  }

  unsetDpt(num) {
    this.dpts.splice(num, 1);
  }

}
