import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { File } from 'ionic-native';
import { ListeningMode } from '../ListeningMode/ListeningMode';
import { Util } from '../../util';
import * as config from '../../assets/screenUnits/Japanese/config.json';

declare var cordova: any;

@Component({
  selector: 'page-phonemeList',
  templateUrl: 'PhonemeList.html'
})
export class PhonemeList {
  loaded: boolean = false;
  lessons: any;
  mode: any = {
    listening: ListeningMode,
    speaking: null //to be SpeakingMode
  };

  constructor(public plt: Platform, public navCtrl: NavController) {
    this.lessons = config.lessons;
    this.plt.ready().then(() => {
      this.loaded = true;
    });
  }

  startLevel3 = function (index: number, mode: any) {
    //todo
  };

  startLevel1 = function (index: number, mode: any) {
    if (!mode) {
      return;
    }

    //generate array of randomized screenUnits
    //and navigate to ListeningMode, passing the array and lessons[index].name as title
    let numUnits = 1;
    let lessonFolder = this.lessons[index].path + '1'; //todo: make a "constants" file for the random magic strings and numbers like this '1'

    getScreenUnits(numUnits, lessonFolder)
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

    getScreenUnits(numUnits, lessonFolder)
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

function getScreenUnits(numUnits: number, sourceFolder: string) {
  let path = cordova.file.applicationDirectory + 'www/';
  return (

    File.listDir(path, sourceFolder)
      .then((files) => {
        let util = new Util();
        files = util.shuffle(files);
        let screenUnits = [];
        for (let i = 0; i < numUnits; i++) {
          screenUnits.push(
            File.readAsText(path + sourceFolder, files[i].name)
              .then(text => {
                if (typeof text === 'string') {
                  return JSON.parse(text);
                }
              })
              .catch(err => console.log("err: " + err.message))
          );
        }

        return screenUnits;
      })
      .catch(err => {
        console.log("listdir error " + err.message);
        return null;
      })
  );
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

  scope.navCtrl.setRoot(mode, params);
}