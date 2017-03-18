import { screenUnit, LessonType } from './interfaces';

interface sessionInfo {
    sessionID: number, // phonemeID of the session 
    sessionType: LessonType, // Lesson type, either Speaking or Listening
    lessonLevel: number, // the level of the lesson [1-3]
    sessionCorrect: number, // Number of correct screenUnits in the session
    sessionTotal: number // Number of total screenUnits in the session
    sessionTime: number // How long this session took
}

// A class that stores session statistics.
// Provides functions for accessing filtered statistics data as well as simplified 
// functions for common requests.
export class Statistics
{
    private static instance: Statistics; // Singleton Instance
    
    // Data
    private sessionInProgress: Boolean; // Whether or not a sessions is in progress
    private sessionStart: Date; // When the last session started
    private curSessionInfo: sessionInfo; // The session info of the current session
    private sessionNumber: number; // The number of session attempts made so far
    private dataPromise: Promise<sessionInfo[]>; // The promise we use to load the stats
    private sessionData: sessionInfo[]; // All session data ever recorded
    private totalTime: number; // Is this a number?
    
    protected constructor()
    {
        // TODO: Load stats from disk
        this.sessionInProgress = false;
        this.sessionNumber = 0;
        this.sessionData = [];
        this.totalTime = 0;
        this.dataPromise = new Promise((resolve, reject) => {
            // TODO actually load from a file instead of this
            resolve([])
        });
        this.dataPromise.then((data: sessionInfo[]) => {
            this.sessionData = data; // Store data locally for easy of use later
        }, (rejected: any) => {
            console.log("Error on statistics load: " + rejected);
        });
    }
    
    // Returns the instance of the statistics module following the Singleton pattern.
    // Uses lazy instantiation. 
    public static GetStatistics(): Statistics
    {
         if(!this.instance) { // No instance yet so make one
            Statistics.instance = new Statistics();
        }
        return Statistics.instance; // Return the static instance 
    }

    // Call before each session starts, supply the phonemeID and the lessonType
    public StartSession(phonemeID: number, type: LessonType, level: number): void
    {
        if(this.sessionInProgress) {
            // TODO: ERROR Message
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
            sessionTime: 0
        }; // this.curSessionInfo
    }

    // Call at the end of each session
    public EndSession(): void
    {
        if(!this.sessionInProgress) {
            // TODO: Error Message
            return;
        }
        this.sessionInProgress = false; // Mark the session as off
        let sessionTime = this.sessionStart.getTime() - new Date().getTime(); // Calculate the session time
        this.curSessionInfo.sessionTime = sessionTime; // Update session time.
        this.totalTime = this.totalTime + sessionTime; // Update total time
        this.sessionNumber += 1; // Update the sessionNumber.
        this.dataPromise.then(() => { // Only push after we have finished loading
            this.sessionData.push(this.curSessionInfo); // Store the current session
        });
    }

    // Records a single screenUnit result, on each attempt
    public Record(unit: screenUnit, correct: Boolean): void
    {
        // TODO: Update the dynamic list. 
        this.curSessionInfo.sessionTotal += 1; // Update the currentSession attempts
        if(correct) {
            this.curSessionInfo.sessionCorrect += 1; // Update the currentSession corrects
        }
    }

    private GetStatsInternal(data: sessionInfo[], groupBy: number): [number, number][]
    {
        if(data.length === 0) { // Early out for empty
            return [];
        }
        if(groupBy <= 0) { // If groupBy is less than 0 then just average over all data points
            groupBy = this.sessionNumber;
        } // if
        let head: number = 0;
        let phonemeStats: [number, number][] = [];
        let sum: number = 0;
        while((head < data.length) && (head < groupBy)) {
            sum += data[head].sessionCorrect/data[head].sessionTotal; // Add averages
            head += 1;
        } // while
        phonemeStats.push([0, sum/head]); // Average of averages
        while(head < data.length) {
            sum -= data[head - groupBy].sessionCorrect/data[head - groupBy].sessionTotal; // Remove oldest average
            sum += data[head].sessionCorrect/data[head].sessionTotal; // Add newest average
            head += 1; // update head
            phonemeStats.push([head - groupBy, sum/groupBy]) // average of averages
        } // while
        return phonemeStats;
    }

    public GetSessionCount(): number
    {
        return this.sessionNumber;
    }

    // Returns an array of accuracy points. Each point will be the accuracy averaged over groupBy sessions.
    // filterFunction: A function to filter the statistics by, will only average statistics that pass the filter
    // groupBy: An integer that specifies how many sessions should be averaged for each data point
    public GetFilteredStats(filterFunction: (val: sessionInfo, index: number, array: sessionInfo[])=>any, groupBy: number): Promise<[number, number][]>
    {
        return new Promise((resolve, reject) => {
            this.dataPromise.then(() => {
                let filteredStats = this.sessionData.filter(filterFunction);
                resolve(this.GetStatsInternal(filteredStats, groupBy));
            });
        });
    }

    // Returns an array of accuracy points. Each point will be the accuracy averaged over groupBy sessions.
    // Phoneme-id: The unique id for the phoneme pair you want the stats for.
    // Type: Specifies either listening, speaking, or both
    // level: Specifies the lesson level [1-3]
    // groupBy: An integer that specifies how many sessions should be averaged for each data point
    public GetPhonemeStatsByLevel(phonemeID: number, type: LessonType, level: number, groupBy: number): Promise<[number, number][]>
    {
        return this.GetFilteredStats((val: sessionInfo) => { 
            return (val.sessionID === phonemeID && val.sessionType === type && val.lessonLevel === level);
        }, groupBy);
    }

    // Returns an array of accuracy points. Each point will be the accuracy averaged over groupBy sessions.
    // Phoneme-id: The unique id for the phoneme pair you want the stats for.
    // Type: Specifies either listening, speaking, or both
    // groupBy: An integer that specifies how many sessions should be averaged for each data point
    public GetPhonemeStatsByType(phonemeID: number, type: LessonType, groupBy: number): Promise<[number, number][]>
    {
        return this.GetFilteredStats((val: sessionInfo) => {
            return (val.sessionID === phonemeID && val.sessionType === type);
        }, groupBy);
    }

    // Returns an array of accuracy points. Each point will be the accuracy averaged over groupBy sessions. 
    // Type: Specifies either listening, speaking, or both
    // groupBy: An integer that specifies how many sessions should be averaged for each data point
    public GetTotalStatsByType(type: LessonType, groupBy: number): Promise<[number, number][]>
    {
        return this.GetFilteredStats((val: sessionInfo) => {
            return val.sessionType === type;
        }, groupBy);
    }

    // Returns the total time the user has spent practicing. 
    public GetTotalTime(): number
    {
        return this.totalTime;
    }
}