import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceConditionPageRoutingModule } from './device-condition-routing.module';

import { DeviceConditionPage } from './device-condition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeviceConditionPageRoutingModule
  ],
  declarations: [DeviceConditionPage]
})
export class DeviceConditionPageModule {}
