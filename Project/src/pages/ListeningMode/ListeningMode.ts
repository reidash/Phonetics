import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-ListeningMode',
  templateUrl: 'ListeningMode.html'
})
export class ListeningMode {
  title: string = 'Listening Mode'; //this should be the title of the phoneme list

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //constructor code here
  }
}

