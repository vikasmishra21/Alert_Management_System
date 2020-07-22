import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { IAlert } from "src/app/interfaces/alert";
import { Status, Priority } from "src/app/enums/alerts.enum";
import { AlertStateService } from "src/app/services/alert-state.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent implements OnInit, OnChanges {
  @Input() alerts: IAlert[] = [];
  @Input() pipelineId: number;
  @Input() selectedColumns: any[] = [];
  @Input() selectedFields: any[] = [];

  public tableData: any[] = [];
  public sortedData: any[] = [];
  public tableHeaders: any[] = [];
  public orderBy = "none";
  public sortedColumnIndex = null;

  constructor(private alertState: AlertStateService, private router: Router) {}

  ngOnInit(): void {}

  ngOnChanges(changes): void {
    let canUpdate = true;

    if (!this.alerts || !this.selectedColumns) {
      canUpdate = false;
    }

    if (canUpdate) {
      this.initializeTableData();
    }
  }

  private initializeTableData() {
    this.tableData = [];
    this.tableHeaders = [];

    for (let i = 0; i < this.selectedColumns.length; i++) {
      let header = {
        property: this.selectedColumns[i].property,
        text: this.selectedColumns[i].text,
        type: this.selectedColumns[i].type,
      };

      this.tableHeaders.push(header);
    }

    for (let i = 0; i < this.selectedFields.length; i++) {
      let header = {
        property: this.selectedFields[i].variableName,
        text: this.selectedFields[i].variableText,
        type: "field",
      };

      this.tableHeaders.push(header);
    }

    for (let i = 0; i < this.alerts.length; i++) {
      let row = {};

      for (let j = 0; j < this.selectedColumns.length; j++) {
        let property = this.selectedColumns[j].property;
        row[`${property}_value`] = this.alerts[i][property];

        switch (this.selectedColumns[j].type) {
          case "date":
            row[property] =
              property === "closedDate"
                ? this.alerts[i][property]
                  ? new Date(this.alerts[i][property]).toLocaleDateString()
                  : ""
                : this.alerts[i][property]
                ? new Date(this.alerts[i][property]).toLocaleDateString()
                : "Never";
            break;

          case "status":
            row[property] = Status[this.alerts[i][property]];
            break;

          case "priority":
            row[property] = Priority[this.alerts[i][property]];
            break;

          default:
            row[property] = this.alerts[i][property];
        }

        for (let j = 0; j < this.selectedFields.length; j++) {
          row[this.selectedFields[j].variableName] = this.alerts[i].fields[
            this.selectedFields[j].variableName
          ];
          row[`${this.selectedFields[j].variableName}_value`] =
            row[this.selectedFields[j].variableName];
        }
      }

      this.tableData.push(row);
    }

    this.sortedData = this.tableData.slice();

    if (this.orderBy !== "none" && this.sortedColumnIndex !== null) {
      this.sortedData.sort((a, b) => {
        return this.sortData(
          this.sortedData,
          a,
          b,
          this.sortedColumnIndex,
          this.orderBy
        );
      });
    }
  }

  public openAlert(index: number) {
    this.alertState.alert = this.alerts[index];
    this.router.navigate([
      "alert-details",
      this.pipelineId,
      this.alerts[index].id,
    ]);
  }

  public sortOnColumn(index: number): void {
    if (index !== this.sortedColumnIndex) {
      this.orderBy = "none";
      this.sortedColumnIndex = index;
    }

    switch (this.orderBy) {
      case "none":
        this.orderBy = "desc";
        break;

      case "desc":
        this.orderBy = "asc";
        break;

      case "asc":
        this.orderBy = "none";
        this.sortedColumnIndex = null;
        break;
    }

    this.sortedData = this.tableData.slice();
    this.sortedData.sort((a, b) => {
      return this.sortData(this.sortedData, a, b, index, this.orderBy);
    });
  }

  private sortData(
    data: any[],
    a: any,
    b: any,
    columnIndex: number,
    orderBy: string
  ): number {
    const columnType = this.tableHeaders[columnIndex].type;
    const property = `${this.tableHeaders[columnIndex].property}_value`;

    switch (orderBy) {
      case "asc":
        switch (columnType) {
          case "number":
            return a[property] - b[property];

          case "text":
          case "date":
          case "field":
            return a[property].localeCompare(b[property]);

          case "status":
          case "priority":
            return b[property] - a[property];
        }
        break;

      case "desc":
        switch (columnType) {
          case "number":
            return b[property] - a[property];

          case "text":
          case "date":
          case "field":
            return b[property].localeCompare(a[property]);

          case "status":
          case "priority":
            return a[property] - b[property];
        }
        break;

      default:
        return 0;
    }
  }
}
