import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceCheckUpPageRoutingModule } from './device-check-up-routing.module';

import { DeviceCheckUpPage } from './device-check-up.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeviceCheckUpPageRoutingModule
  ],
  declarations: [DeviceCheckUpPage]
})
export class DeviceCheckUpPageModule {}
