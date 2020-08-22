import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api_base_url } from 'src/config';
import { DaftarbarangPage } from '../daftarbarang/daftarbarang.page';

@Component({
  selector: 'app-modalharga',
  templateUrl: './modalharga.page.html',
  styleUrls: ['./modalharga.page.scss'],
})
export class ModalhargaPage implements OnInit {
  id_barang: number
  tipe_beli: string
  kode: string
  nama_barang: string
  action: string
  jwt: any
  user_id: any
  arrTipe: any
  fakeList: Array<any> = new Array(4);
  showList: boolean = false;
  harga: number
  arrdata:any
  arrCabang: any
  branch_id: string

  tipe_barang: any
  jumlah: number
  arrTipeBeli: any[] = [
    {
      'val': 'E',
      'valdesc': 'Eceran'
    },
    {
      'val': 'G',
      'valdesc': 'Grosir'
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
    this.id_barang = this.navParams.get('id_barang');
    this.tipe_beli = this.navParams.get('tipe_beli');
    this.kode = this.navParams.get('code_barang');
    this.nama_barang = this.navParams.get('nama_barang');
    this.action = this.navParams.get('action');
    this.storageCtrl.get('dataLogin').then(async (data) => {
      this.jwt = data[0].jwt;
      this.user_id = data[0].id;
      this.branch_id = data[0].branch_id;
      if (this.action == 'Edit') {
        this.getData();
      } else {
        this.arrCabang = await this.getCabang();
        this.showList = true;
      }
    });
  }

  isReadonly(){
    if (this.action == 'Edit') {
      return true;
    }else{
      return false;
    }
  }

 async getData() {
    this.arrCabang = await this.getCabang();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where id_barang =" + this.id_barang +" and tipe_beli='"+this.tipe_beli+"'";

    let arrdata = {
      "action": "rowtable",
      "table": "m_harga",
      "limit": "",
      "order": "",
      "where": where
    };
    console.log(arrdata);
    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
      .subscribe(data => {
        this.harga = data['harga'];
        this.jumlah = data['jml'];

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
  
  onChange(e){
    if(e.target.value=="E"){
      this.jumlah = 1;
    }else{
      this.jumlah = 12;
    }
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
    
    if(this.action =='Edit'){
      this.arrdata = {
        "action": this.action,
        "table": "m_harga",
        "data": {
          "harga": this.harga
          // "jml": this.jumlah
                },
        "except":"",
        "where": {"id_barang":this.id_barang, "tipe_beli":this.tipe_beli}
      };
    }else{
      this.arrdata = {
        "action": this.action,
        "table": "m_harga",
        "data": {
          "harga": this.harga,
          "jml": this.jumlah,
          "id_barang": this.id_barang,
          "tipe_beli": this.tipe_beli,
          "branch_id": this.branch_id
        },
        "except":"",
        "where": ""
      };
    }

    this.tipe_barang = '';
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

  async getBarang(){
    if (this.action == 'Add') {
      const modal = await this.modalCtrl.create({
        component: DaftarbarangPage,
        cssClass: 'my-custom-class'
      });
  
      modal.onDidDismiss().then((r) => {
        this.kode = r.data.codeBarang;
        this.id_barang = r.data.idbarang;
        this.nama_barang = r.data.namaBarang;
      });
      return await modal.present();      
    }
  }

}
