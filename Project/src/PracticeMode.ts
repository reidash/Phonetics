import { NavController, NavParams, Platform } from 'ionic-angular';
import { Util } from './util';
import { screenUnit } from './interfaces';
import { LessonsList } from './pages/LessonsList/LessonsList';
import { StatisticsVisualizer } from './pages/StatisticsVisualizer/StatisticsVisualizer';
import { Statistics } from './StatisticsModel';

declare var cordova: any;

export class PracticeMode {
    protected lessonsList: any;
    protected loaded: boolean = false;
    protected title: string; // Title of the session
    protected phonemeId: number;
    protected currUnit: screenUnit; // Current screenUnit
    protected currState: number; // Current state of UI
    protected state: any = {
        init: 0,
        right: 1,
        wrong: 2,
        end: 3
    };
    protected currIndex: number = 0; //index of currently displayed screenUnit
    protected screenUnits: screenUnit[] = []; // Array of all screen units in the session

    constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform) {
        this.currUnit = {
            id: 0,
            word: '',
            wordOptions: [],
            audioPaths: []
        };

        this.lessonsList = navParams.get('navParams');
        this.title = navParams.get('title');
        this.phonemeId = navParams.get('phonemeId');
        let tempUnits: Promise<screenUnit>[] = navParams.get('screenUnits');

        Promise.all(tempUnits).then((values) => {
            this.screenUnits = values;
            this.initUnit();
        }).catch(err => console.log("err: " + err.message));

        this.plt.ready().then((readySource) => { // Make sure the platform is ready before we try to use native components
            if (readySource !== 'dom') {
                this.loaded = true;
            }
        });
    }

    initUnit() {
        // Logic for setting up a new screenUnit
        // Maybe add statisitics tracking here?
        this.currState = this.state.init; // Go to initial state
        this.currUnit = this.screenUnits[this.currIndex]; // Set current screenUnit
    };

    chooseCorrect() {
        // Logic for getting a correct answer
        // Add statistics tracking here later
        this.currState = this.state.right;
        Statistics.GetStatistics().Record(this.currUnit, true);
    };

    chooseIncorrect() {
        // Logic for getting an incorrect answer
        // Add statistics tracking here later
        this.currState = this.state.wrong;
        Statistics.GetStatistics().Record(this.currUnit, false);
    };

    endSession() {
        // Logic for ending a session
        // Add statistics/goal tracking here
        this.currState = this.state.end;
        Statistics.GetStatistics().EndSession(); // End current statistics session
    };

    goToLessons() {
        this.navCtrl.setRoot(LessonsList, this.lessonsList);
    }

    goToStats() {
        let params = {
            phonemeId: this.phonemeId,
            lessonTitle: this.navParams.get('title')
        };

        this.navCtrl.setRoot(StatisticsVisualizer, params);
    }

    chooseOption(chosen: string) {
        if (this.currUnit.word !== chosen) {
            this.chooseIncorrect();
            return;
        }

        this.chooseCorrect();
        this.autoAdvance();
    };

    autoAdvance() {
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
    };
}
