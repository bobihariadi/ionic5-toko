import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DaftarbarangPage } from './daftarbarang.page';

const routes: Routes = [
  {
    path: '',
    component: DaftarbarangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaftarbarangPageRoutingModule {}
