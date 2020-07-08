import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JualPageRoutingModule } from './jual-routing.module';

import { JualPage } from './jual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JualPageRoutingModule
  ],
  declarations: [JualPage]
})
export class JualPageModule {}
