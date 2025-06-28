import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Animation, AnimationController, createAnimation } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ApiService } from '../services/api.service';
import { DbserviceService } from '../services/dbservice.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
  animations: [
    trigger('bounceAnimation', [
      state('normal', style({ transform: 'scale(1)' })),
      state('clicked', style({ transform: 'scale(0.95)' })),
      transition('normal => clicked', animate('100ms ease-in')),
      transition('clicked => normal', animate('200ms ease-out'))
    ])
  ]
})
export class HomePage implements OnInit {
  animationState: string = 'normal';
  userData: any;
  usuarios: any[] = []; 
  isLoading = true;
  errorMessage = '';
  dataSource = '';

  userImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private apiService: ApiService, 
    private dbService: DbserviceService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const userDataString = localStorage.getItem('userData');
    const imageData = localStorage.getItem('profilePicture');

    if (imageData) {
      this.userImage = imageData;
    }
    
    if (!userDataString) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.userData = JSON.parse(userDataString);
      this.createCardAnimations();
      await this.cargarUsuarios();
    } catch (e) {
      this.router.navigate(['/login']);
    }
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


  private createCardAnimations() {

    // Animaciones a las clases .game-card, las cuales son en este caso las de clasificacion y las del juego pong

    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach((card, index) => {
      const animation: Animation = this.animationCtrl.create()
        .addElement(card)
        .duration(600 + (index * 200))
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(50px)', 'translateY(0px)');
      
      animation.play();
    });
  }

  // Routing al perfil (clickear en la foto de perfil desde homae)
  goToProfile() {
    this.router.navigate(['/perfil'], {
        queryParams: { user: this.userData.usuario },
        state: { user: this.userData }
      });
  }

  // Routing al juego pong
  goToPong() {
    this.animationState = 'clicked';
    setTimeout(() => {
      const navigationExtras: NavigationExtras = {
        state: {
          user: this.userData
        }
      };
      this.animationState = 'normal';
      this.router.navigate(['/pong'], navigationExtras);
    }, 150);
  }

  // Routing a clasificacion
  goToClasificacion() {
    this.animationState = 'clicked';
    setTimeout(() => {
      const navigationExtras: NavigationExtras = {
        state: {
          user: this.userData
        }
      };
      this.animationState = 'normal';
      this.router.navigate(['/clasificacion'], navigationExtras);
    }, 150);
  }

  getBadgeColor(position: number): string {
    if (position === 0) return 'warning'; // Oro
    if (position === 1) return 'medium';  // Plata
    if (position === 2) return 'tertiary'; // Bronce
    return 'light'; // Otros puestos
  }
}
