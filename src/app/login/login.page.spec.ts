import { LoginPage } from './login.page';
import { DbserviceService } from '../services/dbservice.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Platform } from '@ionic/angular';

describe('LoginPage', () => {
  let component: LoginPage;
  let dbSpy: jasmine.SpyObj<DbserviceService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastSpy: jasmine.SpyObj<ToastController>;
  let platformSpy: jasmine.SpyObj<Platform>;

  beforeEach(() => {
    dbSpy = jasmine.createSpyObj('DbserviceService', ['validarUsuario']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    platformSpy = jasmine.createSpyObj('Platform', ['is']);

    toastSpy.create.and.resolveTo({
      present: () => Promise.resolve()
    } as any);

    component = new LoginPage(routerSpy, dbSpy, toastSpy, platformSpy);
    
    spyOn(localStorage, 'setItem');
  });

  it('debe mostrar error con credenciales inválidas', async () => {
    const form = { valid: true } as NgForm;
    dbSpy.validarUsuario.and.resolveTo(null);
    spyOn(component, 'presentToast');
    
    await component.ingresar(form);
    
    expect(component.presentToast).toHaveBeenCalledWith('Credenciales inválidas');
  });
});
