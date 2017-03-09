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
  lessons: any;

  constructor(public plt: Platform, public navCtrl: NavController) {
    this.lessons = config.lessons;
  }

  startSpeaking1 = function (index: number, level: number) {
    //todo
  };


  startSpeaking2 = function (index: number, level: number) {
    //todo
  };


  startSpeaking3 = function (index: number, level: number) {
    //todo
  };
  startListening1 = function (index: number) {
    //generate array of randomized screenUnits
    //and navigate to ListeningMode, passing the array and lessons[index].name as title
    let util = new Util();
    this.plt.ready().then(() => {
      let path = cordova.file.applicationDirectory + 'www/';
      let lessonFolder = this.lessons[index].path + '1';

      File.listDir(path, lessonFolder)
        .then((files) => {
          let i = getRandomIndex(0, files.length);
          let temparray = [];
          temparray.push(
            File.readAsText(path + lessonFolder, files[i].name)
              .then(text => {
                if (typeof text === 'string') {
                  return JSON.parse(text);
                }
              })
              .catch(err => console.log(err.message))
          );

          let params = {
            sessionTitle: this.lessons[index].name,
            screenUnits: temparray
          };

          this.navCtrl.setRoot(ListeningMode, params);
        })
        .catch(err => console.log("listdir error " + err.message));
    });
  };

  startListening2 = function (index: number) {

    //generate array of randomized screenUnits
    //and navigate to ListeningMode, passing the array and lessons[index].name as title
    let util = new Util();
    let numUnits = 20;
    this.plt.ready().then(() => {
      let path = cordova.file.applicationDirectory + 'www/';
      let lessonFolder = this.lessons[index].path + '2';

      File.listDir(path, lessonFolder)
        .then((files) => {
          files = util.shuffle(files);
          let temparray = [];
          for (let i = 0; i < numUnits; i++) {
            temparray.push(
              File.readAsText(path + lessonFolder, files[i].name)
                .then(text => {
                  if (typeof text === 'string') {
                    return JSON.parse(text);
                  }
                })
                .catch(err => console.log(err.message))
            );
          }

          let params = {
            sessionTitle: this.lessons[index].name,
            screenUnits: temparray
          };

          this.navCtrl.setRoot(ListeningMode, params);
        })
        .catch(err => console.log("listdir error " + err.message));
    });
  };

  goToStats = function () {
    //todo
  };
}

function getRandomIndex(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
