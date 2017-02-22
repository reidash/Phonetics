import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Util } from '../../util';
import { MediaPlugin } from 'ionic-native';

interface screenUnit {
    id : number //just an id for this screen unit, 
    word: string //the correct/expected word
    wordOptions: string[],  //words to be presented in the screen unit, ex [rock, lock]; only used in listening mode; speaking mode will present the "word" property
    audioPaths: string [] //paths to audio files for this screen unit
}

@Component({
    selector: 'page-ListeningMode',
    templateUrl: 'ListeningMode.html'
})
export class ListeningMode {
    title: string = 'Listening Mode'; //this should be the title of the phoneme list
    screenUnits: screenUnit[];
    currentUnit: screenUnit;
    currentIndex: number;
    currentLeft: string;
    currentRight: string;

    // State control super sketchy but this is more UI than logic
    // Replace with whatever we use to actually switch the UI
    currentState: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform) {
        //constructor code here
        var util = new Util();
        this.screenUnits = navParams.get('screenUnits');
        this.screenUnits = util.shuffle(this.screenUnits);
        this.currentIndex = 0;
        this.setUpUnit();
    }

    // Call when we switch from feedback
    nextQuestion() {
        this.currentIndex = (this.currentIndex + 1) % this.screenUnits.length;
        this.setUpUnit();
    }

    setUpUnit() {
        this.currentUnit = this.screenUnits[this.currentIndex];
        this.currentLeft = this.currentUnit.wordOptions[0];
        this.currentRight = this.currentUnit.wordOptions[1];
        this.switchState('State.Question');
    }

    switchState(state: string) {
        // Replace with actual view changing code. 
        this.currentState = state;
    }

    checkAnswer(answer: string) {
        if(answer === this.currentUnit.word) {
            console.log("Correct!");
            this.switchState('State.Correct');
        } else {
            console.log("Incorrect, correct was: " + this.currentUnit.word);
            this.switchState('State.Incorrect');
        }
    }

    playAudio() {
        console.log("Playing Audio!")
        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            // Platform now ready, execute any required native code
            var audio = new MediaPlugin(this.currentUnit.audioPaths[0])
            audio.play();
        });
    }
}

