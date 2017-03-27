import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Statistics } from '../../StatisticsModel';
import { LessonType } from '../../interfaces';


@Component({
  selector: 'page-StatisticsTesting',
  templateUrl: 'StatisticsTesting.html'
})
export class StatisticsTesting {

  public type: any = {
      listening: LessonType.Listening,
      speaking: LessonType.Speaking
  }
  // Actual Statistics stuff
  public myStats: Statistics;
  public myAverages: number[];
  public myNumStats: number;

  // A whole bunch of variables for user input
  public useLevel: Boolean;
  public level: number;
  public usePhonemeID: Boolean;
  public phonemeID: number;
  public useType: Boolean;
  public myType: LessonType
  public groupBy: number;
  public amount: number;
  public successWeight: number;

  constructor(public navCtrl: NavController) {
    this.myStats = Statistics.GetStatistics();
    this.myAverages = [];
    this.useLevel = false;
    this.level = 1;
    this.usePhonemeID = false;
    this.phonemeID = 0;
    this.useType = false;
    this.myType = this.type.listening;
    this.groupBy = 0;
    this.amount = 1;
    this.successWeight = 0.5;
    this.LogStatistics(1, this.phonemeID, this.myType, this.level);
  }

  // Updates the myAverages to reflect the filter options selected by the user
  public LogStatistics(groupBy: number, phonemeID: number, type: LessonType, level: number) {
      this.myNumStats = this.myStats.GetSessionCount();
      console.log("Num Sessions: " + this.myNumStats);
      let promise: Promise<number[]>;
      //console.log("Filterning stats with: groupBy="+groupBy+", phonemeID="+phonemeID+", type="+type+", level="+level);
      if(this.useLevel) {
        console.log("Filtering by level");
        promise = this.myStats.GetPhonemeStatsByLevel(phonemeID, type, level, groupBy);
      } else if(this.usePhonemeID) {
        console.log("Filtering by PhonemeID");
        promise = this.myStats.GetPhonemeStatsByType(phonemeID, type, groupBy);
      } else if(this.useType) {
        console.log("Filtering by Type");
        promise = this.myStats.GetTotalStatsByType(type, groupBy);
      } else {
        console.log("No Filtering");
        promise = this.myStats.GetFilteredStats(() => {return true;}, groupBy);
      }
      promise.then((data: number[]) => {
          this.myAverages = data;
          for(let val of this.myAverages) {
              console.log(val);
          }
      });
  }

  // Generates a bunch of random statistics based on the user input
  public GenerateStatistics(amount: number, successWeight: number, phonemeID: number, type: LessonType, level: number): void {
      //console.log("Generating Stats with: amount="+amount+", successWeight="+successWeight+", phonemeID="+phonemeID+", type="+type+", level="+level);
      let stats: Statistics = Statistics.GetStatistics();
      for(let i: number = 0; i < amount; i+=1) {
          stats.StartSession(phonemeID, type, level, true);
          for(let j: number = 0; j < 20; ++j) {
              stats.Record({id: j, word: "lock", wordOptions: ["lock", "rock"], audioPaths: ["assets/audio/00-lock-0.m4a"]}, Math.random()*100 < successWeight);
          }
          stats.EndSession();
      }
      this.LogStatistics(this.groupBy, this.phonemeID, this.myType, this.level);
  }
}