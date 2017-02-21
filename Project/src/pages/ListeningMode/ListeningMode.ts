import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Util } from '../../util';

@Component({
    selector: 'page-ListeningMode',
    templateUrl: 'ListeningMode.html'
})
export class ListeningMode {
    title: string;
    screenUnit: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        //constructor code here
        var util = new Util();

        this.title = 'R-L Distinction';
        var screenUnits = [{
            id: 1,
            word: 'rock',
            wordOptions: ['lock', 'rock'],
            audioPaths: ['1.mp3','2.mp3', '3.mp3']
        }]

        this.screenUnit = screenUnits[0];
    }

    playAudio = function() {
        console.log("lalalala");
    }

    chooseOption = function(chosen: string) {
        console.log("chosen word: " + chosen);
    }
}

