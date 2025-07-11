import { Injectable, NgZone } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private onlineStatus = new BehaviorSubject<boolean>(true);
  private isNativePlatform: boolean = false;

  constructor(
    private platform: Platform,
    private ngZone: NgZone
  ) {
    this.isNativePlatform = this.platform.is('cordova') || this.platform.is('capacitor');
    this.initNetworkListener();
  }

  private async initNetworkListener() {
    if (this.isNativePlatform) {
      // Implementación nativa
      const status = await Network.getStatus();
      this.onlineStatus.next(status.connected);
      
      Network.addListener('networkStatusChange', status => {
        this.ngZone.run(() => {
          this.onlineStatus.next(status.connected);
        });
      });
    } else {
      // Implementación web
      this.onlineStatus.next(navigator.onLine);
      
      window.addEventListener('online', () => {
        this.ngZone.run(() => {
          this.onlineStatus.next(true);
        });
      });
      
      window.addEventListener('offline', () => {
        this.ngZone.run(() => {
          this.onlineStatus.next(false);
        });
      });
    }
  }

  get isOnline() {
    return this.onlineStatus.asObservable();
  }

  async checkConnection(): Promise<boolean> {
    if (this.isNativePlatform) {
      const status = await Network.getStatus();
      return status.connected;
    } else {
      return navigator.onLine;
    }
  }
}
