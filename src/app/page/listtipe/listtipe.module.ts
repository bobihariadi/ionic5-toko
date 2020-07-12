import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListtipePageRoutingModule } from './listtipe-routing.module';

import { ListtipePage } from './listtipe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListtipePageRoutingModule
  ],
  declarations: [ListtipePage]
})
export class ListtipePageModule {}
