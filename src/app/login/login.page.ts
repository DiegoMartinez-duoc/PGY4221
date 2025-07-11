import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras  } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DbserviceService } from '../services/dbservice.service';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  userData = {
    usuario:"",
    password:""
  }
  private isNativePlatform: boolean = false;

  constructor(
    private router: Router,
    private dbService: DbserviceService,
    private toastController: ToastController,
    private platform: Platform
  ) { this.isNativePlatform = this.platform.is('cordova') || this.platform.is('capacitor'); }

  ngOnInit() {
  }

  ingresar(form: NgForm) {
    if (!this.isNativePlatform) {

      if (form.valid)
      {
        const storedData = this.getWebUserData();

        console.log(storedData.usuario);
        console.log(this.userData.usuario);

        try {
          if (storedData && storedData.usuario === this.userData.usuario) {
            if (storedData.password === this.userData.password) {
              localStorage.setItem('userData', JSON.stringify(storedData));
              this.router.navigate(['/home']);
            } else {
              this.presentToast('Contraseña incorrecta');
            }
          } else {
            this.presentToast(storedData.usuario);
          }
        } catch (error) {
          this.presentToast('Credenciales inválidas');
          console.error(error);
        }
        
      }
    } else {
      if (form.valid) {
        this.dbService.validarUsuario(this.userData.usuario, this.userData.password)
          .then((user: any) => {
            if (user) {
              // Guardar usuario en localStorage
              localStorage.setItem('userData', JSON.stringify(user));
              this.router.navigate(['/home']);
            } else {
              this.presentToast('Credenciales inválidas');
              
            }
          })
          .catch((error: any) => {
            this.presentToast('Error en la autenticación');
            console.error(error);
          });
      }
    }
  }

  private getWebUserData(): any {
    const storedDataString = localStorage.getItem('userData');
    
    if (storedDataString) {
      try {
        return JSON.parse(storedDataString);
      } catch (error) {
        console.error('Error parsing user data', error);
        return null;
      }
    }
    return null;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  registrar() {
    this.router.navigate(['/registrar']);
  }

}
