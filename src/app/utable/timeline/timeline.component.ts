import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})

export class TimelineComponent implements OnInit {

  percents: any;

  @Input () allEvents: any;

  constructor () {}

  ngOnInit() {
    this.percents = this.allEvents;
  }

  getClass(msg) {
    if (msg == 'Out of Office') return 'yellow';
    if (msg == 'In office') return 'green';
    if (msg == 'Unknown') return 'brick';
    if (msg == 'Untracked') return 'gray';
  }

}
