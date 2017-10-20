import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Rx";

import { HauntService } from './haunt.service';

@Injectable()

export class HauntGuard implements CanActivate{

    constructor ( private hauntService: HauntService, private router: Router ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {
        /*if (this.hauntService.autorized) {
            return true;
        } else {
            return false;
        }*/
        return true;
    }

}