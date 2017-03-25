import { Chart } from 'chart.js';
import { Input, ViewChild, Component, AfterViewInit, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

@Component({
    selector: 'component-donut',
    templateUrl: 'donut.component.html'
})

export class DonutComponent implements AfterViewInit {
    @Input() public value: number;

    private type: string = 'doughnut';
    private thresholds: any = {
        good: .7,
        moderate: .5,
        bad: 0
    };

    private colours: any = {
        good: '#77ae79',
        moderate: '#ff8000',
        bad: '#b30000',
        background: '#f4f4f4'
    };

    private options: any = {
        'cutoutPercentage': 90,
        'animation': {
            'animateScale': true,
            'animateRotate': false
        }
    };

    private charColours: string[] = [this.colours.background];

    @ViewChild('donut') donut: ElementRef;
    @ViewChild('label') label: ElementRef;

    constructor(public el: ElementRef) { }

    ngAfterViewInit() {

        let ctx = this.donut.nativeElement.getContext('2d');

        if (this.value < this.thresholds.moderate) {
            this.charColours.push(this.colours.bad);
        } else if (this.value < this.thresholds.good) {
            this.charColours.push(this.colours.moderate);
        } else {
            this.charColours.push(this.colours.good);
        }

        let valArray: number[] = [1 - this.value, this.value];
        let data = {
            datasets: [
                {
                    data: valArray,
                    backgroundColor: this.charColours
                }]
        };

        let chart = new Chart(
            ctx,
            {
                type: this.type,
                data: data,
                options: this.options
            }
        );

        this.label.nativeElement.style.color = this.charColours[1];
    }

}
