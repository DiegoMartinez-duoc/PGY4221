import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private onlineStatus = new BehaviorSubject<boolean>(true);

  constructor() {
    this.initNetworkListener();
  }

  private async initNetworkListener() {
    const status = await Network.getStatus();
    this.onlineStatus.next(status.connected);
    
    Network.addListener('networkStatusChange', status => {
      this.onlineStatus.next(status.connected);
    });
  }

  get isOnline() {
    return this.onlineStatus.asObservable();
  }
}
