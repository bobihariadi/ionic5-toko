import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListbarangPage } from './listbarang.page';

const routes: Routes = [
  {
    path: '',
    component: ListbarangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListbarangPageRoutingModule {}
