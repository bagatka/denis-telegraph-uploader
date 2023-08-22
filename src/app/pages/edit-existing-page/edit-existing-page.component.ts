import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../models/telegraph/types';
import { AuthService } from '../../services/auth.service';
import { TelegraphSdkService } from '../../services/telegraph-sdk.service';


@Component({
    selector: 'app-edit-existing-page',
    templateUrl: './edit-existing-page.component.html',
    styleUrls: ['./edit-existing-page.component.scss']
})
export class EditExistingPageComponent implements OnInit {
    private readonly telegraphSdkService = inject(TelegraphSdkService);
    private readonly authService = inject(AuthService);
    public currentPageIndex = 0;
    private pageSize = 50;
    public pages: Array<Page> = [];
    private total: number = 0;

    public ngOnInit(): void {
        this.loadPages(0);
    }

    public get nextPageExist(): boolean {
        return (this.currentPageIndex + 1) * this.pageSize < this.total;
    }

    public get previousPageExist(): boolean {
        return this.currentPageIndex !== 0;
    }

    public loadPages(pageIndex: number): void {
        this.currentPageIndex = pageIndex;
        this.telegraphSdkService
            .getPageList({
                limit: this.pageSize,
                offset: pageIndex * this.pageSize,
                access_token: this.authService.getAccessToken()!
            })
            .subscribe({
                next: pageList => {
                    this.total = pageList.result?.total_count!;
                    this.pages = pageList.result?.pages!;
                }
            })
    }
}
