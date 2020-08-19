import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListcabangPageRoutingModule } from './listcabang-routing.module';

import { ListcabangPage } from './listcabang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListcabangPageRoutingModule
  ],
  declarations: [ListcabangPage]
})
export class ListcabangPageModule {}
