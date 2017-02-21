import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Util } from '../../util';

@Component({
    selector: 'page-ListeningMode',
    templateUrl: 'ListeningMode.html'
})
export class ListeningMode {
    title: string;
    public screenUnit: any;
    public currState: number;
    public state: any = {
        init: 0,
        right: 1,
        wrong: 2
    };
    public currIndex: number; //index of currently displayed screenUnit
    protected screenUnits: any[];

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        //constructor code here
        this.currState = this.state.init;

        this.title = 'R-L Distinction';

        //fake data for testing
        this.screenUnits = [{
            id: 1,
            word: 'rock',
            wordOptions: ['lock', 'rock'],
            audioPaths: ['1.mp3', '2.mp3', '3.mp3']
        },
        {
            id: 2,
            word: 'light',
            wordOptions: ['light', 'right'],
            audioPaths: ['1.mp3', '2.mp3', '3.mp3']
        }];

        this.currIndex = 0;
        this.screenUnit = this.screenUnits[this.currIndex];
    }

    playAudio = function () {
        console.log("lalalala");
    }

    chooseOption = function (chosen: string) {
        if(this.screenUnit.id === 2) {
            this.currState = this.state.wrong;
            return;
        }

        this.currState = this.state.right;
        this.autoAdvance();
    }

    autoAdvance = function() {
        let util = new Util();
        let ind = util.getNext(this.currIndex, this.screenUnits.length);

        setTimeout(() => {
            if(ind < 0) {
                return; //end of session, should do something here
            }

            this.currIndex = ind;
            this.currState = this.state.init;
            this.screenUnit = this.screenUnits[ind];
        }, 1500);
    }
}
