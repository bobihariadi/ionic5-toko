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
  role: any
  isAdministrator: any = false
  arrCabang: any
  branch_id: any
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
    let tot = this.kode.length;
    if(tot <= 3){
      return false;
    }
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = "where b.code ='" + this.kode +"' and b.branch_id ="+this.branch_id;
    
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
          this.arrList = [];
        } else {
          this.showList = true;          
        }
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

      this.http.post(api_base_url + 'master', arrdata, { headers: headers })
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log(error);
        })
    })
  }

}
