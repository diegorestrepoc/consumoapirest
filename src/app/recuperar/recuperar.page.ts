import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
public nombreUsuario= ''

  constructor(public toastController: ToastController,
    private atrCtrl: AlertController) { }

  ngOnInit() {
  }


  async showAlert() {
    if (this.nombreUsuario.trim() === '') {
      return 'Para ingresar al sistema debe ingresar un nombre de usuario.';
    }
    let alert = await this.atrCtrl.create({
       header:'Confirmacion de cambio de contraseña enviada',
      buttons: ['OK']
    });
    alert.present();
  }
}
