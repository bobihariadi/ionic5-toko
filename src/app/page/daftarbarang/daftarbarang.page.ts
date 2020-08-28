import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api_base_url } from 'src/config';

@Component({
  selector: 'app-daftarbarang',
  templateUrl: './daftarbarang.page.html',
  styleUrls: ['./daftarbarang.page.scss'],
})
export class DaftarbarangPage implements OnInit {
  fakeList: Array<any> = new Array(7);
  showList: boolean = false;
  arrList: any = []
  jwt: any
  searchTerm: string = "";

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private storageCtrl: Storage,
    private http: HttpClient
  ) {
    this.storageCtrl.get('isLogin').then((val) => {
      if (!val) {
        this.router.navigate(['login'], { replaceUrl: true });
      }
    });
   }

  ngOnInit() {
    this.storageCtrl.get('dataLogin').then((data) => {
      this.jwt = data[0].jwt;
      this.getData();
    });
  }

  getData() {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = '';
    if (this.searchTerm != "") {
      where = "where nama_barang like '%" + this.searchTerm + "%'";
    }
    let arrdata = {
      "action": "arraytable",
      "table": "m_barang",
      "limit": "",
      "order": "order by nama_barang desc",
      "where": where
    };

    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
      .subscribe(data => {
        this.arrList = data;
        this.showList = true;
        if (!this.arrList.length) {
          this.arrList = [];
        } 
      }, error => {
        console.log(error);
      })
  }

  getSelected(id?,code?,name?) {
    let dataParsing = {
      "idbarang": id,
      "codeBarang": code,
      "namaBarang": name
    }
    this.modalCtrl.dismiss(dataParsing);
  }

  setFilteredItems(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.getData();
  }

  cleared(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.getData();
  }

}
