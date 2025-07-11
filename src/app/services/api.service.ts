import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DbserviceService } from './dbservice.service';
import { NetworkService } from './network.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';
  private isNativePlatform: boolean = false;

  constructor(
    private http: HttpClient,
    private dbService: DbserviceService,
    private networkService: NetworkService,
    private platform: Platform
  ) {
    this.isNativePlatform = this.platform.is('cordova') || this.platform.is('capacitor');
  }

  // Obtener usuarios
  getUsers(): Observable<any> {
    if (!this.isNativePlatform) {
      // En entorno web, devolver datos simulados
      return of({
        data: [
          { id: 1, name: '111', username: '1234' },
          { id: 2, name: '222', username: '1234' }
        ],
        source: 'web-mock',
        error: null
      });
    }
    else {
      return this.networkService.isOnline.pipe(
        switchMap(online => {
          if (online) {
            return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
              map(response => {
                this.dbService.guardarUsuarios(response);
                return { data: response, source: 'api', error: null };
              }),
              catchError((error: HttpErrorResponse) => {
                return this.handleApiError(error);
              })
            );
          } else {
            return from(this.handleOffline()).pipe(
              map(data => ({ data, source: 'cache', error: null }))
            );
          }
        })
      );
    }

    
   
  }
  // Tratar errores 404 u otros errores
  private handleApiError(error: HttpErrorResponse): Observable<any> {
    console.error('Error en API:', error);
    
    if (error.status === 404) {
      return from(this.handleOffline()).pipe(
        map(data => ({ data, source: 'cache', error: '404 - Recurso no encontrado' }))
      );
    }
    
    return from(this.handleOffline()).pipe(
      map(data => ({ data, source: 'cache', error: `Error ${error.status}` }))
    );
  }

  private async handleOffline(): Promise<any[]> {
    try {
      return await this.dbService.getUsers();
    } catch (e) {
      console.error('Error cargando datos locales:', e);
      return [];
    }
  }
}