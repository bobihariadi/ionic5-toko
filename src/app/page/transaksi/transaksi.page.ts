import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { api_base_url } from 'src/config';
import { IonInfiniteScroll } from '@ionic/angular';


@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.page.html',
  styleUrls: ['./transaksi.page.scss'],
})
export class TransaksiPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  fakeList: Array<any> = new Array(7);
  showList: boolean = false;
  arrList: any = []
  jwt: any
  page: number = 0
  limit: number = 5
  totalRow: number = 0
  arrdata: any =[]

  constructor(
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

  getData(event?) {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let arrdata = {
      "action": "listtransaksi",
      "table": "",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by id asc"
    };

    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
      .subscribe(data => {
        this.infiniteScroll.disabled = false;
        this.showList = true;
        this.arrList = data;
        if (event) {
          event.target.complete();
        } else {
          this.totalRow = data[0].total_row;
        }
      }, error => {
        console.log(error);
      })
  }

  refreshData(event) {
    this.page = 0;
    this.showList = false;
    event.target.disabled = false;
    this.getData(event);
    event.target.disabled = false;
  }

  moreData(event?) {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let arrdata = {
      "action": "listtransaksi",
      "table": "",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by id asc"
    };

    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
      .subscribe(data => {
        event.target.complete();
        this.arrdata = data;
        this.arrdata.forEach(element => {
          this.arrList.push(element);
        });
      }, error => {
        console.log(error);
      })
  }

  loadData(event) {
    this.page = this.page + this.limit;
    this.moreData(event);
    if (this.page >= this.totalRow) {
      event.target.disabled = true;
    }
  }

  ngOnInit() {
    this.storageCtrl.get('dataLogin').then((data) => {
      this.jwt = data[0].jwt;
      this.getData();
    });
  }

}
