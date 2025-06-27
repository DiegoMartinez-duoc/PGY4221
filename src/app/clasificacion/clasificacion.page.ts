import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { DbserviceService } from '../services/dbservice.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.page.html',
  styleUrls: ['./clasificacion.page.scss'],
  standalone: false,
})
export class ClasificacionPage implements OnInit {

  userData: any;
  usuarios: any[] = []; 
  isLoading = true;
  userImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService, 
    private dbService: DbserviceService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const imageData = localStorage.getItem('profilePicture');

    if (imageData) {
      this.userImage = imageData;
    }


    if (navigation?.extras?.state) {
      this.userData = navigation.extras.state['user'];
    }
    
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.isLoading = true;
    
    try {
      this.apiService.getUsers().subscribe({
        next: (users) => {
          this.usuarios = users;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.presentToast('Error cargando usuarios');
        }
      });
    } catch (error) {
      this.isLoading = false;
      this.presentToast('Error inesperado: ' + error);
    }
  }

  
  async recargarUsuarios() {
    this.isLoading = true;
    await this.cargarUsuarios();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  getBadgeColor(position: number): string {
    if (position === 0) return 'warning'; // Oro
    if (position === 1) return 'medium';  // Plata
    if (position === 2) return 'tertiary'; // Bronce
    return 'light'; // Otros puestos
  }
}
