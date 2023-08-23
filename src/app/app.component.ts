import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public get userLoggedIn(): boolean {
    return this.authService.userAuthenticated();
  }

  public logOut(): void {
    this.authService.removeAccessToken();
    this.authService.removeAccountInfo();
    void this.router.navigate(['login']);
  }
}
