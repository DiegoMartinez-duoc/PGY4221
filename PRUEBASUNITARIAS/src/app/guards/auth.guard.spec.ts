import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    guard = new AuthGuard(routerSpy);
    localStorage.clear();
  });

  it('redirigir al login si no hay usuario registrado', () => {
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('permitir acceso con usuario valido', () => {
    localStorage.setItem('userData', JSON.stringify({ usuario: 'test' }));
    expect(guard.canActivate()).toBeTrue();
  });

  it('redirigir con datos de usuario corruptos', () => {
    localStorage.setItem('userData', 'invalid-json');
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
