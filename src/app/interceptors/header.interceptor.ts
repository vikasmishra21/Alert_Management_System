import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenService } from "../services/token.service";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let headers = this.tokenService.getTokens();
    const newReq = request.clone({ setHeaders: { ...headers } });
    return next.handle(newReq);
  }
}
