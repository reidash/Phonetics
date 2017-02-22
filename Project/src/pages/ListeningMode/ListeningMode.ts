import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
//import { PhonemeList } from '../PhonemeList/PhonemeList';
import { Util } from '../../util';
import { MediaPlugin } from 'ionic-native';
import { screenUnit } from '../../interfaces';

@Component({
    selector: 'page-ListeningMode',
    templateUrl: 'ListeningMode.html'
})
export class ListeningMode {
    title: string;
    public currUnit: screenUnit;
    public currState: number;
    public state: any = {
        init: 0,
        right: 1,
        wrong: 2,
        end: 3
    };
    public currIndex: number; //index of currently displayed screenUnit
    protected screenUnits: screenUnit[];

    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform) {
        //constructor code here

        this.title = navParams.get('sessionTitle'); //hardcoded for testing, but this needs to be passed as a nav param or something
        this.screenUnits = navParams.get('screenUnits');
        let util = new Util();
        this.screenUnits = util.shuffle(this.screenUnits); // Shuffle screenUnit order

        this.currIndex = 0;
        this.initUnit();
    }

    initUnit = function() {
        // Logic for setting up a new screenUnit
        // Maybe add statisitics tracking here?
        this.currState = this.state.init;
        this.currUnit = this.screenUnits[this.currIndex];
    }
    chooseCorrect = function() {
        // Logic for getting a correct answer
        // Add statistics tracking here later
        this.currState = this.state.right;
    }
    chooseIncorrect = function() {
        // Logic for getting an incorrect answer
        // Add statistics tracking here later
        this.currState = this.state.wrong;
    }
    endSession = function() {
        // Logic for ending a session
        // Add statistics/goal tracking here
        this.currState = this.state.end;
    }

    playAudio = function () {
        console.log("Playing Audio!")
        this.plt.ready().then((readySource) => {
            console.log('Platform ready from', readySource);
            // Platform now ready, execute any required native code
            var audio = new MediaPlugin(this.currUnit.audioPaths[0])
            audio.play();
        });

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
            if (ind < 0) {
                this.endSession();
                return; //end of session
            }

            this.currIndex = ind;
            this.initUnit();
        }, timeout);
    }
}
