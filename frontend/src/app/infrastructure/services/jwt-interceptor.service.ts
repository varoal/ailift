import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptorService implements HttpInterceptor {
  private isRefreshingToken = false;
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private inj: Injector,
              private router: Router) {
  }

  private static addToken(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }


  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    const dupReq = req.clone();
    return next.handle(JwtInterceptorService.addToken(dupReq, localStorage.getItem('token')))
      .pipe(catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch ((error as HttpErrorResponse).status) {
            case 400:
              return this.handle400Error(error);
            // case 401:
            //   return this.handle401Error(req, next);
            default:
              return throwError(error);
          }
        } else {
          return throwError(error);
        }
      }));
  }


  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    const authService = this.inj.get(AuthenticationService);

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      this.tokenSubject.next('');

      return authService.refreshToken()
        .pipe(switchMap((newToken) => {
          if (newToken) {
            localStorage.setItem('token', newToken.token);
            this.tokenSubject.next(newToken);
            return next.handle(JwtInterceptorService.addToken(req, newToken.token));
          }

          return this.logoutUser();
        }))
        .pipe(catchError(error => {
          return this.logoutUser();
        }))
        .pipe(finalize(() => {
          this.isRefreshingToken = false;
        }));

    } else {
      return this.tokenSubject
        .pipe(filter(token => token != null))
        .pipe(take(1))
        .pipe(switchMap(token => {
          return next.handle(JwtInterceptorService.addToken(req, token));
        }));
    }
  }

  private handle400Error(error: any) {
    switch (error.error.error) {
      case 'token_fully_expired':
        break;
      case 'token_invalid':
        this.goToLogin();
        break;

      case 'token_blacklisted':
        this.goToLogin();
        break;

      case 'token_not_provided':
        this.goToLogin();
        break;
    }
    return throwError(error);
  }

  public logoutUser() {
    return throwError('');
  }

  private goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

