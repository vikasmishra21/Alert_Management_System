import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class VariableSelectorService {
  private surveyConstants = {
    DisplayFlag: {
      Hidden: 1,
      Mandatory: 2,
      QuestionMasking: 4,
      OptionMasking: 8,
      ValidationScript: 16,
      IsLoop: 32,
      Deleted: 64,
    },
    QuestionType: {
      SingleChoice: 1,
      MultipleChoice: 2,
      Text: 3,
      Numeric: 4,
      DateTime: 5,
      Rank: 6,
      RankAndSort: 7,
      Slider: 8,
      NPS: 9,
      Display: 10,
      SimpleGrid: 11,
      ComplexGrid: 12,
      TextGrid: 13,
      NumericGrid: 14,
      BipolarGrid: 15,
      MaxDiff: 16,
      Smiley: 17,
      Stars: 18,
      MultimediaCapture: 19,
      GPSCapture: 20,
      Distribution: 21,
      LikeDislike: 22,
      HeatMap: 23,
      HeatZone: 24,
    },
    SurveyObjectType: {
      // Sync with object type
      Question: 1,
      Section: 2,
      List: 4,
      Script: 5,
      PageBreak: 6,
      Sequencer: 7,
      Jump: 8,
      SetValue: 9,
      SurveyEnd: 13,
      Message: 17,
      Media: 18,
      Group: 20,
      Quota: 23,
    },
    ObjectType: {
      Question: 1,
      Section: 2,
      SurveyTree: 3,
      List: 4,
      Script: 5,
      PageBreak: 6,
      Sequencer: 7,
      Jump: 8,
      SetValue: 9,
      Variable: 10,
      AttributeHeader: 11,
      Attribute: 12,
      SurveyEnd: 13,
      Group: 20,
    },
  };

  constructor() {}

  public getDataForSurveyTree(surveyTree) {
    var gridData = [];

    this.createDataForSurveyTree(surveyTree, gridData);
    return gridData;
  }

  public createDataForSurveyTree(surveyTree, gridData): void {
    for (var i = 0; i < surveyTree.length; i++) {
      if (
        (surveyTree[i].IconFlag & this.surveyConstants.DisplayFlag.Deleted) ==
        this.surveyConstants.DisplayFlag.Deleted
      ) {
        continue;
      }

      if (
        surveyTree[i].SurveyObjectType ==
        this.surveyConstants.SurveyObjectType.Section
      ) {
        this.createDataForSurveyTree(surveyTree[i].Children, gridData);
      } else if (
        surveyTree[i].SurveyObjectType ==
        this.surveyConstants.SurveyObjectType.Sequencer
      ) {
        this.createDataForSurveyTree(surveyTree[i].Children, gridData);
      } else if (
        surveyTree[i].SurveyObjectType ==
        this.surveyConstants.SurveyObjectType.Question
      ) {
        if (
          surveyTree[i].SurveyObjectSubType ==
            this.surveyConstants.QuestionType.Display ||
          (surveyTree[i].SurveyObjectType ==
            this.surveyConstants.ObjectType.Variable &&
            surveyTree[i].SurveyObjectSubType ==
              this.surveyConstants.QuestionType.Text)
        ) {
          continue;
        }

        surveyTree[i]._children = surveyTree[i].Children;
        // surveyTree[i].Text = surveyTree[i].DisplayText[this.serviceInstance.Language]; // For searching purpose
        gridData.push(surveyTree[i]);

        this.createDataForSurveyTree(surveyTree[i].Children, gridData);

        if (
          surveyTree[i].SurveyObjectSubType ==
          this.surveyConstants.QuestionType.MultimediaCapture
        ) {
          surveyTree[i].Children.forEach(function (item) {
            item.Properties.IsMedia = "true";
          });
        } else if (surveyTree[i].Properties.hasOwnProperty("IsMedia")) {
          surveyTree[i].Children.forEach(function (item) {
            if (
              item.SurveyObjectSubType != this.surveyConstants.VariableType.Text
            ) {
              return;
            }

            item.Properties.IsMedia = "true";
          });
        }
      }
      // else if (surveyTree[i].SurveyObjectType == this.surveyConstants.SurveyObjectType.Quota && allowOthers && allowOthers.indexOf(surveyConstants.SurveyObjectType.Quota) > -1) {

      //   surveyTree[i]._children = surveyTree[i].Children;
      //   // surveyTree[i].Text = surveyTree[i].DisplayText[serviceInstance.Language];   // For searching purpose
      //   gridData.push(surveyTree[i]);

      //   createDataForSurveyTree(surveyTree[i].Children, gridData, allowOthers);
      // }
      else if (
        surveyTree[i].SurveyObjectType ==
          this.surveyConstants.ObjectType.AttributeHeader ||
        surveyTree[i].SurveyObjectType ==
          this.surveyConstants.ObjectType.Attribute ||
        surveyTree[i].SurveyObjectType == this.surveyConstants.ObjectType.Group
      ) {
        surveyTree[i]._children = surveyTree[i].Children;
        // surveyTree[i].Text = surveyTree[i].DisplayText[this.serviceInstance.Language]; // For searching purpose
        this.createDataForSurveyTree(surveyTree[i].Children, gridData);
      } else if (
        surveyTree[i].SurveyObjectType ==
        this.surveyConstants.ObjectType.Variable
      ) {
        // surveyTree[i].Text = surveyTree[i].DisplayText[this.serviceInstance.Language];
        // surveyTree[i]._children = surveyTree[i].Children;
      }
    }
  }

  public createSelectedFields(grid, guid, type) {
    var selectedFields = [];
    var transformedSelectedFields = [];

    this.getSelectedFields(grid, guid, type, selectedFields);

    this.transformSelectedFields(selectedFields, transformedSelectedFields);

    return transformedSelectedFields;
  }

  private getSelectedFields(grid, guid, type, selectedFields): void {
    for (var i = 0; i < grid.length; i++) {
      if (
        (grid[i].SurveyObjectType == this.surveyConstants.ObjectType.Question &&
          type == this.surveyConstants.ObjectType.Question) ||
        (grid[i].SurveyObjectType == this.surveyConstants.ObjectType.Question &&
          type == this.surveyConstants.ObjectType.Variable) ||
        (grid[i].SurveyObjectType == this.surveyConstants.ObjectType.Question &&
          type == this.surveyConstants.ObjectType.Attribute)
      ) {
        this.getSelectedFields(grid[i].Children, guid, type, selectedFields);
      } else if (
        grid[i].SurveyObjectType == this.surveyConstants.ObjectType.Variable &&
        type == this.surveyConstants.ObjectType.Question
      ) {
        if (grid[i].Properties.QuestionGUID == guid) {
          selectedFields.push(...grid);
          return;
        }
      } else if (
        grid[i].SurveyObjectType == this.surveyConstants.ObjectType.Variable &&
        type == this.surveyConstants.ObjectType.Variable
      ) {
        if (grid[i].SurveyObjectID == guid) {
          selectedFields.push(grid[i]);
          return;
        }
      } else if (
        grid[i].SurveyObjectType == this.surveyConstants.ObjectType.Attribute &&
        type == this.surveyConstants.ObjectType.Question
      ) {
        this.getSelectedFields(grid[i].Children, guid, type, selectedFields);
      } else if (
        grid[i].SurveyObjectType == this.surveyConstants.ObjectType.Attribute &&
        type == this.surveyConstants.ObjectType.Attribute
      ) {
        // this.getSelectedFields(grid[i].Children, guid, type);
        if (grid[i].SurveyObjectID == guid) {
          selectedFields.push(...grid[i].Children);
        }
      } else if (
        grid[i].SurveyObjectType == this.surveyConstants.ObjectType.Attribute &&
        type == this.surveyConstants.ObjectType.Variable
      ) {
        this.getSelectedFields(grid[i].Children, guid, type, selectedFields);
      }
    }
  }

  private transformSelectedFields(
    selectedFields,
    transformedSelectedFields
  ): void {
    let transformedSelectedField = {
      variableName: "",
      variableText: "",
      variableGUID: "",
      questionGUID: "",
      variableType: "",
    };

    selectedFields.forEach((variable) => {
      transformedSelectedField.variableName = variable.SurveyObjectName;
      transformedSelectedField.variableText = variable.DisplayText["en-us"];
      transformedSelectedField.variableGUID = variable.SurveyObjectID;
      transformedSelectedField.questionGUID = variable.Properties.QuestionGUID;
      transformedSelectedField.variableType = variable.SurveyObjectSubType;

      transformedSelectedFields.push(
        JSON.parse(JSON.stringify(transformedSelectedField))
      );
    });
  }
}
