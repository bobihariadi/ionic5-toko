import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CekPageRoutingModule } from './cek-routing.module';

import { CekPage } from './cek.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CekPageRoutingModule
  ],
  declarations: [CekPage]
})
export class CekPageModule {}
