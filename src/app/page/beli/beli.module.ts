import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeliPageRoutingModule } from './beli-routing.module';

import { BeliPage } from './beli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeliPageRoutingModule
  ],
  declarations: [BeliPage]
})
export class BeliPageModule {}
