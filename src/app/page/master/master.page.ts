import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master',
  templateUrl: './master.page.html',
  styleUrls: ['./master.page.scss'],
})
export class MasterPage implements OnInit {
  role: any
  isAdministrator: any = false
  jwt: any
  
  constructor(
    private storageCtrl: Storage,
    private router: Router,
  ) { 
    this.storageCtrl.get('isLogin').then((val) => {
      if(!val){
        this.router.navigate(['login'],{replaceUrl: true});
      }
    });
  }

  ngOnInit() {
    this.storageCtrl.get('dataLogin').then((data) => {
      this.jwt = data[0].jwt;
      this.role = data[0].level;
      if(this.role == '1'){
        this.isAdministrator = true;
      }
    });
  }

  goTo(param) {
    this.router.navigateByUrl(param);
  }

}
