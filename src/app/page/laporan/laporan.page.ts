import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api_base_url } from 'src/config';
import {parseISO, format} from "date-fns";
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.page.html',
  styleUrls: ['./laporan.page.scss'],
})
export class LaporanPage implements OnInit {
  kode: any  
  arrList:any
  showList: boolean = false;
  jwt: any
  role: any
  isAdministrator: any = false
  arrCabang: any
  branch_id: any
  startDate: any=new Date().toISOString(); 
  endDate: any
  tipe_transaksi: any = 'J'
  arrTipeTransaksi: any[] = [
    {
      'val': 'J',
      'valdesc': 'Jual'
    },
    {
      'val': 'B',
      'valdesc': 'Beli'
    }
  ]

  constructor(
    private storageCtrl: Storage,
    private router: Router,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.storageCtrl.get('isLogin').then((val) => {
      console.log(val);
      if(!val){
        this.router.navigate(['login'],{replaceUrl: true});
      }
    });
   }

  ngOnInit() {
    this.storageCtrl.get('dataLogin').then(async (data) => {
      this.jwt = data[0].jwt;
      this.role = data[0].level;
      this.arrCabang = await this.getCabang();
      this.branch_id = data[0].branch_id;
      if(this.role == '1'){
        this.isAdministrator = true;
      }
    });
  }

  async actLaporan(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Hitung laporan!!!',
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
            this.getLaporan();
          }
        }
      ]
    });
    await alert.present();
  }

  getLaporan(){
    this.showList = false; 
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer

    let addWhere = '';
    if(this.startDate != null && this.endDate !=null){
      let startDate = format(parseISO(this.startDate),'yyyyMMdd');
      let endDate = format(parseISO(this.endDate),'yyyyMMdd');
      addWhere = " and (create_date BETWEEN date_format('"+startDate+"','%Y%m%d') and DATE_ADD(date_format('"+endDate+"','%Y%m%d'), INTERVAL 1 DAY)) ";
    }else if(this.startDate != null && this.endDate ==null){
      let startDate = format(parseISO(this.startDate),'yyyyMMdd');
      addWhere = " and create_date >= date_format('"+startDate+"','%Y%m%d') ";
    }else if(this.startDate == null && this.endDate !=null){
      let endDate = format(parseISO(this.endDate),'yyyyMMdd');
      addWhere = " and reate_date <= DATE_ADD(date_format('"+endDate+"','%Y%m%d'), INTERVAL 1 DAY) ";
    }

    let where = 'where 1=1';
    if(this.tipe_transaksi != ""){
      where = where+ " and jenis='"+this.tipe_transaksi+"'";
    }
    if(this.branch_id != ""){
      where = where+ ' and branch_id ='+this.branch_id;
    }

    let arrdata = {
      "action": "laporan",
      "table": "",
      "limit": "",
      "order": "",
      "where": where+addWhere
    };
    this.http.post(api_base_url + 'master', arrdata, { headers: headers })
    .subscribe(data => {
      console.log(data);
        this.arrList = data;
        if (!this.arrList.length) {
          this.arrList = [];
        } else {
          this.showList = true;          
        }
      }, error => {
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

  clearTgl(e: any){
    if(e == 'startDate'){
      this.startDate = null;
    }else{
      this.endDate = null;
    }
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
}
