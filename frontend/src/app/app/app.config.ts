import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app-routing.module';
import { provideHttpClient, HttpClientModule, withFetch } from '@angular/common/http';
import { httpInterceptorProviders } from '../core/interceptors/httpInterceptorProviders';
import { provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(HttpClientModule),
    httpInterceptorProviders,
    provideNgxMask(),
    provideEnvironmentNgxMask(),
  ],
};
