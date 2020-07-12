import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModaltipePage } from './modaltipe.page';

const routes: Routes = [
  {
    path: '',
    component: ModaltipePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModaltipePageRoutingModule {}
