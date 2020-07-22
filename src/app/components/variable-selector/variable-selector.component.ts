import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { VariableTreeNode } from "src/app/interfaces/variable-tree-node";
import { VariableSelectorService } from "src/app/services/variable-selector.service";
import { DataService } from "src/app/services/data.service";
import { TreeType } from "src/app/enums/alerts.enum";

@Component({
  selector: "app-variable-selector",
  templateUrl: "./variable-selector.component.html",
  styleUrls: ["./variable-selector.component.scss"],
})
export class VariableSelectorComponent implements OnInit {
  public TreeType = TreeType;
  public totalSelectedFields = [];
  public deletedVariablesId: Set<string>;
  public activeTreeType: TreeType;

  private surveyTreeData;
  private gridData = [];
  private currentSelectedFields = [];

  constructor(
    public dialogRef: MatDialogRef<VariableSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedFields: any,
    private variableSelectorService: VariableSelectorService,
    private dataService: DataService
  ) {
    if (this.selectedFields["data"]) {
      this.totalSelectedFields = [...this.selectedFields["data"]];
    }

    this.deletedVariablesId = new Set();
  }

  ngOnInit(): void {
    this.activeTreeType = TreeType.SURVEY;
    this.getSurveyTree(TreeType.SURVEY);
  }

  public createTreeNode = (node: any, level: number) => {
    return {
      expandable: !!node.Children && node.Children.length > 0,
      name:
        this.activeTreeType == TreeType.SURVEY
          ? node.SurveyObjectName + " " + node.DisplayText["en-us"]
          : node.DisplayText["en-us"],
      id: node.SurveyObjectID,
      type: node.SurveyObjectType,
      children: node.Children,
      level: level,
    };
  };

  public hasChild = (_: number, node: VariableTreeNode) => node.expandable;

  public treeControl = new FlatTreeControl<VariableTreeNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  public treeFlattener = new MatTreeFlattener(
    this.createTreeNode,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.Children
  );

  public dataSource = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener
  );

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.totalSelectedFields,
      event.previousIndex,
      event.currentIndex
    );
  }

  public onDialogCancel(): void {
    this.dialogRef.close();
  }

  public save(): void {
    let deletedVariableIds = [];

    this.deletedVariablesId.forEach((x) => deletedVariableIds.push(x));

    this.dialogRef.close({
      deletedIds: deletedVariableIds,
      selectedVariables: this.currentSelectedFields,
    });
  }

  public getSurveyTree(treeType): void {
    this.activeTreeType = treeType;

    this.gridData = [];
    this.dataService.getSurveyTree(treeType).subscribe(
      (res) => {
        this.surveyTreeData = res["RootNodes"];

        if (treeType == TreeType.SURVEY) {
          this.gridData = this.variableSelectorService.getDataForSurveyTree(
            this.surveyTreeData
          );
        } else {
          this.gridData = this.surveyTreeData;
        }

        this.dataSource.data = this.gridData;
      },
      (err) => {
        //Here goes the error code
      }
    );
  }

  public allowDrop(ev): void {
    ev.preventDefault();
  }

  public onDrag(ev, node): void {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  public onDrop(ev): void {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var elementType = document.getElementById(data)
      ? parseInt(document.getElementById(data).getAttribute("data-node-type"))
      : null;
    var elementGUID = document.getElementById(data)
      ? document.getElementById(data).getAttribute("data-node-guid")
      : "";

    //Check if the element already exists in the selectedArray

    if (this.totalSelectedFields.length) {
      if (this.checkSelectedArray(this.totalSelectedFields, elementGUID)) {
        alert("Exists!!");
      } else {
        let currentSelectedField = [];

        currentSelectedField.push(
          ...this.variableSelectorService.createSelectedFields(
            this.gridData,
            elementGUID,
            elementType
          )
        );
        this.currentSelectedFields.push(...currentSelectedField);
        this.totalSelectedFields.push(...currentSelectedField);
      }
    } else {
      let currentSelectedField = [];

      currentSelectedField.push(
        ...this.variableSelectorService.createSelectedFields(
          this.gridData,
          elementGUID,
          elementType
        )
      );
      this.currentSelectedFields.push(...currentSelectedField);
      this.totalSelectedFields.push(...currentSelectedField);
    }
  }

  public deselect(variableGuid, index): void {
    let deletedVariable = this.totalSelectedFields.splice(index, 1);
    this.deletedVariablesId.add(deletedVariable[0].id);
  }

  private checkSelectedArray(selectedFields, guid): boolean {
    for (let i = 0; i < selectedFields.length; i++) {
      if (
        selectedFields[i].questionGUID == guid ||
        selectedFields[i].variableGUID == guid
      ) {
        return true;
      }
    }
    return false;
  }
}
