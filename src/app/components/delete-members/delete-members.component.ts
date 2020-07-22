import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataService } from "src/app/services/data.service";
import { AlertActivity } from "src/app/classes/alert-activity";
import { ActivityType } from "src/app/enums/alerts.enum";
import { AlertNotificationService } from "src/app/services/alert-notification.service";

@Component({
  selector: "app-delete-members",
  templateUrl: "./delete-members.component.html",
  styleUrls: ["./delete-members.component.scss"],
})
export class DeleteMembersComponent implements OnInit {
  public ActivityType = ActivityType;
  public alertMembers: any[];
  public showProgress: boolean = false;
  public removedMemberIds = [];

  private alertActivity: AlertActivity = new AlertActivity();
  private removedMembers = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public alertDetails: any,
    private dataService: DataService,
    private notificationService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.dialogRef.updatePosition({ right: "20px" });
    this.alertMembers = [...this.alertDetails["alert"].alertMembers];
  }

  private createActivity(removedMembers) {
    this.alertActivity.alertID = this.alertDetails.alertId;
    this.alertActivity.activityTypeID = ActivityType.DELETE_MEMBER;

    const queryString = this.getDeleteMemberQueryString(removedMembers);

    this.alertActivity.membersAffected = queryString;
  }

  private getDeleteMemberQueryString(members): string {
    let queryString = [];

    for (let member in members) {
      queryString[member] =
        members[member].memberName + ":" + members[member].member;
    }

    return queryString.join("|");
  }

  public deleteMember(member, index): void {
    this.notificationService
      .openConfirmDialog(
        "Delete",
        `Are you sure you want to delete ${member.memberName} from this alert.?`
      )
      .afterClosed()
      .subscribe((deleteMember) => {
        if (deleteMember) {
          this.showProgress = true;

          this.dataService
            .deleteMember(
              this.alertDetails.alertPipelineId,
              this.alertDetails.alertId,
              member.id
            )
            .subscribe(
              (res) => {
                this.removedMemberIds.push(member.id);
                this.removedMembers.push(...this.alertMembers.splice(index, 1));
                this.showProgress = false;
              },
              (err) => {
                this.showProgress = false;
              }
            );
        }
      });
  }

  public onDialogClose() {
    if (this.removedMemberIds.length) {
      this.createActivity(this.removedMembers);
      this.dialogRef.close({
        removedMemberIds: this.removedMemberIds,
        alertActivity: this.alertActivity,
      });
    } else {
      this.dialogRef.close();
    }
  }
}
