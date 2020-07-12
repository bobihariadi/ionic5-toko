import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api_base_url } from 'src/config';

@Component({
  selector: 'app-cek',
  templateUrl: './cek.page.html',
  styleUrls: ['./cek.page.scss'],
})
export class CekPage implements OnInit {
  kode: any  
  arrList:any
  showList: boolean = false;
  jwt: any

  constructor(
    private storageCtrl: Storage,
    private router: Router,
    private barcodeCtrl: BarcodeScanner,
    private http: HttpClient
  ) { 
    this.storageCtrl.get('isLogin').then((val) => {
      console.log(val);
      if(!val){
        this.router.navigate(['login'],{replaceUrl: true});
      }
    });
  }

  ngOnInit() {
    this.kode = '';
    this.storageCtrl.get('dataLogin').then((data) => {
      this.jwt = data[0].jwt;
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

  getHarga(){
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where b.code ='" + this.kode +"'";
    
    let arrdata = {
      "action": "cekharga",
      "table": "",
      "limit": "",
      "order": "",
      "where": where
    };
    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
    .subscribe(data => {
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

}
