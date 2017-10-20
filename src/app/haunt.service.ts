import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { uProfile } from './uprofile';

@Injectable()

export class HauntService {

    autorized: boolean = false;
    permissions: any = {
        autorized: false,
        show: '',
        rules: '',
        fullName: ''
    };

    allUserSettings: uProfile[] = [];
    allDpts: any = [];

    delim: string = '&';

    constructor (private http: Http) {}
    
    getUserProfiles() {
        return this.http.get('assets/settings.json').map((resp: Response) => {
            let encodedSet = resp.json().permissions;
            for (let i=0; i < encodedSet.length; i++) {
                encodedSet[i].pass = this.decodeStr(encodedSet[i].pass);
            }
            this.allUserSettings = encodedSet;
            this.allDpts = resp.json().departments;
            return [resp.json().permissions, resp.json().departments];
        });
    }

    getUserSettings() {
        return this.allUserSettings;
    }

    getDpts() {
        return this.allDpts;
    }

    getUserInfo() {
        return this.permissions;
    }

    decodeStr(str) {
        let passEnArr = str.split(this.delim);
        let passDecoded = '';
        for (let i=0; i < passEnArr.length; i++) {
            passDecoded += String.fromCharCode((parseInt(passEnArr[i], 16))/3);
        }
        return passDecoded;
    }

    encodeStr(str) {
        let passEncoded = '';
        for (let i=0; i < str.length; i++) {
            if (i == 0) {
                passEncoded += (str.charCodeAt(i) * 3).toString(16);
            } else {
                passEncoded += this.delim + (str.charCodeAt(i) * 3).toString(16);
            }
        }
        return passEncoded;
    }

}