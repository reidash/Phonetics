import { screenUnit, LessonType } from './interfaces';
import { File } from 'ionic-native';

declare var cordova: any;

interface sessionInfo {
    sessionID: number, // phonemeID of the session 
    sessionType: LessonType, // Lesson type, either Speaking or Listening
    lessonLevel: number, // the level of the lesson [1-3]
    sessionCorrect: number, // Number of correct screenUnits in the session
    sessionTotal: number, // Number of total screenUnits in the session
    sessionTime: number, // How long this session took
    sessionIsDynamic: boolean
}

interface statisticsData {
    sessionNumber: number; // The number of session attempts made so far
    sessionData: sessionInfo[]; // All session data ever recorded
    totalTime: number; // Is this a number?
    dynamicList: [screenUnit[], screenUnit[]]; // Words in the dynamicList one for speaking one for listening
}

// A class that stores session statistics.
// Provides functions for accessing filtered statistics data as well as simplified 
// functions for common requests.
export class Statistics {
    private static instance: Statistics; // Singleton Instance

    // Data
    private sessionInProgress: boolean; // Whether or not a sessions is in progress
    private sessionStart: Date; // When the last session started
    private curSessionInfo: sessionInfo; // The session info of the current session
    private dataPromise: Promise<statisticsData>; // The promise we use to load the stats
    private data: statisticsData; // The actual data 

    protected constructor() {
        // TODO: Load stats from disk
        this.sessionInProgress = false;
        this.data = {
            sessionNumber: 0,
            sessionData: [],
            totalTime: 0,
            dynamicList: [[], []]
        }; // Default values
        this.dataPromise = new Promise((resolve, reject) => { // Statistics loading code 
            let storagePath = cordova.file.dataDirectory; // TODO make this a constant of some sort.
            let statsFile = 'stats.json'; // TODO make this some kind of constant
            File.checkFile(storagePath, statsFile).then((fileExists: boolean) => {
                console.log("Found existing stat file.");
                File.readAsText(storagePath, statsFile).then((contents: string) => {
                    resolve(JSON.parse(contents));
                }, (error: any) => {
                    console.log("Error reading stats file: " + JSON.stringify(error));
                });
            }, (error: any) => {
                if (error.code === 1 || error.code === 13) {
                    console.log("No previous stat file found.");
                    resolve(
                        {
                            sessionNumber: 0,
                            sessionData: [],
                            totalTime: 0,
                            dynamicList: [[], []]
                        }
                    ); // Resolve with new statistics data
                } else {
                    console.log("Error checking for stats file: " + JSON.stringify(error));
                }
            });
        });
        this.dataPromise.then((data: statisticsData) => {
            this.data = data; // Store data in memory for easy of use later
        }, (rejected: any) => {
            console.log("Error on statistics load: " + JSON.stringify(rejected));
        });
    }

    // Returns the instance of the statistics module following the Singleton pattern.
    // Uses lazy instantiation. 
    public static GetStatistics(): Statistics {
        if (!this.instance) { // No instance yet so make one
            Statistics.instance = new Statistics();
        }
        return Statistics.instance; // Return the static instance 
    }

    public StoreData(): void {
        console.log("Trying to store statistics to disk");
        this.dataPromise.then(() => {
            let storagePath = cordova.file.dataDirectory;
            let statsFile = 'stats.json';

            let writeFile = function (data: statisticsData) {
                File.writeFile(storagePath, statsFile, JSON.stringify(data), true).then(() => {
                    console.log("Stats successfully written!");
                }, (error: any) => {
                    console.log("Error writting statistics: " + JSON.stringify(error));
                }); // Overwrite existing stats
            };

            File.checkFile(storagePath, statsFile).then((fileExists: boolean) => {
                console.log("Removing existing stats file.");
                return File.removeFile(storagePath, statsFile).then(() => { }, (error: any) => {
                    console.log("Error removing previous stats file: " + JSON.stringify(error));
                });
            }).then(() => {
                writeFile(this.data); // Write file
            }, (error) => {
                if (error.code === 1 || error.code === 13) {
                    console.log("No previous stats file");
                    writeFile(this.data); // Either way
                } else {
                    console.log("Error checking stats file for write: " + JSON.stringify(error));
                }
            });
        });
    }

    // Call before each session starts, supply the phonemeID and the lessonType
    public StartSession(phonemeID: number, type: LessonType, level: number, isDynamic: boolean): void {
        if (this.sessionInProgress) {
            console.log("Error! Tried to start a session while one was already in progress!");
            return;
        }
        this.sessionInProgress = true; // Set the session in progress flag
        this.sessionStart = new Date(); // Record the start time
        this.curSessionInfo = {  // Instantiate new sessionInfo
            sessionID: phonemeID,
            sessionType: type,
            lessonLevel: level,
            sessionCorrect: 0,
            sessionTotal: 0,
            sessionTime: 0,
            sessionIsDynamic: isDynamic
        }; // this.curSessionInfo
    }

    // Call at the end of each session
    public EndSession(): void {
        if (!this.sessionInProgress) {
            console.log("Error! Tried to end a session while none were in progress!");
            return;
        }
        this.sessionInProgress = false; // Mark the session as off
        let sessionTime = this.sessionStart.getTime() - new Date().getTime(); // Calculate the session time
        this.curSessionInfo.sessionTime = sessionTime; // Update session time.
        this.data.totalTime = this.data.totalTime + sessionTime; // Update total time
        this.data.sessionNumber += 1; // Update the sessionNumber.
        this.dataPromise.then(() => { // Only push after we have finished loading
            this.data.sessionData.push(this.curSessionInfo); // Store the current session
        });
        this.StoreData(); // Store data at the end of each session
    }

    // Records a single screenUnit result, on each attempt
    public Record(unit: screenUnit, correct: Boolean): void {
        this.curSessionInfo.sessionTotal += 1; // Update the currentSession attempts
        if (correct) {
            this.curSessionInfo.sessionCorrect += 1; // Update the currentSession corrects
            if (this.curSessionInfo.sessionIsDynamic) {
                this.data.dynamicList[this.curSessionInfo.sessionType] = this.data.dynamicList[this.curSessionInfo.sessionType].filter((otherUnit: screenUnit) => {
                    return unit.id !== otherUnit.id; // Keep everything except for this screenUnit
                });
            }
        } else {
            if (!this.data.dynamicList[this.curSessionInfo.sessionType].find((otherUnit: screenUnit) => { return unit.id === otherUnit.id; })) {
                this.data.dynamicList[this.curSessionInfo.sessionType].push(unit); // Add the word to the dynamic list
            }
        }
    }

    private GetStatsInternal(data: sessionInfo[], groupBy: number): number[] {
        if (data.length === 0) { // Early out for empty
            return [];
        }
        if (groupBy <= 0) { // If groupBy is less than 0 then just average over all data points
            groupBy = this.data.sessionNumber;
        } // if
        let head: number = 0;
        let phonemeStats: number[] = [];
        let correctSum: number = 0;
        let totalSum: number = 0;
        while ((head < data.length) && (head < groupBy)) {
            correctSum += data[head].sessionCorrect;
            totalSum += data[head].sessionTotal;
            head += 1;
        } // while
        phonemeStats.push(correctSum / totalSum); // Average of sessions
        while (head < data.length) {
            correctSum -= data[head - groupBy].sessionCorrect;
            correctSum += data[head].sessionCorrect;
            totalSum -= data[head - groupBy].sessionTotal;
            totalSum += data[head].sessionTotal;
            head += 1; // update head
            phonemeStats.push(correctSum / totalSum) // average of sessions
        } // while
        return phonemeStats;
    }

    public GetSessionCount(): number {
        return this.data.sessionNumber;
    }

    // Returns an array of accuracy points. Each point will be the accuracy averaged over groupBy sessions.
    // filterFunction: A function to filter the statistics by, will only average statistics that pass the filter
    // groupBy: An integer that specifies how many sessions should be averaged for each data point
    public GetFilteredStats(filterFunction: (val: sessionInfo, index: number, array: sessionInfo[]) => any, groupBy: number): Promise<number[]> {
        return new Promise((resolve, reject) => {
            this.dataPromise.then(() => {
                let filteredStats = this.data.sessionData.filter(filterFunction);
                resolve(this.GetStatsInternal(filteredStats, groupBy));
            });
        });
    }

    // Returns an array of accuracy points. Each point will be the accuracy averaged over groupBy sessions.
    // Phoneme-id: The unique id for the phoneme pair you want the stats for.
    // Type: Specifies either listening, speaking, or both
    // level: Specifies the lesson level [1-3]
    // groupBy: An integer that specifies how many sessions should be averaged for each data point
    public GetPhonemeStatsByLevel(phonemeID: number, type: LessonType, level: number, groupBy: number): Promise<number[]> {
        return this.GetFilteredStats((val: sessionInfo) => {
            return (val.sessionID === phonemeID && val.sessionType === type && val.lessonLevel === level);
        }, groupBy);
    }

    // Returns an array of accuracy points. Each point will be the accuracy averaged over groupBy sessions.
    // Phoneme-id: The unique id for the phoneme pair you want the stats for.
    // Type: Specifies either listening, speaking, or both
    // groupBy: An integer that specifies how many sessions should be averaged for each data point
    public GetPhonemeStatsByType(phonemeID: number, type: LessonType, groupBy: number): Promise<number[]> {
        return this.GetFilteredStats((val: sessionInfo) => {
            return (val.sessionID === phonemeID && val.sessionType === type);
        }, groupBy);
    }

    // Returns an array of accuracy points. Each point will be the accuracy averaged over groupBy sessions. 
    // Type: Specifies either listening, speaking, or both
    // groupBy: An integer that specifies how many sessions should be averaged for each data point
    public GetTotalStatsByType(type: LessonType, groupBy: number): Promise<number[]> {
        return this.GetFilteredStats((val: sessionInfo) => {
            return val.sessionType === type;
        }, groupBy);
    }

    // Returns the total time the user has spent practicing. 
    public GetTotalTime(): number {
        return this.data.totalTime;
    }

    // Returns the current dynamic list
    public GetDynamicList(type: LessonType): Promise<screenUnit[]> {
        return new Promise((resolve, reject) => {
            this.dataPromise.then(() => {
                resolve(this.data.dynamicList[type]);
            });
        });
    }

    // Allows someone to set the dynamic list to remove correct screenUnits
    public SetDynamicList(type: LessonType, list: screenUnit[]): void {
        this.dataPromise.then(() => {
            this.data.dynamicList[type] = list;
        });
    }

    public ResetStatistics(): void {
        this.dataPromise.then(() => {
            this.data = {
                sessionNumber: 0,
                sessionData: [],
                totalTime: 0,
                dynamicList: [[], []]
            }; // Default values
        });
    }

    // Returns the current session info
    public GetCurrentSessionInfo(): sessionInfo {
        return this.curSessionInfo;
    }
}