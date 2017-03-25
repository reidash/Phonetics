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
    private viewModes: any = {
        overview: 0,
        detail: 1
    };
    private view: number = this.viewModes.overview;
    private detailsObj: any = null;
    private stats: any[];
    private totalStats: number[];

    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, elRef: ElementRef) {
        
        //todo check navParams for phonemeId and load data for only that phonemeId
        if(navParams && navParams.get('phonemeId')) {
            console.log(navParams.get('phonemeId'));
        }

        //fake data for testing
        this.totalStats = [0.35, 0.4, 0.5, 0.6, 0.5, 0.7, 0.75, 0.8];
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

    getDetailsView(phonemeId: number, type: string, level: number) {
        this.detailsObj = {
            title: 'Level 1 Accuracy - Listening Mode',
            data: [0.35, 0.4, 0.37, 0.49, 0.5, 0.6, 0.75, 0.8]
        }

        this.view = this.viewModes.details;
    }

    getOverview() {
        this.view = this.viewModes.overview;
    }
    ngAfterViewInit() {
    }
}
