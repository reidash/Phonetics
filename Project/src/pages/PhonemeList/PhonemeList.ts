import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as config from '../../assets/screenUnits/Japanese/config.json';

@Component({
  selector: 'page-phonemeList',
  templateUrl: 'PhonemeList.html'
})
export class PhonemeList {
  lessons: any;

  constructor(public navCtrl: NavController) {
    this.lessons = config.lessons;
  }

  startSpeaking = function(index: number, level: number) {
    //todo
  };

  startListening = function(index: number, level: number) {
    //generate array of randomized screenUnits
    //and navigate to ListeningMode, passing the array and lessons[index].name as title
    console.log(index);
  };

  goToStats = function() {
    //todo
  };
}
