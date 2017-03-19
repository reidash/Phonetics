import { File } from 'ionic-native';
import { Util } from '../util';

declare var cordova: any;

export class LessonsLoader {
    getLessons = function (lang: string) {
        let configPath = cordova.file.applicationDirectory + 'www/assets/screenUnits/Japanese/';
        let fileName = 'config.json';
        console.log(configPath + fileName);
        return new Promise<any>((resolve, reject) => {
            File.readAsText(configPath, fileName)
                .then(text => {
                    if (typeof text === 'string') {
                        resolve(JSON.parse(text).lessons);
                    }
                })
                .catch(err => reject(err));
        });
    };

    getScreenUnits = function (numUnits: number, sourceFolder: string) {
        let path = cordova.file.applicationDirectory + 'www/';
        return (
            File.listDir(path, sourceFolder)
                .then((files) => {
                    let util = new Util();
                    files = util.shuffle(files);
                    let screenUnits = [];
                    for (let i = 0; i < numUnits; i++) {
                        screenUnits.push(
                            File.readAsText(path + sourceFolder, files[i].name)
                                .then(text => {
                                    if (typeof text === 'string') {
                                        return JSON.parse(text);
                                    }
                                })
                                .catch(err => console.log("err: " + err.message))
                        );
                    }

                    return screenUnits;
                })
                .catch(err => {
                    console.log("listdir error " + err.message);
                    return null;
                })
        );
    };
}