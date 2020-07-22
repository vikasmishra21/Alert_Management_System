import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { TokenService } from "../services/token.service";

@Injectable({
  providedIn: "root",
})
export class CanActivateGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const loggedIn = this.tokenService.exists();

    if (!loggedIn) {
      const params = {};

      for (let param in next.params) {
        params[param] = next.params[param];
      }

      for (let param in next.queryParams) {
        params[param] = next.queryParams[param];
      }

      return this.router.createUrlTree(["login"], {
        queryParams: params,
      });
    }

    return loggedIn;
  }
}
