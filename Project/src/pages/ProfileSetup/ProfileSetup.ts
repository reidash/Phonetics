import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { PhonemeList } from '../PhonemeList/PhonemeList'; 
import { ProfileInfo } from '../../loaders/profileInfo';
import { profileData } from '../../interfaces';

@Component({
  selector: 'page-ProfileSetup',
  templateUrl: 'ProfileSetup.html'
})
export class ProfileSetup {
  private title: string = 'Profile Setup';
  private user: profileData;
  private langs: string[] = ['Japanese', 'Mandarin']; //todo: replace this with actual data

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform) {
    this.user = navParams.get('user');
    if(!this.user) {
      this.user = this.user = this.createUser(); // Create default values
    }
  } // constructor

  changePicture(event, item) {
    // TODO
  }

  submitUser = function() {
    let profileLoader = new ProfileInfo();
    profileLoader.storeInfo(this.user, this.plt);
    this.setupDone();
  } // submitUser

  setupDone = function() {
    // setRoot to avoid back button showing up. Can't go back to profile creation (instead there should be some edit profile page or something).
    this.navCtrl.setRoot(PhonemeList, {user: this.user});
  }

  createUser = function () {
  // Default user info, they will fill this stuff in.
    return {
      name: '',
      img: 'assets/images/defaultprofile.png',
      nativeLang: ''
    }
  }
}
