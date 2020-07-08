import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {api_base_url} from '../../../config';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  fakeList: Array<any> = new Array(5);
  username: string="";
  password: string="";
  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private storageCtrl: Storage,
    public router: Router,
    private statusBar: StatusBar
  ) {
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#007e00')
    this.storageCtrl.get('isLogin').then((val) => {
      if (val) {
        this.router.navigate(['home'],{replaceUrl: true});
      }
    });
  }

  ngOnInit() {
    this.storageCtrl.get('isLogin').then((val) => {
      console.log(val);
      if (val) {
        // this.router.navigateByUrl('/home');
        this.router.navigate(['home'],{replaceUrl: true});
      }
    });
  }

  goLogin() {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Basic ' + btoa(this.username + ':' + this.password));

    let arrdata = {
      "action": "loginapp",
      "username": this.username,
      "table": "M_USER"
    };
    console.log(this.username);
    if ((!this.username) || (!this.password)) {
      this.showTost('Username or Password canot be empty');
      return false;
    }
    this.http.post(api_base_url+'api/v2/login', arrdata, { headers: headers })
      .subscribe(data => {
        this.showTost('Success');
        this.storageCtrl.set('isLogin', true);
        this.storageCtrl.set('dataLogin', data);
        this.router.navigate(['home'],{replaceUrl: true});
      }, error => {
        console.log(error);
        this.showTost(error.error.text);
      })
  }

  async showTost(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

}
