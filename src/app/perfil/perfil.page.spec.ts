/// <reference types="jasmine" />

import { PerfilPage } from './perfil.page';
import { Router, ActivatedRoute } from '@angular/router';
import { CameraService } from '../camera.service';
import { Platform } from '@ionic/angular';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let routerSpy: jasmine.SpyObj<Router>;
  let cameraSpy: jasmine.SpyObj<CameraService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let platformSpy: jasmine.SpyObj<Platform>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    cameraSpy = jasmine.createSpyObj('CameraService', ['takePhoto']);
    
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['paramMap']);

    platformSpy = jasmine.createSpyObj('Platform', ['is']);
    
    component = new PerfilPage(cameraSpy, routerSpy, activatedRouteSpy, platformSpy);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem');
  });

  it('debe cerrar sesión correctamente', () => {
    spyOn(component, 'cerrarSesion');
    component.cerrarSesion();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});