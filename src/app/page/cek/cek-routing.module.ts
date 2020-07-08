import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CekPage } from './cek.page';

const routes: Routes = [
  {
    path: '',
    component: CekPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CekPageRoutingModule {}
