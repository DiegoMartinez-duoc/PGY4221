import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Animation, AnimationController, createAnimation } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';

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

  // Routing utilizado para enviar al login en caso de que no se detecte un usuario
  constructor(private router: Router, private animationCtrl: AnimationController, private activatedRoute: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.userData = navigation.extras.state['user'];
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Carga del usuario a la pagina una vez se entre a esta
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const navigationState = this.router.getCurrentNavigation()?.extras?.state;
      if (navigationState && navigationState['user']) {
        this.userData = navigationState['user'];
        localStorage.setItem('userData', JSON.stringify(this.userData));
      } else {
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
          this.userData = JSON.parse(savedUser);
        }
      }
    });
    
    // Ejecucion de animaciones
    this.createCardAnimations();
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
}
