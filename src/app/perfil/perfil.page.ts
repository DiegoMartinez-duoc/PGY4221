import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Animation, AnimationController, createAnimation } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  userData: any;

  constructor(private router: Router, private animationCtrl: AnimationController, private activatedRoute: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.userData = navigation.extras.state['user'];
    } else {
      this.router.navigate(['/login']);
    }
  }

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
  }

}
