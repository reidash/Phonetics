import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { ListeningController } from '../ListeningController/ListeningController';
import { SpeakingController } from '../SpeakingController/SpeakingController';
import { LessonsLoader } from '../../loaders/lessonsLoader';
import { lesson, LessonType, screenUnit } from '../../interfaces';
import { StatisticsVisualizer } from '../StatisticsVisualizer/StatisticsVisualizer';
import { Statistics } from '../../StatisticsModel';

declare var cordova: any;

@Component({
  selector: 'page-lessonsList',
  templateUrl: 'LessonsList.html'
})
export class LessonsList {
  private language: string;
  private lessonsLoader: LessonsLoader;
  private loaded: boolean = false;
  private lessons: lesson[];
  private mode: any = {
    listening: ListeningController,
    speaking: SpeakingController
  };
  private hasListeningDynamicList: boolean = false;
  private hasSpeakingDynamicList: boolean = false;

  constructor(public plt: Platform, public navCtrl: NavController, public params: NavParams) {
    this.language = params.get('user').nativeLang;

    this.plt.ready().then(() => {
      this.lessonsLoader = new LessonsLoader();
      this.lessonsLoader.getLessons(this.language)
        .then(resp => {
          this.lessons = resp;
          this.loaded = true;
        })
        .catch(e => console.log(e.message));

      Statistics.GetStatistics().GetDynamicList(LessonType.Listening).then((dynamicList: screenUnit[]) => {
        if (dynamicList.length > 0) {
          this.hasListeningDynamicList = true;
        }
      });
      Statistics.GetStatistics().GetDynamicList(LessonType.Speaking).then((dynamicList: screenUnit[]) => {
        if (dynamicList.length > 0) {
          this.hasSpeakingDynamicList = true;
        }
      });
    });
  }

  startDynamic(mode: any) {
    let type: LessonType = mode === this.mode.listening ? LessonType.Listening : LessonType.Speaking;
    Statistics.GetStatistics().GetDynamicList(type)
      .then((screenUnits) => {
        startSession(
          this,
          {
            phonemeId: 0,
            isDynamic: true,
            title: 'Challenge List',
            screenUnits: screenUnits
          },
          mode,
          0)
      });
  }

  startLevel3(index: number, mode = SpeakingController) {
    //generate array of randomized screenUnits
    //and navigate to ListeningMode, passing the array and lessons[index].name as title
    let numUnits = 20;
    let lessonFolder = this.lessons[index].path + '3';

    this.lessonsLoader.getScreenUnits(numUnits, lessonFolder)
      .then((screenUnits) =>
        startSession(
          this,
          {
            phonemeId: this.lessons[index].id,
            isDynamic: false,
            title: this.lessons[index].name,
            screenUnits: screenUnits
          },
          mode,
          3)
      );
  }

  startLevel1(index: number, mode: any) {
    if (!mode) {
      return;
    }

    //generate array of randomized screenUnits
    //and navigate to ListeningMode, passing the array and lessons[index].name as title
    let numUnits = 1;
    let lessonFolder = this.lessons[index].path + '1'; //todo: make a "constants" file for the random magic strings and numbers like this '1'

    this.lessonsLoader.getScreenUnits(numUnits, lessonFolder)
      .then((screenUnits) =>
        startSession(
          this,
          {
            phonemeId: this.lessons[index].id,
            isDynamic: false,
            title: this.lessons[index].name,
            screenUnits: screenUnits
          },
          mode,
          1)
      );
  }

  startLevel2(index: number, mode: any) {
    if (!mode) {
      return;
    }

    let numUnits = 20;
    let lessonFolder = this.lessons[index].path + '2';

    this.lessonsLoader.getScreenUnits(numUnits, lessonFolder)
      .then((screenUnits) =>
        startSession(
          this,
          {
            phonemeId: this.lessons[index].id,
            isDynamic: false,
            title: this.lessons[index].name,
            screenUnits: screenUnits
          },
          mode,
          2)
      )
  };

  goToStats(phonemeId: number, title: string) {
    let params = {
      phonemeId: phonemeId,
      lessonTitle: title
    };

    this.navCtrl.push(StatisticsVisualizer, params);
  }
}

function startSession(scope: LessonsList, params: any, mode: any, level: number) {
  if (!scope) {
    console.log("Err: " + "Tried to start session with no scope");
    return;
  }

  if (!params) {
    console.log("Err: " + "Tried to start session with no params");
    return;
  }

  if (!mode) {
    console.log("Err: " + "Tried to start session with no mode");
    return;
  }

  if (params.screenUnits.length < 1) {
    console.log("Err: Tried to start session with no screen units");
    return;
  }

  params.navParams = scope.params;
  let lessonType: LessonType = LessonType.Speaking;
  if (mode === ListeningController) {
    lessonType = LessonType.Listening;
  }
  console.log("Beginning statistics session for {phonemeId: ", params.phonemeId, ", type: ", lessonType, ", level:", level);

  Statistics.GetStatistics().StartSession(params.phonemeId, lessonType, level, params.isDynamic);

  scope.navCtrl.push(mode, params);
}