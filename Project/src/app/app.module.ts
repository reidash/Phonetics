import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Phonetics } from './app.component';
import { LessonsList } from '../pages/LessonsList/LessonsList';
import { ProfileManager } from '../pages/ProfileManager/ProfileManager';
import { Goals } from '../pages/Goals/Goals';
import { ListeningController } from '../pages/ListeningController/ListeningController';
import { SpeakingController } from '../pages/SpeakingController/SpeakingController';

@NgModule({
  declarations: [
    Phonetics,
    LessonsList,
    ProfileManager,
    Goals,
    ListeningController,
    SpeakingController
  ],
  imports: [
    IonicModule.forRoot(Phonetics)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Phonetics,
    LessonsList,
    ProfileManager,
    Goals,
    ListeningController,
    SpeakingController
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
