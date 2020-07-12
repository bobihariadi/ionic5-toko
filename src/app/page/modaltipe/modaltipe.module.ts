import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModaltipePageRoutingModule } from './modaltipe-routing.module';

import { ModaltipePage } from './modaltipe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModaltipePageRoutingModule
  ],
  declarations: [ModaltipePage]
})
export class ModaltipePageModule {}
