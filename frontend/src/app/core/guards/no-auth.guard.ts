import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserHttpService } from '../services/userHttp.service';

@Injectable({
  providedIn: 'root',
})
export class noAuthGuard implements CanActivate {
  constructor(private authService: UserHttpService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.getUserIsLogedObservable().pipe(
      map((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          // Se já estiver autenticado, redireciona para a página inicial
          this.router.navigate(['/']);
          return false;
        } else {
          // Se não estiver autenticado, permite acesso à rota
          return true;
        }
      })
    );
  }
}
