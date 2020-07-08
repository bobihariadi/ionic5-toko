import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JualPage } from './jual.page';

const routes: Routes = [
  {
    path: '',
    component: JualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JualPageRoutingModule {}
