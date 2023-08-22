import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Account } from '../models/telegraph/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private account?: Account;
  private readonly tokenLocalStorageKey = 'access_token';
  private authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public saveAccessToken(token: string): void {
    localStorage.setItem(this.tokenLocalStorageKey, token);
    this.authenticated.next(true);
  }

  public saveAccountInfo(accountInfo: Account): void {
    this.account = accountInfo;
  }

  public removeAccessToken(): void {
    localStorage.removeItem(this.tokenLocalStorageKey);
    this.authenticated.next(false);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.tokenLocalStorageKey);
  }

  public getAccountInfo(): Account | null {
    return this.account ?? null;
  }

  public removeAccountInfo(): void {
    this.account = undefined;
  }

  public userAuthenticated$(): Observable<boolean> {
    return this.authenticated.asObservable();
  }

  public userAuthenticated(): boolean {
    return this.authenticated.value;
  }
}
