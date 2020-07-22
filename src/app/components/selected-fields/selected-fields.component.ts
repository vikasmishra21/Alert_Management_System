import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { VariableType } from "src/app/enums/alerts.enum";
import { DataService } from "src/app/services/data.service";
@Component({
  selector: "app-selected-fields",
  templateUrl: "./selected-fields.component.html",
  styleUrls: ["./selected-fields.component.scss"],
})
export class SelectedFieldsComponent implements OnInit, OnChanges {
  @Input() selectedFields: any = [];
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();

  public VariableType = VariableType;
  public variablesOptions = {};

  private selectionMade = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  ngOnChanges(changes): void {
    if (
      changes.selectedFields &&
      changes.selectedFields.currentValue.length > 0
    ) {
      this.getSelectedVariableOptions();
    }
  }

  public getSelectedVariableOptions(): void {
    this.dataService
      .getFilterOptions(this.getFilterString())
      .subscribe((res) => {
        this.variablesOptions = res;
        this.createOptionList();
      });
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

  private createOptionList(): void {
    for (let variableName in this.variablesOptions) {
      this.variablesOptions[variableName].optionList = [];
      this.variablesOptions[variableName].selectedFilter = "";
      for (let optionCode in this.variablesOptions[variableName].options) {
        let option = this.variablesOptions[variableName].options[optionCode];
        this.variablesOptions[variableName].optionList.push(option);
      }
    }

    this.createOptionText();
  }

  private createOptionText(): void {
    this.selectedFields.forEach((field) => {
      this.variablesOptions[field.variableName].text =
        field.variableType === VariableType.NUMERIC ||
        field.variableType === VariableType.DATE_TIME ||
        field.variableType === VariableType.TEXT
          ? field.variableText
          : this.variablesOptions[field.variableName].text;
    });
  }

  public emitFilterChange(isOpen): void {
    if (isOpen || !this.selectionMade) {
      return;
    }
    this.selectionMade = false;
    this.onFilterChange.next(this.variablesOptions);
  }

  public onFilterSelectionChange(): void {
    this.selectionMade = true;
  }
}
