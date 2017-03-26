import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Statistics } from '../../StatisticsModel';
import { LessonType } from '../../interfaces';

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
        console.log(navParams);

        //todo check navParams for phonemeId and load data for only that phonemeId
        let phonemeId: number = 0;
        if(navParams && navParams.get('phonemeId')) {
            console.log(navParams.get('phonemeId'));
        } else {
            console.log("Error: phonemeId not provided as navParam for StatisticsVisualizer");
        }

        if(navParams && navParams.get('lessonTitle')) {
            this.title = navParams.get('lessonTitle');
        } else {
            console.log("Error: lessonTitle not provided as navParam for StatisticsVisualizer");
        }

        //Default values 
        let statsModel = Statistics.GetStatistics();
        this.totalStats = [0, 0, 0, 0, 0, 0, 0, 0];
        this.stats = [
                {
                    phonemeId: phonemeId,
                    level: 1,
                    data: [{
                        type: 'Listening',
                        value: 0.4
                    },
                    {
                        type: 'Speaking',
                        value: 0
                    }]
                },
                {
                    phonemeId: 0,
                    level: 2,
                    data: [{
                        type: 'Listening',
                        value: 0
                    },
                    {
                        type: 'Speaking',
                        value: 0
                    }],
                },
                {
                    phonemeId: 0,
                    level: 3,
                    data: [
                        {
                            type: 'Speaking',
                            value: 0
                        }]
                }
        ]; // stats
        statsModel.GetFilteredStats(() => {return true;}, Math.floor(statsModel.GetSessionCount()/20)).then((data) => {
            console.log(JSON.stringify(data));
            this.totalStats = data;
        }).then(() => {
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Listening, 1, 0).then((data) => {
                console.log(data);
                if(data.length > 0) {
                    this.stats[0].data[0].value = data[0];
                }
            })
        }).then(() => {
            let type: LessonType = LessonType.Speaking;
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Speaking, 1, 0).then((data) => {
                console.log(data);
                if(data.length > 0) {
                    this.stats[0].data[1].value = data[0];
                }
            })
        }).then(() => {
            let type: LessonType = LessonType.Listening;
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Listening, 2, 0).then((data) => {
                console.log(data);
                if(data.length > 0) {
                    this.stats[1].data[0].value = data[0];
                }
            })
        }).then(() => {
            let type: LessonType = LessonType.Speaking;
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Speaking, 2, 0).then((data) => {
                console.log(data);
                if(data.length > 0) {
                    this.stats[1].data[1].value = data[0];
                }
            })
        }).then(() => {
            let type: LessonType = LessonType.Speaking;
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Speaking, 3, 0).then((data) => {
                console.log(data);
                if(data.length > 0) {
                    this.stats[2].data[0].value = data[0];
                }
            })
        }).then(() => {this.loaded = true});
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
