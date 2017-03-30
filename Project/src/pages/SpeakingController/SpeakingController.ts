import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { PracticeMode } from '../../PracticeMode';
import { VideoPlayer } from '@ionic-native/video-player';


declare var cordova: any;
declare var SpeechRecognition: any;

@Component({
    providers: [VideoPlayer],
    selector: 'page-SpeakingController',
    templateUrl: 'SpeakingController.html'
})

export class SpeakingController extends PracticeMode {
    private recognition: any;
    private isCorrect: boolean;
    private currAudio: MediaPlugin; // Current audio file
    private videoUrl = 'assets/video/sample.mp4';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public plt: Platform,
        private toastCtrl: ToastController,
        private videoPlayer: VideoPlayer,
        private zone: NgZone
    ) {
        super(navCtrl, navParams, plt);

        if (navParams.get('video')) {
            this.videoUrl = navParams.get('video');
            console.log("video " + this.videoUrl);
        }

        plt.ready().then(() => {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'en-US';
            this.recognition.continuous = true;
            this.recognition.interimResults = true;

            //the voice recognition doesn't id what you are speaking -> rarely comes here
            this.recognition.onnomatch = event => {
                this.chooseIncorrect();
            };

            //either too much noise or something
            this.recognition.onerror = event => {
                zone.run(() => {
                    this.presentToast("Oops. We didn't hear you correctly, please tap the microphone and pronounce the word again :)")
                    this.recognition.stop(true);
                });
            };

            //able to pick up what you are saying
            this.recognition.onresult = event => {
                this.recognition.stop(true);
                console.log("Got result");
                zone.run(() => { //need to run in zone for view to refresh properly
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
                        //means out of all the options, none is correct
                        this.chooseIncorrect();
                    }
                });
            };
        });
    }

    playVideo() {
        var path = this.plt.is('android') ? cordova.file.applicationDirectory + 'www/' + this.videoUrl : ''; //might be a hack...
        // Playing a video.
        this.videoPlayer.play(path, { scalingMode: 2 }).then(() => {
            console.log('video completed');
        }).catch(err => {
            console.log('Error: ' + err);
        });
    }

    speechToText() {
        console.log("Starting speech recognition");
        this.isCorrect = false;
        this.recognition.start();
    }

    presentToast(message) {
        this.zone.run(() => {
            let toast = this.toastCtrl.create({
                message: message,
                position: "bottom",
                duration: 3000
            });
            toast.present();
        });
    }

    initUnit() {
        // Logic for setting up a new screenUnit
        // Maybe add statisitics tracking here?
        super.initUnit();
        var path = this.plt.is('android') ? cordova.file.applicationDirectory + 'www/' : ''; //might be a hack...
        let randomIndex = Math.floor(Math.random() * this.currUnit.audioPaths.length); // Pick audio clip to use
        this.currAudio = new MediaPlugin(path + this.currUnit.audioPaths[randomIndex]);
    }

    playAudio() {
        if (this.currAudio) { // Only play audio if it actually exists
            this.currAudio.play(); // Restart audio from the beginning
        }
    }

    autoAdvance() {
        if (this.currAudio) { // Release the audio resource since we are done now
            this.currAudio.release();
        }

        super.autoAdvance();
    }
}
