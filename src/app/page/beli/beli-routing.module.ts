import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeliPage } from './beli.page';

const routes: Routes = [
  {
    path: '',
    component: BeliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeliPageRoutingModule {}
