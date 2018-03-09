import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HauntService } from '../haunt.service';
import { uProfile } from '../uprofile';

@Injectable()

export class LoginService {

    constructor (private http: Http, private hauntService: HauntService) {}

    verifyUser(name, pass) {
        /*let allUsersList: uProfile[] = this.hauntService.allUserSettings;
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
        return false;*/
        let body = JSON.stringify({name: name, pass: btoa(pass)});
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8'});
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:3000/api/user', body, options).map( (resp:Response) => {return resp.json();});
    }

}