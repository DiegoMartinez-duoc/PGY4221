import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  data: any; 
  modalVisible = false; 
  fechaModalVisible = false; 
  userData: any = { 
    nombre: '',
    apellido: '',
    educacion: '',
    fechaNacimiento: new Date().toISOString() 
  };

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.data = navigation.extras.state['user'];
    } else {
      this.router.navigate(['/login']);
    }
  }

  limpiarCampos() {
    this.userData = {
      nombre: '',
      apellido: '',
      educacion: '',
      fechaNacimiento: new Date().toISOString()
    };
  }

  mostrarInformacion() {
    this.modalVisible = true;
  }

  abrirSelectorFecha() {
    this.fechaModalVisible = true;
  }

  fechaSeleccionada() {
    this.fechaModalVisible = false;
  }
}
