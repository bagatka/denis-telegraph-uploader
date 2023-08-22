import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { CreateAccountRequest } from '../../models/telegraph/requests/create-account-request';
import { AuthService } from '../../services/auth.service';
import { TelegraphSdkService } from "../../services/telegraph-sdk.service";


@Component({
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
    public readonly tokenFormControl = new FormControl<string>('', [Validators.required]);
    public readonly registrationFormGroup = inject(FormBuilder).group({
        shortName: ['', [Validators.required]],
        authorName: [''],
        authorUrl: ['']
    })
    private readonly telegraphSdkService = inject(TelegraphSdkService);
    private readonly toastService = inject(HotToastService);
    private readonly authService = inject(AuthService);
    private readonly dialog = inject(DialogService);
    private readonly router = inject(Router);

    private dialogRef?: DialogRef;

    ngOnInit(): void {
        if (this.authService.userAuthenticated()) {
            this.toastService.warning('User already logged in')
            this.navigateToHomePage();
        }
    }

    public onLoginSubmit(): void {
        const accessToken = this.tokenFormControl.value;

        if (accessToken == null) {
            return;
        }

        this.telegraphSdkService
            .getAccountInfo(accessToken)
            .subscribe(
                {
                    next: response => {
                        if (!response.ok) {
                            this.toastService.error(response.error);
                            return;
                        }

                        if (response.ok) {
                            const accountInfo = response.result;

                            if (accountInfo === null || accountInfo === undefined) {
                                this.toastService.error("Incorrect account");
                                return;
                            }

                            this.authService.saveAccountInfo(accountInfo);
                            this.authService.saveAccessToken(accessToken);
                            window.open(accountInfo.auth_url, '_blank');
                            this.dialogRef?.close();
                            this.navigateToHomePage();
                        }
                    }
                }
            );
    }

    public onRegistrationSubmit(): void {
        const registrationRequest: CreateAccountRequest = {
            short_name: this.registrationFormGroup.value.shortName ?? '',
            author_url: this.registrationFormGroup.value.authorUrl ?? '',
            author_name: this.registrationFormGroup.value.authorName ?? ''
        };

        this.telegraphSdkService
            .createAccount(registrationRequest)
            .subscribe(
                {
                    next: response => {
                        if (!response.ok) {
                            this.toastService.error(response.error);
                            return;
                        }

                        if (response.ok) {
                            const accountInfo = response.result;

                            if (
                                accountInfo === null || accountInfo === undefined
                                || accountInfo.access_token === undefined || accountInfo.access_token === null
                            ) {
                                this.toastService.error("Incorrect account");
                                return;
                            }

                            this.authService.saveAccountInfo(accountInfo);
                            this.authService.saveAccessToken(accountInfo.access_token);
                            window.open(accountInfo.auth_url, '_blank');
                            this.dialogRef?.close();
                            this.navigateToHomePage();
                        }
                    }
                }
            );
    }

    public openDialog(template: TemplateRef<unknown>) {
        this.dialogRef = this.dialog.open(template);

        this.dialogRef.afterClosed$
            .subscribe({
                next: _ => {
                    this.dialogRef = undefined;
                }
            })
    }

    public navigateToHomePage(): void {
        void this.router.navigate([''])
    }
}
