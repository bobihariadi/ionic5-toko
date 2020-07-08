import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isLogin: boolean = false;
  user: any
  constructor(
    private storageCtrl : Storage,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.storageCtrl.get('isLogin').then((val) => {
      console.log(val);
      if(!val){
        this.router.navigate(['login'],{replaceUrl: true});
      }else{
        this.isLogin = val;
      }
    });
   }

  ngOnInit() {
    this.storageCtrl.get('dataLogin').then((data) => {
      this.user = data[0].full_name;
    });
  }

  goToLogout(){
    // this.isLogin = false;
    this.storageCtrl.clear();
    this.storageCtrl.set('isLogin', false);
    // this.router.navigateByUrl('/login');
    this.router.navigate(['login'],{replaceUrl: true});
  }

  goTo(param){
    this.router.navigateByUrl(param);
  }
}
