import { Injectable } from "@angular/core";
import { TokenType } from "../enums/token-type.enum";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  private projectTokens = {};
  private tokens = {};
  private storageKey = "tokens";
  private projectStorageKey = "projectTokens";

  constructor() {
    const tokenString = localStorage.getItem(this.storageKey);
    const projectTokenString = localStorage.getItem(this.projectStorageKey);

    if (projectTokenString) {
      this.projectTokens = JSON.parse(projectTokenString);
    }

    if (tokenString) {
      this.tokens = JSON.parse(tokenString);
    }
  }

  public getTokens(): object {
    return this.tokens;
  }

  public setAuthorizationToken(token: string, tokenType: string): void {
    this.tokens[TokenType.AUTHORIZATION] = `${tokenType} ${token}`;
    this.saveTokens();
  }

  public getAuthorizationToken(): string | undefined {
    return this.tokens[TokenType.AUTHORIZATION];
  }

  private saveTokens(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tokens));
    localStorage.setItem(
      this.projectStorageKey,
      JSON.stringify(this.projectTokens)
    );
  }

  public exists(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  public addProjectToken(projectId: string, token: string): void {
    this.projectTokens[projectId] = token;
    this.saveTokens();
  }

  public hasProjectToken(projectId: string): boolean {
    return this.projectTokens.hasOwnProperty(projectId);
  }

  public getProjectToken(projectId: string): string | undefined {
    return this.projectTokens[projectId];
  }

  public setProjectToken(projectId: string): void {
    this.tokens[TokenType.PROJECT] = this.projectTokens[projectId];
    this.saveTokens();
  }

  public removeProjectToken(): void {
    delete this.tokens[TokenType.PROJECT];
  }

  public clearTokens(): void {
    this.projectTokens = {};
    this.tokens = {};

    localStorage.removeItem(this.projectStorageKey);
    localStorage.removeItem(this.storageKey);
  }
}
