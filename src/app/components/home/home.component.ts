import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ColumnSelectorComponent } from "../column-selector/column-selector.component";
import { VariableSelectorComponent } from "../variable-selector/variable-selector.component";
import { DataService } from "src/app/services/data.service";
import { IAlertPipeline } from "src/app/interfaces/alert-pipeline";
import { Observable, Subject, throwError, fromEvent, from } from "rxjs";
import { IAlert } from "src/app/interfaces/alert";
import {
  SortOn,
  DateRange,
  Status,
  Priority,
  AlertCategory,
  VariableType,
} from "src/app/enums/alerts.enum";
import { ColumnSelectorService } from "src/app/services/column-selector.service";
import { AuthService } from "src/app/services/auth.service";
import {
  mergeMap,
  distinctUntilChanged,
  map,
  debounceTime,
} from "rxjs/operators";
import { UserService } from "src/app/services/user.service";
import { AlertStateService } from "src/app/services/alert-state.service";
import { IMedianTTC } from "src/app/interfaces/median-ttc";
import { ProjectRoles } from "src/app/enums/project-roles.enum";
import { AppService } from "src/app/services/app.service";
import { AlertNotificationService } from "src/app/services/alert-notification.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("alertSearchInput") alertSearchInput: ElementRef;

  public SortOn = SortOn;
  public DateRange = DateRange;
  public Status = Status;
  public Priority = Priority;
  public AlertCategory = AlertCategory;
  public VariableType = VariableType;
  public alertsView = "board";
  public sortOn = SortOn.CREATED_ON;
  public filters = {
    displayMenu: false,
    createdOn: DateRange.NONE,
    createdOnStart: null,
    createdOnEnd: null,
    lastActivityDate: DateRange.NONE,
    lastActivityDateStart: null,
    lastActivityDateEnd: null,
    status: Status.NONE,
    priority: Priority.NONE,
    gettingUsers: true,
    lastFetched: null,
    users: [],
    assignedTo: [],
  };
  public alertStats = {
    open: 0,
    expired: 0,
    closed: 0,
  };
  public alertPipelines: IAlertPipeline[] = [];
  public selectedAlertPipeline: IAlertPipeline | undefined;
  public selectedAlertCategory: AlertCategory = AlertCategory.OPEN;
  public alerts: IAlert[] | undefined;
  public filteredAlerts: IAlert[] | undefined;
  public filteredSelectedFields: any = [];
  public selectedFields = []; //  Container for all selected Fields
  public showProgress = false;
  public isInvalidLastActivityOnDate = false;
  public isLastActivityOnDateEmpty = false;
  public isInvalidCreatedOnDate = false;
  public isCreatedOnDateEmpty = false;
  public selectedColumns = [];
  public variablesOptions = [];
  public medianTTC: IMedianTTC = { MedianTTC: 0, MyMedianTTC: 0 };
  public isProjectUser: boolean = false;
  public appVersion = "";
  public medianTTCStyles = {
    myTTC: {},
    allTTC: {},
  };

  private selectedFilterOptions = {};

  constructor(
    public columnSelectorDialog: MatDialog,
    public addFieldsDialog: MatDialog,
    private dataService: DataService,
    private columnSelectorService: ColumnSelectorService,
    private authService: AuthService,
    private userService: UserService,
    private alertState: AlertStateService,
    private appService: AppService,
    private alertNotificationService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.showProgress = true;

    this.appVersion = this.appService.getAppVersion();
    this.selectedColumns = this.columnSelectorService.getSelectedColumns();
    this.setTTCStyles();
    this.initialiseData();
  }

  ngAfterViewInit(): void {
    this.bindSearchEvent();
  }

  public initialiseData(): void {
    if (this.alertState.filters) {
      this.filters = this.alertState.filters;
    } else {
      this.alertState.filters = this.filters;
    }

    if (this.alertState.alertsView) {
      this.alertsView = this.alertState.alertsView;
    } else {
      this.alertState.alertsView = this.alertsView;
    }

    if (this.alertState.alertCategory) {
      this.selectedAlertCategory = this.alertState.alertCategory;
    } else {
      this.alertState.alertCategory = this.selectedAlertCategory;
    }

    this.dataService
      .getAlertPipelines()
      .pipe(
        mergeMap((res) => {
          this.alertPipelines = res;

          let index = 0;
          if (this.alertState.alertPipeline) {
            index = this.alertPipelines.findIndex(
              (x) => x.id === this.alertState.alertPipeline.id
            );
          }

          return this.selectAlertPipeline(index === -1 ? 0 : index);
        })
      )
      .subscribe(
        (res) => (this.showProgress = false),
        (err) => (this.showProgress = false)
      );
  }

  private bindSearchEvent(): void {
    fromEvent(this.alertSearchInput.nativeElement, "keyup")
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((searchText) => {
        this.filteredAlerts = this.alerts.filter((x) => {
          let nameIndex = x.respondentName
            .toLowerCase()
            .indexOf(searchText.toLowerCase());
          let fieldIndex = -1;

          for (let field in x.fields) {
            fieldIndex = x.fields[field]
              .toLowerCase()
              .indexOf(searchText.toLowerCase());

            if (fieldIndex !== -1) {
              break;
            }
          }

          return nameIndex !== -1 || fieldIndex !== -1;
        });
      });
  }

  private resetAlertStats() {
    this.alertStats.open = 0;
    this.alertStats.expired = 0;
    this.alertStats.closed = 0;
  }

  /**
   *
   * @param median boolean whether to delete the temp table on completion of this call.
   */
  private getAlerts(median: boolean = false): Observable<any> {
    const subject = new Subject();
    let query = this.getAlertQueryString();

    if (query.length > 0) {
      query += `&$median=${median}`;
    } else {
      query = `$median=${median}`;
    }

    this.dataService.getAlerts(this.selectedAlertPipeline.id, query).subscribe(
      (res) => {
        this.alerts = res.alertList;
        this.filteredAlerts = this.alerts.slice();

        this.resetAlertStats();

        for (let i = 0; i < this.alerts.length; i++) {
          switch (this.alerts[i].status) {
            // Closed
            case 4:
              this.alertStats.closed++;
              break;

            default:
              this.alertStats.open++;

              if (this.alerts[i].expired) this.alertStats.expired++;
          }
        }

        subject.next(res);
      },
      (err) => {
        this.alerts = [];
        this.filteredAlerts = [];

        subject.error(err);
      }
    );

    return subject.asObservable();
  }

  private getMedianTTC(tableName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.dataService
        .getMedianTTC(this.selectedAlertPipeline.id, tableName)
        .subscribe(
          (res) => {
            this.medianTTC = res;
            this.setTTCStyles();

            subscriber.next(res);
          },
          (err) => {
            subscriber.error(err);
          }
        );
    });
  }

  private setTTCStyles() {
    this.medianTTCStyles.myTTC["left"] = `${this.medianTTC.MyMedianTTC}%`;
    this.medianTTCStyles.allTTC["left"] = `${this.medianTTC.MedianTTC}%`;
  }

  private getFormattedDate(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  private getAlertQueryString(): string {
    let allFilters = [];

    allFilters.push(this.getAlertFilterString());
    allFilters.push(this.getSurveyFilterString());
    allFilters.push(this.getOtherFilterString());

    allFilters = allFilters.filter((x) => x !== "");

    return allFilters.join("&");
  }

  private getAlertFilterString(): string {
    let filterString = "";
    let filters = [];

    filters.push(`alertCategory eq ${this.selectedAlertCategory}`);

    if (this.filters.createdOn !== DateRange.NONE) {
      if (this.filters.createdOn === DateRange.CUSTOM) {
        const start = this.filters.createdOnStart
          ? this.getFormattedDate(this.filters.createdOnStart)
          : this.getFormattedDate(new Date());
        const end = this.filters.createdOnEnd
          ? this.getFormattedDate(this.filters.createdOnEnd)
          : this.getFormattedDate(new Date());

        filters.push(`createdOn eq ${start}|${end}`);
      } else {
        filters.push(`createdOn eq ${this.filters.createdOn}`);
      }
    }

    if (this.filters.lastActivityDate !== DateRange.NONE) {
      if (this.filters.lastActivityDate === DateRange.CUSTOM) {
        const start = this.filters.lastActivityDateStart
          ? this.getFormattedDate(this.filters.lastActivityDateStart)
          : this.getFormattedDate(new Date());
        const end = this.filters.lastActivityDateEnd
          ? this.getFormattedDate(this.filters.lastActivityDateEnd)
          : this.getFormattedDate(new Date());

        filters.push(`lastActivityDate eq ${start}|${end}`);
      } else {
        filters.push(`lastActivityDate eq ${this.filters.lastActivityDate}`);
      }
    }

    if (this.filters.status !== Status.NONE) {
      filters.push(`status eq ${this.filters.status}`);
    }

    if (this.filters.priority !== Priority.NONE) {
      filters.push(`priority eq ${this.filters.priority}`);
    }

    if (this.filters.assignedTo.length !== 0) {
      filters.push(`assignedTo eq ${this.filters.assignedTo.join(",")}`);
    }

    if (filters.length !== 0) {
      filterString = `$alertFilter=${filters.join(" and ")}`;
    }

    return filterString;
  }

  private getSurveyFilterString(): string {
    let filterString = "";
    let filters = [];

    for (let i = 0; i < this.selectedFields.length; i++) {
      if (
        !this.selectedFilterOptions.hasOwnProperty(
          this.selectedFields[i].variableName
        ) ||
        this.selectedFilterOptions[this.selectedFields[i].variableName]
          .selectedFilter.length === 0
      ) {
        continue;
      }

      let operator =
        this.selectedFilterOptions[this.selectedFields[i].variableName]
          .selectedFilter.length == 1
          ? "itemSelected"
          : "anyItemSelected";
      filters.push(
        `${
          this.selectedFields[i].variableName
        } ${operator} ${this.selectedFilterOptions[
          this.selectedFields[i].variableName
        ].selectedFilter.join(",")}`
      );
    }

    if (filters.length !== 0) {
      filterString = `$surveyFilter=${filters.join(" and ")}`;
    }

    return filterString;
  }

  private getOtherFilterString(): string {
    let filters = [];
    let filterString = "";

    if (this.sortOn !== SortOn.NONE) {
      filterString = `$sortOn=${this.sortOn}`;
      filters.push(filterString);
    }

    return filters.join("&");
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
        (x) => (x.PipelineID = this.selectedAlertPipeline.id)
      );

      return this.dataService.saveFields(data.selectedVariables, "home");
    }

    return from("Nothing to save");
  }

  public openVariableSelectorDialog(): void {
    const dialogRef = this.addFieldsDialog.open(VariableSelectorComponent, {
      width: "60%",
      height: "85%",
      minHeight: "500px",
      closeOnNavigation: true,
      disableClose: true,
      data: { data: this.selectedFields },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.deletedIds.length) {
        this.showProgress = true;
        this.dataService
          .deleteVariable(
            this.selectedAlertPipeline.id,
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
              this.getAlerts().subscribe(
                (res) => {
                  this.showProgress = false;
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
            this.getAlerts().subscribe(
              (res) => {
                this.showProgress = false;
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

  public toggleFilterMenu(): void {
    this.filters.displayMenu = !this.filters.displayMenu;

    if (this.filters.displayMenu === true) {
      let currentTime = new Date().getTime();
      let lastTime = this.filters.lastFetched
        ? this.filters.lastFetched.getTime()
        : 0;
      let difference = currentTime - lastTime;
      let differenceInMinutes = difference / (1000 * 60);

      if (differenceInMinutes <= 5) {
        return;
      }

      this.filters.gettingUsers = true;
      this.filters.lastFetched = new Date();

      this.dataService.getUsers().subscribe((res) => {
        this.filters.gettingUsers = false;
        this.filters.users = res.map((x) => {
          return {
            username: x.UserName,
            name: x.User.FirstName + " " + x.User.LastName,
          };
        });
      });
    }
  }

  public changeAlertsView(view): void {
    this.alertsView = view;
    this.alertState.alertsView = view;
  }

  public openColumnSelectorDialog(): void {
    const dialogRef = this.columnSelectorDialog.open(ColumnSelectorComponent, {
      width: "60%",
      height: "85%",
      minHeight: "500px",
      closeOnNavigation: true,
      disableClose: true,
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.selectedColumns = result;
    });
  }

  public selectAlertPipeline(index: number): Observable<any> {
    if (this.alertPipelines.length === 0) {
      return throwError("Alert pipelines is empty");
    }

    if (
      this.selectedAlertPipeline &&
      this.selectedAlertPipeline.id === this.alertPipelines[index].id
    )
      return throwError("This pipeline is already selected");

    this.selectedAlertPipeline = this.alertPipelines[index];

    this.userService.setCurrentProjectId(this.selectedAlertPipeline.projectID);
    this.alertState.alertPipeline = this.selectedAlertPipeline;
    this.getFields(
      this.selectedAlertPipeline.projectID,
      this.selectedAlertPipeline.id
    );

    this.showProgress = true;
    const subject: Subject<any> = new Subject<any>();

    this.authService
      .getProjectToken(this.selectedAlertPipeline.projectID)
      .pipe(
        mergeMap((res: any) => {
          this.isProjectUser =
            this.userService.getProjectInfo(
              this.selectedAlertPipeline.projectID
            ).Roleid === ProjectRoles.PROJECT
              ? true
              : false;

          return this.getAlerts(true);
        }),
        mergeMap((res) => {
          // Pass temp table name to median ttc call so that it get's deleted.
          let tableName = res.tableName;
          return tableName
            ? this.getMedianTTC(tableName)
            : from("no table to delete");
        })
      )
      .subscribe(
        (res) => {
          this.showProgress = false;
          subject.next(res);
        },
        (err) => {
          this.showProgress = false;
          this.filteredAlerts = [];
          this.alertNotificationService.showNotification(
            "Access denied to this pipeline."
          );
          subject.error(err);
        }
      );

    return subject.asObservable();
  }

  private getFields(projectID: string, pipelineId: string | number): void {
    this.dataService.getFields(projectID, pipelineId, "home").subscribe(
      (res) => {
        this.selectedFields = res;
        this.filteredSelectedFields = this.selectedFields.slice();
      },
      (err) => {
        this.selectedFields = [];
      }
    );
  }

  private validateActivityFilterDate(selectedFilterField): boolean {
    if (selectedFilterField == "lastActivityOn") {
      let startDate = new Date(this.filters.lastActivityDateStart);
      let endDate = new Date(this.filters.lastActivityDateEnd);

      let difference = endDate.getTime() - startDate.getTime();

      if (difference < 0) {
        this.isLastActivityOnDateEmpty = false;
        this.isInvalidLastActivityOnDate = true;
        return true;
      } else {
        this.isLastActivityOnDateEmpty = false;
        this.isInvalidLastActivityOnDate = false;
        return false;
      }
    } else {
      let startDate = new Date(this.filters.createdOnStart);
      let endDate = new Date(this.filters.createdOnEnd);

      var difference = endDate.getTime() - startDate.getTime();

      if (difference < 0) {
        this.isCreatedOnDateEmpty = false;
        this.isInvalidCreatedOnDate = true;
        return true;
      } else {
        this.isCreatedOnDateEmpty = false;
        this.isInvalidCreatedOnDate = false;
        return false;
      }
    }
  }

  private checkEmptyActivityFilterDate(selectedFilterField): boolean {
    if (selectedFilterField == "lastActivityOn") {
      if (
        this.filters.lastActivityDateEnd == null ||
        this.filters.lastActivityDateStart == null
      ) {
        this.isInvalidLastActivityOnDate = false;
        this.isLastActivityOnDateEmpty = true;
        return true;
      } else {
        this.isInvalidLastActivityOnDate = false;
        this.isLastActivityOnDateEmpty = false;
        return false;
      }
    } else {
      if (
        this.filters.createdOnStart == null ||
        this.filters.createdOnEnd == null
      ) {
        this.isInvalidCreatedOnDate = false;
        this.isCreatedOnDateEmpty = true;
        return true;
      } else {
        this.isInvalidCreatedOnDate = false;
        this.isCreatedOnDateEmpty = false;
        return false;
      }
    }
  }

  public selectAlertCategory(category): void {
    if (this.selectedAlertCategory === category) {
      return;
    }

    this.selectedAlertCategory = category;
    this.alertState.alertCategory = category;

    this.showProgress = true;
    this.getAlerts().subscribe(
      (res) => {
        this.showProgress = false;
      },
      (err) => {
        this.showProgress = false;
      }
    );
  }

  public submitFilters(): void {
    if (this.filters.createdOn === DateRange.CUSTOM) {
      if (
        this.validateActivityFilterDate("createdOn") ||
        this.checkEmptyActivityFilterDate("createdOn")
      ) {
        return;
      }
    }

    if (this.filters.lastActivityDate === DateRange.CUSTOM) {
      if (
        this.validateActivityFilterDate("lastActivityOn") ||
        this.checkEmptyActivityFilterDate("lastActivityOn")
      ) {
        return;
      }
    }

    this.isLastActivityOnDateEmpty = false;
    this.isInvalidLastActivityOnDate = false;
    this.isInvalidCreatedOnDate = false;
    this.isCreatedOnDateEmpty = false;
    this.filters.displayMenu = false;
    this.showProgress = true;
    this.alertState.filters = this.filters;
    this.getAlerts().subscribe(
      (res) => {
        this.showProgress = false;
      },
      (err) => {
        this.showProgress = false;
      }
    );
  }

  public getContentHeight() {
    return window.innerHeight - 100;
  }

  public getPipelineHeight() {
    return window.innerHeight - 400;
  }

  public clearAlertFilters(): void {
    this.filters.createdOn = DateRange.NONE;
    this.filters.createdOnStart = null;
    this.filters.createdOnEnd = null;
    this.filters.lastActivityDate = DateRange.NONE;
    this.filters.lastActivityDateStart = null;
    this.filters.lastActivityDateEnd = null;
    this.filters.status = Status.NONE;
    this.filters.priority = Priority.NONE;
    this.filters.assignedTo = [];
    this.isInvalidLastActivityOnDate = false;
    this.isLastActivityOnDateEmpty = false;
    this.isInvalidCreatedOnDate = false;
    this.isCreatedOnDateEmpty = false;
  }

  public onAlertStatusUpdate(event): void {
    const alert: IAlert = event.alert;
    const oldStatus: Status = event.oldStatus;

    switch (oldStatus) {
      case Status.NEW:
        this.selectedAlertPipeline.newAlerts--;
        break;

      case Status.CLOSED:
        this.alertStats.closed--;
        this.alertStats.open++;
    }

    switch (alert.status) {
      case Status.CLOSED:
        this.alertStats.closed++;
        this.alertStats.open--;
        break;

      case Status.NEW:
        this.selectedAlertPipeline.newAlerts++;
        break;
    }
  }

  public onSortOnChange(): void {
    this.showProgress = true;
    this.getAlerts().subscribe(
      (res) => (this.showProgress = false),
      (err) => (this.showProgress = false)
    );
  }

  public onFilterChange(event): void {
    this.selectedFilterOptions = event;

    this.showProgress = true;
    this.getAlerts().subscribe(
      (res) => {
        this.showProgress = false;
      },
      (err) => {
        this.showProgress = false;
      }
    );
  }

  public resetValidationError(selectedFilterField): void {
    if (selectedFilterField == "lastActivityOn") {
      this.isInvalidLastActivityOnDate = false;
      this.isLastActivityOnDateEmpty = false;
    } else {
      this.isInvalidCreatedOnDate = false;
      this.isCreatedOnDateEmpty = false;
    }
  }
}
