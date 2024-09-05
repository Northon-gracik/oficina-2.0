import { UserHttpService } from './../../../../core/services/userHttp.service';
import { LoaderService } from '../../loader/loader.service';
import { AuthService } from './../../../../core/services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input()
  public title = '';
  public collapsed = true;

  public isAuthenticated: boolean = false;
  public isAuthenticatedCompany: boolean = false;


  constructor(
    private authService: AuthService,
    private userService: UserHttpService,
    private userHttpService: UserHttpService,
    private loaderService: LoaderService,
    private router: Router
  ) {
    authService.authUserStatus.subscribe(value => this.isAuthenticated = value);
    authService.authCompanyStatus.subscribe(value => this.isAuthenticatedCompany = value);
  }

  async ngOnInit(): Promise<void> {
    await this.getIfAuthenticated();
  }

  public async getIfAuthenticated(): Promise<void> {
    this.authService.authUserStatus.next(await this.userService.getUserIsLogedObservable().toPromise() || false);
    this.authService.authCompanyStatus.next(await this.userService.getCompanyIsLogedObservable().toPromise() || false);
  }

  navigateToUser(): void {
    this.router.navigate(['/usuario']);
  }
  navigateToCompany(): void {
    this.router.navigate(['/empresa']);
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToLoginCompany(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login/empresa']);
  }

  async companyLogout(event: Event) {
    event.preventDefault();
    try {
      this.loaderService.show();
      await this.authService.logoutCompany();
      this.loaderService.hide();
      this.router.navigate(['/home']);
    } catch (error) {}
  }
  async userLogout(event: Event) {
    event.preventDefault();
    try {
      this.loaderService.show();
      await this.authService.logout();
      this.loaderService.hide();
      this.router.navigate(['/home']);
    } catch (error) {}
  }
}
