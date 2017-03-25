import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Phonetics } from './app.component';
import { LessonsList } from '../pages/LessonsList/LessonsList';
import { ProfileManager } from '../pages/ProfileManager/ProfileManager';
import { Goals } from '../pages/Goals/Goals';
import { DonutComponent } from '../graphComponents/donut/donut.component';
import { LineComponent } from '../graphComponents/line/line.component';
import { StatisticsVisualizer } from '../pages/StatisticsVisualizer/StatisticsVisualizer';
import { ListeningController } from '../pages/ListeningController/ListeningController';
import { SpeakingController } from '../pages/SpeakingController/SpeakingController';


@NgModule({
  declarations: [
    LineComponent,
    DonutComponent,
    Phonetics,
    LessonsList,
    ProfileManager,
    Goals,
    StatisticsVisualizer,
    ListeningController,
    SpeakingController
  ],
  imports: [
    IonicModule.forRoot(Phonetics)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LineComponent,
    DonutComponent,
    Phonetics,
    LessonsList,
    ProfileManager,
    Goals,
    StatisticsVisualizer,
    ListeningController,
    SpeakingController
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
