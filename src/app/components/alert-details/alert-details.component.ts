import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { AlertStateService } from "src/app/services/alert-state.service";
import { AddMembersComponent } from "../add-members/add-members.component";
import { VariableSelectorComponent } from "../variable-selector/variable-selector.component";
import { EmailComponent } from "../email/email.component";
import { PhoneCallComponent } from "../phone-call/phone-call.component";
import { NotesComponent } from "../notes/notes.component";
import { FileUploadComponent } from "../file-upload/file-upload.component";
import { AlertActivity } from "src/app/classes/alert-activity";
import {
  Status,
  VariableType,
  ActivityType,
  AlertEmailType,
  Priority,
} from "src/app/enums/alerts.enum";
import { IAlert } from "src/app/interfaces/alert";
import { Email } from "src/app/interfaces/email";
import { Observable, from } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { UserService } from "src/app/services/user.service";
import { DeleteMembersComponent } from "../delete-members/delete-members.component";
import { ProjectRoles } from "src/app/enums/project-roles.enum";
import { SurveyViewComponent } from "../survey-view/survey-view.component";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-alert-details",
  templateUrl: "./alert-details.component.html",
  styleUrls: ["./alert-details.component.scss"],
})
export class AlertDetailsComponent implements OnInit {
  public Status = Status;
  public VariableType = VariableType;
  public ActivityType = ActivityType;
  public AlertEmailType = AlertEmailType;
  public Priority = Priority;

  public statuses = [
    { text: "Status", value: ActivityType.STATUS },
    { text: "Assignment", value: ActivityType.ASSIGNMENT },
    { text: "Note", value: ActivityType.NOTE },
    { text: "Email", value: ActivityType.EMAIL },
    { text: "Call", value: ActivityType.CALL },
    { text: "Upload", value: ActivityType.UPLOAD },
    { text: "Priority", value: ActivityType.PRIORITY },
    { text: "Member Addition", value: ActivityType.ADD_MEMBER },
    { text: "Member Deletion", value: ActivityType.DELETE_MEMBER },
  ];
  public selectedStatuses = [];
  public alertMembers = [];
  public selectedMembers = [];
  public activityFilters = { status: [], members: [] };
  public selectedFields = [];
  public alert: IAlert;
  public alertDetails;
  public transformedAlertProperties: any = {};
  public showProgress = false;
  public alertActivities: any[] = [];
  public status: Status;
  public priority: Priority;
  public assignedTo: string;
  public isProjectUser: boolean = false;
  public statusesSelectAll = true;
  public membersSelectAll = true;
  public variablesOptions = {};
  public displayedSelectedFields = [];

  public routeParameters;
  private queryParameters;

  constructor(
    private addMembersDialog: MatDialog,
    private deleteMembersDialog: MatDialog,
    private variableSelectorDialog: MatDialog,
    private emailDialog: MatDialog,
    private notesDialog: MatDialog,
    private phoneCallDialog: MatDialog,
    private fileUploadDialog: MatDialog,
    private surveyViewDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private userService: UserService,
    private alertState: AlertStateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getRouteParameters();

    if (
      this.queryParameters.projectGuid &&
      this.queryParameters.projectGuid !==
        this.userService.getCurrentProjectId()
    ) {
      this.showProgress = true;

      this.authService
        .getProjectToken(this.queryParameters.projectGuid)
        .subscribe(
          (res) => {
            this.userService.setCurrentProjectId(
              this.queryParameters.projectGuid
            );
            this.initializeDetails();

            this.isProjectUser =
              this.userService.getProjectInfo(
                this.userService.getCurrentProjectId()
              ).Roleid === ProjectRoles.PROJECT
                ? true
                : false;
          },
          (err) => {
            console.log("You are not assigned to this project.");
            // Show a dialog and on 'Ok' click of it navigate to home page.
            this.showProgress = false;
          }
        );
    } else {
      this.initializeDetails();
      this.isProjectUser =
        this.userService.getProjectInfo(this.userService.getCurrentProjectId())
          .Roleid === ProjectRoles.PROJECT
          ? true
          : false;
    }
  }

  private initializeDetails() {
    if (this.alertState.alert) {
      this.showProgress = true;

      this.alert = this.alertState.alert;
      this.initialiseAlertInfo();
      this.getAlertActivities();
      this.getFields(
        this.userService.getCurrentProjectId(),
        this.routeParameters.pipelineId
      );
    } else if (this.routeParameters) {
      this.showProgress = true;
      this.getAlert(
        this.routeParameters.pipelineId,
        this.routeParameters.alertId
      ).subscribe(
        (res) => {},
        (err) => {
          this.showProgress = false;
        }
      );
    } else {
      this.router.navigate(["home"]);
    }
  }

  private getAlert(pipelineId: string, alertId: string): Observable<any> {
    return new Observable((subscriber) => {
      this.dataService
        .getAlert(this.routeParameters.pipelineId, this.routeParameters.alertId)
        .subscribe(
          (res) => {
            this.alert = res.alertList[0];
            this.initialiseAlertInfo();
            this.getAlertActivities();
            this.getFields(
              this.userService.getCurrentProjectId(),
              this.routeParameters.pipelineId
            );
            subscriber.next(res);
          },
          (err) => {
            subscriber.error(err);
          }
        );
    });
  }

  private getAlertActivities(): void {
    this.dataService
      .getAlertDetails(
        this.routeParameters.pipelineId,
        this.routeParameters.alertId
      )
      .pipe(
        mergeMap((res) => {
          this.alertDetails = res;

          return this.dataService.getAlertActivities(
            this.routeParameters.pipelineId,
            this.routeParameters.alertId
          );
        })
      )
      .subscribe(
        (res) => {
          this.alertActivities = res;
          this.showProgress = false;
        },
        (err) => {}
      );
  }

  private getFields(projectID: string, pipelineId: string | number): void {
    this.dataService.getFields(projectID, pipelineId, "details").subscribe(
      (res) => {
        this.selectedFields = res;
        this.dataService
          .getFilterOptions(this.getFilterString())
          .subscribe((res) => {
            this.variablesOptions = res;
            this.displayedSelectedFields = this.getFieldsToDisplay();
          });
      },
      (err) => (this.selectedFields = [])
    );
  }

  private getFilterString(): string {
    let filterString = "";
    let variableName = "";

    this.selectedFields.forEach((field) => {
      filterString = filterString + "side";
      variableName = "{" + field.variableName + "}";
      filterString = filterString + variableName + "+";
    });

    filterString = filterString.slice(0, filterString.length - 1);

    return filterString;
  }

  private getFieldsToDisplay(): any {
    let displayedSelectedFields = [];

    this.selectedFields.forEach((field) => {
      let variable = {
        variableText:
          field.variableType === VariableType.NUMERIC ||
          field.variableType === VariableType.DATE_TIME ||
          field.variableType === VariableType.TEXT
            ? field.variableText
            : this.variablesOptions[field.variableName].text,
        answer: this.alert.fields[field.variableName],
      };

      displayedSelectedFields.push(variable);
    });

    return displayedSelectedFields;
  }

  private initialiseAlertInfo(): void {
    if (!this.alert.alertMembers.length) {
      this.createAlertMembers();
    } else {
      this.alertMembers = [...this.alert.alertMembers];
      if (!this.checkAlertAssignedMember()) {
        this.createAlertMembers();
      }
    }

    this.createAlertTransformedProperties();
    this.status = this.alert.status;
    this.priority = this.alert.priority;
    this.assignedTo = this.alert.assignedTo;
    this.selectAll("activity");
    this.activityFilters.status = this.selectedStatuses.slice();
    this.selectAll("members");
    this.activityFilters.members = this.selectedMembers.slice();
  }

  private createAlertTransformedProperties() {
    if (this.alert.openedOn) {
      if (this.alert.status != Status.CLOSED) {
        let openedOn = new Date(this.alert.openedOn);
        let timeZoneDiff = openedOn.getTimezoneOffset();
        openedOn = new Date(openedOn.getTime() - timeZoneDiff * 60 * 1000);

        let currentDate = new Date();
        // let timeZoneDifference = currentDate.getTimezoneOffset();
        // currentDate = new Date(
        //   currentDate.getTime() + timeZoneDifference * 60 * 1000
        // );

        this.transformedAlertProperties.openedOn = openedOn.toLocaleDateString();
        this.transformedAlertProperties.openHours = Math.round(
          (currentDate.getTime() - openedOn.getTime()) / 3600000
        );
      } else {
        this.transformedAlertProperties.openedOn = new Date(
          this.alert.openedOn
        ).toLocaleDateString();
      }
    } else {
      this.transformedAlertProperties.openedOn = "Never";
    }

    if (this.alert.lastActivityOn) {
      this.transformedAlertProperties.lastActivityOn = new Date(
        this.alert.lastActivityOn
      ).toLocaleDateString();
    } else {
      this.transformedAlertProperties.lastActivityOn = "Never";
    }

    this.transformedAlertProperties.memberInitials = [];

    let alertMembers =
      this.alert.alertMembers.length <= 4 ? this.alert.alertMembers.length : 4;

    for (let i = 0; i < alertMembers; i++) {
      let memberDetails = {
        fullName: "",
        initials: "",
      };
      memberDetails.fullName = this.alert.alertMembers[i].memberName;
      let name = this.alert.alertMembers[i].memberName.split(" ");
      let firstName = name[0];
      let lastName = name.length > 0 ? name[1] : "";
      let initials = lastName
        ? firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
        : firstName.charAt(0).toUpperCase();
      memberDetails.initials = initials;

      this.transformedAlertProperties.memberInitials.push(memberDetails);
    }
  }

  private createAlertMembers(): void {
    let member = {
      member: "",
      memberName: "",
    };
    const username = this.userService.getUserInfo().username;

    if (this.alert.assignedTo == username) {
      member.member = username;
      member.memberName = "me";
    } else {
      member.member = this.alert.assignedTo;
      member.memberName = this.alert.assignedTo;
    }

    this.alertMembers.push(member);
  }

  private checkAlertAssignedMember(): boolean {
    for (let i = 0; i < this.alertMembers.length; i++) {
      if (this.alertMembers[i].member == this.alert.assignedTo) {
        return true;
      }
    }

    return false;
  }

  private getRouteParameters() {
    this.activatedRoute.params.subscribe((res) => {
      this.routeParameters = res;
    });

    this.activatedRoute.queryParams.subscribe((res) => {
      this.queryParameters = res;
    });
  }

  private removeSelectedFields(ids: number[]): void {
    const deletedIds = new Set();

    ids.forEach((x) => deletedIds.add(x));
    this.selectedFields = this.selectedFields.filter(
      (x) => !deletedIds.has(x.id)
    );
  }

  private saveSelectedVariable(data): Observable<any> {
    if (Array.isArray(data.selectedVariables)) {
      data.selectedVariables.map(
        (x) => (x.PipelineID = this.routeParameters.pipelineId)
      );

      return this.dataService.saveFields(data.selectedVariables, "details");
    }

    return from("Nothing to save");
  }

  private sendEmail(emailContent: Email) {
    const alertActivity = new AlertActivity();

    alertActivity.alertID = this.alert.id;
    alertActivity.emailTo = emailContent.to;
    alertActivity.subject = emailContent.subject;
    alertActivity.body = emailContent.body;
    alertActivity.forActivityId = 0;
    // alertActivity.id = parseInt(new Date().getTime().toString().slice(0, 5));
    alertActivity.members = this.alert.alertMembers;
    alertActivity.alertEmailType = AlertEmailType.AgentReply;
    alertActivity.assignedTo = this.alert.assignedTo;
    alertActivity.activityTypeID = ActivityType.EMAIL;

    this.showProgress = true;
    this.postAlertActivity(
      this.routeParameters.pipelineId,
      this.routeParameters.alertId,
      alertActivity
    ).subscribe(
      (res) => {
        this.showProgress = false;
        alertActivity.id = res;
        alertActivity.activityBy = this.userService.getUserInfo().username;
        alertActivity.activityDate = new Date().toLocaleDateString();

        this.alertActivities.unshift(alertActivity);
        this.alertActivities = this.alertActivities.slice();
      },
      (err) => {
        this.showProgress = false;
      }
    );
  }

  private updateAlertNote(alertNotes) {
    const alertActivity = new AlertActivity();

    alertActivity.alertID = this.alert.id;
    alertActivity.note = alertNotes;
    alertActivity.assignedTo = this.alert.assignedTo;
    alertActivity.members = this.alert.alertMembers;
    alertActivity.activityTypeID = ActivityType.NOTE;

    this.showProgress = true;
    this.postAlertActivity(
      this.routeParameters.pipelineId,
      this.routeParameters.alertId,
      alertActivity
    ).subscribe(
      (res) => {
        this.showProgress = false;
        alertActivity.activityBy = this.userService.getUserInfo().username;
        alertActivity.activityDate = new Date().toLocaleDateString();

        this.alertActivities.unshift(alertActivity);
        this.alertActivities = this.alertActivities.slice();
      },
      (err) => {
        this.showProgress = false;
      }
    );
  }

  private addPhoneCall(callData) {
    const alertActivity = new AlertActivity();

    alertActivity.alertID = this.alert.id;
    alertActivity.callStatus = callData.status;
    alertActivity.note = callData.note;
    alertActivity.assignedTo = this.alert.assignedTo;
    alertActivity.members = this.alert.alertMembers;
    alertActivity.activityTypeID = ActivityType.CALL;

    this.showProgress = true;
    this.postAlertActivity(
      this.routeParameters.pipelineId,
      this.routeParameters.alertId,
      alertActivity
    ).subscribe(
      (res) => {
        this.showProgress = false;
        alertActivity.activityBy = this.userService.getUserInfo().username;
        alertActivity.activityDate = new Date().toLocaleDateString();

        this.alertActivities.unshift(alertActivity);
        this.alertActivities = this.alertActivities.slice();
      },
      (err) => {
        this.showProgress = false;
      }
    );
  }

  private uploadFile(fileName: string): void {
    const alertActivity = new AlertActivity();

    alertActivity.alertID = this.alert.id;
    alertActivity.uploadedFile = fileName;
    alertActivity.assignedTo = this.alert.assignedTo;
    alertActivity.members = this.alert.alertMembers;
    alertActivity.activityTypeID = ActivityType.UPLOAD;

    this.showProgress = true;
    this.postAlertActivity(
      this.routeParameters.pipelineId,
      this.routeParameters.alertId,
      alertActivity
    ).subscribe(
      (res) => {
        this.showProgress = false;
        alertActivity.alertID = this.alert.id;
        alertActivity.activityBy = this.userService.getUserInfo().username;
        alertActivity.activityDate = new Date().toLocaleDateString();

        this.alertActivities.unshift(alertActivity);
        this.alertActivities = this.alertActivities.slice();
      },
      (err) => {
        this.showProgress = false;
      }
    );
  }

  private postAlertActivity(
    alertPipelineId: string,
    alertId: number,
    alertActivity: AlertActivity
  ): Observable<any> {
    return this.dataService.postAlertActivity(
      alertPipelineId,
      alertId,
      alertActivity
    );
  }

  public updatePriority(): void {
    const oldPriority: Priority = this.alert.priority;
    const alertActivity = new AlertActivity();

    alertActivity.alertID = this.alert.id;
    alertActivity.members = this.alert.alertMembers;
    alertActivity.assignedTo = this.alert.assignedTo;
    alertActivity.activityTypeID = ActivityType.PRIORITY;
    alertActivity.originalPriority = oldPriority;
    alertActivity.newPriority = this.priority;

    this.showProgress = true;
    this.postAlertActivity(
      this.routeParameters.pipelineId,
      this.routeParameters.alertId,
      alertActivity
    ).subscribe(
      (res) => {
        this.showProgress = false;
        alertActivity.alertID = this.alert.id;
        alertActivity.activityBy = this.userService.getUserInfo().username;
        alertActivity.activityDate = new Date().toLocaleDateString();

        this.alertActivities.unshift(alertActivity);
        this.alertActivities = this.alertActivities.slice();
      },
      (err) => {
        this.showProgress = false;
        this.priority = this.alert.priority;
      }
    );
  }

  public updateStatus(): void {
    const alertActivity = new AlertActivity();

    alertActivity.alertID = this.alert.id;
    alertActivity.originalStatus = this.alert.status;
    alertActivity.newStatus = this.status;
    alertActivity.members = this.alert.alertMembers;
    alertActivity.assignedTo = this.alert.assignedTo;
    alertActivity.activityTypeID = ActivityType.STATUS;

    this.showProgress = true;
    this.postAlertActivity(
      this.routeParameters.pipelineId,
      this.routeParameters.alertId,
      alertActivity
    ).subscribe(
      (res) => {
        this.showProgress = false;
        alertActivity.alertID = this.alert.id;
        alertActivity.activityBy = this.userService.getUserInfo().username;
        alertActivity.activityDate = new Date().toLocaleDateString();

        this.alertActivities.unshift(alertActivity);
        this.alertActivities = this.alertActivities.slice();
      },
      (err) => {
        this.showProgress = false;
        this.status = this.alert.status;
      }
    );
  }

  public updateAssignedTo() {
    const alertActivity = new AlertActivity();

    alertActivity.alertID = this.alert.id;
    alertActivity.assignedTo = this.assignedTo;
    alertActivity.originallyAssignedTo = this.alert.assignedTo;
    alertActivity.newAssignedTo = this.assignedTo;
    alertActivity.members = this.alert.alertMembers;
    alertActivity.activityTypeID = ActivityType.ASSIGNMENT;

    this.showProgress = true;
    this.postAlertActivity(
      this.routeParameters.pipelineId,
      this.routeParameters.alertId,
      alertActivity
    ).subscribe(
      (res) => {
        this.showProgress = false;
        alertActivity.alertID = this.alert.id;
        alertActivity.activityBy = this.userService.getUserInfo().username;
        alertActivity.activityDate = new Date().toLocaleDateString();

        this.alertActivities.unshift(alertActivity);
        this.alertActivities = this.alertActivities.slice();
      },
      (err) => {
        this.showProgress = false;
        this.assignedTo = this.alert.assignedTo;
      }
    );
  }

  public openAddMembersDialog(): void {
    const dialogRef = this.addMembersDialog.open(AddMembersComponent, {
      width: "30%",
      height: "95%",
      closeOnNavigation: true,
      disableClose: true,
      data: {
        alertPipelineId: this.routeParameters.pipelineId,
        alertId: this.routeParameters.alertId,
        alert: this.alert,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.response) {
        this.alert.alertMembers.push(...result.response);
        this.createAlertTransformedProperties();

        result.alertActivity.activityBy = this.userService.getUserInfo().username;
        result.alertActivity.activityDate = new Date().toLocaleDateString();
        result.alertActivity.assignedTo = this.alert.assignedTo;
        result.alertActivity.members = this.alert.alertMembers;

        this.showProgress = true;
        this.postAlertActivity(
          this.routeParameters.pipelineId,
          this.routeParameters.alertId,
          result.alertActivity
        ).subscribe(
          (res) => {
            this.alertActivities.unshift(result.alertActivity);
            this.alertActivities = this.alertActivities.slice();
            this.showProgress = false;
          },
          (err) => {
            this.showProgress;
          }
        );
      }
    });
  }

  public openDeleteMembersDialog(): void {
    const dialogRef = this.deleteMembersDialog.open(DeleteMembersComponent, {
      width: "30%",
      height: "95%",
      closeOnNavigation: true,
      disableClose: true,
      data: {
        alertPipelineId: this.routeParameters.pipelineId,
        alertId: this.routeParameters.alertId,
        alert: this.alert,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.removedMemberIds) {
        const removedIds = new Set();
        result.removedMemberIds.forEach((x) => removedIds.add(x));
        this.alert.alertMembers = this.alert.alertMembers.filter(
          (x) => !removedIds.has(x.id)
        );

        this.createAlertTransformedProperties();

        result.alertActivity.activityBy = this.userService.getUserInfo().username;
        result.alertActivity.activityDate = new Date().toLocaleDateString();
        result.alertActivity.assignedTo = this.alert.assignedTo;
        result.alertActivity.members = this.alert.alertMembers;

        this.showProgress = true;
        this.postAlertActivity(
          this.routeParameters.pipelineId,
          this.routeParameters.alertId,
          result.alertActivity
        ).subscribe(
          (res) => {
            this.alertActivities.unshift(result.alertActivity);
            this.alertActivities = this.alertActivities.slice();
            this.showProgress = false;
          },
          (err) => {
            this.showProgress;
          }
        );
      }
    });
  }

  public openVariableSelectorDialog(): void {
    const dialogRef = this.variableSelectorDialog.open(
      VariableSelectorComponent,
      {
        width: "60%",
        height: "85%",
        minHeight: "500px",
        closeOnNavigation: true,
        disableClose: true,
        data: { data: this.selectedFields },
      }
    );

    dialogRef.afterClosed().subscribe((data) => {
      if (data.deletedIds.length) {
        this.showProgress = true;
        this.dataService
          .deleteVariable(
            this.routeParameters.pipelineId,
            data.deletedIds.join(",")
          )
          .pipe(
            mergeMap((res) => {
              this.removeSelectedFields(data.deletedIds);
              return this.saveSelectedVariable(data);
            })
          )
          .subscribe(
            (res) => {
              this.selectedFields = this.selectedFields.concat(
                data.selectedVariables
              );
              this.getAlert(
                this.routeParameters.pipelineId,
                this.routeParameters.alertId
              ).subscribe(
                (res) => {
                  this.displayedSelectedFields = this.getFieldsToDisplay();
                },
                (err) => {
                  this.showProgress = false;
                }
              );
            },
            (err) => {
              this.showProgress = false;
            }
          );
      } else {
        this.showProgress = true;
        this.saveSelectedVariable(data).subscribe(
          (res) => {
            this.showProgress = false;
            this.selectedFields = this.selectedFields.concat(
              data.selectedVariables
            );
            this.getAlert(
              this.routeParameters.pipelineId,
              this.routeParameters.alertId
            ).subscribe(
              (res) => {
                this.displayedSelectedFields = this.getFieldsToDisplay();
              },
              (err) => {
                this.showProgress = false;
              }
            );
          },
          (err) => {
            this.showProgress = false;
          }
        );
      }
    });
  }

  public openEmailDialog(): void {
    const dialogRef = this.emailDialog.open(EmailComponent, {
      width: "45%",
      height: "80%",
      closeOnNavigation: true,
      disableClose: true,
      data: {
        respondentEmail: this.alert["respondentEmail"],
        alertId: this.routeParameters.alertId,
        subId: this.userService.getUserInfo().CustomerID,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sendEmail(result);
      }
    });
  }

  public openNotesDialog(): void {
    const dialogRef = this.notesDialog.open(NotesComponent, {
      width: "40%",
      height: "75%",
      closeOnNavigation: true,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateAlertNote(result);
      }
    });
  }

  public openPhoneCallDialog(): void {
    const dialogRef = this.phoneCallDialog.open(PhoneCallComponent, {
      width: "40%",
      height: "80%",
      closeOnNavigation: true,
      disableClose: true,
      data: {
        respondentPhone: this.alert.respondentPhone,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addPhoneCall(result);
      }
    });
  }

  public openFileUploadDialog(): void {
    const dialogRef = this.fileUploadDialog.open(FileUploadComponent, {
      width: "30%",
      height: "50%",
      closeOnNavigation: true,
      disableClose: true,
      data: {
        uploadedFile: "",
        pipelineId: this.routeParameters.pipelineId,
        alertId: this.routeParameters.alertId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.uploadFile(result);
      }
    });
  }

  public onReturn() {
    this.router.navigate(["home"]);
  }

  public onActivityFilterOpenChange(opened: boolean): void {
    if (!opened) {
      this.activityFilters.status = this.selectedStatuses.slice();
      this.activityFilters.members = this.selectedMembers.slice();
    }
  }

  public openSurveyViewDialog(): void {
    const dialogRef = this.surveyViewDialog.open(SurveyViewComponent, {
      width: "80%",
      height: "80%",
      closeOnNavigation: true,
      disableClose: true,
      data: this.alert.fields["RespondentID"].trim(),
    });
  }

  public selectAll(type: string): void {
    if (type == "activity") {
      if (this.statusesSelectAll) {
        this.selectedStatuses = [];
        this.statuses.forEach((status) => {
          this.selectedStatuses.push(status.value);
        });
      } else {
        this.selectedStatuses = [];
      }
    }

    if (type == "members") {
      this.selectedMembers = [];
    }
  }

  public disableSelectAll(type: string) {
    switch (type) {
      case "activity":
        if (this.statusesSelectAll) {
          this.statusesSelectAll = !this.statusesSelectAll;
        }
        break;

      case "members":
        if (this.membersSelectAll) {
          this.membersSelectAll = !this.membersSelectAll;
        }
        break;
    }
  }
}
