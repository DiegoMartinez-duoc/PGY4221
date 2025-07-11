import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      this.router.navigate(['/login']); 
      return false;
    }

    try {
      const user = JSON.parse(userData);
      return !!user; 
    } catch (e) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}