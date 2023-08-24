import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Account } from '../../models/telegraph/types';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(HotToastService);
  private readonly router = inject(Router);

  public get account(): Account {
    return this.authService.getAccountInfo()!;
  }

  public onAccessTokenCopied(): void {
    this.toastService.success('Access token copied');
  };

  public navigateToUpload(): void {
    void this.router.navigate(['', 'upload']);
  }

  public navigateToEditExisting(): void {
    void this.router.navigate(['', 'edit']);
  }
}
