import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api_base_url } from 'src/config';

@Component({
  selector: 'app-modaluser',
  templateUrl: './modaluser.page.html',
  styleUrls: ['./modaluser.page.scss'],
})
export class ModaluserPage implements OnInit {
  passId: number
  action: string
  jwt: any
  arrList: any
  arrCabang: any
  arrRole: any
  fakeList: Array<any> = new Array(4);
  showList: boolean = false;
  isDisabled: boolean = false;
  id: number

  password: any
  username: any
  full_name: any
  role: any
  cabang:any
  arrdata: any
  isactive: string = "1"
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

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private storageCtrl: Storage,
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alerCtrl: AlertController
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
    this.passId = this.navParams.get('pass_id');
    this.action = this.navParams.get('action');
    this.storageCtrl.get('dataLogin').then(async (data) => {
      this.jwt = data[0].jwt;

      if (this.action == 'Edit') {
        this.isDisabled = true;
        this.getData();
      } else {
        this.arrCabang = await this.getCabang();
        this.arrRole = await this.getRole();
        this.showList = true;
      }
    });
  }

  async getData() {
    this.arrCabang = await this.getCabang();
    this.arrRole = await this.getRole();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where id =" + this.passId;

    let arrdata = {
      "action": "rowtable",
      "table": "m_user",
      "limit": "",
      "order": "",
      "where": where
    };

    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
      .subscribe(data => {
        this.role = data['level'];
        this.username = data['username'];
        this.full_name = data['full_name'];
        this.cabang = data['branch_id'];
        this.isactive = data['status_user'];

        this.showList = true;

      }, error => {
        console.log(error);
      })
  }

  //promise
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

      this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
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

      this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log(error);
        })
    })
  }

  closeModal() {
    let datatest = {
      "aa": "aa",
      "bb": "bb"
    }
    this.modalCtrl.dismiss(datatest);
  }

  async saveForm(){
    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
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

      this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
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
      message: 'Please wait...',
    });
    await loading.present();
    if(this.password != null){
      if(this.username == null || this.role == null || this.full_name == null || this.cabang == null){
        this.showTost('Lengkapi data');
        loading.dismiss();
        return false;
      }
      this.password = await this.getHas1();
      this.arrdata = {
        "action": this.action,
        "table": "m_user",
        "data": {
          "username": this.username,
          "status_user": this.isactive,
          "full_name": this.full_name,
          "level": this.role,
          "branch_id": this.cabang,
          "password" : this.password
        },
        "except":"",
        "where": {"id":this.passId}
      };
    }else{
      if(this.username == null || this.role == null || this.full_name == null || this.cabang == null){
        this.showTost('Lengkapi data');
        loading.dismiss();
        return false;
      }
      this.arrdata = {
        "action": this.action,
        "table": "m_user",
        "data": {
          "username": this.username,
          "status_user": this.isactive,
          "full_name": this.full_name,
          "level": this.role,
          "branch_id": this.cabang
        },
        "except":"",
        "where": {"id":this.passId}
      };
    }
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    
    
    console.log(this.arrdata);
    this.http.post(api_base_url + 'api/v2/postdata', this.arrdata, { headers: headers })
      .subscribe(data => {
        console.log(data);  
        loading.dismiss();
        this.showTost('Success');
        this.closeModal();
      }, error => {
        loading.dismiss();
        this.showTost('Failed');
        console.log(error);
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
