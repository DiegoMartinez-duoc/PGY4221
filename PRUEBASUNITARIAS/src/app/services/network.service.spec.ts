import { NetworkService } from './network.service';
import { Network } from '@capacitor/network';

describe('NetworkService', () => {
  let service: NetworkService;


  beforeEach(() => {
    
    service = new NetworkService();
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
