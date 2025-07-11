import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DbserviceService } from './dbservice.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(
    private http: HttpClient,
    private dbService: DbserviceService,
    private networkService: NetworkService
  ) {}

  getUsers(): Observable<any> {
    // Verificar si hay conexión a internet
    return this.networkService.isOnline.pipe(
      switchMap(online => {
        if (online) {
          return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
            map(response => {
              // Guardar en la base de datos local
              this.dbService.guardarUsuarios(response);
              return { data: response, source: 'api', error: null };
            }),
            catchError((error: HttpErrorResponse) => {
              // Manejar errores específicos (404, etc.)
              return this.handleApiError(error);
            })
          );
        } else {
          // Sin conexión - cargar desde base de datos local
          return from(this.handleOffline()).pipe(
            map(data => ({ data, source: 'cache', error: null }))
          );
        }
      })
    );
  }

  private handleApiError(error: HttpErrorResponse): Observable<any> {
    console.error('Error en API:', error);
    
    // Manejar error 404 específicamente
    if (error.status === 404) {
      return from(this.handleOffline()).pipe(
        map(data => ({ data, source: 'cache', error: '404 - Recurso no encontrado' }))
      );
    }
    
    // Para otros errores, intentar cargar desde caché
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