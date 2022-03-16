import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpectedPageRoutingModule } from './expected-routing.module';

import { ExpectedPage } from './expected.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpectedPageRoutingModule
  ],
  declarations: [ExpectedPage]
})
export class ExpectedPageModule {}
