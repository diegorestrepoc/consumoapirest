import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
// import { CertificacionesComponent } from '../certificaciones/certificaciones.component';


// Se declaran las rutas hijas que se cargaran al interior de Page Home
const routes: Routes = [
  {
    path: '',
    component: HomePage,
        children: [
  
 
    
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
