import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { File } from 'ionic-native';
import { ListeningMode } from '../ListeningMode/ListeningMode';
import { Util } from '../../util';
import * as config from '../../assets/screenUnits/Japanese/config.json';

declare var cordova: any;
const androidPath: string = cordova.file.applicationDirectory + 'www/';

@Component({
  selector: 'page-phonemeList',
  templateUrl: 'PhonemeList.html'
})
export class PhonemeList {
  lessons: any;

  constructor(public plt: Platform, public navCtrl: NavController) {
    this.lessons = config.lessons;
  }

  startSpeaking = function (index: number, level: number) {
    //todo
  };

  startListening = function (index: number, level: number) {
    //generate array of randomized screenUnits
    //and navigate to ListeningMode, passing the array and lessons[index].name as title
    let util = new Util();
    this.plt.ready().then(() => {
      let path = cordova.file.applicationDirectory + 'www/';
      let lessonFolder = this.lessons[index].path;

      //selecting all files for now
      //todo: implement logic for each session level
      File.listDir(path, lessonFolder)
        .then((files) => {
          let temparray = [];
          files.forEach((file, ind) => {
            temparray.push(
              File.readAsText(path + lessonFolder, file.name)
                .then(text => {
                  if (typeof text === 'string') {
                    return JSON.parse(text);
                  }
                })
                .catch(err => console.log(err.message))
            );
          });

          let params = {
            sessionTitle: this.lessons[index].name,
            screenUnits: util.shuffle(temparray)
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
