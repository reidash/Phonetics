import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { LessonsList } from '../LessonsList/LessonsList';
import { ProfileInfo } from '../../loaders/profileInfo';
import { profileData } from '../../interfaces';

declare var navigator: any;

@Component({
  selector: 'page-ProfileManager',
  templateUrl: 'ProfileManager.html'
})
export class ProfileManager {
  private showMenu: boolean = false;
  private title: string = 'Profile Setup';
  private user: profileData;
  private langs: string[] = ['Japanese', 'Mandarin']; //todo: replace this with actual data
  private showMenuOverlay: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public plt: Platform,
    private zone: NgZone
  ) {
    this.user = navParams.get('user');
    if (!this.user) {
      this.user = this.user = this.createUser(); // Create default values
    } else {
      this.showMenu = true;
    }

    plt.ready().then(() => console.log(navigator));
  } // constructor

  changePicture() {
    this.showMenuOverlay = true;
  }

  closeMenu() {
    this.showMenuOverlay = false;
  }

  takePicture() {
    navigator.camera.getPicture(this.cameraSuccess, this.cameraError, {
      sourceType: navigator.camera.PictureSourceType.CAMERA,
      destinationType: navigator.camera.DestinationType.DATA_URL
    });
  }

  choosePicture() {
    navigator.camera.getPicture(this.cameraSuccess, this.cameraError, {
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: navigator.camera.DestinationType.DATA_URL
    });
  }

  cameraSuccess = (imageData) => {
    this.zone.run(() => {
      this.user.img = 'data:image/jpeg;base64,' + imageData;
      this.closeMenu();
    })
  }

  cameraError(err) {
    console.log("err " + err.message);
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
