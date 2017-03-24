import { Chart } from 'chart.js';
import { ViewChild, Component, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

@Component({
    selector: 'page-StatisticsVisualizer',
    templateUrl: 'StatisticsVisualizer.html'
})

export class StatisticsVisualizer implements AfterViewInit {
    private title: String = "Statistics";
    private loaded: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, elRef: ElementRef) {
    }

    ngAfterViewInit() {
    }
}
