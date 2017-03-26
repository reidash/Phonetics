export interface screenUnit {
    id : number //just an id for this screen unit, 
    word: string //the correct/expected word
    wordOptions: string[],  //words to be presented in the screen unit, ex [rock, lock]; only used in listening mode; speaking mode will present the "word" property
    audioPaths: string [] //paths to audio files for this screen unit
}

export interface lesson {
    id: number;
    name: string;
    description: string;
    path: string;
};

export interface profileData {
    name: string, // Username
    img: string, // Path to user image
    nativeLang: string // User's native language
}

export const enum LessonType { 
    Listening = 0,
    Speaking = 1
}