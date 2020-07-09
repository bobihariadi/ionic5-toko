import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-jual',
  templateUrl: './jual.page.html',
  styleUrls: ['./jual.page.scss'],
})
export class JualPage implements OnInit {

  constructor(
    private storageCtrl: Storage,
    private router: Router,
    private statusBar: StatusBar
  ) {
    this.storageCtrl.get('isLogin').then((val) => {
      this.statusBar.styleBlackTranslucent();
      this.statusBar.backgroundColorByHexString('#008000');
      console.log(val);
      if(!val){
        this.router.navigate(['login'],{replaceUrl: true});
      }
    });
   }

  ngOnInit() {
  }

}
