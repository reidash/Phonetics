import { Platform } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

export interface profileData {
  name: string, // Username
  img: string, // Path to user image
  nativeLang: string // User's native language
}

// Class for loading and storing profileData. 
export class ProfileInfo {
    // Gets any existing profile data. 
    getInfo = function(plt: Platform): Promise<profileData> {
         return new Promise<profileData>((resolve, reject) => {
            plt.ready().then((readySource) => {
                if(readySource !== 'dom') {
                    NativeStorage.getItem('profileData').then(
                        profileData => { // profileData found use it.
                            resolve(profileData);
                        } // profileData
                    ) // then
                }
            }); // readySource
         });      
    }

    // Sets and stores data as the profileData.
    // Will overwrite any existing data.
    storeInfo = function(data: profileData, plt: Platform) {
        plt.ready().then((readySource) => {
            if(readySource !== 'dom') {
                NativeStorage.setItem('profileData', data).then( // Store all user data
                    () => console.log("Stored profileInfo: " + JSON.stringify(data)),
                    error => console.log("Error storing user info: " + error)
                ); // then
            } // if
        }); // readySource
    }
}