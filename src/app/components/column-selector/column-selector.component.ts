import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { ColumnSelectorService } from "src/app/services/column-selector.service";
import { fromEvent } from "rxjs";
import { map, debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-column-selector",
  templateUrl: "./column-selector.component.html",
  styleUrls: ["./column-selector.component.scss"],
})
export class ColumnSelectorComponent implements OnInit, AfterViewInit {
  @ViewChild("columnSearchInput") columnSearchInput: ElementRef;
  public selectedColumns: any[] = [];
  public availableColumns: any[] = [];
  public filteredAvailableColumns: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ColumnSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private columnSelectorService: ColumnSelectorService
  ) {}

  ngOnInit(): void {
    this.selectedColumns = this.columnSelectorService.getSelectedColumns();
    this.availableColumns = this.columnSelectorService.getAvailableColumns();
    this.filteredAvailableColumns = this.availableColumns.slice();
  }

  ngAfterViewInit(): void {
    fromEvent(this.columnSearchInput.nativeElement, "keyup")
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((searchText) => {
        this.filteredAvailableColumns = this.availableColumns.filter(
          (x) => x.text.toLowerCase().indexOf(searchText) !== -1
        );
      });
  }

  public onDialogCancel(): void {
    this.dialogRef.close();
  }

  public onDialogClose(): void {
    this.columnSelectorService.setAvaiableColumns(this.availableColumns);
    this.columnSelectorService.setSelectedColumns(this.selectedColumns);

    this.dialogRef.close(this.selectedColumns.slice());
  }

  private getUnselectedColumns(): any[] {
    let set = new Set();
    this.selectedColumns.forEach((x) => set.add(x.property));
    return this.availableColumns.filter((x) => !set.has(x.property));
  }

  public drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // Since columns are moved from filtered columns, we need
    // to keep available columns updated.
    this.availableColumns = this.getUnselectedColumns();
  }
}
