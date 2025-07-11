import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { DbserviceService } from './dbservice.service';
import { NetworkService } from './network.service';
import { Platform } from '@ionic/angular';

describe('ApiService', () => {
  let service: ApiService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let dbSpy: jasmine.SpyObj<DbserviceService>;
  let networkSpy: jasmine.SpyObj<NetworkService>;
  let platformSpy: jasmine.SpyObj<Platform>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    dbSpy = jasmine.createSpyObj('DbserviceService', ['guardarUsuarios', 'getUsers']);
    platformSpy = jasmine.createSpyObj('Platform', ['is']);
    networkSpy = jasmine.createSpyObj('NetworkService', ['isOnline'], {
      isOnline: of(true) 
    });
    
    service = new ApiService(httpSpy, dbSpy, networkSpy, platformSpy);
  });

  it('debe obtener usuarios de API cuando hay conexión', (done) => {
    const mockUsers = [{id: 1, name: 'Test'}];
    httpSpy.get.and.returnValue(of(mockUsers));

    service.getUsers().subscribe(result => {
      expect(result.source).toBe('api');
      expect(result.data).toEqual(mockUsers);
      expect(dbSpy.guardarUsuarios).toHaveBeenCalled();
      done();
    });
  });

  it('debe usar cache cuando hay error', (done) => {
    httpSpy.get.and.returnValue(throwError(() => ({ status: 404 })));
    dbSpy.getUsers.and.resolveTo([{id: 1, name: 'Cached'}]);

    service.getUsers().subscribe(result => {
      expect(result.source).toBe('cache');
      expect(result.data.length).toBe(1);
      expect(result.error).toContain('404');
      done();
    });
  });
});