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
    recognition: any;
    platform: any;
    title: string; // Title of the session
    isCorrect: any;
    public currUnit: screenUnit; // Current screenUnit
    public currAudio: MediaPlugin; // Current audio file
    public currState: number; // Current state of UI
    public state: any = {
        init: 0,
        right: 1,
        wrong: 2,
        end: 3
    };
    public currIndex: number = 0; //index of currently displayed screenUnit
    public screenUnits: screenUnit[] = []; // Array of all screen units in the session

    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, private toastCtrl: ToastController, private zone: NgZone) {
        this.platform = plt;

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
    }

    SpeechToText = function () {
        this.isCorrect = false;
        this.platform.ready().then(() => {

            this.recognition = new SpeechRecognition();
            this.recognition.start();
            this.recognition.lang = 'en-US';
            //the voice recognition dont uds what you are speaking -> rarely comes here
            this.recognition.onnomatch = (event => {
                console.log('No match found.');
            });

            //either too much noise or something
            this.recognition.onerror = (event => {
                console.log('Error happens.');
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
        });
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
        this.plt.ready().then((readySource) => { // Make sure the platform is ready before we try to use native components
            if (readySource !== 'dom') { // Don't try to use cordova unless we are on a device
                this.currAudio = new MediaPlugin(path + this.currUnit.audioPaths[randomIndex]);
            }
        });
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
