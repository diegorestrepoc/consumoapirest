import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DBTaskService } from '../services/dbtask.service';
import { AuthenticationService } from '../services/authentication.service';
import {  ViewChild, ElementRef } from '@angular/core';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
import { APIClientService } from '../services/apiclient.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.page.html',
  styleUrls: ['./publicaciones.page.scss'],
})
export class PublicacionesPage implements OnInit {
  loading: HTMLIonLoadingElement = null;
  selectedUserId: number;
  usuarios: any;
  publicacion: any = {
    userId: null,
    id: null,
    title: '',
    body: '',
    name: ''
  };
  publicaciones: any;
  publicacionSeleccionada: string;

  constructor(private router: Router,
    public dbtaskService: DBTaskService,
    public authenticationSerive:AuthenticationService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private api: APIClientService,
    private toastController: ToastController
) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.selectedUserId = null;
    this.setPublicacion(null, null, '', '', '');

    this.getPublicaciones();
  }


  cambiarUsuario($event: number) {
    this.setPublicacion($event, null, '', '', '');
  }


  limpiarPublicacion() {
    this.setPublicacion(this.selectedUserId, null, '', '', '');
  }



  setPublicacion(userId, pubId, title, body, name) {




    this.publicacion.id = pubId;
    this.publicacion.title = title;
    this.publicacion.body = body;
    this.publicacion.name = name;



    const pid = pubId === null? 'nueva' : pubId;
    this.publicacionSeleccionada = `( pubId: ${pid})`;
  }






  getPublicaciones() {

    this.api.getPublicaciones().subscribe((publicaciones) => {



      this.api.getUsuarios().subscribe((usuarios) => {
        // Recorrer las publicaciones para actualizar el nombre del usuario
        publicaciones.forEach(publicacion => {
          publicacion.name = usuarios.find(u => u.id === publicacion.userId).name;
        });
        // Invertir la lista de publicaciones para que muestre desde la más nueva a la más antigua
        publicaciones.reverse();
        // Actualizar lista de publicaciones
        this.publicaciones = publicaciones;
      });
    });
  }



  guardarPublicacion() {

    if (this.publicacion.title.trim() === '') {
      this.mostrarMensaje('Antes de hacer una publicación debe llenar el título.');
      return;
    }
    if (this.publicacion.body.trim() === '') {
      this.mostrarMensaje('Antes de hacer una publicación debe llenar el cuerpo.');
      return;
    }
    if (this.publicacion.id === null) {
      this.crearPublicacion();
    }
    else {
      this.actualizarPublicacion();
    }
  }


  crearPublicacion() {
    this.api.createPublicacion(this.publicacion).subscribe(
      (data) => {
        this.mostrarMensaje(`PUBLICACION CREADA CORRECTAMENTE: ${data.id} ${data.title}...`);
        this.limpiarPublicacion();
        this.getPublicaciones();
      },
      (error) => this.mostrarError('NO FUE POSIBLE CREAR LA PUBLICACION.', error)
    );
  }



  actualizarPublicacion() {
    this.api.updatePublicacion(this.publicacion).subscribe(
      (data) => {
        this.mostrarMensaje(`PUBLICACION ACTUALIZADA CORRECTAMENTE: ${data.id} ${data.title}...`);
        this.limpiarPublicacion();
        this.getPublicaciones();
      },
      (error) => this.mostrarError('NO FUE POSIBLE ACTUALIZAR LA PUBLICACION.', error)
    );
  }



  editarPublicacion($event){
    const pub = $event;
    this.setPublicacion(pub.userId, pub.id, pub.title, pub.body, pub.name);
    document.getElementById('topOfPage').scrollIntoView({block: 'end', behavior: 'smooth'});
  }

  eliminarPublicacion($event){
    const pubId = $event.id;
    this.api.deletePublicacion(pubId).subscribe(
      (data) => {
        this.mostrarMensaje(`PUBLICACION ELIMINADA CORRECTAMENTE: ${pubId}...`);
        this.limpiarPublicacion();
        this.getPublicaciones();
      },
      (error) => this.mostrarError('NO FUE POSIBLE ELIMINAR LA PUBLICACION.', error)
    );
  }



  getIdentificadorItemPublicacion(index, item) {
    return item.id;
  }



  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }


  async mostrarError(mensaje, error) {
    console.log(mensaje);
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
    throw error;
  }
  logout(){
    this.authenticationSerive.logout();
  }

}
