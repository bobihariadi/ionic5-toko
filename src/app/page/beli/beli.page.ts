import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-beli',
  templateUrl: './beli.page.html',
  styleUrls: ['./beli.page.scss'],
})
export class BeliPage implements OnInit {

  constructor(
    private storageCtrl: Storage,
    private router: Router,
    private statusBar: StatusBar
  ) { 
    this.storageCtrl.get('isLogin').then((val) => {
      console.log(val);
      if(!val){
        this.router.navigate(['login'],{replaceUrl: true});
      }
    });
  }

  ngOnInit() {
  }

}
