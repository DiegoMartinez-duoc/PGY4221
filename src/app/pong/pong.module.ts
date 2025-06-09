import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PongPageRoutingModule } from './pong-routing.module';

import { PongPage } from './pong.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PongPageRoutingModule
  ],
  declarations: [PongPage]
})
export class PongPageModule {}
