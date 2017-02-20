import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Util } from '../../util';

@Component({
    selector: 'page-ListeningMode',
    templateUrl: 'ListeningMode.html'
})
export class ListeningMode {
    title: string = 'Listening Mode'; //this should be the title of the phoneme list
    test: string[];

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        //constructor code here
        var util = new Util();
        this.test = ["Saab", "Volvo", "BMW", "nissan", "lala"];
        this.test = util.shuffle(this.test);
    }
}

