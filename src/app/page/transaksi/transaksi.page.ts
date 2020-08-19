import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { api_base_url } from 'src/config';
import { IonInfiniteScroll } from '@ionic/angular';
import {parseISO, format} from "date-fns";

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.page.html',
  styleUrls: ['./transaksi.page.scss'],
})
export class TransaksiPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  fakeList: Array<any> = new Array(7)
  showList: boolean = false
  arrList: any = []
  jwt: any
  page: number = 0
  limit: number = 5
  totalRow: number = 0
  arrdata: any = []
  searchTerm: string = "";
  role: any
  isAdministrator: any = false
  arrCabang: any
  branch_id: any
  startDate: any
  endDate: any

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

  clearTgl(e: any){
    if(e == 'startDate'){
      this.startDate = null;
    }else{
      this.endDate = null;
    }
  }

  getDataChange(){
    this.page = 0;  
    this.getData();
  }

  async getData(event?) {
    this.arrCabang = await this.getCabang();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let addWhere = '';
    if(this.startDate != null && this.endDate !=null){
      let startDate = format(parseISO(this.startDate),'yyyyMMdd');
      let endDate = format(parseISO(this.endDate),'yyyyMMdd');
      addWhere = " and (a.create_date BETWEEN date_format('"+startDate+"','%Y%m%d') and DATE_ADD(date_format('"+endDate+"','%Y%m%d'), INTERVAL 1 DAY)) ";
    }else if(this.startDate != null && this.endDate ==null){
      let startDate = format(parseISO(this.startDate),'yyyyMMdd');
      addWhere = " and a.create_date >= date_format('"+startDate+"','%Y%m%d') ";
    }else if(this.startDate == null && this.endDate !=null){
      let endDate = format(parseISO(this.endDate),'yyyyMMdd');
      addWhere = " and a.create_date <= date_format('"+endDate+"','%Y%m%d') ";
    }

    let where = 'where a.branch_id ='+this.branch_id; 
    if(this.searchTerm !=""){
      where = "where b.nama_barang like '%" + this.searchTerm + "%' and a.branch_id = "+this.branch_id;
    }
    let arrdata = {
      "action": "listtransaksi",
      "table": "",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by id desc",
      "where": where+addWhere
    };

    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
      .subscribe(data => {
        this.arrList = data;
        if(!this.arrList.length){
          this.arrList = [];
        }else{
          this.infiniteScroll.disabled = false;
          this.showList = true;
          this.totalRow = data[0].total_row;
          if (event) {
            event.target.complete();
          }
        }
      }, error => {
        console.log(error);
      })
  }

  refreshData(event) {
    this.page = 0;
    this.showList = false;
    this.searchTerm = '';
    event.target.disabled = false;
    this.getData(event);
    event.target.disabled = false;
  }

  moreData(event?) {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    
    let where = 'where a.branch_id ='+this.branch_id;
    if(this.searchTerm !=""){
      where = "where b.nama_barang like '%" + this.searchTerm + "%' and a.branch_id = "+this.branch_id;
    }

    let arrdata = {
      "action": "listtransaksi",
      "table": "",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by id desc",
      "where": where
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
      this.role = data[0].level;
      this.branch_id = data[0].branch_id;
      if(this.role == '1'){
        this.isAdministrator = true;
      }
      this.getData();
    });
  }

  setFilteredItems(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.page = 0;
    this.getData();
  }

  actCabang(e:any){
    this.branch_id = e.target.value;
    this.page = 0;
    this.getData();
  }

  cleared(ev: any){
    const val = ev.target.value;
    this.searchTerm = val;
    this.page = 0;
    this.getData();
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
}
