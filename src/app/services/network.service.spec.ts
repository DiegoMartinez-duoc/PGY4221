import { NetworkService } from './network.service';
import { Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';

describe('NetworkService', () => {
  let service: NetworkService;

  let ngZoneSpy: jasmine.SpyObj<NgZone>;
  let platformSpy: jasmine.SpyObj<Platform>;

  beforeEach(() => {

    ngZoneSpy = jasmine.createSpyObj('NgZone', ['']);
    platformSpy = jasmine.createSpyObj('Platform', ['is']);
    
    service = new NetworkService(platformSpy, ngZoneSpy);
    spyOn(Network, 'getStatus').and.resolveTo({ connected: true } as any);
    spyOn(Network, 'addListener');
  });

  it('debe detectar conexión inicial', (done) => {
    service.isOnline.subscribe(online => {
      expect(online).toBeTrue();
      done();
    });
  });
});
