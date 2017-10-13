import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { uProfile } from './uprofile';

@Injectable()

export class HauntService {

    autorized: boolean = false;

    allUserSettings: uProfile[] = [];
    allDpts: any = [];

    constructor (private http: Http) {}
    
    getUserProfiles() {
        return this.http.get('assets/settings.json').map((resp: Response) => {
            //console.log (123);
            this.allUserSettings = resp.json().permissions;
            this.allDpts = resp.json().departments;
            //console.log (resp.json().permissions);
            return [resp.json().permissions, resp.json().departments];
        });
    }

}