import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Animation, AnimationController, createAnimation } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CameraService } from '../camera.service';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  userData: any;
  userImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  private isNativePlatform: boolean = false;

  constructor(private cameraService: CameraService, private router: Router, private activatedRoute: ActivatedRoute, private platform: Platform) {
    const navigation = this.router.getCurrentNavigation();
    this.isNativePlatform = this.platform.is('cordova') || this.platform.is('capacitor');
    if (navigation?.extras?.state) {
      this.userData = navigation.extras.state['user'];
    } else {
      this.router.navigate(['/login']);
    }
  }

  async takeProfilePicture() {
    try {
      this.userImage = await this.cameraService.takePhoto();
      this.saveProfilePicture();
    } catch (error) {
      console.error('Error tomando foto', error);
    }
  }

  cerrarSesion() {
    if (!this.isNativePlatform) {
      this.router.navigate(['/login']);
    } else {
      localStorage.removeItem('userData');
      this.router.navigate(['/login']);
    }
    
  }

  saveProfilePicture() {
    localStorage.setItem('profilePicture', this.userImage);
  }

  ngOnInit() {
    const savedImage = localStorage.getItem('profilePicture');
    if (savedImage) {
      this.userImage = savedImage;
    }

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
