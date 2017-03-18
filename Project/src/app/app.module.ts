import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Phonetics } from './app.component';
import { PhonemeList } from '../pages/PhonemeList/PhonemeList';
import { ProfileSetup } from '../pages/ProfileSetup/ProfileSetup';
import { Goals } from '../pages/Goals/Goals';
import { ListeningMode } from '../pages/ListeningMode/ListeningMode';
import { SpeakingMode } from '../pages/SpeakingMode/SpeakingMode';

@NgModule({
  declarations: [
    Phonetics,
    PhonemeList,
    ProfileSetup,
    Goals,
    ListeningMode,
    SpeakingMode
  ],
  imports: [
    IonicModule.forRoot(Phonetics)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Phonetics,
    PhonemeList,
    ProfileSetup,
    Goals,
    ListeningMode,
    SpeakingMode
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
