import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { ListeningMode } from '../ListeningMode/ListeningMode';
import { SpeakingMode } from '../SpeakingMode/SpeakingMode';
import { LessonsLoader } from '../../loaders/lessonsLoader';
import { lesson } from '../../interfaces';

declare var cordova: any;

@Component({
  selector: 'page-phonemeList',
  templateUrl: 'PhonemeList.html'
})
export class PhonemeList {
  private language: string;
  private lessonsLoader: any;
  private loaded: boolean = false;
  private lessons: lesson[];
  private mode: any = {
    listening: ListeningMode,
    speaking: SpeakingMode
  };

  constructor(public plt: Platform, public navCtrl: NavController, public params: NavParams) {
    this.language =  params.get('user').nativeLang;

    this.plt.ready().then(() => {
      this.lessonsLoader = new LessonsLoader();
      this.lessonsLoader.getLessons(this.language)
        .then(resp => {
          this.lessons = resp.lessons;
        })
        .catch(e => console.log(e.message));
      this.loaded = true;
    });
  }

  startLevel3 = function (index: number, mode = SpeakingMode) {
    //generate array of randomized screenUnits
    //and navigate to ListeningMode, passing the array and lessons[index].name as title
    let numUnits = 20;
    let lessonFolder = this.lessons[index].path + '3';

    this.lessonsLoader.getScreenUnits(numUnits, lessonFolder)
      .then((screenUnits) =>
        startSession(
          this,
          {
            title: this.lessons[index].name,
            screenUnits: screenUnits
          },
          mode)
      );
  };

  startLevel1 = function (index: number, mode: any) {
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
            title: this.lessons[index].name,
            screenUnits: screenUnits
          },
          mode)
      );
  };

  startLevel2 = function (index: number, mode: any) {
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
            title: this.lessons[index].name,
            screenUnits: screenUnits
          },
          mode)
      );
  };

  goToStats = function () {
    //todo
  };
}

function getRandomIndex(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function startSession(scope: PhonemeList, params: any, mode: any) {
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
  params.navParams = scope.params;
  scope.navCtrl.setRoot(mode, params);
}