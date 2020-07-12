import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalbarangPage } from './modalbarang.page';

const routes: Routes = [
  {
    path: '',
    component: ModalbarangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalbarangPageRoutingModule {}
