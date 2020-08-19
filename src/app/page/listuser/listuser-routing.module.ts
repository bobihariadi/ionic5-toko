import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListuserPage } from './listuser.page';

const routes: Routes = [
  {
    path: '',
    component: ListuserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListuserPageRoutingModule {}
