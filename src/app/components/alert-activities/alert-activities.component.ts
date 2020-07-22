import { Component, OnInit, OnChanges, Input } from "@angular/core";
import {
  ActivityType,
  Status,
  Priority,
  CallStatus,
  AlertEmailType,
} from "src/app/enums/alerts.enum";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-alert-activities",
  templateUrl: "./alert-activities.component.html",
  styleUrls: ["./alert-activities.component.scss"],
})
export class AlertActivitiesComponent implements OnInit {
  @Input() activities: any[] = [];
  @Input() statusFilters: Status[] = [];
  @Input() userFilters: string[] = [];
  @Input() alertId: string | number;
  @Input() alertPipelineId: string | number;

  public readonly ActivityType = ActivityType;
  public readonly Status = Status;
  public readonly Priority = Priority;
  public readonly CallStatus = CallStatus;
  public readonly AlertEmailType = AlertEmailType;

  public filteredActivities: any[] = [];
  public emailActivities;
  public filteredEmailConversations: any[] = [];
  public transformedActivities: any[] = [];
  public showProgress: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  ngOnChanges(changes) {
    if (
      (changes.activities && Array.isArray(this.activities)) ||
      changes.statusFilters ||
      changes.userFilters
    ) {
      this.makeChangesInData(this.activities);
      this.transformedActivities = this.transformAlertActivities(
        this.activities
      );
      this.transformedActivities = this.getFilteredActivities(
        this.transformedActivities
      );
    }
  }

  private transformAlertActivities(activities: any[]): any[] {
    let transformedActivities = activities;

    transformedActivities.forEach((activity) => {
      if (
        activity.activityTypeID == ActivityType.EMAIL &&
        activity.alertEmailType == AlertEmailType.CustomerResponse
      ) {
        activity.body = activity.body.replace(/[\r\n]/gi, "<br>");
      }

      if (
        activity.activityTypeID == ActivityType.ADD_MEMBER ||
        activity.activityTypeID == ActivityType.DELETE_MEMBER
      ) {
        let members = [];
        members = activity.membersAffected.split("|");
        activity.memberArray = [];
        for (let i = 0; i < members.length; i++) {
          let memberArray = [];
          let memberDetials = {
            member: "",
            memberName: "",
          };
          memberArray[i] = members[i].split(":");
          memberDetials.memberName =
            i === members.length - 1
              ? memberArray[i][0]
              : memberArray[i][0] + ",";
          memberDetials.member = memberArray[i][1];

          activity.memberArray.push(memberDetials);
        }
      }
    });

    return transformedActivities;
  }

  private makeChangesInData(activities): void {
    for (let i = 0; i < activities.length; i++) {
      activities[i].activityDate = new Date(
        activities[i].activityDate
      ).toLocaleDateString();
    }
  }

  private getFilteredActivities(activities: any[]): any[] {
    let filteredActivities = [];

    if (this.statusFilters) {
      filteredActivities = activities.filter(
        (x) => this.statusFilters.indexOf(x.activityTypeID) !== -1
      );
    }

    if (this.userFilters.length) {
      filteredActivities = filteredActivities.filter(
        (x) =>
          this.userFilters.findIndex(
            (y) => y.trim().toLowerCase() === x.activityBy.trim().toLowerCase()
          ) !== -1
      );
    }

    return filteredActivities;
  }

  public downloadFile(fileName): void {
    this.showProgress = true;
    this.dataService
      .downloadFile(this.alertPipelineId, this.alertId, fileName)
      .subscribe(
        (res) => {
          if (res.status === 200) {
            var blob = new Blob([res.body]);

            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, fileName);
            } else {
              var downloadLink = document.createElement("a");
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.target = "_blank";
              downloadLink.download = fileName;
              setTimeout(() => {
                downloadLink.click();
                downloadLink.remove();
              }, 1000);
            }

            this.showProgress = false;
          } else {
            this.showProgress = false;
          }
        },
        (err) => {
          this.showProgress = false;
        }
      );
  }
}
