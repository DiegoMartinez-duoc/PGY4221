import { RegistrarPage } from './registrar.page';
import { DbserviceService } from '../services/dbservice.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Platform } from '@ionic/angular';

describe('RegistrarPage', () => {
  let component: RegistrarPage;
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

    component = new RegistrarPage(routerSpy, dbSpy, toastSpy, platformSpy);
    
    spyOn(localStorage, 'setItem');
  });

  it('debe mostrar error al no poder registrar', async () => {
    const form = { valid: true } as NgForm;
    dbSpy.validarUsuario.and.resolveTo(null);
    spyOn(component, 'presentToast');
    
    await component.ingresar(form);
    
    expect(component.presentToast).toHaveBeenCalledWith('Error al obtener datos del usuario');
  });
});
