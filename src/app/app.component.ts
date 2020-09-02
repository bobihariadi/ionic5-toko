import { Component } from '@angular/core';

import { Platform, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  showSplash = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private storageCtrl: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.statusBar.hide();
      // this.statusBar.overlaysWebView(true);
      // this.statusBar.backgroundColorByHexString('#008000'); 
      if(this.platform.is('cordova')){
        this.setupPush();
      }
      

      timer(2000).subscribe(()=> this.showSplash = false); ()=>this.splashScreen.hide();
    });
  }

  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit('240edd41-51c0-4b54-adc4-5c42cc8b5fa2', '370691792130');
 
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
 
    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });
 
    // Notification was really clicked/opened
    // this.oneSignal.handleNotificationOpened().subscribe(data => {
    //   // Just a note that the data is a different place here!
    //   let msg = data.notification.payload.body;
    //   let title = data.notification.payload.title;
    //   let additionalData = data.notification.payload.additionalData;
      
    //   this.showAlert(msg, title, additionalData.task);
    // });
 
    this.oneSignal.endInit();
    this.oneSignal.getIds().then(identity => {     
      this.storageCtrl.set('palyerId', identity.userId); 
    });
  }

  async showTost(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

  async showAlert(title: any, msg: any, task: any) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Buka`,
          handler: () => {
            this.router.navigateByUrl(task);
          }
        }
      ]
    })
    alert.present();
  }

}
