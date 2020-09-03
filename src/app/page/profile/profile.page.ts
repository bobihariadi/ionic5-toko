import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api_base_url } from 'src/config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  fakeList: Array<any> = new Array(7);
  showList: boolean = false;
  arrList: any = []
  jwt: any
  page: number = 0
  limit: number = 5
  totalRow: number = 0
  arrdata: any = []
  searchTerm: string = "";
  role: any
  password: any
  username: any
  full_name: any
  cabang:any
  arrCabang: any
  arrRole: any
  user_id: any
  branch_id: any
  isactive: string
  isDisabled: any = true
  notif: any
  playerid: any
  listActive: any[] = [
    {
      'val': '1',
      'valdesc': 'Ya'
    },
    {
      'val': '0',
      'valdesc': 'Tidak'
    }
  ]
  listNotif: any[] = [
    {
      'val': 'Y',
      'valdesc': 'Ya'
    },
    {
      'val': 'N',
      'valdesc': 'Tidak'
    }
  ]
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private storageCtrl: Storage,
    private http: HttpClient,
    private alerCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { 
    this.storageCtrl.get('isLogin').then((val) => {
      if (!val) {
        this.router.navigate(['login'], { replaceUrl: true });
      }
    });
    this.storageCtrl.get('dataLogin').then((data) => {
      this.jwt = data[0].jwt;
    });
  }

  ngOnInit() {
    this.storageCtrl.get('dataLogin').then(async (data) => {
      this.jwt = data[0].jwt;
      this.user_id = data[0].id;
      this.arrCabang = await this.getCabang();
      this.branch_id = data[0].branch_id;
      this.role = data[0].level;
      this.getData();      
    });
  }

  async getData() {
    this.arrCabang = await this.getCabang();
    this.arrRole = await this.getRole();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where id =" + this.user_id;

    let arrdata = {
      "action": "rowtable",
      "table": "m_user",
      "limit": "",
      "order": "",
      "where": where
    };

    this.http.post(api_base_url + 'master', arrdata, { headers: headers })
      .subscribe(data => {
        this.role = data['level'];
        this.username = data['username'];
        this.full_name = data['full_name'];
        this.cabang = data['branch_id'];
        this.isactive = data['status_user'];
        this.notif = data['notif'];
        this.playerid = data['player_id'];
        this.showList = true;
      }, error => {
        console.log(error);
      })
  }

  getCabang() {
    return new Promise(resolve => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

      let where = "";
      let arrdata = {
        "action": "arraytable",
        "table": "m_branch",
        "limit": "",
        "order": "", 
        "where": where
      };

      this.http.post(api_base_url + 'master', arrdata, { headers: headers })
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log(error);
        })
    })
  }

  getRole() {
    return new Promise(resolve => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

      let where = "";
      let arrdata = {
        "action": "arraytable",
        "table": "m_level",
        "limit": "",
        "order": "", 
        "where": where
      };

      this.http.post(api_base_url + 'master', arrdata, { headers: headers })
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log(error);
        })
    })
  }

  async saveForm(){
    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Simpan data ini?',
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
            this.saveFormCommit();
          }
        }
      ]
    });

    await alert.present();
  }

  getHas1(){
    return new Promise(resolve => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

      let where = "";
      let arrdata = {
        "action": "sha1",
        "table": this.password,
        "limit": "",
        "order": "", 
        "where": where
      };

      this.http.post(api_base_url + 'master', arrdata, { headers: headers })
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log(error);
        })
    })
  }

  async saveFormCommit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon menunggu...',
    });
    await loading.present();
    if(this.password != null){      
      this.password = await this.getHas1();
      this.arrdata = {
        "action": "Edit",
        "table": "m_user",
        "data": {          
          "full_name": this.full_name,
          "password" : this.password,
          "notif": this.notif 
        },
        "except":"",
        "where": {"id":this.user_id}
      };
    }else{
      this.arrdata = {
        "action": "Edit",
        "table": "m_user",
        "data": {
          "full_name": this.full_name,
          "notif": this.notif
        },
        "except":"",
        "where": {"id":this.user_id}
      };
    }
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    
    
    console.log(this.arrdata);
    this.http.post(api_base_url + 'postdata', this.arrdata, { headers: headers })
      .subscribe(data => {
        loading.dismiss();
        this.showTost('Berhasil simpan data');
        setTimeout(() => {
            this.router.navigate(['master'], { replaceUrl: true });            
          }, 3000);
      }, error => {
        loading.dismiss();
        this.showTost('Gagal');
        console.log(error);
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

}
