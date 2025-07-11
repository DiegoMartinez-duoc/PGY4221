import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pong',
  templateUrl: './pong.page.html',
  styleUrls: ['./pong.page.scss'],
  standalone: false,
})
export class PongPage implements OnInit {

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

  startGame() {
    // this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Modo de Juego',
      message: 'Selecciona cómo quieres jugar:',
      buttons: [
        {
          text: 'Contra la IA',
          handler: () => {
            this.router.navigate(['/pong-game'], { state: { mode: 'ai' } });
          }
        },
        {
          text: 'Multijugador',
          handler: () => {
            this.router.navigate(['/pong-game'], { state: { mode: 'multiplayer' } });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

}
