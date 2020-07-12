import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalhargaPage } from '../modalharga/modalharga.page';
import { api_base_url } from 'src/config';

@Component({
  selector: 'app-listharga',
  templateUrl: './listharga.page.html',
  styleUrls: ['./listharga.page.scss'],
})
export class ListhargaPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  fakeList: Array<any> = new Array(7);
  showList: boolean = false;
  arrList: any = []
  jwt: any
  page: number = 0
  limit: number = 10
  totalRow: number = 0
  arrdata: any = []
  searchTerm: string = "";

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private storageCtrl: Storage,
    private http: HttpClient,
    private alerCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
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

  async presentModal(pId,tBeli,code,nama,pAct) {
    const modal = await this.modalCtrl.create({
      component: ModalhargaPage,
      cssClass: 'my-custom-class',
      componentProps:{
        id_barang:pId,
        tipe_beli:tBeli,
        code_barang:code,
        nama_barang:nama,
        action:pAct
      }
    });

    modal.onDidDismiss().then((r) => {
      // console.log(r);
      this.getData();
    });
    return await modal.present();
  }

  async confimData(param1,param2) {
    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure to <strong>delete</strong> this data?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.delData(param1,param2);
          }
        }
      ]
    });

    await alert.present();
  }

  async delData(id,tipe){
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    
    let arrdata = {
      "action": "Del",
      "table": "m_harga",
      "data": "",
      "except":"",
      "where": {"id_barang":id, "tipe_beli":tipe}
    };

    this.http.post(api_base_url + 'api/v2/postdata', arrdata, { headers: headers })
      .subscribe(data => {
        console.log(data);  
        this.getData();
        loading.dismiss();
        this.showTost('Deleted');
      }, error => {
        loading.dismiss();
        this.showTost('Failed');
        console.log(error);
      })
  }

  async showTost(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

  getData(event?) {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = '';
    if (this.searchTerm != "") {
      where = "where b.nama_barang like '%" + this.searchTerm + "%'";
    }
    let arrdata = {
      "action": "listharga",
      "table": "",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by b.nama_barang desc",
      "where": where
    };

    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
      .subscribe(data => {
        this.arrList = data;
        if (!this.arrList.length) {
          this.arrList = [];
        } else {
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

    let where = '';
    if (this.searchTerm != "") {
      where = "where b.nama_barang like '%" + this.searchTerm + "%'";
    }

    let arrdata = {
      "action": "listharga",
      "table": "",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by b.nama_barang desc",
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

  setFilteredItems(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.page = 0;
    this.getData();
  }

  cleared(ev: any) {
    const val = ev.target.value;
    this.searchTerm = val;
    this.page = 0;
    this.getData();
  }

}
