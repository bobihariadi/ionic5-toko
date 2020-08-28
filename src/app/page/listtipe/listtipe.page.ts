import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, LoadingController, ToastController, IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModaltipePage } from '../modaltipe/modaltipe.page';
import { api_base_url } from 'src/config';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-listtipe',
  templateUrl: './listtipe.page.html',
  styleUrls: ['./listtipe.page.scss'],
})
export class ListtipePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  fakeList: Array<any> = new Array(7);
  showList: boolean = false;
  arrList: any = []
  jwt: any
  page: number = 0
  limit: number = 5
  totalRow: number = 0
  arrdata: any = []
  searchTerm: string = "";
  role: any
  isAdministrator: any = false

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
      this.role = data[0].level;
      if(this.role == '1'){
        this.isAdministrator = true;
      }
      this.getData();
    });
  }

  async presentModal(pId,pAct) {
    const modal = await this.modalCtrl.create({
      component: ModaltipePage,
      cssClass: 'my-custom-class',
      componentProps:{
        pass_id:pId,
        action:pAct
      }
    });

    modal.onDidDismiss().then((r) => {
      // console.log(r);
      this.getData();
    });
    return await modal.present();
  }

  async confimData(param) {
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
            this.delData(param);
          }
        }
      ]
    });

    await alert.present();
  }

  async delData(id){
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
      "table": "m_tipe",
      "data": "",
      "except":"",
      "where": {"tipe":id}
    };

    this.http.post(api_base_url + 'api/v2/postdata', arrdata, { headers: headers })
      .subscribe(data => {
        this.page = 0;  
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
      where = "where deskripsi like '%" + this.searchTerm + "%'";
    }
    let arrdata = {
      "action": "arraytable",
      "table": "m_tipe",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by deskripsi desc",
      "where": where
    };

    this.http.post(api_base_url + 'api/v2/master', arrdata, { headers: headers })
      .subscribe(data => {
        this.arrList = data;
        if (event) {
          event.target.complete();
        }
        this.showList = true;

        if (!this.arrList.length) {
          this.arrList = [];
        } else {
          this.infiniteScroll.disabled = false;
          this.totalRow = data[0].total_row;
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
      where = "where deskripsi like '%" + this.searchTerm + "%'";
    }

    let arrdata = {
      "action": "arraytable",
      "table": "m_tipe",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by deskripsi desc",
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
