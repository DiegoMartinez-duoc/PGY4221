import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras  } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DbserviceService } from '../services/dbservice.service';
import { ToastController } from '@ionic/angular';

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

  constructor(
    private router: Router,
    private dbService: DbserviceService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  ingresar(form: NgForm) {
    if (form.valid) {
      this.dbService.validarUsuario(this.userData.usuario, this.userData.password)
        .then(user => {
          if (user) {
            // Guardar usuario en localStorage
            localStorage.setItem('userData', JSON.stringify(user));
            this.router.navigate(['/home']);
          } else {
            this.presentToast('Credenciales inválidas');
            
          }
        })
        .catch(error => {
          this.presentToast('Error en la autenticación');
          console.error(error);
        });
    }
  }

  private async presentToast(message: string) {
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
