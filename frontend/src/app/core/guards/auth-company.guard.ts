import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserHttpService } from '../services/userHttp.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCompanyGuard implements CanActivate {

  constructor(private authService: UserHttpService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getCompanyIsLogedObservable().pipe(
      map((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          return true;
        } else {
          // Se não estiver autenticado, redireciona para a página de login
          this.router.navigate(['/login/empresa']);
          return false;
        }
      }),
      catchError(async (error) => {
        // Se houver algum erro na requisição, redireciona para a página de login
        this.router.navigate(['/login/empresa']);
        return false;
      })
    );
  }
}
