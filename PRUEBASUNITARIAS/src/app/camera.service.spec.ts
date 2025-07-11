import { CameraService } from './camera.service';
import { Camera } from '@capacitor/camera';

describe('CameraService', () => {
  let service: CameraService;

  beforeEach(() => {
    service = new CameraService();
    spyOn(Camera, 'getPhoto').and.resolveTo({ dataUrl: 'data:image' } as any);
  });

  it('es creado', () => {
    expect(service).toBeTruthy();
  });
});
