import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListhargaPageRoutingModule } from './listharga-routing.module';

import { ListhargaPage } from './listharga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListhargaPageRoutingModule
  ],
  declarations: [ListhargaPage]
})
export class ListhargaPageModule {}
