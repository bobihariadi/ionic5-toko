import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/service/print.service';
import { ToastController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-listprinter',
  templateUrl: './listprinter.page.html',
  styleUrls: ['./listprinter.page.scss'],
})
export class ListprinterPage implements OnInit {
  jwt: any
  user_id: any
  bluetoothList:any=[];
  selectedPrinter:any;
  showButton: boolean = false;
  constructor(
    private storageCtrl: Storage,
    private router: Router,
    private statusBar: StatusBar,
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
    this.storageCtrl.get('printerConnected').then((val) => {
      this.selectedPrinter = val;
      if(val != null){
        this.showTost('Printer '+this.selectedPrinter);
        this.showButton = true;
      }
      this.listPrinter();
    });
  }

  listPrinter() {
    this.print.searchBluetoothPrinter()
      .then(resp => {
        this.bluetoothList = resp;        
      });
  }

  selectPrinter(e: any) {
    this.selectedPrinter = e.target.value;
    this.showTost('Printer '+this.selectedPrinter+' selected');
    this.storageCtrl.set('printerConnected', this.selectedPrinter);
    this.showButton = true;
  }

  printStuff() {       
    var myText = "MASTER\n";   
    myText += "Jl. Tengkuruk Permai Blok B No.82 PALEMBANG\n"; 
    myText += "============================";
    this.print.sendToBluetoothPrinter(this.selectedPrinter, myText);
  }

  async showTost(param) {
    let toast = await this.toastCtrl.create({
      message: param,
      duration: 1000,
      position: "bottom"
    });
    toast.present();
  }

}
