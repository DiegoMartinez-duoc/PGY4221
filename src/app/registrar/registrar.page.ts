import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { DbserviceService } from '../services/dbservice.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: false,
})
export class RegistrarPage implements OnInit {
  fechaModalVisible = false;
  userData: any = {
    usuario: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: new Date().toISOString(),
    password: ''
  };
  dbReady = false;
  private dbSubscription: any;
  private isNativePlatform: boolean = false;

  constructor(
    private router: Router,
    private dbService: DbserviceService,
    private toastController: ToastController,
    private platform: Platform

  ) { this.isNativePlatform = this.platform.is('cordova') || this.platform.is('capacitor'); }

  ngOnInit() {
    // Verificar estado de la base de datos
    this.dbSubscription = this.dbService.getIsDbReady().subscribe(isReady => {
      this.dbReady = isReady;
      if (!isReady) {
        this.presentToast('Base de datos no está lista. Por favor espere...');
      }
    });
  }

  ngOnDestroy() {
    if (this.dbSubscription) {
      this.dbSubscription.unsubscribe();
    }
  }

  async ingresar(form: NgForm) {
    if (!this.isNativePlatform) {
      
      if (form.valid) {
        localStorage.setItem('userData', JSON.stringify(this.userData));
        this.router.navigate(['/home']);
      } else {
        this.presentToast('Error al obtener datos del usuario');
      }
      

    } else {
      if (form.valid && this.dbReady) {
        try {
          // Insertar usuario en la base de datos
          await this.dbService.insertUsuario(
            this.userData.usuario,
            this.userData.nombre,
            this.userData.apellido,
            this.userData.fechaNacimiento,
            this.userData.password
          );

          const user = await this.dbService.validarUsuario(
          this.userData.usuario,
          this.userData.password
          );

          if (user) {
            localStorage.setItem('userData', JSON.stringify(user));
            this.router.navigate(['/home']);
          } else {
            this.presentToast('Error al obtener datos del usuario');
          }
          
          // Navegar al login
          this.router.navigate(['/home']);
          
        } catch (error) {
          console.error('Error al registrar usuario:', error);
          this.presentToast('Error al registrar usuario');
        }
      } else if (!this.dbReady) {
        this.presentToast('Base de datos no está lista. Intente nuevamente.');
      }
    }
    
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  abrirSelectorFecha() {
    this.fechaModalVisible = true;
  }

  fechaSeleccionada() {
    this.fechaModalVisible = false;
  }

  login() {
    this.router.navigate(['/login']);
  }
}
