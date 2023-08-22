import { APP_INITIALIZER, inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { tap } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HotToastModule, HotToastService } from '@ngneat/hot-toast';
import { AppSortableComponent } from './components/app-sortable/app-sortable.component';
import { AuthService } from './services/auth.service';
import { TelegraphSdkService } from './services/telegraph-sdk.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UploadPageComponent } from './pages/upload-page/upload-page.component';
import { EditExistingPageComponent } from './pages/edit-existing-page/edit-existing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    UploadPageComponent,
    EditExistingPageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        HotToastModule.forRoot(),
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AppSortableComponent
    ],
  providers: [
    TelegraphSdkService,
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const telegraphSdk = inject(TelegraphSdkService);
        const authService = inject(AuthService);
        const toastService = inject(HotToastService);

        const accessToken = authService.getAccessToken();

        if (accessToken === null || accessToken === '') {
          return () => { };
        }

        return () => telegraphSdk
          .getAccountInfo(accessToken)
          .pipe(
            tap({
              next: accountInfoResponse => {
                if (!accountInfoResponse.ok) {
                  toastService.error('Invalid access_token. Log in again')
                  return;
                }

                if (
                  accountInfoResponse.result === null
                  || accountInfoResponse.result === undefined
                ) {
                  toastService.error('Failed to load account info from telegra.ph.')
                  return;
                }

                authService.saveAccessToken(accessToken);
                authService.saveAccountInfo(accountInfoResponse.result);
                console.log('Data saved');
              },
              error: error => {
                console.error(error);
                return;
              }
            })
          );
      },
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
