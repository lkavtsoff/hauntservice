import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { uProfile } from './uprofile';

@Injectable()

export class HauntService {

    autorized: boolean = false;
    permissions: any = {
        autorized: false,
        shortName: "",
        show: false
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
        /*return this.http.get('http://localhost:3000/api/users').map((resp: Response) => {
            let encodedSet = resp.json();
            for (let i=0; i < encodedSet.length; i++) {
                encodedSet[i].pass = this.decodeStr(encodedSet[i].pass);
            }
            this.allUserSettings = encodedSet;
            return resp.json().permissions;
            //this.allDpts = resp.json().departments;
            
            //return [resp.json().permissions, resp.json().departments];
        });*/
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

    validatePswd(pswd) {
        let correct = pswd.search( /^[0-9a-zA-Z!@#$%^&*-_]{6,}/ );
        if (correct == 0) {
            return true;
        } else {
            return false;
        }
    }

    changePswd(pswd) {
        let body = JSON.stringify({
            shortName: this.permissions.shortName,
            newPswd: btoa(pswd)
        });
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8'});
        let options = new RequestOptions({ headers: headers });
        return this.http.put('http://localhost:3000/api/updpswd', body, options).map( (resp:Response) => {return resp.json();} );
    }

}