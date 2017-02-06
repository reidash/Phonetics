import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-ProfileSetup',
  templateUrl: 'ProfileSetup.html'
})
export class ProfileSetup {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  title: string = 'Profile Setup';
  user: any;
  langs: string[] = ['Japanese', 'Mandarin'];
  nativeLang: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.get('user');
    if(this.user) {
      this.title = 'Edit Profile';
    }
  }

  changePicture(event, item) {
    console.log("something");
  }
}
