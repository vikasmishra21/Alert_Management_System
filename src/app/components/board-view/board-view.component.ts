import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { IAlert } from "src/app/interfaces/alert";
import { Status, ActivityType, Priority } from "src/app/enums/alerts.enum";
import { AlertActivity } from "src/app/classes/alert-activity";
import { Observable } from "rxjs";
import { DataService } from "src/app/services/data.service";

interface IAlertStatusUpdateEvent {
  alert: IAlert;
  oldStatus: Status;
}

@Component({
  selector: "app-board-view",
  templateUrl: "./board-view.component.html",
  styleUrls: ["./board-view.component.scss"],
})
export class BoardViewComponent implements OnInit, OnChanges {
  @Input() alerts: IAlert[] = [];
  @Input() pipelineId: string;
  @Input() selectedFields: any[] = [];
  @Output() onAlertStatusUpdate: EventEmitter<
    IAlertStatusUpdateEvent
  > = new EventEmitter<IAlertStatusUpdateEvent>();

  public Status = Status;
  public statuses = {
    new: [],
    waitingOnCustomer: [],
    waitingOnUs: [],
    closed: [],
  };
  public showProgress = false;

  private movedAlert: object;
  private targetStatus: number;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  ngOnChanges(changes): void {
    if (changes.alerts && changes.alerts.currentValue) {
      this.resetStatuses();
      this.loadData(this.alerts);
    }
  }

  private resetStatuses() {
    this.statuses.new = [];
    this.statuses.waitingOnCustomer = [];
    this.statuses.waitingOnUs = [];
    this.statuses.closed = [];
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.movedAlert = Object(
        event.previousContainer.data[event.previousIndex]
      );
      this.targetStatus = parseInt(
        event.container.element.nativeElement.attributes.getNamedItem("status")
          .value
      );

      // Move to new position.
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      let oldStatus: Status, alert: IAlert;

      // Changing status of Moved Alert
      for (let element of this.alerts) {
        if (
          element.id == this.movedAlert["id"] &&
          element.status == this.movedAlert["status"]
        ) {
          oldStatus = element.status;
          element.status = this.targetStatus;
          alert = element;
          break;
        }
      }

      this.showProgress = true;
      this.updateAlertStatus(oldStatus, this.targetStatus, alert).subscribe(
        (res) => {
          this.showProgress = false;
          this.onAlertStatusUpdate.emit({ alert: alert, oldStatus: oldStatus });
        },
        (err) => {
          alert.status = oldStatus;
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          this.showProgress = false;
        }
      );
    }
  }

  public loadData(alertData: IAlert[]) {
    alertData.forEach((element) => {
      switch (element.status) {
        case Status.NEW:
          this.statuses.new.push(element);
          break;

        case Status.WAITING_ON_CUSTOMER:
          this.statuses.waitingOnCustomer.push(element);
          break;

        case Status.WAITING_ON_US:
          this.statuses.waitingOnUs.push(element);
          break;

        case Status.CLOSED:
          this.statuses.closed.push(element);
          break;
      }
    });
  }

  public updateAlertStatus(
    oldStatus: Status,
    newStatus: Status,
    alert: IAlert
  ): Observable<any> {
    const alertActivity = new AlertActivity();

    alertActivity.alertID = alert.id;
    alertActivity.originalStatus = oldStatus;
    alertActivity.newStatus = newStatus;
    alertActivity.assignedTo = alert.assignedTo;
    alertActivity.members = alert.alertMembers;
    alertActivity.activityTypeID = ActivityType.STATUS;

    return this.postAlertActivity(this.pipelineId, alert.id, alertActivity);
  }

  private postAlertActivity(
    alertPipelineId: string,
    alertId: number,
    activity: AlertActivity
  ): Observable<any> {
    return this.dataService.postAlertActivity(
      alertPipelineId,
      alertId,
      activity
    );
  }
}
