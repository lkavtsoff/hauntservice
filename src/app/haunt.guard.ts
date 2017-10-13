import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Rx";

import { HauntService } from './haunt.service';

@Injectable()

export class HauntGuard implements CanActivate{

    constructor ( private hauntService: HauntService, private router: Router ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {
        console.log (this.hauntService.autorized);
        /*if (this.hauntService.autorized == false) {
           this.router.navigate(['/login']);
        } else {
           return true;
        }*/
        return true;
    }
}