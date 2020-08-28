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
  {
    path: 'modalbarang',
    loadChildren: () => import('./page/modalbarang/modalbarang.module').then( m => m.ModalbarangPageModule)
  },
  {
    path: 'listbarang',
    loadChildren: () => import('./page/listbarang/listbarang.module').then( m => m.ListbarangPageModule)
  },
  {
    path: 'modaltipe',
    loadChildren: () => import('./page/modaltipe/modaltipe.module').then( m => m.ModaltipePageModule)
  },
  {
    path: 'listtipe',
    loadChildren: () => import('./page/listtipe/listtipe.module').then( m => m.ListtipePageModule)
  },
  {
    path: 'listharga',
    loadChildren: () => import('./page/listharga/listharga.module').then( m => m.ListhargaPageModule)
  },
  {
    path: 'modalharga',
    loadChildren: () => import('./page/modalharga/modalharga.module').then( m => m.ModalhargaPageModule)
  },
  {
    path: 'daftarbarang',
    loadChildren: () => import('./page/daftarbarang/daftarbarang.module').then( m => m.DaftarbarangPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./page/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'listcabang',
    loadChildren: () => import('./page/listcabang/listcabang.module').then( m => m.ListcabangPageModule)
  },
  {
    path: 'modalcabang',
    loadChildren: () => import('./page/modalcabang/modalcabang.module').then( m => m.ModalcabangPageModule)
  },
  {
    path: 'listuser',
    loadChildren: () => import('./page/listuser/listuser.module').then( m => m.ListuserPageModule)
  },
  {
    path: 'modaluser',
    loadChildren: () => import('./page/modaluser/modaluser.module').then( m => m.ModaluserPageModule)
  },
  {
    path: 'listprinter',
    loadChildren: () => import('./page/listprinter/listprinter.module').then( m => m.ListprinterPageModule)
  },
];

@NgModule({ 
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
