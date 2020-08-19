import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListcabangPage } from './listcabang.page';

const routes: Routes = [
  {
    path: '',
    component: ListcabangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListcabangPageRoutingModule {}
