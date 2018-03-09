import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//import { HauntService } from '../haunt.service';
import { uProfile } from '../uprofile';

@Injectable()

export class SettingsService {

    constructor ( private http: Http ) {}
    
    getUsers(): any {
        return this.http.get('http://localhost:3000/api/users').map((resp: Response) => {
            let encodedSet = resp.json();
            encodedSet.forEach(element => {
                element.edited = false;
                element.errors = false;
            });
            return encodedSet;
        });
    }

    getDpts() {
        return this.http.get('http://localhost:3000/api/dpts').map((resp: Response) => {
            let encodedSet = resp.json();
            encodedSet.forEach(element => {
                element.edited = false;
                element.errors = false;
            });
            return encodedSet;
        });
    }

    updUser(uObj) {
        //console.log (uObj);
        let body = JSON.stringify(uObj);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8'});
        let options = new RequestOptions({ headers: headers });
        if (uObj.pass == '111111') {
            return this.http.put('http://localhost:3000/api/saveuser', body, options).map( (resp:Response) => {return resp.json();} );
        } else {
            return this.http.put('http://localhost:3000/api/upduser', body, options).map( (resp:Response) => {return resp.json();} );
        }
    }

    updDpt(dObj) {
        let body = JSON.stringify(dObj);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8'});
        let options = new RequestOptions({ headers: headers });
        if (dObj._id == '') {
            return this.http.put('http://localhost:3000/api/savedpt', body, options).map( (resp:Response) => {return resp.json();} );
        } else {
            return this.http.put('http://localhost:3000/api/upddpt', body, options).map( (resp:Response) => {return resp.json();} );
        }
    }

    delUser(id) {
        return this.http.delete('http://localhost:3000/api/deluser/' + id).map( (resp:Response) => {return resp.json();} );
    }

    delDpt(id) {
        return this.http.delete('http://localhost:3000/api/deldpt/' + id).map( (resp:Response) => {return resp.json();} );
    }

    resetPswd(uObj) {
        let body = JSON.stringify(uObj);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8'});
        let options = new RequestOptions({ headers: headers });
        return this.http.put('http://localhost:3000/api/respsw', body, options).map( (resp:Response) => {return resp.json();} );
    }

}