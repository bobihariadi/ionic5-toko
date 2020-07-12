import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListhargaPage } from './listharga.page';

const routes: Routes = [
  {
    path: '',
    component: ListhargaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListhargaPageRoutingModule {}
