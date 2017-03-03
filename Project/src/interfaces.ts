export interface screenUnit {
    id : number //just an id for this screen unit, 
    word: string //the correct/expected word
    wordOptions: string[],  //words to be presented in the screen unit, ex [rock, lock]; only used in listening mode; speaking mode will present the "word" property
    audioPaths: string [] //paths to audio files for this screen unit
}