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
  role: any
  branch_id: any
  isAdministrator: any = false
  arrCabang: any

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
      this.branch_id = data[0].branch_id;
      if(this.role == '1'){
        this.isAdministrator = true;
      }
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
      this.page = 0;
      this.getData();
    });
    return await modal.present();
  }

  async confimData(param1,param2) {
    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Pemberitahuan!',
      message: 'Yakin untuk <strong>hapus</strong> data ini?',
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
      message: 'Mohon menunggu...',
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

    this.http.post(api_base_url + 'postdata', arrdata, { headers: headers })
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
      duration: 1000,
      position: "bottom"
    });
    toast.present();
  }

  async getData(event?) {
    this.arrCabang = await this.getCabang();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.jwt); //bearer
    let where = 'where 1=1 ';
    
    if(this.branch_id != ""){
      where = where+ ' and b.branch_id ='+this.branch_id;
    }

    if (this.searchTerm != "") {
      where = where+" and b.nama_barang like '%" + this.searchTerm + "%'";
    }
    let arrdata = {
      "action": "listharga",
      "table": "",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by b.nama_barang desc",
      "where": where
    };

    this.http.post(api_base_url + 'master', arrdata, { headers: headers })
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

    let where = 'where 1=1 ';
    if(this.branch_id != ""){
      where = where+ ' and b.branch_id ='+this.branch_id;
    }
    if (this.searchTerm != "") {
      where = where+" and b.nama_barang like '%" + this.searchTerm + "%'";
    }

    let arrdata = {
      "action": "listharga",
      "table": "",
      "limit": "Limit " + this.page + "," + this.limit,
      "order": "order by b.nama_barang desc",
      "where": where
    };

    this.http.post(api_base_url + 'master', arrdata, { headers: headers })
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

  actCabang(e:any){
    this.branch_id = e.target.value;
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

      this.http.post(api_base_url + 'master', arrdata, { headers: headers })
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log(error);
        })
    })
  }

}
