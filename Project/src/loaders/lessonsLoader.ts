import { File } from 'ionic-native';
import { Util } from '../util';
import { lesson } from '../interfaces';

declare var cordova: any;

export class LessonsLoader {
    getLanguages() {
        let configPath = cordova.file.applicationDirectory;
        let folderPath = 'www/assets/screenUnits/';
        return new Promise<string[]>((resolve, reject) => {
            File.listDir(configPath, folderPath)
                .then((files) => {
                    let langs: string[] = files
                        .filter(val => val.isDirectory)
                        .map(val => val.name);
                    resolve(langs);
                })
                .catch(err => reject(err));
        });
    }

    getLessons(lang: string) {
        let configPath = cordova.file.applicationDirectory + 'www/assets/screenUnits/' + lang;
        let fileName = 'config.json';

        return new Promise<lesson[]>((resolve, reject) => {
            File.readAsText(configPath, fileName)
                .then(text => {
                    if (typeof text === 'string') {
                        resolve(JSON.parse(text).lessons);
                    }
                })
                .catch(err => reject(err));
        });
    };

    getPair(sourceFolder: string) {
        let path = cordova.file.applicationDirectory + 'www/';
        return (
            File.listDir(path, sourceFolder)
                .then((files) => {
                    let index = Math.floor(Math.random() * files.length);
                    let screenUnits = [];
                    screenUnits.push(
                        File.readAsText(path + sourceFolder, files[index].name)
                            .then(text => {
                                if (typeof text === 'string') {
                                    return JSON.parse(text);
                                }
                            })
                            .catch(err => console.log("err: " + err.message))
                    );

                    //paired word of even file name always comes after
                    if(Number(files[index].name.substring(0, files[index].name.indexOf('.'))) % 2 === 0) {
                        index++;
                    } else {
                        index--;
                    }

                    screenUnits.push(
                        File.readAsText(path + sourceFolder, files[index].name)
                            .then(text => {
                                if (typeof text === 'string') {
                                    return JSON.parse(text);
                                }
                            })
                            .catch(err => console.log("err: " + err.message))
                    );

                    return screenUnits;
                })
                .catch(err => {
                    console.log("listdir error " + err.message);
                    return null;
                })
        );
    }

    getScreenUnits(numUnits: number, sourceFolder: string) {
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