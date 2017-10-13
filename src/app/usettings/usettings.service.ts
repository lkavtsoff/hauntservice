import { Injectable } from '@angular/core';

import { HauntService } from '../haunt.service';
import { uProfile } from '../uprofile';

@Injectable()

export class SettingsService {

    constructor ( private hauntService: HauntService ) {}
    
    getUsers() {
        return (this.hauntService.allUserSettings);
    }

    getDpts() {
        return (this.hauntService.allDpts);
    }

}