import { Injectable } from "@angular/core";
import { ApiPathService } from "./api-path.service";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private apiPath: ApiPathService,
    private http: HttpClient,
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  public login(username, password): Observable<any> {
    const apiPath = this.apiPath.baseUrl + "/users/login";
    const data = {
      username: username,
      password: password,
      grant_type: "password",
      applicationname: "dashboard",
    };

    this.clearTokens();

    return this.http.post(apiPath, data, { observe: "response" }).pipe(
      map((res: any) => {
        if (res.status !== 200) {
          return res;
        }

        this.tokenService.setAuthorizationToken(
          res.body.access_token,
          res.body.token_type
        );

        let tokens = res.body.access_token.split(".");
        this.userService.setUserInfo(JSON.parse(atob(tokens[1])));

        return res;
      })
    );
  }

  public getProjectToken(projectId: string): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/projects/${projectId}/projecttoken`;

    if (this.tokenService.hasProjectToken(projectId)) {
      return of<string>(this.tokenService.getProjectToken(projectId)).pipe(
        map((res: any) => {
          this.tokenService.setProjectToken(projectId);
        })
      );
    }

    // Remove project token so that it do not get sent in headers to get
    // project token for other projects.
    this.tokenService.removeProjectToken();

    return this.http.get(apiPath, { observe: "response" }).pipe(
      map((res: any) => {
        if (res.status !== 200) {
          return res;
        }

        this.tokenService.addProjectToken(projectId, res.body.access_token);
        this.tokenService.setProjectToken(projectId);

        let tokens = res.body.access_token.split(".");
        this.userService.setProjectInfo(JSON.parse(atob(tokens[1])));

        return res;
      })
    );
  }

  private clearTokens(): void {
    this.tokenService.clearTokens();
    this.userService.removeUserInfo();
  }

  public logout(): void {
    this.clearTokens();
  }
}
