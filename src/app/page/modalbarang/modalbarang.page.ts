import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { api_base_url } from 'src/config';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-modalbarang',
  templateUrl: './modalbarang.page.html',
  styleUrls: ['./modalbarang.page.scss'],
})
export class ModalbarangPage implements OnInit {
  passId: number
  action: string
  jwt: any
  arrList: any
  arrTipe: any
  fakeList: Array<any> = new Array(4);
  showList: boolean = false;
  id: number

  kode: any
  nama_barang: any
  tipe_barang: any
  jumlah: number
  isactive: string = "Y"
  listActive: any[] = [
    {
      'val': 'Y',
      'valdesc': 'Ya'
    },
    {
      'val': 'T',
      'valdesc': 'Tidak'
    }
  ]

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private storageCtrl: Storage,
    private router: Router,
    private http: HttpClient,
    private barcodeCtrl: BarcodeScanner,
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
        this.arrTipe = await this.getTipe();
      }
    });
  }

  async getData() {
    this.arrTipe = await this.getTipe();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where id =" + this.passId;

    let arrdata = {
      "action": "rowtable",
      "table": "m_barang",
      "limit": "",
      "order": "",
      "where": where
    };

    this.tipe_barang = '';
    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
      .subscribe(data => {
        this.kode = data['code'];
        this.nama_barang = data['nama_barang'];
        this.tipe_barang = data['tipe_barang'];
        this.jumlah = data['jml'];
        this.isactive = data['isactive'];

        this.showList = true;

      }, error => {
        console.log(error);
      })
  }

  //promise
  getTipe() {
    return new Promise(resolve => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

      let where = "";
      let arrdata = {
        "action": "arraytable",
        "table": "m_tipe",
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

  getScan() {
    this.barcodeCtrl.scan().then(barcodeData => {
      if (barcodeData) {
        this.kode = barcodeData.text;
      }
    }).catch(err => {
      console.log('Error', err);
    });
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

  async saveFormCommit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    
    let arrdata = {
      "action": this.action,
      "table": "m_barang",
      "data": {
        "code": this.kode,
        "isactive": this.isactive,
        "jml": this.jumlah,
        "nama_barang": this.nama_barang,
        "tipe_barang": this.tipe_barang
      },
      "except":"",
      "where": {"id":this.passId}
    };
    console.log(arrdata);
    this.tipe_barang = '';
    this.http.post(api_base_url + 'api/v2/postdata', arrdata, { headers: headers })
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
