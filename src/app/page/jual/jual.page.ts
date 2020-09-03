import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { api_base_url } from 'src/config';

@Component({
  selector: 'app-jual',
  templateUrl: './jual.page.html',
  styleUrls: ['./jual.page.scss'],
})
export class JualPage implements OnInit {

  kode: any = ""
  harga: any
  harga_real: any =0
  jml: number = 1;
  sub_harga: any = 0
  nama: any
  arrList:any = []
  arrBelanja:any = []
  arrReturn: any = []
  id_barang: any
  arrCabang: any
  showList: boolean = false
  showLoading: boolean = false
  jwt: any
  user_id: any
  tipe_beli: string = 'E'
  arrdata:any
  batch:any
  total: any = 0
  branch_id: any = 1
  isdisabled: any = false
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
      if(!val){
        this.router.navigate(['login'],{replaceUrl: true});
      }
    });    
   }

  ngOnInit() {
    this.kode = '';  
    this.storageCtrl.get('dataLogin').then(async (data) => {
      this.jwt = data[0].jwt;
      this.user_id = data[0].id;      
      this.arrCabang = await this.getCabang();
      this.branch_id = data[0].branch_id;
      this.role = data[0].level;
      if(this.role != '1'){
        this.isdisabled = true;
      }
    }); 
    this.storageCtrl.get('dataBatch').then((val) => {
      if(!val){
        const d = new Date();
        this.monthDesc = this.arrMonth[d.getMonth()];
        this.batch = this.monthDesc+"-"+Math.floor(Math.random() * 10000)+1;      
        console.log(this.batch);
        this.storageCtrl.set('dataBatch', this.batch);
      }else{
        this.batch = val;
      }
      this.getBelanja();
    });   
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
      message: 'Batalkan transaksi!!!',
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

  async actBayar(){
    if (!this.arrBelanja.length) {
      this.showTost('Tidak ada barang belanjaan');
      return false;
    }

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Lanjut ke Pembayaran!!!',
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
            this.router.navigateByUrl('payment');
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
      "where": {"tmp_batch":this.batch}
    };

    this.http.post(api_base_url + 'postdata', arrdata, { headers: headers })
      .subscribe(data => {
        loading.dismiss();
        this.showTost('Berhasil dibatalkan');
        this.storageCtrl.set('dataBatch', '');
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
      this.id_barang = null;
      return false;
    };
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where b.isactive ='Y' and b.code ='" + this.kode +"' and a.tipe_beli='"+ this.tipe_beli +"' and b.branch_id ="+this.branch_id;
    
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
          this.tipe_beli = data[0].tipe_beli;
          this.harga_real = data[0].harga_int;
          this.harga = data[0].harga_int;
          this.sub_harga = this.jml * this.harga_real;          
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

  onChangeCabang(e:any){
    this.branch_id = e.target.value;
    this.getHarga();
  }

  onChange(e:any){
    this.tipe_beli = e.target.value;
    let tot = this.kode.length;
    if(tot <= 4){
      return false;
    };
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where b.code ='" + this.kode +"' and a.tipe_beli='"+ this.tipe_beli +"' and b.branch_id ="+this.branch_id;
    
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
        console.log('not found');
        let tipebelidesc = 'Grosir';
        if(this.tipe_beli == 'E')
        {
          tipebelidesc = 'Eceran';
        }
        this.showTost('Harga '+tipebelidesc +' tidak ditemukan.');
        this.harga_real = 0;
      } else {
          this.id_barang = data[0].id_barang;
          this.nama = data[0].nama_barang;
          this.harga_real = data[0].harga_int;
          this.harga = data[0].harga_int;
          this.sub_harga = this.jml * this.harga;
        }
      }, error => {
        console.log(error);
      })
  }

  cekStock(){
      return new Promise(resolve => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
  
        let where = "where id="+this.id_barang;
        let arrdata = {
          "action": "rowtable",
          "table": "m_barang",
          "limit": "",
          "order": "",
          "where": where
        };
  
        this.http.post(api_base_url + 'master', arrdata, { headers: headers })
          .subscribe(data => {
            let jumlah = parseInt(data['jml']) - this.jml;
            let returnValue = false;
            if(jumlah <=0 ){
              returnValue = true;
            }
            resolve(returnValue);
          }, error => {
            console.log(error);
          })
      })
    
  }

  async actTambah(){
    if(this.sub_harga==0 || this.kode =="" || this.id_barang == null){
      this.showTost('Data tidak lengkap atau kode barang tidak ditemukan');
      return false;
    }

    let cek = await this.cekStock();
    if(cek){
      this.showTost('Stok tidak mencukupi');
      return false;
    }

    this.showLoading = true;

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    this.arrdata = {
      "action": "Add",
      "table": "tmp_transaksi",
      "data": {
        "tmp_batch": this.batch,
        "tmp_harga": this.harga,
        "tmp_jml": this.jml,
        "tmp_id_barang": this.id_barang,
        "tmp_tipe_beli": this.tipe_beli,
        "tmp_jenis": "J",
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

  getBelanja() {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

    let where = "where tmp_jenis='J'";
    if (this.batch != "" || this.batch== null) {
      where += " and a.tmp_batch like '%" + this.batch + "%'";
    }

    let arrdata = {
      "action": "arraybelanja",
      "table": "",
      "limit": "",
      "order": " order by a.tmp_id desc ",
      "where": where
    };

    this.http.post(api_base_url + 'master', arrdata, { headers: headers })
      .subscribe(data => {
        this.arrReturn =  data;
        this.showLoading = false;
        if (!this.arrReturn.length) {
          console.log('tidak ada list belanja');
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

}
