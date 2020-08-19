import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModaluserPageRoutingModule } from './modaluser-routing.module';

import { ModaluserPage } from './modaluser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModaluserPageRoutingModule
  ],
  declarations: [ModaluserPage]
})
export class ModaluserPageModule {}
