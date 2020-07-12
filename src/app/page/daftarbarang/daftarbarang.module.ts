import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DaftarbarangPageRoutingModule } from './daftarbarang-routing.module';

import { DaftarbarangPage } from './daftarbarang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DaftarbarangPageRoutingModule
  ],
  declarations: [DaftarbarangPage]
})
export class DaftarbarangPageModule {}
