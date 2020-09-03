import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {api_base_url} from 'src/config';
import { OneSignal } from '@ionic-native/onesignal/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  fakeList: Array<any> = new Array(5);
  username: string=""
  password: string=""
  subscription: any
  playerId: any = null
  isDisabled: boolean = false

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private storageCtrl: Storage,
    public router: Router,
    private oneSignal: OneSignal,
    private statusBar: StatusBar,
    private platform: Platform
  ) {
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#008000');
    
  }

  ngOnInit() {
    this.oneSignal.startInit('240edd41-51c0-4b54-adc4-5c42cc8b5fa2', '370691792130');
    this.oneSignal.endInit();
    this.oneSignal.getIds().then(identity => {     
      this.storageCtrl.set('playerId', identity.userId); 
      this.playerId = identity.userId; 
      console.log(identity.userId);
    });

    // this.storageCtrl.get('playerId').then((val) => {
    //   this.playerId = val;
    // });
    this.storageCtrl.get('isLogin').then((val) => {
      if (val) {
        this.router.navigate(['home'],{replaceUrl: true});
      }
    });
  }

  

  goLogin() {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Basic ' + btoa(this.username + ':' + this.password));
    
    this.isDisabled = true;

    let arrdata = {
      "action": "loginapp",
      "username": this.username,
      "table": "M_USER",
      "playerid": this.playerId
    };

    if ((!this.username) || (!this.password)) {
      this.showTost('Username atau Password harus diisi');
      return false;
    }
    this.http.post(api_base_url+'login', arrdata, { headers: headers })
      .subscribe(data => {
        if(data == 'N'){
          this.showTost('User tidak aktif');
          this.isDisabled = false;
          return false;
        }
        this.showTost('Berhasil Login');
        this.storageCtrl.set('isLogin', true);
        this.storageCtrl.set('dataLogin', data);
        setTimeout(() => {
          this.router.navigate(['home'],{replaceUrl: true});          
        }, 1000);
      }, error => {
        console.log(error);
        this.isDisabled = false;
        this.showTost(error.error.text);
      })
  }

  async showTost(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 1000,
      position: "bottom"
    });
    toast.present();
  }

  ionViewDidEnter() {
    this.oneSignal.startInit('240edd41-51c0-4b54-adc4-5c42cc8b5fa2', '370691792130');
    this.oneSignal.endInit();
    this.oneSignal.getIds().then(identity => {     
      this.storageCtrl.set('playerId', identity.userId); 
      this.playerId = identity.userId; 
      console.log(identity.userId);
    });
    
    this.subscription = this.platform.backButton.subscribe(() => {
        navigator['app'].exitApp();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
