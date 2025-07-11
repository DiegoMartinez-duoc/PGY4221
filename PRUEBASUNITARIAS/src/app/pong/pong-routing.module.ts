import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PongPage } from './pong.page';

const routes: Routes = [
  {
    path: '',
    component: PongPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PongPageRoutingModule {}
