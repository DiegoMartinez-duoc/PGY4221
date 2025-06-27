import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerMock: any;

  beforeEach(() => {
    // Crear mock del Router
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerMock }
      ]
    });
    
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when userData exists', () => {
    // Simular que existe userData en localStorage
    spyOn(localStorage, 'getItem').and.returnValue('{"usuario":"test"}');
    
    const result = guard.canActivate();
    
    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when no userData exists', () => {
    // Simular que NO existe userData en localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    const result = guard.canActivate();
    
    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to login when userData is invalid', () => {
    // Simular userData inválido
    spyOn(localStorage, 'getItem').and.returnValue('invalid-json');
    
    const result = guard.canActivate();
    
    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});