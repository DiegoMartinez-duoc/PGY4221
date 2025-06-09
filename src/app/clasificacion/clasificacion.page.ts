import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.page.html',
  styleUrls: ['./clasificacion.page.scss'],
  standalone: false,
})
export class ClasificacionPage implements OnInit {

  userData: any;

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.userData = navigation.extras.state['user'];
    }
  }
}
