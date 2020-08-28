import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListprinterPage } from './listprinter.page';

const routes: Routes = [
  {
    path: '',
    component: ListprinterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListprinterPageRoutingModule {}
