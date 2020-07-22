import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { VariableSelectorComponent } from "./variable-selector.component";
import { VariableSelectorService } from "src/app/services/variable-selector.service";
import { DataService } from "src/app/services/data.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { of, throwError } from "rxjs";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DebugElement } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { VariableTreeNode } from "src/app/interfaces/variable-tree-node";
import { By } from "@angular/platform-browser";

describe("VariableSelectorComponent", () => {
  let component: VariableSelectorComponent;
  let fixture: ComponentFixture<VariableSelectorComponent>;
  let de: DebugElement;
  let dataService: DataService;
  let dataServiceResSpy: jasmine.Spy;
  let dataServiceErrSpy: jasmine.Spy;

  const getSurveyTreeRes = {
    RootNodes: [
      {
        SurveyObjectType: 2,
        SurveyObjectID: "12c78085-2e56-1348-3eea-0b7e516c0941",
        SurveyObjectName: "Section 1",
        SurveyObjectSubType: 0,
        Children: [
          {
            SurveyObjectType: 1,
            SurveyObjectID: "b9d4320d-9ad7-c78d-5a56-7b593f5042ac",
            SurveyObjectName: "Q1",
            SurveyObjectSubType: 1,
            Children: [],
            MetadataProperties: {},
            Properties: {},
            Tags: [],
            IconFlag: 64,
            DisplayText: { "en-us": "Click to edit question text." },
            AnalysisGroupText: {},
          },
          {
            SurveyObjectType: 1,
            SurveyObjectID: "af45e238-6ab7-1933-d18d-3512919df7b5",
            SurveyObjectName: "Q1",
            SurveyObjectSubType: 9,
            Children: [
              {
                SurveyObjectType: 10,
                SurveyObjectID: "0177da63-b1df-bb83-1971-1f5f6eb1e70d",
                SurveyObjectName: "v2",
                SurveyObjectSubType: 1,
                Children: [],
                MetadataProperties: {},
                Properties: {
                  ExportTag: null,
                  QuestionGUID: "af45e238-6ab7-1933-d18d-3512919df7b5",
                },
                Tags: [],
                IconFlag: 0,
                DisplayText: { "en-us": "Recommendation" },
                AnalysisGroupText: {},
              },
              {
                SurveyObjectType: 10,
                SurveyObjectID: "6d24b28d-79f8-f786-5d35-202334e06a63",
                SurveyObjectName: "v3",
                SurveyObjectSubType: 1,
                Children: [],
                MetadataProperties: {},
                Properties: {
                  ExportTag: null,
                  QuestionGUID: "af45e238-6ab7-1933-d18d-3512919df7b5",
                },
                Tags: [],
                IconFlag: 0,
                DisplayText: { "en-us": "NPS" },
                AnalysisGroupText: {},
              },
            ],
            MetadataProperties: {},
            Properties: {},
            Tags: [],
            IconFlag: 0,
            DisplayText: { "en-us": "rate" },
            AnalysisGroupText: {},
          },
          {
            SurveyObjectType: 1,
            SurveyObjectID: "55dba802-2084-70e7-90dc-c19d14b1a45c",
            SurveyObjectName: "Q2",
            SurveyObjectSubType: 1,
            Children: [
              {
                SurveyObjectType: 10,
                SurveyObjectID: "83577db3-a8f7-7f82-bc54-557b5a7328b9",
                SurveyObjectName: "v5",
                SurveyObjectSubType: 1,
                Children: [],
                MetadataProperties: {},
                Properties: {
                  ExportTag: null,
                  QuestionGUID: "55dba802-2084-70e7-90dc-c19d14b1a45c",
                },
                Tags: [],
                IconFlag: 0,
                DisplayText: { "en-us": "Click to edit question text." },
                AnalysisGroupText: {},
              },
            ],
            MetadataProperties: {},
            Properties: {},
            Tags: [],
            IconFlag: 0,
            DisplayText: { "en-us": "Click to edit question text." },
            AnalysisGroupText: {},
          },
        ],
        MetadataProperties: {},
        Properties: {},
        Tags: [],
        IconFlag: 0,
        DisplayText: {},
        AnalysisGroupText: {},
      },
    ],
  };
  const dialogMock = {
    close: () => {},
    updatePosition: (obj) => {},
    afterClosed: () => of(true),
  };

  const dataMock = {
    data: [
      {
        id: 93,
        page: "home",
        pipelineID: 37,
        questionGUID: "af45e238-6ab7-1933-d18d-3512919df7b5",
        subscriptionId: "145",
        variableGUID: "6d24b28d-79f8-f786-5d35-202334e06a63",
        variableName: "v3",
        variableText: "NPS",
        variableType: 1,
      },
    ],
  };

  class DataTransfer {
    public getData(string): string {
      return "83577db3-a8f7-7f82-bc54-557b5a7328b9";
    }
    public setData(string, id) {}
  }
  class event {
    public get(): any {
      let ev = {
        target: {
          id: "83577db3-a8f7-7f82-bc54-557b5a7328b9",
        },
        dataTransfer: new DataTransfer(),
        preventDefault() {},
      };
      return ev;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [VariableSelectorComponent],
      providers: [
        VariableSelectorService,
        DataService,
        {
          provide: MatDialogRef,
          useValue: dialogMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dataMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableSelectorComponent);
    component = fixture.componentInstance;
    // component.totalSelectedFields = dataMock.data
    de = fixture.debugElement;
    dataService = de.injector.get(DataService);
    fixture.detectChanges();
  });

  it("should create component", () => {
    // console.log("case 1");
    expect(component).toBeTruthy();
    expect(component.totalSelectedFields).toBeDefined();
  });

  it("should getSurveyTree should return true", () => {
    // console.log("case 2");
    dataServiceResSpy = spyOn(dataService, "getSurveyTree").and.returnValue(
      of(getSurveyTreeRes)
    );

    component.getSurveyTree(2);

    expect(dataServiceResSpy).toHaveBeenCalled();
  });

  it("should getSurveyTree should return true when tree type is not survey", () => {
    // console.log("case 3");
    dataServiceResSpy = spyOn(dataService, "getSurveyTree").and.returnValue(
      of(getSurveyTreeRes)
    );

    component.getSurveyTree(3);

    expect(dataServiceResSpy).toHaveBeenCalled();
  });

  it("should getSurveyTree should return false", () => {
    // console.log("case 4");
    dataServiceErrSpy = spyOn(dataService, "getSurveyTree").and.returnValue(
      throwError({ status: 500 })
    );

    component.getSurveyTree(2);

    expect(dataServiceErrSpy).toHaveBeenCalled();
  });

  it("should checkSelectedArray should return true ", () => {
    // console.log("case 5");
    const guid = "6d24b28d-79f8-f786-5d35-202334e06a63";
    //@ts-ignore
    const returnValue = component.checkSelectedArray(
      component.totalSelectedFields,
      guid
    );

    expect(returnValue).toBe(true);
  });

  it("should checkSelectedArray should return false ", () => {
    // console.log("case 6");
    const guid = "";
    //@ts-ignore
    const returnValue = component.checkSelectedArray(
      component.totalSelectedFields,
      guid
    );

    expect(returnValue).toBe(false);
  });

  it("should deselect run successfully", () => {
    // console.log("case 7");
    const guid = "6d24b28d-79f8-f786-5d35-202334e06a63";
    //@ts-ignore
    component.deselect(guid, 0);

    expect(component.deletedVariablesId).toBeDefined();
  });

  it("should onDrop run successfully", () => {
    // console.log("case 8");
    let obj = new event();
    let ev = obj.get();

    component.onDrop(ev);
  });

  it("should onDrop else condition", () => {
    // console.log("case 9");
    let obj = new event();
    let ev = obj.get();
    component.totalSelectedFields = [];

    component.onDrop(ev);
    expect(component.totalSelectedFields).toBeDefined();
  });

  it("should allowDrop run successfully", () => {
    // console.log("case 10");
    let obj = new event();
    let ev = obj.get();
    component.allowDrop(ev);
  });

  it("should onDrag work properly", () => {
    // console.log("case 11");
    let obj = new event();
    let ev = obj.get();

    let node = {
      expandable: false,
      name: "v5 Click to edit question text.",
      id: "83577db3-a8f7-7f82-bc54-557b5a7328b9",
      type: 10,
      children: [],
      level: 1,
    };
    component.onDrag(ev, node);
  });

  it("should save run successfully", () => {
    // console.log("case 12");
    component.deletedVariablesId = new Set();
    component.deletedVariablesId.add("1");

    component.save();
    dialogMock.close();
  });

  it("should createTreeNode be called", () => {
    // console.log("case 13");
    let node = {
      SurveyObjectType: 1,
      SurveyObjectID: "855d137a-8270-1cdc-4b4f-ea8fff182c6c",
      SurveyObjectName: "Q1",
      SurveyObjectSubType: 9,
      Children: [
        {
          SurveyObjectType: 10,
          SurveyObjectID: "1940923c-0952-a29a-785a-2987b8580574",
          SurveyObjectName: "v4",
          SurveyObjectSubType: 1,
          Children: [],
          MetadataProperties: {},
          Properties: {
            ExportTag: null,
            QuestionGUID: "855d137a-8270-1cdc-4b4f-ea8fff182c6c",
          },
          Tags: [],
          IconFlag: 0,
          DisplayText: { "en-us": "Recommendation" },
          AnalysisGroupText: {},
        },
      ],
      MetadataProperties: {},
      Properties: {},
      Tags: [],
      IconFlag: 0,
      DisplayText: {
        "en-us":
          "Based on your experience with Kotak Mahindra Bank’s POS Machine (Card Swiping Machine), how likely are you to recommend us to your friends/family and business associate on a scale of 0 to 10?",
        hin:
          "कोटक महिंद्रा बैंक के पीओएस मशीन (कार्ड स्वाइपिंग मशीन) के साथ आपके अनुभव के आधार पर, 0 से 10 के पैमाने पर आपके द्वारा अपने मित्रों और परिवारजनों से हमारी अनुशंसा करने की कितनी संभावना है?",
      },
      AnalysisGroupText: {},
      _children: [
        {
          SurveyObjectType: 10,
          SurveyObjectID: "1940923c-0952-a29a-785a-2987b8580574",
          SurveyObjectName: "v4",
          SurveyObjectSubType: 1,
          Children: [],
          MetadataProperties: {},
          Properties: {
            ExportTag: null,
            QuestionGUID: "855d137a-8270-1cdc-4b4f-ea8fff182c6c",
          },
          Tags: [],
          IconFlag: 0,
          DisplayText: { "en-us": "Recommendation" },
          AnalysisGroupText: {},
        },
      ],
    };
    component.createTreeNode(node, 0);
  });

  it("should createTreeNode be called", () => {
    // console.log("case 14");
    let node = {
      expandable: true,
      name:
        "Q1 Based on your experience with Kotak Mahindra Bank’s POS Machine (Card Swiping Machine), how likely are you to recommend us to your friends/family and business associate on a scale of 0 to 10?",
      id: "855d137a-8270-1cdc-4b4f-ea8fff182c6c",
      type: 1,
      level: 0,
    };
    component.hasChild(0, node);
  });

  it("should createTreeNode be called", () => {
    // console.log("case 15");
    let node = {
      expandable: true,
      name:
        "Q1 Based on your experience with Kotak Mahindra Bank’s POS Machine (Card Swiping Machine), how likely are you to recommend us to your friends/family and business associate on a scale of 0 to 10?",
      id: "855d137a-8270-1cdc-4b4f-ea8fff182c6c",
      type: 1,
      level: 0,
    };
    component.treeControl = new FlatTreeControl<VariableTreeNode>(
      (node) => node.level,
      (node) => node.expandable
    );
  });
});
