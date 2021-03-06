import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HauntService } from '../haunt.service';
import { uVisits } from './uvisits';

@Injectable()

export class VisitsService {

    lastUpd : number = 0;
    usrs4T : any;

    constructor (private http: Http, private hauntService: HauntService) {}

    getAllUsers4T() : Observable<any> {
        let numb : string;
        if (this.hauntService.permissions.show) {
            numb = 'all';
        } else {
            numb = this.hauntService.permissions.shortName;
        }
        return this.http.get('http://localhost:3000/api/users4t/' + numb).map((resp: Response) => {
            let usrs = resp.json()[0];
            let dpts = resp.json()[1];
            for (let i in usrs) {
                for (let j in dpts) {
                    if (usrs[i].dpt == dpts[j].pos) {
                        usrs[i].dpt = dpts[j].name;
                        break;
                    }
                }
            }
            this.usrs4T = usrs;
            return usrs;
        });
    }
    
    /*getVisits1(date_id) : Observable<any[]> {
        if (!date_id) {
            date_id = this.parsedToday();
        } else {
            date_id = this.parsedDate(date_id);
        }
        return this.http.get('http://localhost:3000/api/visits/' + date_id).map((resp: Response) => {
            let encodedVisits = resp.json();
            return encodedVisits;
        });
    }*/
    
    getVisits(date_id) : Observable<any[]> {
        //if (!date_id) date_id = '12-10-2017'; 
        //return this.http.get('assets/visits_' + date_id + '.json').map((resp: Response) => {
        if (!date_id) {
            date_id = this.parsedToday();
        } else {
            date_id = this.parsedDate(date_id);
        }
        return this.http.get('http://localhost:3000/api/visits/' + date_id).map((resp: Response) => {
            let userList = resp.json().visits;
            let curDate = resp.json().date;
            let curTime = resp.json().lastUpd;

            // Checks if today
            let ifToday = this.checkToday(curDate);
            if (ifToday != '') {
                this.lastUpd = this.parseToMins(curTime);
            } else {
                this.lastUpd = 0;
            }

            let users : uVisits[] = [];

            //let settings = this.hauntService.allUserSettings;
            let settings = this.usrs4T;

            for (let i in settings) {
                let foundU: boolean = false;
                for (let j in userList) {
                    if (settings[i].cardid == userList[j].cardid) {
                        // Analyzing
                        let intsArr: any = this.analyzeInts(userList[j].visitsIn, userList[j].visitsOut);
                        users.push({
                            name: settings[i].name,
                            shName: settings[i].shortName,
                            dpt: settings[i].dpt,
                            came: intsArr.came,
                            left: intsArr.left,
                            sumIn: intsArr.in,
                            sumOut: intsArr.out,
                            allEvents: intsArr.intsInfo
                        });
                        foundU = true;
                        continue;
                    }
                }
                if (foundU == false) {
                    if (this.lastUpd == 0) {
                        users.push({
                            name: settings[i].name,
                            shName: settings[i].shortName,
                            dpt: settings[i].dpt,
                            came: '-',
                            left: '-',
                            sumIn: '0:00',
                            sumOut: '0:00',
                            allEvents: [{start: '0:00', end: '23:59', width: 100, msg: 'Out of Office'}]
                        });
                    } else {
                        users.push({
                            name: settings[i].name,
                            shName: settings[i].shortName,
                            dpt: settings[i].dpt,
                            came: '-',
                            left: '-',
                            sumIn: '0:00',
                            sumOut: '0:00',
                            allEvents: [
                                {start: '0:00', end: this.parseToText (this.lastUpd), width: this.countPercent(this.lastUpd), msg: 'Out of Office'},
                                {start: this.parseToText (this.lastUpd), end: '23:59', width: this.countPercent(1440 - this.lastUpd), msg: 'Untracked'}
                            ]
                        });
                    }
                }
            }

            return [users, curDate, curTime];
        });
    }

    // Analyzing
    analyzeInts(Ins, Outs) {
        let sumArr: any = [];
        for (let i = 0; i < Ins.length; i++) {
            sumArr.push({time: this.parseToMins(Ins[i]), type: 'in'})
        }
        for (let i = 0; i < Outs.length; i++) {
            sumArr.push({time: this.parseToMins(Outs[i]), type: 'out'})
        }
        let sortedArr: any = this.sortByTime(sumArr);
        let fullTL: any = this.createReport(sortedArr);
        return fullTL;
    }

    // Convert values
    parseToMins (val) : number {
        let timeArr: string[] = val.split(':');
        let timeNum: number = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
        return timeNum;
    }

    parseToText (val) : string {
        let mins = val%60;
        let hrs = (val - mins)/60;
        if (mins < 10) {
            return hrs + ':0' + mins;
        } else {
            return hrs + ':' + mins;
        }
    }

    // Sort array by values
    sortByTime(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (arr[i].time < arr[j].time) {
                    let newVal:any = arr[i];
                    arr[i] = arr[j];
                    arr[j] = newVal;
                }
            }
        }
        return arr;
    }

    countPercent(val) {
        return (val/14.4).toFixed(2);
    }

    checkWidth(arr) {
        let sum: number = 0;
        for (let i in arr) {
            sum += parseFloat(arr[i].width);
        }
        if (sum > 100) {
            let diff: number = parseFloat((sum - 100).toFixed(2));
            arr[arr.length - 1].width = (arr[arr.length - 1].width - diff).toFixed(2);
        }
        // Sometimes throw > 100 - todo
        return arr;
    }

    // Creating Report
    createReport(arr) {
        if (arr.length == 0) {
            if (this.lastUpd == 0) {
                return {
                    intsInfo: [{start: '0:00', end: '23:59', width: 100, msg: 'Out of Office'}],
                    came: '-',
                    left: '-',
                    in: '0:00',
                    out: '0:00'
                }
            } else {
                return {
                    intsInfo: [
                        {start: '0:00', end: this.parseToText (this.lastUpd), width: this.countPercent(this.lastUpd), msg: 'Out of Office'},
                        {start: this.parseToText (this.lastUpd), end: '23:59', width: this.countPercent(1440 - this.lastUpd), msg: 'Untracked'}
                    ],
                    came: '-',
                    left: '-',
                    in: '0:00',
                    out: '0:00'
                }
            }
        }
        if (arr.length == 1) {
            if (arr[0].type == 'in') {
                if (this.lastUpd == 0) {
                    return {
                        intsInfo: [
                            {start: '0:00', end: this.parseToText (arr[0].time), width: this.countPercent(arr[0].time), msg: 'Out of Office'},
                            {start: this.parseToText (arr[0].time), end: '23:59', width: this.countPercent(1440 - arr[0].time), msg: 'Unknown'}
                        ],
                        came: this.parseToText (arr[0].time),
                        left: '?',
                        in: '0:00',
                        out: '0:00'
                    }
                } else {
                    return {
                        intsInfo: [
                            {start: '0:00', end: this.parseToText (arr[0].time), width: this.countPercent(arr[0].time), msg: 'Out of Office'},
                            {start: this.parseToText (arr[0].time), end: this.parseToText (this.lastUpd), width: this.countPercent(this.lastUpd - arr[0].time), msg: 'In office'},
                            {start: this.parseToText (this.lastUpd), end: '23:59', width: this.countPercent(1440 - this.lastUpd), msg: 'Untracked'}
                        ],
                        came: this.parseToText (arr[0].time),
                        left: '?',
                        in: this.parseToText (this.lastUpd - arr[0].time), // '0:00' old state on 21.11.2017
                        out: '0:00'
                    }
                }
            }
            if (arr[0].type == 'out') {
                if (this.lastUpd == 0) {
                    return {
                        intsInfo: [
                            {start: '0:00', end: this.parseToText (arr[0].time), width: this.countPercent(arr[0].time), msg: 'Unknown'},
                            {start: this.parseToText (arr[0].time), end: '23:59', width: this.countPercent(1440 - arr[0].time), msg: 'Out of Office'}
                        ],
                        came: '?',
                        left: this.parseToText (arr[0].time),
                        in: '0:00',
                        out: '0:00'
                    }
                } else {
                    return {
                        intsInfo: [
                            {start: '0:00', end: this.parseToText (arr[0].time), width: this.countPercent(arr[0].time), msg: 'Unknown'},
                            {start: this.parseToText (arr[0].time), end: this.parseToText (this.lastUpd), width: this.countPercent(this.lastUpd - arr[0].time), msg: 'Out of Office'},
                            {start: this.parseToText (this.lastUpd), end: '23:59', width: this.countPercent(1440 - this.lastUpd), msg: 'Untracked'}
                        ],
                        came: '?',
                        left: this.parseToText (arr[0].time),
                        in: '0:00',
                        out: '0:00'
                    }
                }
            }
        }
        let full: any = {
            intsInfo: [],
            came: '?',
            left: '?',
            in: '',
            out: ''
        };
        let sumInOffice: number = 0;
        let sumOutOffice: number = 0;
        for (let i = 0; i < arr.length; i++) {
            if (i == 0) {
                if (arr[0].type == 'in') {
                    full.intsInfo.push({start: '0:00', end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time), msg: 'Out of Office'});
                    full.came = this.parseToText (arr[0].time);
                } else {
                    full.intsInfo.push({start: '0:00', end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time), msg: 'Unknown'});
                }
                continue;
            }
            if (i == (arr.length - 1)) {
                if (arr[i].type == 'out') {
                    if (this.lastUpd == 0) {
                        if (arr[i - 1].type == 'in') {
                            full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'In office'});
                            sumInOffice += (arr[i].time - arr[i - 1].time);
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: '23:59', width: this.countPercent(1440 - arr[i].time), msg: 'Out of Office'});
                            full.left = this.parseToText (arr[i].time);
                        } else {
                            full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'Unknown'});
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: '23:59', width: this.countPercent(1440 - arr[i].time), msg: 'Unknown'});
                        }
                    } else {
                        if (arr[i - 1].type == 'in') {
                            full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'In office'});
                            sumInOffice += (arr[i].time - arr[i - 1].time);
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: this.parseToText (this.lastUpd), width: this.countPercent(this.lastUpd - arr[i].time), msg: 'Out of Office'});
                            sumOutOffice += (this.lastUpd - arr[i].time);
                            full.intsInfo.push({start: this.parseToText (this.lastUpd), end: '23:59', width: this.countPercent(1440 - this.lastUpd), msg: 'Untracked'});
                            //full.left = this.parseToText (arr[i].time);
                        } else {
                            full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'Unknown'});
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: this.parseToText (this.lastUpd), width: this.countPercent(this.lastUpd - arr[i].time), msg: 'Out of Office'});
                            sumOutOffice += (this.lastUpd - arr[i].time);
                            full.intsInfo.push({start: this.parseToText (this.lastUpd), end: '23:59', width: this.countPercent(1440 - this.lastUpd), msg: 'Untracked'});
                        }
                    }
                } else {
                    if (this.lastUpd == 0) {
                        if (arr[i - 1].type == 'out') {
                            full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'Out of Office'});
                            sumOutOffice += (arr[i].time - arr[i - 1].time);
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: '23:59', width: this.countPercent(1440 - arr[i].time), msg: 'Unknown'});
                        } else {
                            full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'Unknown'});
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: '23:59', width: this.countPercent(1440 - arr[i].time), msg: 'Unknown'});
                        }
                    } else {
                        if (arr[i - 1].type == 'out') {
                            full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'Out of Office'});
                            sumOutOffice += (arr[i].time - arr[i - 1].time);
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: this.parseToText (this.lastUpd), width: this.countPercent(this.lastUpd - arr[i].time), msg: 'In office'});
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: '23:59', width: this.countPercent(1440 - this.lastUpd), msg: 'Untracked'});
                            sumInOffice += (this.lastUpd - arr[i].time);
                        } else {
                            full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'Unknown'});
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: this.parseToText (this.lastUpd), width: this.countPercent(this.lastUpd - arr[i].time), msg: 'In office'});
                            sumInOffice += (this.lastUpd - arr[i].time);
                            full.intsInfo.push({start: this.parseToText (arr[i].time), end: '23:59', width: this.countPercent(1440 - this.lastUpd), msg: 'Untracked'});
                        }
                    }
                }
                continue;
            }
            if (arr[i].type == 'out') {
                if (arr[i - 1].type == 'in') {
                    full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'In office'});
                    sumInOffice += (arr[i].time - arr[i - 1].time);
                } else {
                    full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'Unknown'});
                }
            }
            if (arr[i].type == 'in') {
                if (arr[i - 1].type == 'out') {
                    full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'Out of Office'});
                    sumOutOffice += (arr[i].time - arr[i - 1].time);
                } else {
                    full.intsInfo.push({start: this.parseToText (arr[i - 1].time), end: this.parseToText (arr[i].time), width: this.countPercent(arr[i].time - arr[i - 1].time), msg: 'Unknown'});
                }
            }
        }
        full.in = this.parseToText(sumInOffice);
        full.out = this.parseToText(sumOutOffice);
        full.intsInfo = this.checkWidth(full.intsInfo);

        return full;
    }

    // Check if Today
    checkToday(date) {
        let today = new Date();
        let day: string;
        let month: string;
        let dd: number = today.getDate();
        let mm: number = today.getMonth();
        let yyyy: string = today.getFullYear().toString();
        if (mm < 9) {
            month = '0' + (mm + 1);
        } else {
            month = (mm + 1).toString();
        }
        if (dd < 10) {
            day = '0' + dd;
        } else {
            day = dd.toString();
        }
        let checkDate = day + '.' + month + '.' + yyyy;
        if (checkDate == date) {
            return 'today, ';
        } else {
            return '';
        }
    }

    // Parse Today YYYY-MM-DD
    parsedToday() {
        let today = new Date();
        let day: string;
        let month: string;
        let dd: number = today.getDate();
        let mm: number = today.getMonth();
        let yyyy: string = today.getFullYear().toString();
        if (mm < 9) {
            month = '0' + (mm + 1);
        } else {
            month = (mm + 1).toString();
        }
        if (dd < 10) {
            day = '0' + dd;
        } else {
            day = dd.toString();
        }
        return yyyy + '-' + month + '-' + day ;
    }

    // Parse not today
    parsedDate(date) {
        let parsedArr = (date.split('-'));
        return parsedArr[2] + '-' + parsedArr[1] + '-' + parsedArr[0];
    }

}