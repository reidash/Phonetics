import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { Util } from '../../util';
import { MediaPlugin } from 'ionic-native';
import { screenUnit } from '../../interfaces';


declare var cordova: any;
declare var SpeechRecognition: any;

@Component({
    selector: 'page-SpeakingMode',
    templateUrl: 'SpeakingMode.html'
})
export class SpeakingMode {
    loaded: boolean = false;
    private recognition: any;
    private platform: any;
    private title: string; // Title of the session
    private isCorrect: any;
    private currUnit: screenUnit; // Current screenUnit
    private currAudio: MediaPlugin; // Current audio file
    private currState: number; // Current state of UI
    private state: any = {
        init: 0,
        right: 1,
        wrong: 2,
        end: 3
    };
    private currIndex: number = 0; //index of currently displayed screenUnit
    private screenUnits: screenUnit[] = []; // Array of all screen units in the session

    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, private toastCtrl: ToastController, private zone: NgZone) {

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
        });

        this.plt.ready().then((readySource) => { // Make sure the platform is ready before we try to use native components
            if (readySource !== 'dom') {
                this.loaded = true;
            }
        });
    }

    SpeechToText = function () {
        this.isCorrect = false;
        this.recognition = new SpeechRecognition();
        this.recognition.start();
        this.recognition.lang = 'en-US';
        //the voice recognition dont uds what you are speaking -> rarely comes here
        this.recognition.onnomatch = (event => {
            this.chooseIncorrect();
        });

        //either too much noise or something
        this.recognition.onerror = (event => {
            this.presentToast("Opps. We didn't hear you correctly, please tap the microphone and pronounce the word again :)")
        });

        //able to pick up what you are saying
        this.recognition.onresult = event => {
            this.zone.run(() => { // <== added
                var i = 0;
                if (event.results.length > 0) {
                    for (i = 0; i < event.results.length; i++) {
                        //only choose words that are higher than 0.9 confidence
                        //First word is usually the correct word pronounced, but the speech recognition will not be confident sometimes
                        if (this.currUnit.word === event.results[0][0].transcript.toLowerCase()) {
                            this.isCorrect = true;
                            break;
                        }
                        //only if confidence level is over 90% for remaining words then it will accept as a right answer
                        if (event.results[i][0].confidence >= 0.9) {
                            if (this.currUnit.word === event.results[i][0].transcript.toLowerCase()) {
                                this.isCorrect = true;
                                break;
                            }
                        }
                    }

                    if (this.isCorrect === true) {
                        this.chooseCorrect();
                        this.autoAdvance();
                        return;
                    }
                    //means out of all the options, non is correct
                    this.chooseIncorrect();
                }
            });
        };
    }

    presentToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            position: "bottom",
            duration: 3000
        });
        toast.present();
    }

    initUnit = function () {
        // Logic for setting up a new screenUnit
        // Maybe add statisitics tracking here?
        var path = this.plt.is('android') ? cordova.file.applicationDirectory + 'www/' : ''; //might be a hack...
        this.currState = this.state.init; // Go to initial state
        this.currUnit = this.screenUnits[this.currIndex]; // Set current screenUnit
        let randomIndex = Math.floor(Math.random() * this.currUnit.audioPaths.length); // Pick audio clip to use
        this.currAudio = new MediaPlugin(path + this.currUnit.audioPaths[randomIndex]);
    }

    chooseCorrect = function () {
        // Logic for getting a correct answer
        // Add statistics tracking here later
        this.currState = this.state.right;
    }
    chooseIncorrect = function () {
        // Logic for getting an incorrect answer
        // Add statistics tracking here later
        this.currState = this.state.wrong;
    }
    endSession = function () {
        // Logic for ending a session
        // Add statistics/goal tracking here
        this.currState = this.state.end;
    }

    playAudio = function () {
        if (this.currAudio) { // Only play audio if it actually exists
            this.currAudio.stop(); // Stop if it was already playing
            this.currAudio.play(); // Restart audio from the beginning
        }
    }

    chooseOption = function (chosen: string) {
        if (this.currUnit.word !== chosen) {
            this.chooseIncorrect();
            return;
        }

        this.chooseCorrect();
        this.autoAdvance();
    }

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
    }
}
