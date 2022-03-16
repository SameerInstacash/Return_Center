import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceConditionPage } from './device-condition.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceConditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceConditionPageRoutingModule {}
