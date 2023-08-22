import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CreateAccountRequest } from "../models/telegraph/requests/create-account-request";
import { forkJoin, Observable } from "rxjs";
import { CreatePageRequest } from '../models/telegraph/requests/create-page-request';
import { GetPageListRequest } from '../models/telegraph/requests/get-page-list-request';
import { CreateAccountResponse } from "../models/telegraph/responses/create-account-response";
import { CreatePageResponse } from '../models/telegraph/responses/create-page-response';
import { GetPageListResponse } from '../models/telegraph/responses/get-page-list-response';
import { Account, Page, PageList } from "../models/telegraph/types";
import { GetAccountInfoResponse } from "../models/telegraph/responses/get-account-info-response";

@Injectable()
export class TelegraphSdkService {
  private readonly nameof = <T>(name: Extract<keyof T, string>): string => name;
  private readonly baseUrl: string = 'https://api.telegra.ph';
  private readonly httpClient = inject(HttpClient);

  public createAccount(request: CreateAccountRequest): Observable<CreateAccountResponse> {
    const payload = new HttpParams()
      .set(this.nameof<CreateAccountRequest>('short_name'), request.short_name)
      .set(this.nameof<CreateAccountRequest>('author_name'), request.author_name ?? '')
      .set(this.nameof<CreateAccountRequest>('author_url'), request.author_url ?? '');

    return this.httpClient.post<CreateAccountResponse>(`${this.baseUrl}/createAccount`, payload);
  }

  public getAccountInfo(accessToken: string): Observable<GetAccountInfoResponse> {
    const fields = [
      this.nameof<Account>('author_name'),
      this.nameof<Account>('short_name'),
      this.nameof<Account>('author_url'),
      this.nameof<Account>('page_count'),
      this.nameof<Account>('auth_url')
    ];

    const fieldsParameterValue = fields.map(field => `"${field}"`).join(',');

    const payload = new HttpParams()
      .set(this.nameof<Account>('access_token'), accessToken)
      .set('fields', `[${fieldsParameterValue}]`);

    return this.httpClient.get<GetAccountInfoResponse>(`${this.baseUrl}/getAccountInfo`, {
      params: payload
    });
  }

  public createPage(request: CreatePageRequest): Observable<CreatePageResponse> {
    const payload = new HttpParams()
        .set(this.nameof<CreatePageRequest>('title'), request.title)
        .set(this.nameof<CreatePageRequest>('content'), JSON.stringify(request.content))
        .set(this.nameof<CreatePageRequest>('access_token'), request.access_token)
        .set(this.nameof<CreatePageRequest>('author_name'), request.author_name ?? '')
        .set(this.nameof<CreatePageRequest>('author_url'), request.author_url ?? '')
        .set(this.nameof<CreatePageRequest>('return_content'), request.return_content ? 'true' : 'false');

    return this.httpClient.post<CreatePageResponse>(`${this.baseUrl}/createPage`, payload);
  }

  public getPageList(request: GetPageListRequest): Observable<GetPageListResponse> {
    const payload = new HttpParams()
        .set(this.nameof<GetPageListRequest>('access_token'), request.access_token)
        .set(this.nameof<GetPageListRequest>('offset'), request.offset ?? '0')
        .set(this.nameof<GetPageListRequest>('limit'), request.limit ?? '50');

    return this.httpClient.post<GetPageListResponse>(`${this.baseUrl}/getPageList`, payload);
  }

  public uploadFiles(files: Array<Blob>): Observable<Array<Array<{ src: string }>>> {
    // const url = `https://telegra.ph/upload`;
    const url = 'http://localhost:5293/UploadFiles/upload';

    const formRequests = files.map(file => {
      const requestFormData = new FormData();
      requestFormData.append('file', file);

      return requestFormData;
    });

    const requests = formRequests
      .map(form => {
        return this.httpClient.post<Array<{ src: string }>>(url, form);
      });

    return forkJoin(requests);
  }
}
