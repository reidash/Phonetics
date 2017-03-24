import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { LessonsList } from '../LessonsList/LessonsList';
import { ProfileInfo } from '../../loaders/profileInfo';
import { profileData } from '../../interfaces';

@Component({
  selector: 'page-ProfileManager',
  templateUrl: 'ProfileManager.html'
})
export class ProfileManager {
  private title: string = 'Profile Setup';
  private user: profileData;
  private langs: string[] = ['Japanese', 'Mandarin']; //todo: replace this with actual data

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform) {
    this.user = navParams.get('user');
    if (!this.user) {
      this.user = this.user = this.createUser(); // Create default values
    }
  } // constructor

  changePicture(event, item) {
    // TODO
  }

  submitUser() {
    let profileLoader = new ProfileInfo();
    profileLoader.storeInfo(this.user, this.plt);
    this.setupDone();
  } // submitUser

  setupDone() {
    // setRoot to avoid back button showing up. Can't go back to profile creation (instead there should be some edit profile page or something).
    this.navCtrl.setRoot(LessonsList, { user: this.user });
  }

  createUser() {
    // Default user info, they will fill this stuff in.
    return {
      name: '',
      img: 'assets/images/defaultprofile.png',
      nativeLang: ''
    }
  }
}
