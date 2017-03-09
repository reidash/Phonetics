import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Util } from '../../util';
import { MediaPlugin } from 'ionic-native';
import { screenUnit } from '../../interfaces';
import { PhonemeList } from '../PhonemeList/PhonemeList';

declare var cordova: any;

@Component({
    selector: 'page-ListeningMode',
    templateUrl: 'ListeningMode.html'
})
export class ListeningMode {
    title: string; // Title of the session
    currUnit: screenUnit; // Current screenUnit
    currAudio: MediaPlugin; // Current audio file
    currState: number; // Current state of UI
    state: any = {
        init: 0,
        right: 1,
        wrong: 2,
        end: 3
    };
    currIndex: number = 0; //index of currently displayed screenUnit
    screenUnits: screenUnit[] = []; // Array of all screen units in the session

    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform) {
        this.currUnit = {
            id: 0,
            word: '',
            wordOptions: [],
            audioPaths: []
        };

        this.title = navParams.get('sessionTitle');
        let tempUnits: Promise<screenUnit>[] = navParams.get('screenUnits');

        Promise.all(tempUnits).then((values) => {
            this.screenUnits = values;
            this.initUnit();
        }).catch(err => console.log("err1: " + err.message));
    }

    initUnit = function () {
        // Logic for setting up a new screenUnit
        // Maybe add statisitics tracking here?
        var path = this.plt.is('android') ? cordova.file.applicationDirectory + 'www/' : ''; //might be a hack...
        this.currState = this.state.init; // Go to initial state
        this.currUnit = this.screenUnits[this.currIndex]; // Set current screenUnit
        let randomIndex = Math.floor(Math.random() * this.currUnit.audioPaths.length); // Pick audio clip to use
        this.plt.ready().then((readySource) => { // Make sure the platform is ready before we try to use native components
            if (readySource !== 'dom') { // Don't try to use cordova unless we are on a device
                this.currAudio = new MediaPlugin(path + this.currUnit.audioPaths[randomIndex]);
            }
        });
    };

    chooseCorrect = function () {
        // Logic for getting a correct answer
        // Add statistics tracking here later
        this.currState = this.state.right;
    };

    chooseIncorrect = function () {
        // Logic for getting an incorrect answer
        // Add statistics tracking here later
        this.currState = this.state.wrong;
    };

    endSession = function () {
        // Logic for ending a session
        // Add statistics/goal tracking here
        this.currState = this.state.end;
    };

    goToLessons = function () {
        this.navCtrl.setRoot(PhonemeList);
    }

    playAudio = function () {
        if (this.currAudio) { // Only play audio if it actually exists
            this.currAudio.play(); // Restart audio from the beginning
        }
    };

    chooseOption = function (chosen: string) {
        if (this.currUnit.word !== chosen) {
            this.chooseIncorrect();
            return;
        }

        this.chooseCorrect();
        this.autoAdvance();
    };

    autoAdvance = function () {
        let util = new Util();
        let ind = util.getNext(this.currIndex, this.screenUnits.length);

        let timeout = 0;
        if (this.currState === this.state.right) {
            timeout = 1500;
        }

        setTimeout(() => {
            if (this.currAudio) { // Release the audio resource since we are done now
                this.currAudio.release();
            }
            if (ind < 0) {
                this.endSession();
                return; //end of session
            }

            this.currIndex = ind;
            this.initUnit();
        }, timeout);
    };
}
