import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api_base_url } from 'src/config';

@Component({
  selector: 'app-beli',
  templateUrl: './beli.page.html',
  styleUrls: ['./beli.page.scss'],
})
export class BeliPage implements OnInit {
  kode: any = ""
  harga: any
  harga_real: any =0
  jml: number = 1;
  sub_harga: any = 0
  nama: any
  arrList:any = []
  arrBelanja:any = []
  arrReturn: any = []
  arrCabang: any = []
  id_barang: any
  showList: boolean = false;
  jwt: any
  user_id: any
  tipe_beli: string = 'G'
  arrdata:any
  batchBeli:any
  total: any = 0
  branch_id: any
  isdisabled: any = false
  arrPlayerId: any=[]
  role: any
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
  fakeList: Array<any> = new Array(3);
  arrMonth: any[]=[
    "JAN","FEB","MAR","APR","MEI","JUN","JUL","AGU","SEP","OKT","NOV","DES"
  ]
  monthDesc: any

  constructor(    
    private storageCtrl: Storage,
    private router: Router,
    private statusBar: StatusBar,
    private barcodeCtrl: BarcodeScanner,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
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
    this.kode = '';
    this.storageCtrl.get('dataLogin').then(async(data) => {
      this.jwt = data[0].jwt;
      this.user_id = data[0].id;
      this.arrCabang = await this.getCabang();
      this.branch_id = data[0].branch_id;
      this.role = data[0].level;
      if(this.role != '1'){
        this.isdisabled = true;
      }
    });
    this.storageCtrl.get('databatchBeli').then((val) => {
      if(!val){
        const d = new Date();
        this.monthDesc = this.arrMonth[d.getMonth()];
        this.batchBeli = this.monthDesc+"-"+Math.floor(Math.random() * 10000)+1;      
        console.log(this.batchBeli);
        this.storageCtrl.set('databatchBeli', this.batchBeli);
      }else{
        this.batchBeli = val;
      }
      this.getBelanja();
    });
  }

  getCabang(param="") {
    return new Promise(resolve => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

      let where = param;
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

  getScan() {
    this.barcodeCtrl.scan().then(barcodeData => {
      if (barcodeData) {
        this.kode = barcodeData.text;
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  async confirmBatal(){
    if (!this.arrBelanja.length) {
      this.showTost('Tidak ada barang belanjaan');
      return false;
    }
    
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Batalkan transaksi pembelian!!!',
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
            this.actBatal();
          }
        }
      ]
    });
    await alert.present();
  }

  async actBayar(){
    if (!this.arrBelanja.length) {
      this.showTost('Tidak ada data pembelian');
      return false;
    }

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Simpan data pembelian!!!',
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
            this.saveBeli();
          }
        }
      ]
    });
    await alert.present();
  }

  async actBatal(){
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon tunggu...',
    });
    await loading.present();

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    
    let arrdata = {
      "action": "Del",
      "table": "tmp_transaksi",
      "data": "",
      "except":"",
      "where": {"tmp_batch":this.batchBeli}
    };

    this.http.post(api_base_url + 'postdata', arrdata, { headers: headers })
      .subscribe(data => {
        loading.dismiss();
        this.showTost('Berhasil dibatalkan');
        this.storageCtrl.set('databatchBeli', '');
        this.router.navigate(['home'], { replaceUrl: true });
      }, error => {
        loading.dismiss();
        this.showTost('Gagal');
        console.log(error);
      })
  }

  getHarga(){
    let tot = this.kode.length;
    if(tot <= 3){
      this.nama = null;
      this.harga = 0;
      this.jml = 1;
      this.sub_harga = 0;
      this.harga_real = 0;
      this.id_barang = null;
      return false;
    };
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where b.code ='" + this.kode +"'  and b.branch_id ="+this.branch_id;
    
    let arrdata = {
      "action": "cekharga",
      "table": "",
      "limit": "",
      "order": "",
      "where": where
    };
    this.http.post(api_base_url + 'master', arrdata, { headers: headers })
    .subscribe(data => {
      this.arrList = data;
      if (!this.arrList.length) {
        this.nama = '';
        this.harga = 0;
        this.jml = 1;
        this.sub_harga = 0;
        this.harga_real = 0;
        this.id_barang = null;
      } else {
          this.nama = data[0].nama_barang;
          this.id_barang = data[0].id_barang;         
        }
      }, error => {
        console.log(error);
      })
  }

  cekHarga(){
    if(this.jml == null){
      this.jml = 1;
    }
    if(this.id_barang== null && this.harga_real == null){
      return false;
    }

    if(this.harga_real == null){
      this.showTost('Harga harus diisi.');
      return false;
    }

    if(this.id_barang == null && this.harga_real > 0){
      this.showTost('Kode Barang tidak ditemukan.');
      return false;
    }
    
    this.sub_harga = this.jml * this.harga_real;
  }

  async showTost(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 1000,
      position: "bottom"
    });
    toast.present();
  }

  async actTambah(){
    if(this.sub_harga==0 || this.kode ==""){
      this.showTost('Data tidak lengkap atau kode barang tidak ditemukan');
      return false;
    }

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    this.arrdata = {
      "action": "Add",
      "table": "tmp_transaksi",
      "data": {
        "tmp_batch": this.batchBeli,
        "tmp_harga": this.harga,
        "tmp_jml": this.jml,
        "tmp_id_barang": this.id_barang,
        "tmp_tipe_beli": this.tipe_beli,
        "tmp_jenis": "B",
        "tmp_harga_real": this.harga_real,
        "tmp_total": this.harga*this.jml,
        "tmp_total_real": this.harga_real*this.jml,
        "tmp_create_by": this.user_id,
        "tmp_code": this.kode,
        "branch_id": this.branch_id
      },
      "except":"",
      "where": ""
    };

    this.http.post(api_base_url + 'postdata', this.arrdata, { headers: headers })
      .subscribe(data => {
        console.log(data);    
          this.showTost('Data berhasil ditambahkan');
          this.getBelanja();
          this.nama = '';
          this.harga = 0;
          this.jml = 1;
          this.sub_harga = 0;
          this.harga_real = 0;
          this.kode = '';
          this.id_barang = null;
      }, error => {
        this.showTost('Failed');
        console.log(error);
      });
  }

  onChangeCabang(e:any){
    this.branch_id = e.target.value;
    this.getHarga();
  }

  getBelanja() {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

    let where = "where a.tmp_jenis = 'B'and a.tmp_batch like '%" + this.batchBeli + "%'";

    let arrdata = {
      "action": "arraybelanja",
      "table": "",
      "limit": "",
      "order": "order by a.tmp_id",
      "where": where
    };

    this.http.post(api_base_url + 'master', arrdata, { headers: headers })
      .subscribe(data => {
        this.arrReturn =  data;
        if (!this.arrReturn.length) {
          this.arrBelanja = [];
          this.showList = false;
          this.total = 0;
        }else{
          this.arrBelanja = [];
          this.total = 0;
          this.arrReturn.forEach(element => {
            this.arrBelanja.push(element);
            this.total = (parseFloat(element.tmp_total_real) + parseFloat(this.total));
          });
          this.showList = true;
        }
      }, error => {
        console.log(error);
      })
  }

  async confimData(param1) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Yakin <strong>hapus</strong> data ini?',
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
            this.delData(param1);
          }
        }
      ]
    });

    await alert.present();
  }

  async delData(id){
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon tunggu...',
    });
    await loading.present();

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    
    let arrdata = {
      "action": "Del",
      "table": "tmp_transaksi",
      "data": "",
      "except":"",
      "where": {"tmp_id":id}
    };

    this.http.post(api_base_url + 'postdata', arrdata, { headers: headers })
      .subscribe(data => {
        console.log(data);  
        this.getBelanja();
        loading.dismiss();
        this.showTost('Berhasil dihapus');
      }, error => {
        loading.dismiss();
        this.showTost('Gagal');
        console.log(error);
      })
  }

  async saveBeli(){
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon menunggu...',
    });
    await loading.present();

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

    this.arrdata = {
      "action": "beli",
      "table": "tx_payment",
      "data": {
        "pay_batch": this.batchBeli,
        "branch_id": this.branch_id,
        "pay_create_by": this.user_id
       },
      "except":"",
      "where": ""
    };

    this.arrPlayerId = await this.getPlayerId(); 
    this.http.post(api_base_url + 'bayar', this.arrdata, { headers: headers })
      .subscribe(data => {
          this.sendNotif();      
          loading.dismiss();
          this.storageCtrl.set('databatchBeli', null);
          this.showTost('Pembelian berhasil disimpan');
          setTimeout(() => {
            this.router.navigate(['home'], { replaceUrl: true });            
          }, 3000);  
      }, error => {
        loading.dismiss();
        this.showTost('Gagal');
        console.log(error);
      })
  }

  async sendNotif(){
    const arrPlayerid = [];
    this.arrPlayerId.forEach(element => {
      arrPlayerid.push(element.player_id);
    });
    console.log(arrPlayerid);

    let datacabang = await this.getCabang(' where branch_id='+this.branch_id);
    let namaCabang = datacabang['0'].branch_name;
    var headers = new HttpHeaders();

    headers.append('Authorization', 'Basic ZDIzNWUwNTgtMzVjZC00Njk5LWIwOGMtYjZjYjYzMTkzMmI0');
    headers = headers.append('Content-Type', 'application/json; charset=utf-8');
    let content = 'Batch : '+this.batchBeli+', untuk cabang '+namaCabang;

    let arrdata = {
      "app_id" :"240edd41-51c0-4b54-adc4-5c42cc8b5fa2",
      "include_player_ids" : arrPlayerid,
      "headings" : {"en" : "Pembelian Barang"},
      "contents" : {"en" : content},
      "data" : {"task" : "transaksi"}
    }

    this.http.post('https://onesignal.com/api/v1/notifications', arrdata, { headers: headers })
      .subscribe(async data => {
        console.log(data); 
      }, error => {
        console.log(error);
      })
  }

  getPlayerId() {
    return new Promise(resolve => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

      let where = "where level = 1 and notif='Y'";
      let arrdata = {
        "action": "arraytable",
        "table": "m_user",
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

}
