
import { Router } from '@angular/router';
import { DBTaskService } from '../services/dbtask.service';
import { AuthenticationService } from '../services/authentication.service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
import { APIClientService } from '../services/apiclient.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
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

    )

    {
      const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }


  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
  }

  // Helper functions
  // async showQrToast() {
  //   const toast = await this.toastCtrl.create({
  //     message: `Open ${this.scanResult}?`,
  //     position: 'top',
  //     buttons: [
  //       {
  //         text: 'Open',
  //         handler: () => {
  //           window.open(this.scanResult, '_system', 'location=yes');
  //         }
  //       }
  //     ]
  //   });
  //   toast.present();
  // }

  reset() {
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
  }
  async startScan() {
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);
    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        // this.showQrToast();
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }


captureImage() {
  this.fileinput.nativeElement.click();
}

handleFile(files: FileList) {
  const file = files.item(0);

  const img = new Image();
  img.onload = () => {
    this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
    const imageData = this.canvasContext.getImageData(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code) {
      this.scanResult = code.data;
      // this.showQrToast();
    }
  };
  img.src = URL.createObjectURL(file);
}
  /**
   * Función que permite navegar entre componentes
   * mediante la URL
   * @param $event
   */
  segmentChanged($event){
    console.log($event.detail.value);
    let direction=$event.detail.value;
    this.router.navigate(['home/'+direction]);
  }
  /**
   * Antes de que se muestre la visual
   * se redirecciona a la url especifica
   */

  /**
   * Función que permite cerrar la sesión actual
   * actualiza el sesion_data de SQLite
   */
  logout(){
    this.authenticationSerive.logout();
  }
  InfoNavigate(){
    this.router.navigate(["publicaciones"])
  }

}
