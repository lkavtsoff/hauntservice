import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HauntService } from '../haunt.service';
import { uProfile } from '../uprofile';

@Injectable()

export class LoginService {

    constructor (private http: Http, private hauntService: HauntService) {}

    verifyUser(name, pass) {
        let allUsersList: uProfile[] = this.hauntService.allUserSettings;
        for (let i in allUsersList) {
            if ( (allUsersList[i].shortName == name) || (allUsersList[i].name == name) ) {
                if (allUsersList[i].pass == pass) {
                    //console.log (allUsersList[i]);
                    this.hauntService.permissions.autorized = true;
                    this.hauntService.permissions.rules = allUsersList[i].rules;
                    this.hauntService.permissions.fullName = allUsersList[i].name;
                    this.hauntService.permissions.show = allUsersList[i].show;
                    //console.log (this.hauntService.permissions);
                    return true;
                }
            }
        }
        return false;
    }

}