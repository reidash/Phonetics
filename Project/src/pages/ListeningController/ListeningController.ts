import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { PracticeMode } from '../../PracticeMode';

declare var cordova: any;

@Component({
    selector: 'page-ListeningController',
    templateUrl: 'ListeningController.html'
})
export class ListeningController extends PracticeMode {
    private currAudio: MediaPlugin; // Current audio file


    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform) {
        super(navCtrl, navParams, plt);
    }

    initUnit() {
        // Logic for setting up a new screenUnit
        // Maybe add statisitics tracking here?
        super.initUnit();
        var path = this.plt.is('android') ? cordova.file.applicationDirectory + 'www/' : ''; //might be a hack...
        let randomIndex = Math.floor(Math.random() * this.currUnit.audioPaths.length); // Pick audio clip to use
        this.currAudio = new MediaPlugin(path + this.currUnit.audioPaths[randomIndex]);
    };

    playAudio() {
        if (this.currAudio) { // Only play audio if it actually exists
            this.currAudio.play(); // Restart audio from the beginning
        }
    };

    autoAdvance() {
        if (this.currAudio) { // Release the audio resource since we are done now
            this.currAudio.release();
        }
        super.autoAdvance();
    };
}
