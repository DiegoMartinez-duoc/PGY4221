import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { DbserviceService } from '../services/dbservice.service';
import { ToastController, LoadingController } from '@ionic/angular';

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
  errorMessage = '';
  dataSource = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService, 
    private dbService: DbserviceService,
    private toastController: ToastController,
    private loadingController: LoadingController
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
        next: (response) => {
          this.usuarios = response.data;
          this.dataSource = response.source;
          this.errorMessage = response.error || '';
          
          if (response.source === 'cache') {
            this.showCacheMessage(response.error);
          }
          
          this.isLoading = false;
          
        },
        error: async (error) => {
          console.error('Error:', error);
          this.isLoading = false;
          
          this.presentToast('Error al cargar los datos', 'danger');
        }
      });
    } catch (error) {
      this.isLoading = false;
      
      this.presentToast('Error inesperado', 'danger');
    }
  }

  private async showCacheMessage(error: string) {
    let message = 'Mostrando datos almacenados localmente';
    
    if (error) {
      message += ` (${error})`;
    }
    
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'warning',
      position: 'top'
    });
    toast.present();
  }

  
  async recargarUsuarios() {
    this.isLoading = true;
    await this.cargarUsuarios();
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: color,
      position: 'top'
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
