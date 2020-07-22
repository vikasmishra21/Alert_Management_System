import { Injectable } from "@angular/core";
import { IAlert } from "../interfaces/alert";
import { IAlertPipeline } from "../interfaces/alert-pipeline";
import { AlertCategory } from "../enums/alerts.enum";

@Injectable({
  providedIn: "root",
})
export class AlertStateService {
  public alert: IAlert;
  public alertPipeline: IAlertPipeline;
  public selectedFields: any;
  public alertsView: string;
  public alertCategory: AlertCategory;
  public filters: any;

  constructor() {}

  public reset() {
    this.alert = undefined;
    this.alertPipeline = undefined;
    this.selectedFields = undefined;
    this.alertsView = undefined;
    this.alertCategory = undefined;
  }
}
