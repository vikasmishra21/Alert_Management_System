import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataService } from "src/app/services/data.service";
import { ActivityType } from "src/app/enums/alerts.enum";
import { AlertMember } from "src/app/classes/alert-member";
import { AlertActivity } from "src/app/classes/alert-activity";

@Component({
  selector: "app-add-members",
  templateUrl: "./add-members.component.html",
  styleUrls: ["./add-members.component.scss"],
})
export class AddMembersComponent implements OnInit {
  public availableUsers = [];
  public filteredUsers = [];
  public searchString = "";
  public showProgress = false;
  public selectedMembers = {};

  private existingMembers: Set<string> = new Set();
  private alertActivity: AlertActivity = new AlertActivity();

  constructor(
    public dialogRef: MatDialogRef<AddMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dialogRef.updatePosition({ right: "20px" });

    if (this.dialogData.alert) {
      for (let i = 0; i < this.dialogData.alert.alertMembers.length; i++) {
        let memberId = this.dialogData.alert.alertMembers[i].member;
        this.existingMembers.add(memberId);
      }
    }

    this.showProgress = true;
    this.dataService.getUsers().subscribe(
      (res: any[]) => {
        this.availableUsers = res.filter(
          (x) => !this.existingMembers.has(x.UserName)
        );
        this.filterUsers(null);
        this.showProgress = false;
      },
      (err) => {
        this.showProgress = false;
      }
    );
  }

  public filterUsers(event): void {
    this.searchString = event ? event.target.value : this.searchString;

    this.filteredUsers = this.availableUsers.filter((x) => {
      let fullName = x.User.FirstName + " " + x.User.LastName;
      return (
        fullName.indexOf(this.searchString) !== -1 ||
        x.UserName.indexOf(this.searchString) !== -1
      );
    });
  }

  public addMembers(): void {
    let members = [];

    for (let i = 0; i < this.filteredUsers.length; i++) {
      if (this.selectedMembers[this.filteredUsers[i].UserName]) {
        let member = new AlertMember();
        member.alertId = this.dialogData.alertId;
        member.member = this.filteredUsers[i].UserName;
        member.memberName =
          this.filteredUsers[i].User.FirstName +
          " " +
          this.filteredUsers[i].User.LastName;
        members.push(member);
      }
    }

    if (members.length === 0) {
      return;
    }

    this.showProgress = true;
    this.dataService
      .addMembers(
        this.dialogData.alertPipelineId,
        this.dialogData.alertId,
        members
      )
      .subscribe(
        (res) => {
          this.createActivity(members);
          this.showProgress = false;
          this.dialogRef.close({
            response: res,
            alertActivity: this.alertActivity,
          });
        },
        (err) => {
          this.showProgress = false;
        }
      );
  }

  private getAddMemberQueryString(members): string {
    let queryString = [];

    for (let member in members) {
      queryString[member] =
        members[member].memberName + ":" + members[member].member;
    }

    return queryString.join("|");
  }

  private createActivity(members): void {
    this.alertActivity.alertID = this.dialogData.alertId;
    this.alertActivity.activityTypeID = ActivityType.ADD_MEMBER;

    const queryString = this.getAddMemberQueryString(members);

    this.alertActivity.membersAffected = queryString;
  }

  public onDialogClose(): void {
    this.dialogRef.close();
  }
}
