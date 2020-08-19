import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalcabangPage } from './modalcabang.page';

const routes: Routes = [
  {
    path: '',
    component: ModalcabangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalcabangPageRoutingModule {}
