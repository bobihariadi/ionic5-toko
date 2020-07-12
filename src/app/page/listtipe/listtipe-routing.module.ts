import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListtipePage } from './listtipe.page';

const routes: Routes = [
  {
    path: '',
    component: ListtipePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListtipePageRoutingModule {}
