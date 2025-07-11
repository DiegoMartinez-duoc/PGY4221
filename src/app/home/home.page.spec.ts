/// <reference types="jasmine" />

import { HomePage } from './home.page';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AnimationController } from '@ionic/angular';
import { DbserviceService } from '../services/dbservice.service';
import { ToastController } from '@ionic/angular';

describe('HomePage', () => {
  let component: HomePage;
  let routerSpy: jasmine.SpyObj<Router>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let animationSpy: jasmine.SpyObj<AnimationController>;
  let dbSpy: jasmine.SpyObj<DbserviceService>;
  let toastSpy: jasmine.SpyObj<ToastController>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    apiSpy = jasmine.createSpyObj('ApiService', ['getUsers']);
    animationSpy = jasmine.createSpyObj('AnimationController', ['create']);
    dbSpy = jasmine.createSpyObj('DbserviceService', ['']);
    toastSpy = jasmine.createSpyObj('ToastController', ['create']);

    
    toastSpy.create.and.resolveTo({
      present: () => Promise.resolve()
    } as any);


    component = new HomePage(routerSpy, animationSpy, apiSpy, dbSpy, toastSpy);
    
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ usuario: 'test' })); 
  });

  it('debe cargar usuarios al iniciar', () => {
    component.cargarUsuarios();
    expect(apiSpy.getUsers).toHaveBeenCalled();
  });
});