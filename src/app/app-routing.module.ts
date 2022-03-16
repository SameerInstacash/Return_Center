import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'advance-search',
    loadChildren: () => import('./advance-search/advance-search.module').then( m => m.AdvanceSearchPageModule)
  },
  {
    path: 'expected',
    loadChildren: () => import('./expected/expected.module').then( m => m.ExpectedPageModule)
  },
  {
    path: 'product-info',
    loadChildren: () => import('./product-info/product-info.module').then( m => m.ProductInfoPageModule)
  },
  {
    path: 'device-check-up',
    loadChildren: () => import('./device-check-up/device-check-up.module').then( m => m.DeviceCheckUpPageModule)
  },
  {
    path: 'device-condition',
    loadChildren: () => import('./device-condition/device-condition.module').then( m => m.DeviceConditionPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
