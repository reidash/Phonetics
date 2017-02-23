import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { PhonemeList } from '../PhonemeList/PhonemeList'; 

interface userInfo {
  name: string,
  img: string,
  nativeLang: string
};

@Component({
  selector: 'page-ProfileSetup',
  templateUrl: 'ProfileSetup.html'
})
export class ProfileSetup {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  title: string = 'Profile Setup';
  user: userInfo;
  langs: string[] = ['Japanese', 'Mandarin']; //todo: replace this with actual data
  nativeLang: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform) {
    this.user = this.createUser();
    this.plt.ready().then((readySource) => {
      if(readySource !== 'dom') {
        NativeStorage.getItem('profileData').then(
          profileData => { // profileData found use it.
            this.user = profileData;
            console.log("Found user: " + JSON.stringify(this.user)); // Log for now so we know that we have the right data.
            this.setupDone();
          } // profileData
        ) // then 
      } // if
    }); // readySource
  } // constructor

  changePicture(event, item) {
    // TODO
  }

  submitUser = function() {
    console.log("Submitting User: " + JSON.stringify(this.user));
    this.plt.ready().then((readySource) => {
      if(readySource !== 'dom') {
        NativeStorage.setItem('profileData', this.user).then( // Store all user data
          () => console.log("Stored User: " + JSON.stringify(this.user)),
          error => console.log("Error storing user info! " + error)
        );
      } // if
      this.setupDone();
    }); // readySource
  } // submitUser

  setupDone = function() {
    // setRoot to avoid back button showing up. Can't go back to profile creation (instead there should be some edit profile page or something).
    this.navCtrl.setRoot(PhonemeList, {}); // TODO fill in navParams with whatever PhonemeList needs.
  }

  createUser = function () {
  // Default user info, they will fill this stuff in.
    return {
      name: '',
      img: '../../assets/images/defaultprofile.png',
      nativeLang: ''
    }
  }
}
