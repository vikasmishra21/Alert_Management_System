import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiPathService {
  private _baseUrl = environment.baseUrl;
  private _surveyUrl = environment.surveyUrl;

  constructor() {}

  get baseUrl(): string {
    return this._baseUrl;
  }

  get surveyUrl(): string {
    return this._surveyUrl;
  }
}
