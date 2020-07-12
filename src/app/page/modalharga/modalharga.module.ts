import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalhargaPageRoutingModule } from './modalharga-routing.module';

import { ModalhargaPage } from './modalharga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalhargaPageRoutingModule
  ],
  declarations: [ModalhargaPage]
})
export class ModalhargaPageModule {}
