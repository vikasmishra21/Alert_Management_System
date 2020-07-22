import { Injectable } from "@angular/core";

interface ITableColumn {
  property: string;
  text: string;
  type: string;
}

@Injectable({
  providedIn: "root",
})
export class ColumnSelectorService {
  private allColumns: ITableColumn[] = [
    { property: "id", text: "ID", type: "number" },
    { property: "respondentName", text: "Respondent Name", type: "text" },
    { property: "status", text: "Status", type: "status" },
    { property: "priority", text: "Priority", type: "priority" },
    { property: "openedOn", text: "Opened On", type: "date" },
    { property: "lastActivityOn", text: "Last Activity On", type: "date" },
    { property: "assignedTo", text: "Assigned To", type: "text" },
    { property: "closedDate", text: "Closed Date", type: "date" },
  ];
  private selectedColumns: ITableColumn[] = [];
  private availableColumns: ITableColumn[] = [];
  private fieldColumns: ITableColumn[] = [];
  private storageKey = "selectedColumns";

  constructor() {
    let storedColumns = localStorage.getItem(this.storageKey);

    if (storedColumns) {
      let selectedColumnsMap = {};
      let selectedColumns: string[] = JSON.parse(storedColumns);

      this.allColumns.forEach(
        (x, index) => (selectedColumnsMap[x.property] = index)
      );

      selectedColumns.forEach((x) => {
        if (selectedColumnsMap.hasOwnProperty(x)) {
          this.selectedColumns.push(this.allColumns[selectedColumnsMap[x]]);
        }
      });
    } else {
      this.selectedColumns = this.allColumns.slice(0, 4);
    }

    this.availableColumns = this.getUnselectedColumns();
  }

  private getUnselectedColumns(): any[] {
    let set = new Set();
    this.selectedColumns.forEach((x) => set.add(x.property));
    return this.allColumns.filter((x) => !set.has(x.property));
  }

  public getSelectedColumns(): any[] {
    return this.selectedColumns.slice();
  }

  public getAvailableColumns(): any[] {
    return this.availableColumns.slice();
  }

  public setSelectedColumns(selectedColumns): void {
    this.selectedColumns = selectedColumns;
    this.saveSelectedColumns(this.selectedColumns);
  }

  public setAvaiableColumns(availableColumns): void {
    this.availableColumns = availableColumns;
  }

  private saveSelectedColumns(selectedColumns): void {
    let columns = selectedColumns.map((x) => x.property);
    localStorage.setItem(this.storageKey, JSON.stringify(columns));
  }
}
