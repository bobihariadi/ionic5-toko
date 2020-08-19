import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModaluserPage } from './modaluser.page';

const routes: Routes = [
  {
    path: '',
    component: ModaluserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModaluserPageRoutingModule {}
