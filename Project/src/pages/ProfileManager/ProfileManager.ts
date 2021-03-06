import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import { LessonsList } from '../LessonsList/LessonsList';
import { ProfileInfo } from '../../loaders/profileInfo';
import { profileData } from '../../interfaces';
import { LessonsLoader } from '../../loaders/lessonsLoader';

declare var navigator: any;

@Component({
  selector: 'page-ProfileManager',
  templateUrl: 'ProfileManager.html'
})
export class ProfileManager {
  private loaded: boolean = false;
  private photoLoading: boolean = false;
  private showMenu: boolean = false;
  private title: string = 'Profile Setup';
  private user: profileData;
  private langs: string[];
  private lessonsLoader: LessonsLoader;
  private showMenuOverlay: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public plt: Platform,
    private zone: NgZone,
    private events: Events
  ) {
    this.user = navParams.get('user');
    if (!this.user) {
      this.user = this.user = this.createUser(); // Create default values
    } else {
      this.showMenu = true;
    }

    this.lessonsLoader = new LessonsLoader();
    this.lessonsLoader.getLanguages()
      .then((langs) => {
        this.langs = langs;
        this.loaded = true;
      });
  }

  changePicture() {
    this.showMenuOverlay = true;
  }

  closeMenu() {
    this.showMenuOverlay = false;
  }

  takePicture() {
    this.closeMenu();
    this.photoLoading = true;
    navigator.camera.getPicture(this.cameraSuccess, this.cameraError, {
      sourceType: navigator.camera.PictureSourceType.CAMERA,
      destinationType: navigator.camera.DestinationType.DATA_URL
    });
  }

  choosePicture() {
    this.closeMenu();
    this.photoLoading = true;
    navigator.camera.getPicture(this.cameraSuccess, this.cameraError, {
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: navigator.camera.DestinationType.DATA_URL
    });

  }

  cameraSuccess = (imageData) => {
    this.zone.run(() => {
      this.user.img = 'data:image/jpeg;base64,' + imageData;
      this.photoLoading = false;
    })
  };

  cameraError = (err) => {
    this.zone.run(() => {
      this.photoLoading = false;
    });
    console.log("camera err " + err.message);
  };

  submitUser() {
    let profileLoader = new ProfileInfo();
    profileLoader.storeInfo(this.user, this.plt);
    this.events.publish('profileUpdated', this.user);
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
