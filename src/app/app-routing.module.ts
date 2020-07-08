import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./page/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'transaksi',
    loadChildren: () => import('./page/transaksi/transaksi.module').then( m => m.TransaksiPageModule)
  },
  {
    path: 'master',
    loadChildren: () => import('./page/master/master.module').then( m => m.MasterPageModule)
  },
  {
    path: 'jual',
    loadChildren: () => import('./page/jual/jual.module').then( m => m.JualPageModule)
  },
  {
    path: 'beli',
    loadChildren: () => import('./page/beli/beli.module').then( m => m.BeliPageModule)
  },
  {
    path: 'cek',
    loadChildren: () => import('./page/cek/cek.module').then( m => m.CekPageModule)
  },
];

@NgModule({ 
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
