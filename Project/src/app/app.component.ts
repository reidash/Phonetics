import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { PhonemeList } from '../pages/PhonemeList/PhonemeList';
import { ProfileSetup } from '../pages/ProfileSetup/ProfileSetup';
import { ProfileInfo } from '../profileInfo';
//import { Goals } from '../pages/Goals/Goals';
//import { ListeningMode } from '../pages/ListeningMode/ListeningMode';

@Component({
  templateUrl: 'app.html'
})
export class Phonetics {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  user: any;

  constructor(public platform: Platform) {

    //this.initializeApp();
    let profileLoader = new ProfileInfo();

    profileLoader
      .getInfo(this.platform)
      .then((data) => { // Try to get the profile data
        this.user = data; // If it is there then use it

        if (this.user) {
          this.rootPage = PhonemeList;
        } else {
          this.rootPage = ProfileSetup;
        }
      })
      .catch(err => this.rootPage = ProfileSetup);


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Lessons', component: PhonemeList },
      { title: 'Edit Profile', component: ProfileSetup }
      //{ title: 'Practice Goals', component: Goals },
      //{ title: 'Listening Mode', component: ListeningMode }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let params;
    if (page.component == ProfileSetup) {

      if (!this.user) {
        let profileLoader = new ProfileInfo();
        profileLoader.getInfo(this.platform).then((data) => { // Try to get the profile data
          this.user = data; // If it is there then use it
        });
      }

      params = {
        user: this.user
      };

    }
    this.nav.setRoot(page.component, params);
  }
}
