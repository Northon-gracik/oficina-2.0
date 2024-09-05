import { BehaviorSubject } from 'rxjs';
import { ICreateCompany, ICreateUser, ILoginUser } from '../models/userModels';
import { UserHttpService } from './userHttp.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authUserStatus = new BehaviorSubject<boolean>(false); // Inicializa com o status de não autenticado
  public authCompanyStatus = new BehaviorSubject<boolean>(false); // Inicializa com o status de não autenticado


  private authTokenKey = 'auth_token';

  constructor(private userHttpService: UserHttpService) {}

  async login(user: ILoginUser): Promise<void> {
    try {
      const response = await this.userHttpService.loginUser(user);
      this.setToken(response.token);
      this.authUserStatus.next(true);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }
  async logoutCompany(): Promise<void> {
    try {
      const response = await this.userHttpService.logoutCompany();
      this.setToken(response.token);
      this.authCompanyStatus.next(false);
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  }

  async createUser(user: ICreateUser): Promise<void> {
    try {
      const response = await this.userHttpService.createUser(user);
      this.setToken(response.token);
      this.authUserStatus.next(true);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async createCompany(company: ICreateCompany): Promise<void> {
    try {
      const response = await this.userHttpService.createCompany(company);
      this.setToken(response.token);
      this.authCompanyStatus.next(true);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async loginInCompany(idCompany: string): Promise<void>{
    try {
      const response = await this.userHttpService.loginInCompany(idCompany);
      this.setToken(response.token);
      this.authCompanyStatus.next(true);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  logout(): void {
    this.clearToken();
    this.authUserStatus.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.authTokenKey);
  }

  private getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.authTokenKey);
    }
    return null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  getAuthorizationToken(): string | null {
    return this.getToken();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

    // Método para verificar se o token é válido
    isTokenValid(token: string): boolean {
      // Implementar lógica para validar o token (verificar data de expiração, formato, etc.)
      // Esta é uma validação simples de exemplo, você pode usar bibliotecas JWT para validações mais robustas.
      const tokenPayload = this.decodeToken(token);
      const expiryDate = tokenPayload?.exp;
      return expiryDate ? (Date.now() < expiryDate * 1000) : false;
    }

    // Método auxiliar para decodificar o token JWT
    private decodeToken(token: string): any {
      try {
        const payload = atob(token.split('.')[1]);
        return JSON.parse(payload);
      } catch (error) {
        return null;
      }
    }

    isCompanyLoged() {
      try {
        this.userHttpService.getCompanyData();
        return true
      } catch (error) {
        return null;
      }
    }
}
