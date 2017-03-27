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
            phonemeId = navParams.get('phonemeId');
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
                        type: LessonType.Listening,
                        value: 0
                    },
                    {
                        type: LessonType.Speaking,
                        value: 0
                    }]
                },
                {
                    phonemeId: phonemeId,
                    level: 2,
                    data: [{
                        type: LessonType.Listening,
                        value: 0
                    },
                    {
                        type: LessonType.Speaking,
                        value: 0
                    }],
                },
                {
                    phonemeId: phonemeId,
                    level: 3,
                    data: [
                        {
                            type: LessonType.Speaking,
                            value: 0
                        }]
                }
        ]; // stats
        statsModel.GetFilteredStats(() => {return true;}, 20).then((data) => {
            this.totalStats = data;
        }).then(() => {
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Listening, 1, 0).then((data) => {
                if(data.length > 0) {
                    this.stats[0].data[0].value = Math.ceil(data[0]*100)/100;
                }
            })
        }).then(() => {
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Speaking, 1, 0).then((data) => {
                if(data.length > 0) {
                    this.stats[0].data[1].value = Math.ceil(data[0]*100)/100;
                }
            })
        }).then(() => {
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Listening, 2, 0).then((data) => {
                if(data.length > 0) {
                    this.stats[1].data[0].value = Math.ceil(data[0]*100)/100;
                }
            })
        }).then(() => {
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Speaking, 2, 0).then((data) => {
                if(data.length > 0) {
                    this.stats[1].data[1].value = Math.ceil(data[0]*100)/100;
                }
            })
        }).then(() => {
            return statsModel.GetPhonemeStatsByLevel(phonemeId, LessonType.Speaking, 3, 0).then((data) => {
                if(data.length > 0) {
                    this.stats[2].data[0].value = Math.ceil(data[0]*100)/100;
                }
            })
        }).then(() => {this.loaded = true});
    }

    getDetailsView(phonemeId: number, type: LessonType, level: number) {
        Statistics.GetStatistics().GetPhonemeStatsByLevel(phonemeId, type, level, 1).then((stats) => {
            this.detailsObj = {
                title: 'Level ' + level + ' Accuracy - ' + (type === LessonType.Listening ? 'Listening Mode' : 'Speaking Mode'),
                data: stats
            }
            this.view = this.viewModes.details;
        });
    }

    getOverview() {
        this.view = this.viewModes.overview;
    }
    ngAfterViewInit() {
    }
}
