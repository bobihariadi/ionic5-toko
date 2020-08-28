import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListprinterPageRoutingModule } from './listprinter-routing.module';

import { ListprinterPage } from './listprinter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListprinterPageRoutingModule
  ],
  declarations: [ListprinterPage]
})
export class ListprinterPageModule {}
