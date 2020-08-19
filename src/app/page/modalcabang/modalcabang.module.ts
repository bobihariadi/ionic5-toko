import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalcabangPageRoutingModule } from './modalcabang-routing.module';

import { ModalcabangPage } from './modalcabang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalcabangPageRoutingModule
  ],
  declarations: [ModalcabangPage]
})
export class ModalcabangPageModule {}
