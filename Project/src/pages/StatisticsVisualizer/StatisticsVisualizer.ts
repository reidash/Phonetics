import { Chart } from 'chart.js';
import { ViewChild, Component, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

@Component({
    selector: 'page-StatisticsVisualizer',
    templateUrl: 'StatisticsVisualizer.html'
})

export class StatisticsVisualizer implements AfterViewInit {
    private title: String = 'Statistics';
    private loaded: boolean = false;
    private stats: any[];

    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, elRef: ElementRef) {
       //fake data for testing
        this.stats = [
            {
                phonemeId: 0,
                level: 1,
                data: [{
                    type: 'Listening',
                    value: 0.85
                },
                {
                    type: 'Speaking',
                    value: 0.75
                }]
            },
            {
                phonemeId: 0,
                level: 2,
                data: [{
                    type: 'Listening',
                    value: 0.72
                },
                {
                    type: 'Speaking',
                    value: 0.60
                }],
            },
            {
                phonemeId: 0,
                level: 3,
                data: [
                    {
                        type: 'Speaking',
                        value: 0.25
                    }]
            }
        ];
    }

    ngAfterViewInit() {
    }
}
