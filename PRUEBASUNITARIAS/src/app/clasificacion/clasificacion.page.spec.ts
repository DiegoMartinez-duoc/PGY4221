import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClasificacionPage } from './clasificacion.page';

import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { DbserviceService } from '../services/dbservice.service';
import { ToastController, LoadingController } from '@ionic/angular';

describe('ClasificacionPage', () => {
  let component: ClasificacionPage;
  
 
  let routerSpy: jasmine.SpyObj<Router>;
  
  let alertSpy: jasmine.SpyObj<AlertController>;
  let dbSpy: jasmine.SpyObj<DbserviceService>;
  let toastSpy: jasmine.SpyObj<ToastController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    alertSpy = jasmine.createSpyObj('AlertController', ['']);
    apiSpy = jasmine.createSpyObj('ApiService', ['getUsers']);
    dbSpy = jasmine.createSpyObj('DbserviceService', ['']);
    toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['']);

    toastSpy.create.and.resolveTo({
      present: () => Promise.resolve()
    } as any);

    component = new ClasificacionPage(routerSpy, alertSpy, apiSpy, dbSpy, toastSpy, loadingControllerSpy);

  });

  it('debe cargar usuarios al iniciar', () => {
    component.cargarUsuarios();
    expect(apiSpy.getUsers).toHaveBeenCalled();
  });
});