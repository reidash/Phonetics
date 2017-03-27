import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { StatisticsVisualizer } from '../pages/StatisticsVisualizer/StatisticsVisualizer';
import { LessonsList } from '../pages/LessonsList/LessonsList';
import { ProfileManager } from '../pages/ProfileManager/ProfileManager';
import { ProfileInfo } from '../loaders/profileInfo';
import { StatisticsTesting } from '../pages/StatisticsTesting/StatisticsTesting';
import { Statistics } from '../StatisticsModel';

@Component({
  templateUrl: 'app.html'
})
export class Phonetics {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;
  user: any;
  menuTitle: string = 'Menu';
  menuPic: string = 'assets/images/defaultprofile.png';

  constructor(public platform: Platform, private events: Events) {
    this.initializeApp();
    let profileLoader = new ProfileInfo();

    profileLoader
      .getInfo(this.platform)
      .then((data) => { // Try to get the profile data
        this.user = data; // If it is there then use it

        if (this.user) {
          let params = {
            user: this.user
          };

          this.menuTitle = this.user.name;
          this.menuPic = this.user.img;

          this.nav.setRoot(LessonsList, params);
        } else {
          this.rootPage = ProfileManager;
        }
      })
      .catch(err => this.rootPage = ProfileManager);


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Lessons', component: LessonsList },
      { title: 'Edit Profile', component: ProfileManager },
      { title: 'Statistics', component: StatisticsVisualizer },
      { title: 'Statistics Testing', component: StatisticsTesting}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      let stats = Statistics.GetStatistics(); // Start loading statistics
      document.addEventListener('resume', () => {let stats = Statistics.GetStatistics()}); // Load stats on resume
      this.events.subscribe('profileUpdated', (user) => {
        this.user = user;
        this.menuPic = user.img;
        this.menuTitle = user.name;
      });

      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let params;
    if (page.component === ProfileManager || page.component === LessonsList) {
      if (this.user) {
        params = {
          user: this.user
        };

        this.nav.setRoot(page.component, params);
        return;
      }

    let profileLoader = new ProfileInfo();
    profileLoader.getInfo(this.platform).then((data) => { // Try to get the profile data
        this.user = data; // If it is there then use it
        params = {
          user: this.user
        };
        this.nav.setRoot(page.component, params);
      });

      } else {
        this.nav.setRoot(page.component, params);
      }
  }
}
