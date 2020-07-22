import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { Priority, Status } from "src/app/enums/alerts.enum";
import { IAlert } from "src/app/interfaces/alert";
import { AlertStateService } from "src/app/services/alert-state.service";

@Component({
  selector: "app-alert-box",
  templateUrl: "./alert-box.component.html",
  styleUrls: ["./alert-box.component.scss"],
})
export class AlertBoxComponent implements OnInit {
  @Input() id: string;
  @Input() pipelineId: string;
  @Input() alert: IAlert;
  @Input() selectedFields: any[] = [];

  public Priority = Priority;
  public Status = Status;
  public transformedAlertProperties: any = {};

  constructor(private router: Router, private alertState: AlertStateService) {}

  ngOnInit(): void {
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
  }

  public openAlert() {
    this.alertState.alert = this.alert;
    this.router.navigate(["alert-details", this.pipelineId, this.id]);
  }

  // ngOnChanges(changes): void {
  //   if (changes.alert || changes.selectedFields) {
  //     // this.priority = changes.alert.currentValue.priority;
  //     // this.setPriorityIconColor();
  //   }
  // }

  // public setPriorityIconColor() {
  //   switch (this.priority) {
  //     case Priority.LOW:
  //       this.priorityIcon = {
  //         color: "#007bff",
  //       };
  //       break;

  //     case Priority.MEDIUM:
  //       this.priorityIcon = {
  //         color: "#ffc107",
  //       };
  //       break;

  //     case Priority.HIGH:
  //       this.priorityIcon = {
  //         color: "#dc3545",
  //       };
  //       break;
  //   }
  // }

  // public setPriority() {
  //   this.setPriorityIconColor();
  //   const oldPriority = this.alert.priority;
  //   this.alert.priority = this.priority;
  //   this.onPriorityChange.emit({
  //     alert: this.alert,
  //     oldPriority: oldPriority,
  //   });
  // }
}
