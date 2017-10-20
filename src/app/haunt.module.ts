import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes , RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule, MatRadioModule, MatSelectModule, MatInputModule, MatTooltipModule } from '@angular/material';

import { HauntComponent } from './haunt.component';
import { HheaderComponent } from './hheader/hheader.component';
import { HfooterComponent } from './hfooter/hfooter.component';
import { UtableComponent } from './utable/utable.component';
import { UloginComponent } from './ulogin/ulogin.component';
import { UsettingsComponent } from './usettings/usettings.component';
import { TimelineComponent } from './utable/timeline/timeline.component';
import { HauntGuard } from './haunt.guard';
import { HauntService } from './haunt.service';

const hauntRoutes: Routes = [
    {path: 'timeline', component: UtableComponent, canActivate: [HauntGuard]},
    {path: 'timeline/:dateid', component: UtableComponent, canActivate: [HauntGuard]},
    {path: 'login', component: UloginComponent},
    {path: 'settings', component: UsettingsComponent, canActivate: [HauntGuard]},
    {path: '**', redirectTo: '/'}
];

@NgModule ({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(hauntRoutes),
        BrowserAnimationsModule,
        MatIconModule,
        MatRadioModule,
        MatSelectModule,
        MatInputModule,
        MatTooltipModule
    ],
    declarations: [
        HauntComponent,
        HheaderComponent,
        HfooterComponent,
        UtableComponent,
        UloginComponent,
        UsettingsComponent,
        TimelineComponent
    ],
    providers: [
        HauntGuard,
        HauntService
    ],
    bootstrap: [
        HauntComponent
    ]
})

export class HauntModule {

}