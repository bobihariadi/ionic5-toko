import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListbarangPageRoutingModule } from './listbarang-routing.module';

import { ListbarangPage } from './listbarang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListbarangPageRoutingModule
  ],
  declarations: [ListbarangPage]
})
export class ListbarangPageModule {}
