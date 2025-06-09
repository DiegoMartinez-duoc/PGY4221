import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras  } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: false,
})
export class RegistrarPage implements OnInit {
  data: any; 
  fechaModalVisible = false; 
  userData: any = { 
    usuario: '',
    nombre: '',
    apellido: '',
    educacion: '',
    fechaNacimiento: new Date().toISOString(),
    password: ''
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ingresar(form: NgForm) {
    if (form.valid) {
      localStorage.setItem('userData', JSON.stringify(this.userData));
      
      this.router.navigate(['/home'], {
        queryParams: { user: this.userData.usuario },
        state: { user: this.userData }
      });
    }
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
