import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Phonetics } from './app.component';
import { PhonemeList } from '../pages/PhonemeList/PhonemeList';
import { ProfileSetup } from '../pages/ProfileSetup/ProfileSetup';
import { Goals } from '../pages/Goals/Goals';

@NgModule({
  declarations: [
    Phonetics,
    PhonemeList,
    ProfileSetup,
    Goals
  ],
  imports: [
    IonicModule.forRoot(Phonetics)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Phonetics,
    PhonemeList,
    ProfileSetup,
    Goals
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
