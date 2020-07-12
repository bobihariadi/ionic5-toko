import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalbarangPageRoutingModule } from './modalbarang-routing.module';

import { ModalbarangPage } from './modalbarang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalbarangPageRoutingModule
  ],
  declarations: [ModalbarangPage]
})
export class ModalbarangPageModule {}
