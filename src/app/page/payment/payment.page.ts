import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { api_base_url } from 'src/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrintService } from 'src/app/service/print.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  batch: any
  jwt: any
  user_id: any
  arrBelanja: any = []
  arrReturn: any = []
  showList: boolean = false;
  total: any = 0
  kembalian: any = 0
  bayar: any
  bluetoothList:any=[];
  selectedPrinter:any;
  branch_id: any
  hitung: any
  arrdata: any=[]
  arrPlayerId: any=[]
  arrCabang: any
  role: any
  isdisabled : boolean= false
  constructor(
    private storageCtrl: Storage,
    private router: Router,
    private statusBar: StatusBar,
    private http: HttpClient,
    private print: PrintService,
    private toastCtrl: ToastController,
    private alerCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.storageCtrl.get('isLogin').then((val) => {
      this.statusBar.styleBlackTranslucent();
      this.statusBar.backgroundColorByHexString('#008000');
      console.log(val);
      if (!val) {
        this.router.navigate(['login'], { replaceUrl: true });
      }
    });
  }

  ngOnInit() {
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
      this.batch = val;
      this.getBelanja();
    });

    this.storageCtrl.get('printerConnected').then((val) => {
      this.selectedPrinter = val;
    });
  }

  onChangeCabang(e:any){
    this.branch_id = e.target.value;
    this.getBelanja();
  }

  getCabang(param = "") {
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

  getBelanja() {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

    let where = '';
    if (this.batch != "" || this.batch == null) {
      where = "where tmp_batch like '%" + this.batch + "%'";
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
        this.arrReturn = data;
        if (!this.arrReturn.length) {
          console.log('tidak ada list belanja');
          this.arrBelanja = [];
          this.showList = false;
          this.total = 0;
        } else {
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

  actKembalian(){
    this.hitung = parseFloat(this.bayar) - parseFloat(this.total);
    if(this.hitung > 0){
      this.kembalian = this.hitung;
    }else{
      this.kembalian = 0;
    }
  }

  async actBayar() {
    if(this.bayar == null ){
      this.showTost('Masukkan jumlah bayar');
      return false;
    }else if (this.bayar < this.total){
      this.showTost('Kurang bayar');
      return false;
    }
    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi!',
      message: `Pembayaran selesai?`,
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
            this.saveBayar();
          }
        }
      ]
    });

    await alert.present();
  }

  async saveBayar(){
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Mohon menunggu...',
    });
    await loading.present();

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

    this.arrdata = {
      "action": "bayar",
      "table": "tx_payment",
      "data": {
        "pay_batch": this.batch,
        "branch_id": this.branch_id,
        "pay_total": this.total,
        "pay_bayar": this.bayar,
        "pay_kembalian": this.kembalian,
        "pay_create_by": this.user_id
       },
      "except":"",
      "where": ""
    };
    
    this.arrPlayerId = await this.getPlayerId(); 
    this.http.post(api_base_url + 'bayar', this.arrdata, { headers: headers })
    .subscribe( data => {
      this.sendNotif();
      loading.dismiss();
      this.printStuff(); 
          this.showTost('Pembayaran berhasil');
          setTimeout(() => {
            this.storageCtrl.set('dataBatch', '');
            this.router.navigate(['home'], { replaceUrl: true });            
          }, 3000);  
      }, error => {
        loading.dismiss();
        this.showTost('Pembayaran gagal');
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
    let content = 'Batch : '+this.batch+', untuk cabang '+namaCabang+ ' dengan total '+this.total;

    let arrdata = {
      "app_id" :"240edd41-51c0-4b54-adc4-5c42cc8b5fa2",
      "include_player_ids" : arrPlayerid,
      "headings" : {"en" : "Penjualan Barang"},
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


  printStuff() {        
    //The text that you want to print
    var myText = "<b>Hello hello hello</b>\n\n\n This is a test \n\n\n";

    // "pay_batch": this.batch,
    // "branch_id": this.branch_id,
    // "pay_total": this.total,
    // "pay_bayar": this.bayar,
    // "pay_kembalian": this.kembalian,

    this.print.sendToBluetoothPrinter(this.selectedPrinter, myText);
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
