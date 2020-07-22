import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private _appVersion = "1.3.0";
  private _storageKey = "appVersion";

  constructor() {
    let localVersion = localStorage.getItem(this._storageKey);

    if (localVersion && localVersion !== this._appVersion) {
      sessionStorage.clear();
      localStorage.clear();
    }

    localStorage.setItem(this._storageKey, this._appVersion);
  }

  public getAppVersion(): string {
    return `v${this._appVersion}`;
  }
}
