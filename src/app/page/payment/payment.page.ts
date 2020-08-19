import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { api_base_url } from 'src/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrintService } from 'src/app/service/print.service';
import { ToastController } from '@ionic/angular';

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
  hitung: any
  constructor(
    private storageCtrl: Storage,
    private router: Router,
    private statusBar: StatusBar,
    private http: HttpClient,
    private print: PrintService,
    private toastCtrl: ToastController
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
    this.storageCtrl.get('dataLogin').then((data) => {
      this.jwt = data[0].jwt;
      this.user_id = data[0].id;
    });

    this.storageCtrl.get('dataBatch').then((val) => {
      this.batch = val;
      this.getBelanja();
    });
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
      "action": "arraytable",
      "table": "tmp_transaksi",
      "limit": "",
      "order": "order by tmp_id",
      "where": where
    };

    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
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
    }
  }

  actBayar() {
    this.showTost('bayar klik.');
  }

  //This will list all of your bluetooth devices
  listPrinter() {
    this.print.searchBluetoothPrinter()
      .then(resp => {

        //List of bluetooth device list
        this.bluetoothList = resp;
      });
  }
  //This will store selected bluetooth device mac address
  selectPrinter(macAddress) {
    //Selected printer macAddress stored here
    this.selectedPrinter = macAddress;
  }

   //This will print
  printStuff() {
    //The text that you want to print
    var myText = "Hello hello hello \n\n\n This is a test \n\n\n";
    this.print.sendToBluetoothPrinter(this.selectedPrinter, myText);
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
