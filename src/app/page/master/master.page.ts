import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master',
  templateUrl: './master.page.html',
  styleUrls: ['./master.page.scss'],
})
export class MasterPage implements OnInit {

  constructor(
    private storageCtrl: Storage,
    private router: Router
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
