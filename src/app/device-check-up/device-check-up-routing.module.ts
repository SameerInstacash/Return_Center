import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceCheckUpPage } from './device-check-up.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceCheckUpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceCheckUpPageRoutingModule {}
