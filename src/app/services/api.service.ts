import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
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

  getUsers(): Observable<any[]> {
    return this.networkService.isOnline.pipe(
      switchMap(online => {
        if (online) {
          return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
            map(users => {
              this.dbService.guardarUsuarios(users);
              return users;
            }),
            catchError(() => from(this.dbService.getUsers()))
          );
        } else {
          return from(this.dbService.getUsers());
        }
      }),
      catchError(() => from(this.dbService.getUsers()))
    );
  }
}