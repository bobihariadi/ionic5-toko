import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListuserPageRoutingModule } from './listuser-routing.module';

import { ListuserPage } from './listuser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListuserPageRoutingModule
  ],
  declarations: [ListuserPage]
})
export class ListuserPageModule {}
