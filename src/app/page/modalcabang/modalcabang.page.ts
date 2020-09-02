import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api_base_url } from 'src/config';

@Component({
  selector: 'app-modalcabang',
  templateUrl: './modalcabang.page.html',
  styleUrls: ['./modalcabang.page.scss'],
})
export class ModalcabangPage implements OnInit {
  passId: number
  action: string
  jwt: any
  arrList: any
  fakeList: Array<any> = new Array(4);
  showList: boolean = false;
  id: number
  nama: any
  alamat: any
  
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
        this.getData();
      } else {
        this.showList = true;
      }
    });
  }

  async getData() {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where branch_id =" + this.passId;

    let arrdata = {
      "action": "rowtable",
      "table": "m_branch",
      "limit": "",
      "order": "",
      "where": where
    };

    this.http.post(api_base_url + 'master', arrdata, { headers: headers })
      .subscribe(data => {
        this.nama = data['branch_name'];
        this.alamat = data['branch_address'];
        this.showList = true;

      }, error => {
        console.log(error);
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

  async saveFormCommit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon menunggu...',
    });
    await loading.present();

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    
    let arrdata = {
      "action": this.action,
      "table": "m_branch",
      "data": {
        "branch_name": this.nama,
        "branch_address": this.alamat
      },
      "except":"",
      "where": {"branch_id":this.passId}
    };

    this.http.post(api_base_url + 'postdata', arrdata, { headers: headers })
      .subscribe(data => {
        console.log(data);  
        loading.dismiss();
        this.showTost('Berhasil simpan data');
        this.closeModal();
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
