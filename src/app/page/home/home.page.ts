import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { api_base_url } from 'src/config';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isLogin: boolean = false;
  user: any
  jwt: any
  Loding: any
  subscription: any
  backButtonPressedOnceToExit: boolean = false;
  lastBack: any
  playerId: any

  constructor(
    private storageCtrl: Storage,
    private toastCtrl: ToastController,
    private router: Router,
    private statusBar: StatusBar,
    private http: HttpClient,
    private alerCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {
    this.statusBar.overlaysWebView(false);
    this.statusBar.styleBlackTranslucent();
    this.statusBar.backgroundColorByHexString('#008000');
    this.storageCtrl.get('isLogin').then((val) => {
      if (!val) {
        this.router.navigate(['login'], { replaceUrl: true });
      } else {
        this.isLogin = val;
      }
    });
  }

  ngOnInit() {
    this.storageCtrl.get('dataLogin').then((data) => {
      this.user = data[0].full_name;
      this.jwt = data[0].jwt;
    });
  }

  async actLogout() {
    this.storageCtrl.get('playerId').then((val) => {
      this.playerId = val;
    });
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon menunggu...',
    });
    await loading.present();

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let arrdata = {
      "action": "logoutapp"
    };

    this.http.post(api_base_url + 'logout', arrdata, { headers: headers })
      .subscribe(data => {
        if (data = 'Ok') {
          loading.dismiss();
          this.storageCtrl.clear();
          this.storageCtrl.set('isLogin', false);
          this.storageCtrl.set('playerId', this.playerId);
          this.router.navigate(['login'], { replaceUrl: true });
        } else {
          loading.dismiss();
          console.log('gagal logout');
        }
      }, error => {
        console.log(error);
      })
  }

  async goToLogout() {
    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Yakin untuk <strong>keluar</strong>!!!',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ya',
          handler: () => {
            this.actLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  goTo(param) {
    this.router.navigateByUrl(param);
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      if (this.backButtonPressedOnceToExit) {
        this.actLogout();
        this.storageCtrl.set('isLogin', false);
        navigator['app'].exitApp();
        
      } else {
        this.backButtonPressedOnceToExit = true;
        this.showTost('Press back button again to exit');
      }
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  async showTost(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 1500,
      position: "bottom"
    });
    toast.present();
  }


}
