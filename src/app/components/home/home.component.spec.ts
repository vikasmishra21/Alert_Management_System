import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from "@angular/core/testing";

import { HomeComponent } from "./home.component";
import { MatDialogModule } from "@angular/material/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AlertNotificationService } from "../../services/alert-notification.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DataService } from "../../services/data.service";
import { UserService } from "../../services/user.service";
import { AlertStateService } from "../../services/alert-state.service";
import { DebugElement } from "@angular/core";
import { of, Observable, throwError } from "rxjs";
import { ColumnSelectorService } from "../../services/column-selector.service";
import { AuthService } from "src/app/services/auth.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let userService: UserService;
  let userInfo = {
    unique_name: "brahmansh.k@rebuscode.com",
    username: "brahmansh.k@rebuscode.com",
    userid: "12480",
    CustomerID: "145",
    subrole: "0",
    CustomerName: "Rebuscode",
    plan: "beta-enterprise",
    app: "dashboard",
  };

  let de: DebugElement;
  let filterAlertState: AlertStateService;
  let dataServiceResSpy: jasmine.Spy;
  let dataServiceErrSpy: jasmine.Spy;
  let authServiceResSpy: jasmine.Spy;
  let authServiceErrSpy: jasmine.Spy;
  let componentSpy: jasmine.Spy;
  let dataService: DataService;
  let authService: AuthService;

  let getAlertRes = {
    tableName: "amsbrahmansh.k296321",
    alertList: [
      {
        id: 1,
        respondentName: "Manish Pandey",
        status: 2,
        openedOn: "2020-04-05T12:50:04.3466667",
        lastActivityOn: "2020-05-15T09:29:29.0166667",
        priority: 2,
        assignedTo: "pooja.a@rebuscode.com",
        closedDate: "2020-04-28T06:17:04.653",
        showNotification: false,
        expired: true,
        alertMembers: [
          {
            id: 70,
            alertId: 1,
            member: "amitayubasu@gmail.com",
            memberName: "Amitayu Basu",
          },
        ],
        fields: {
          RespondentID: "1",
          v22: "5|Neutral",
          v23: "Detractor",
          v29: "Yes",
          v39: "Detractor",
          v5: "Detractor",
          v6: "Reversals on failed transaction",
        },
        respondentEmail: "abc@gmail.com",
        respondentPhone: "12345678900",
        tableName: "amsbrahmansh.k296321",
      },
    ],
  };

  let getFieldsRes = [
    {
      id: 35,
      subscriptionId: "145",
      pipelineID: 1,
      variableName: "v22",
      variableText: "Recommendation",
      variableGUID: "52769516-2e57-c77b-16c3-4525401debea",
      questionGUID: "2712fe55-3318-33ad-3e87-d72433825784",
      variableType: 1,
      page: "home",
    },
    {
      id: 36,
      subscriptionId: "145",
      pipelineID: 1,
      variableName: "v23",
      variableText: "NPS",
      variableGUID: "eaa11294-6b69-204a-e455-f81ef364f9ac",
      questionGUID: "2712fe55-3318-33ad-3e87-d72433825784",
      variableType: 1,
      page: "home",
    },
    {
      id: 38,
      subscriptionId: "145",
      pipelineID: 1,
      variableName: "v29",
      variableText:
        "Have you ever had an interaction with Worldline executive.",
      variableGUID: "0e7a5fc6-b104-34e9-1df8-7bc952904d0d",
      questionGUID: "9f7fbafb-53c6-6dad-7ee4-0d3863c8cc8b",
      variableType: 1,
      page: "home",
    },
  ];

  function returnAlertStatusChangeEvent(
    oldStatus: number,
    alertStatus: number
  ): any {
    const event = {
      alert: {
        id: 116,
        respondentName: "ashish",
        status: alertStatus,
        openedOn: "2020-04-23T18:23:05",
        lastActivityOn: "2020-05-07T08:43:46.7266667",
        priority: 3,
        assignedTo: "brahmansh.k@rebuscode.com",
        closedDate: null,
        showNotification: false,
        expired: false,
        alertMembers: [
          {
            id: 298,
            alertId: 116,
            member: "brahmansh.k@rebuscode.com",
            memberName: "brahmansh Kaushal",
          },
          {
            id: 315,
            alertId: 116,
            member: "Amsuser@rebuscode.com",
            memberName: "Amsuser suser",
          },
          {
            id: 316,
            alertId: 116,
            member: "ashish.p@rebuscode.com",
            memberName: "Ashish Pandey",
          },
        ],
        fields: { RespondentID: "30", v2: "1", v3: "Detractor" },
        respondentEmail: "ashish.p@rebuscode.com",
        respondentPhone: "234",
        tableName: "amsbrahmansh.k882517",
      },
      oldStatus: oldStatus,
    };
    return event;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      declarations: [HomeComponent],
      providers: [
        AlertNotificationService,
        DataService,
        AlertStateService,
        UserService,
        ColumnSelectorService,
      ],
    }).compileComponents();
    userService = new UserService();
    userService.setUserInfo(userInfo);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dataService = de.injector.get(DataService);
    authService = de.injector.get(AuthService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Check initialise Data function", () => {
    dataServiceResSpy = spyOn(dataService, "getAlertPipelines").and.returnValue(
      of(true)
    );
    filterAlertState = new AlertStateService();
    component.initialiseData();
    expect(filterAlertState.filters).toBeUndefined();
    expect(filterAlertState.alertsView).toBeUndefined();
    expect(filterAlertState.alertCategory).toBeUndefined();
    filterAlertState.filters = component.filters;
    filterAlertState.alertsView = component.alertsView;
    filterAlertState.alertCategory = component.selectedAlertCategory;
    expect(filterAlertState.filters).toBeDefined();
    expect(filterAlertState.alertsView).toBeDefined();
    expect(filterAlertState.alertCategory).toBeDefined();
    expect(dataServiceResSpy).toHaveBeenCalled();
    // expect(component.showProgress).toBeFalsy()
  });

  it("should Allflters are reset", () => {
    const filterValue = component.filters;
    component.clearAlertFilters();
    expect(component.filters).toEqual(filterValue);
    expect(component.isInvalidLastActivityOnDate).toBeFalsy();
    expect(component.isLastActivityOnDateEmpty).toBeFalsy();
    expect(component.isInvalidCreatedOnDate).toBeFalsy();
    expect(component.isCreatedOnDateEmpty).toBeFalsy();
  });

  it("should alertStats are reset", () => {
    // @ts-ignore
    component.resetAlertStats();
    expect(component.alertStats.open).toBe(0);
    expect(component.alertStats.expired).toBe(0);
    expect(component.alertStats.closed).toBe(0);
  });

  it("should show reset validation errors when selectedFilterField is `lastActivityOn`", () => {
    component.resetValidationError("lastActivityOn");
    expect(component.isInvalidLastActivityOnDate).toBe(false);
    expect(component.isLastActivityOnDateEmpty).toBe(false);
  });

  it("should show reset validation errors when selectedFilterField is `createdOn`", () => {
    component.resetValidationError("createdOn");
    expect(component.isInvalidCreatedOnDate).toBe(false);
    expect(component.isCreatedOnDateEmpty).toBe(false);
  });

  it("should return true on filter `lastActivityOn` on activity start date", () => {
    // @ts-ignore
    const returnValue = component.checkEmptyActivityFilterDate(
      "lastActivityOn"
    );
    expect(component.filters.lastActivityDateStart).toBeFalsy();
    expect(returnValue).toBeTruthy();
  });

  it("should return true on filter `lastActivityOn` on activity end date", () => {
    // @ts-ignore
    const returnValue = component.checkEmptyActivityFilterDate(
      "lastActivityOn"
    );
    expect(component.filters.lastActivityDateEnd).toBeFalsy();
    expect(returnValue).toBeTruthy();
  });

  it("should return false on filter `lastActivityOn` on activity start date and end date", () => {
    component.filters.lastActivityDateStart = new Date();
    component.filters.lastActivityDateEnd = new Date();
    // @ts-ignore
    const returnValue = component.checkEmptyActivityFilterDate(
      "lastActivityOn"
    );
    expect(component.filters.lastActivityDateStart).toBeTruthy();
    expect(component.filters.lastActivityDateEnd).toBeTruthy();
    expect(returnValue).toBeFalsy();
  });

  it("should return true on filter `createdOn` on activity start date", () => {
    // @ts-ignore
    const returnValue = component.checkEmptyActivityFilterDate("createdOn");
    expect(component.filters.createdOnStart).toBeFalsy();
    expect(returnValue).toBeTruthy();
  });

  it("should return true on filter `createdOn` on activity end date", () => {
    // @ts-ignore
    const returnValue = component.checkEmptyActivityFilterDate("createdOn");
    expect(component.filters.createdOnEnd).toBeFalsy();
    expect(returnValue).toBeTruthy();
  });

  it("should return false on filter `createdOn` on activity start date and end date", () => {
    component.filters.createdOnStart = new Date();
    component.filters.createdOnEnd = new Date();
    // @ts-ignore
    const returnValue = component.checkEmptyActivityFilterDate("createdOn");
    expect(component.filters.createdOnStart).toBeTruthy();
    expect(component.filters.createdOnEnd).toBeTruthy();
    expect(returnValue).toBeFalsy();
  });

  it("should return true on filter `lastActivityOn` to validate activity filter data", () => {
    component.filters.lastActivityDateStart =
      "Wed May 13 2020 00:00:00 GMT+0530 (India Standard Time)";
    component.filters.lastActivityDateEnd =
      "Fri May 01 2020 00:00:00 GMT+0530 (India Standard Time)";
    let startDate = new Date(component.filters.lastActivityDateStart);
    let endDate = new Date(component.filters.lastActivityDateEnd);
    // @ts-ignore
    const returnValue = component.validateActivityFilterDate("lastActivityOn");
    let difference = endDate.getTime() - startDate.getTime();
    expect(difference).toBeLessThan(0);
    expect(returnValue).toBeTruthy();
  });

  it("should return false on filter `lastActivityOn` to validate activity filter data", () => {
    component.filters.lastActivityDateEnd =
      "Wed May 13 2020 00:00:00 GMT+0530 (India Standard Time)";
    component.filters.lastActivityDateStart =
      "Fri May 01 2020 00:00:00 GMT+0530 (India Standard Time)";
    let startDate = new Date(component.filters.lastActivityDateStart);
    let endDate = new Date(component.filters.lastActivityDateEnd);
    // @ts-ignore
    const returnValue = component.validateActivityFilterDate("lastActivityOn");
    let difference = endDate.getTime() - startDate.getTime();
    expect(difference).toBeGreaterThan(0);
    expect(returnValue).toBeFalsy();
  });

  it("should return true on filter `createdOn` to validate activity filter data", () => {
    component.filters.createdOnStart =
      "Wed May 13 2020 00:00:00 GMT+0530 (India Standard Time)";
    component.filters.createdOnEnd =
      "Fri May 01 2020 00:00:00 GMT+0530 (India Standard Time)";
    let startDate = new Date(component.filters.createdOnStart);
    let endDate = new Date(component.filters.createdOnEnd);
    // @ts-ignore
    const returnValue = component.validateActivityFilterDate("createdOn");
    let difference = endDate.getTime() - startDate.getTime();
    expect(difference).toBeLessThan(0);
    expect(returnValue).toBeTruthy();
  });

  it("should return false on filter `createdOn` to validate activity filter data", () => {
    component.filters.createdOnEnd =
      "Wed May 13 2020 00:00:00 GMT+0530 (India Standard Time)";
    component.filters.createdOnStart =
      "Fri May 01 2020 00:00:00 GMT+0530 (India Standard Time)";
    let startDate = new Date(component.filters.createdOnStart);
    let endDate = new Date(component.filters.createdOnEnd);
    // @ts-ignore
    const returnValue = component.validateActivityFilterDate("createdOn");
    let difference = endDate.getTime() - startDate.getTime();
    expect(difference).toBeGreaterThan(0);
    expect(returnValue).toBeFalsy();
  });

  it("should initialize selected fields if response comes", () => {
    dataServiceResSpy = spyOn(dataService, "getFields").and.returnValue(
      of(getFieldsRes)
    );
    let projectID = "5a8ff4d5-5f28-1876-f97b-25bd768e07e0";
    let pipelineID = "1";
    // @ts-ignore
    component.getFields(projectID, pipelineID);
    expect(dataServiceResSpy).toHaveBeenCalled();
    expect(component.selectedFields).toBeDefined();
  });

  it("should initialize selected fields if response dose not comes", () => {
    dataServiceErrSpy = spyOn(dataService, "getFields").and.returnValue(
      throwError({ status: 404 })
    );
    let projectID = "5a8ff4d5-5f28-1876-f97b-25bd768e07e0";
    let pipelineID = "1";
    // @ts-ignore
    component.getFields(projectID, pipelineID);
    expect(dataServiceErrSpy).toHaveBeenCalled();
    expect(component.selectedFields).toEqual([]);
  });

  it("should get alerts if response comes", () => {
    dataServiceResSpy = spyOn(dataService, "getAlerts").and.returnValue(
      of(getAlertRes)
    );
    let median = false;
    component.selectedAlertPipeline = {
      id: 1,
      name: "pipeline1",
      projectID: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
      newAlerts: 0,
    };

    // @ts-ignore
    const returnValue = component.getAlerts(median);
    // @ts-ignore
    let query = component.getAlertQueryString();
    expect(query).toBeDefined();
    expect(dataServiceResSpy).toHaveBeenCalled();
    expect(component.alerts).toBeDefined();
    expect(returnValue).toBeDefined();
  });

  it("should get alerts if response does not comes", () => {
    dataServiceResSpy = spyOn(dataService, "getAlerts").and.returnValue(
      throwError({ status: 404 })
    );
    let median = false;
    component.selectedAlertPipeline = {
      id: 1,
      name: "pipeline1",
      projectID: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
      newAlerts: 0,
    };

    // @ts-ignore
    const returnValue = component.getAlerts(median);
    // @ts-ignore
    let query = component.getAlertQueryString();
    expect(query).toBeDefined();
    expect(dataServiceResSpy).toHaveBeenCalled();
    expect(component.alerts).toEqual([]);
    expect(returnValue).toBeDefined();
  });

  it("should change alert view on successful call", () => {
    expect(component.alertsView).toEqual("board");
    component.changeAlertsView("table");
    expect(component.alertsView).toEqual("table");
  });

  it("should toggle filter menu return true", () => {
    let res = [{ UserName: "", User: { FirstName: "", LastName: "" } }];
    dataServiceResSpy = spyOn(dataService, "getUsers").and.returnValue(of(res));
    component.filters.displayMenu = false;
    component.toggleFilterMenu();
    expect(component.filters.displayMenu).toBe(true);
    expect(component.filters.lastFetched).toBeDefined();
  });

  it("should save selected fields return true", () => {
    dataServiceResSpy = spyOn(dataService, "saveFields").and.returnValue(
      of(true)
    );
    component.selectedAlertPipeline = {
      id: 1,
      name: "pipeline1",
      projectID: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
      newAlerts: 0,
    };
    let data = {
      deletedIds: [],
      selectedVariables: [
        {
          variableName: "v3",
          variableText: "NPS",
          variableGUID: "6d24b28d-79f8-f786-5d35-202334e06a63",
          questionGUID: "af45e238-6ab7-1933-d18d-3512919df7b5",
          variableType: 1,
        },
        {
          variableName: "v2",
          variableText: "Recommendation",
          variableGUID: "0177da63-b1df-bb83-1971-1f5f6eb1e70d",
          questionGUID: "af45e238-6ab7-1933-d18d-3512919df7b5",
          variableType: 1,
        },
      ],
    };
    // @ts-ignore
    const returnValue = component.saveSelectedVariable(data);
    expect(returnValue).toBeDefined();
  });

  it("should save selected fields return false", fakeAsync(() => {
    let data = {
      deletedIds: [],
      selectedVariables: "",
    };
    let error = "";
    // @ts-ignore
    const returnValue = component.saveSelectedVariable(data);
    expect(data.selectedVariables).toBe("");
    returnValue.subscribe((res) => {
      error += res;
    });
    tick(6000);
    expect(error).toBe("Nothing to save");
  }));

  it("should delete Selected Fields return true", () => {
    let ids = [94];
    component.selectedFields = [
      {
        id: 35,
        subscriptionId: "145",
        pipelineID: 1,
        variableName: "v22",
        variableText: "Recommendation",
        variableGUID: "52769516-2e57-c77b-16c3-4525401debea",
        questionGUID: "2712fe55-3318-33ad-3e87-d72433825784",
        variableType: 1,
        page: "home",
      },
      {
        id: 36,
        subscriptionId: "145",
        pipelineID: 1,
        variableName: "v23",
        variableText: "NPS",
        variableGUID: "eaa11294-6b69-204a-e455-f81ef364f9ac",
        questionGUID: "2712fe55-3318-33ad-3e87-d72433825784",
        variableType: 1,
        page: "home",
      },
      {
        id: 38,
        subscriptionId: "145",
        pipelineID: 1,
        variableName: "v29",
        variableText:
          "Have you ever had an interaction with Worldline executive.",
        variableGUID: "0e7a5fc6-b104-34e9-1df8-7bc952904d0d",
        questionGUID: "9f7fbafb-53c6-6dad-7ee4-0d3863c8cc8b",
        variableType: 1,
        page: "home",
      },
    ];

    //@ts-ignore
    component.removeSelectedFields(ids);

    //here we have nothing to expect
  });

  it("should getSurveyFilterString return surveyFilterString as '' ", () => {
    component.selectedFields = [];
    //@ts-ignore
    component.selectedFilterOptions = {};
    //@ts-ignore
    const returnValue = component.getSurveyFilterString();
    expect(returnValue).toEqual("");
  });

  it("should getSurveyFilterString with defined selectedFields return surveyFilterString as ''  ", () => {
    component.selectedFields = [
      {
        id: 35,
        subscriptionId: "145",
        pipelineID: 1,
        variableName: "v22",
        variableText: "Recommendation",
        variableGUID: "52769516-2e57-c77b-16c3-4525401debea",
        questionGUID: "2712fe55-3318-33ad-3e87-d72433825784",
        variableType: 1,
        page: "home",
      },
      {
        id: 36,
        subscriptionId: "145",
        pipelineID: 1,
        variableName: "v23",
        variableText: "NPS",
        variableGUID: "eaa11294-6b69-204a-e455-f81ef364f9ac",
        questionGUID: "2712fe55-3318-33ad-3e87-d72433825784",
        variableType: 1,
        page: "home",
      },
      {
        id: 38,
        subscriptionId: "145",
        pipelineID: 1,
        variableName: "v29",
        variableText:
          "Have you ever had an interaction with Worldline executive.",
        variableGUID: "0e7a5fc6-b104-34e9-1df8-7bc952904d0d",
        questionGUID: "9f7fbafb-53c6-6dad-7ee4-0d3863c8cc8b",
        variableType: 1,
        page: "home",
      },
    ];
    //@ts-ignore
    component.selectedFilterOptions = {};
    //@ts-ignore
    const returnValue = component.getSurveyFilterString();
    expect(returnValue).toEqual("");
  });

  it("should getSurveyFilterString with defined selectedFields return surveyFilterString   ", () => {
    component.selectedFields = [
      {
        id: 93,
        subscriptionId: "145",
        pipelineID: 37,
        variableName: "v3",
        variableText: "NPS",
        variableGUID: "6d24b28d-79f8-f786-5d35-202334e06a63",
        questionGUID: "af45e238-6ab7-1933-d18d-3512919df7b5",
        variableType: 1,
        page: "home",
      },
    ];
    //@ts-ignore
    component.selectedFilterOptions = {
      v3: {
        text: "NPS",
        code: "v3",
        options: {
          "1": { text: "Detractor", code: "1", sequance: 1, child: null },
        },
        optionList: [
          { text: "Detractor", code: "1", sequance: 1, child: null },
        ],
        selectedFilter: ["1"],
      },
    };
    //@ts-ignore
    const returnValue = component.getSurveyFilterString();
    expect(returnValue).toEqual("$surveyFilter=v3 itemSelected 1");
  });

  it("should getAlertFilterString return alertFilterString default value", () => {
    component.selectedAlertCategory = 1;
    component.filters.createdOn = -1;
    component.filters.lastActivityDate = -1;
    component.filters.status = -1;
    component.filters.priority = -1;
    component.filters.assignedTo = [];

    //@ts-ignore
    const returnValue = component.getAlertFilterString();
    expect(returnValue).toEqual("$alertFilter=alertCategory eq 1");
  });

  it("should getAlertFilterString return alertFilterString with Date Range not equal to custom", () => {
    component.selectedAlertCategory = 1;
    component.filters.createdOn = 3;
    component.filters.lastActivityDate = 3;
    component.filters.status = 3;
    component.filters.priority = 1;
    component.filters.assignedTo = [
      "nandini.r@rebuscode.com",
      "pooja.a@rebuscode.com",
    ];
    const expectedReturnValue =
      "$alertFilter=alertCategory eq 1 and createdOn eq 3 and lastActivityDate eq 3 and status eq 3 and priority eq 1 and assignedTo eq nandini.r@rebuscode.com,pooja.a@rebuscode.com";

    //@ts-ignore
    const returnValue = component.getAlertFilterString();
    expect(returnValue).toEqual(expectedReturnValue);
  });

  it("should getAlertFilterString return alertFilterString with Date Range equal to custom and is provided", () => {
    component.selectedAlertCategory = 1;
    component.filters.createdOn = 4;
    component.filters.lastActivityDate = 4;
    component.filters.createdOnStart = new Date();
    component.filters.createdOnEnd = new Date();
    component.filters.lastActivityDateStart = new Date();
    component.filters.lastActivityDateEnd = new Date();
    component.filters.status = 3;
    component.filters.priority = 1;
    component.filters.assignedTo = [
      "nandini.r@rebuscode.com",
      "pooja.a@rebuscode.com",
    ];
    const date = new Date().toLocaleDateString("en-US");
    const expectedReturnValue = `$alertFilter=alertCategory eq 1 and createdOn eq ${date}|${date} and lastActivityDate eq ${date}|${date} and status eq 3 and priority eq 1 and assignedTo eq nandini.r@rebuscode.com,pooja.a@rebuscode.com`;
    //@ts-ignore
    const returnValue = component.getAlertFilterString();
    expect(returnValue).toEqual(expectedReturnValue);
  });

  it("should getAlertFilterString return alertFilterString with Date Range equal to custom and is not provided", () => {
    component.selectedAlertCategory = 1;
    component.filters.createdOn = 4;
    component.filters.lastActivityDate = 4;
    component.filters.createdOnStart = null;
    component.filters.createdOnEnd = null;
    component.filters.lastActivityDateStart = null;
    component.filters.lastActivityDateEnd = null;
    component.filters.status = 3;
    component.filters.priority = 1;
    component.filters.assignedTo = [
      "nandini.r@rebuscode.com",
      "pooja.a@rebuscode.com",
    ];
    const date = new Date().toLocaleDateString("en-US");
    const expectedReturnValue = `$alertFilter=alertCategory eq 1 and createdOn eq ${date}|${date} and lastActivityDate eq ${date}|${date} and status eq 3 and priority eq 1 and assignedTo eq nandini.r@rebuscode.com,pooja.a@rebuscode.com`;
    //@ts-ignore
    const returnValue = component.getAlertFilterString();
    expect(returnValue).toEqual(expectedReturnValue);
  });

  xit("should het median TTC response", () => {
    dataServiceResSpy = spyOn(dataService, "getMedianTTC").and.returnValue(
      of(true)
    );
    let tableName = "amsbrahmansh.k871259";
    component.selectedAlertPipeline = {
      id: 1,
      name: "pipeline1",
      projectID: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
      newAlerts: 0,
    };
    //@ts-ignore
    const returnValue = component.getMedianTTC(tableName);
    expect(dataServiceResSpy).toHaveBeenCalled();
    expect(returnValue).toBeDefined();
  });

  it("should onFilterChange return response", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlerts").and.returnValue(of(true));
    let event = {
      v3: {
        text: "NPS",
        code: "v3",
        options: {
          "1": { text: "Detractor", code: "1", sequance: 1, child: null },
        },
        optionList: [
          { text: "Detractor", code: "1", sequance: 1, child: null },
        ],
        selectedFilter: ["1"],
      },
    };
    component.selectedAlertPipeline = {
      id: 1,
      name: "pipeline1",
      projectID: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
      newAlerts: 0,
    };
    component.onFilterChange(event);
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should onFilterChange return error", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlerts").and.returnValue(
      throwError({ status: 500 })
    );
    let event = {
      v3: {
        text: "NPS",
        code: "v3",
        options: {
          "1": { text: "Detractor", code: "1", sequance: 1, child: null },
        },
        optionList: [
          { text: "Detractor", code: "1", sequance: 1, child: null },
        ],
        selectedFilter: ["1"],
      },
    };
    component.selectedAlertPipeline = {
      id: 1,
      name: "pipeline1",
      projectID: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
      newAlerts: 0,
    };
    component.onFilterChange(event);
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should onSortOnChange return response", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlerts").and.returnValue(of(true));
    component.selectedAlertPipeline = {
      id: 1,
      name: "pipeline1",
      projectID: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
      newAlerts: 0,
    };

    component.onSortOnChange();
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should onSortOnChange return error", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlerts").and.returnValue(
      throwError({ status: 500 })
    );
    component.selectedAlertPipeline = {
      id: 1,
      name: "pipeline1",
      projectID: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
      newAlerts: 0,
    };

    component.onSortOnChange();
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should onAlertStatusUpdate return when old status was 4 and new status was 1 ", () => {
    let event = returnAlertStatusChangeEvent(4, 1);
    component.selectedAlertPipeline = {
      id: 37,
      name: "filetest",
      projectID: "19e7ef3d-d69f-3166-a26d-525c96ae537e",
      newAlerts: 20,
    };
    component.alertStats = { open: 5, expired: 0, closed: 2 };

    component.onAlertStatusUpdate(event);
    expect(component.selectedAlertPipeline.newAlerts).toBe(21);
    expect(component.alertStats.closed).toBe(1);
    expect(component.alertStats.open).toBe(6);
  });

  it("should onAlertStatusUpdate return when old status was 1 and new status was 4 ", () => {
    let event = returnAlertStatusChangeEvent(1, 4);
    component.selectedAlertPipeline = {
      id: 37,
      name: "filetest",
      projectID: "19e7ef3d-d69f-3166-a26d-525c96ae537e",
      newAlerts: 20,
    };
    component.alertStats = { open: 5, expired: 0, closed: 2 };

    component.onAlertStatusUpdate(event);
    expect(component.selectedAlertPipeline.newAlerts).toBe(19);
    expect(component.alertStats.closed).toBe(3);
    expect(component.alertStats.open).toBe(4);
  });

  it("should submitFilters return when createdOnDate contains error", () => {
    component.filters.createdOn = 4;
    component.isLastActivityOnDateEmpty = true;

    component.submitFilters();
    expect(component.isLastActivityOnDateEmpty).toBe(true);
  });

  it("should submitFilters return when lastActivityDate contains error", () => {
    component.filters.lastActivityDate = 4;
    component.isLastActivityOnDateEmpty = true;

    component.submitFilters();
    expect(component.isLastActivityOnDateEmpty).toBe(true);
  });

  it("should submitFilters return response ", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlerts").and.returnValue(of(true));
    component.filters.lastActivityDate = 2;
    component.filters.createdOn = 2;
    component.isLastActivityOnDateEmpty = true;

    component.submitFilters();
    expect(component.isLastActivityOnDateEmpty).toBe(false);
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should submitFilters return error ", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlerts").and.returnValue(
      throwError({ status: 500 })
    );
    component.filters.lastActivityDate = 2;
    component.filters.createdOn = 2;
    component.isLastActivityOnDateEmpty = true;

    component.submitFilters();
    expect(component.isLastActivityOnDateEmpty).toBe(false);
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should selectAlertCategory return if selected category is equal to category", () => {
    component.showProgress = false;
    component.selectedAlertCategory = 2;

    component.selectAlertCategory(2);
    expect(component.showProgress).toBe(false);
  });

  it("should selectAlertCategory return response if selected category is not equal to category ", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlerts").and.returnValue(of(true));
    component.selectedAlertCategory = 2;

    component.selectAlertCategory(3);
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should selectAlertCategory return errpr if selected category is not equal to category ", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlerts").and.returnValue(
      throwError({ status: 500 })
    );
    component.selectedAlertCategory = 2;

    component.selectAlertCategory(3);
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should selectAlertPipeline return error when pipeline is empty", () => {
    component.alertPipelines = [];

    const returnValue = component.selectAlertPipeline(0);

    expect(returnValue).toBeDefined();
  });

  it("should selectAlertPipeline return error when pipeline is already selected", () => {
    component.alertPipelines = [
      {
        id: 37,
        name: "filetest",
        projectID: "19e7ef3d-d69f-3166-a26d-525c96ae537e",
        newAlerts: 20,
      },
    ];
    component.selectedAlertPipeline = {
      id: 37,
      name: "filetest",
      projectID: "19e7ef3d-d69f-3166-a26d-525c96ae537e",
      newAlerts: 20,
    };

    const returnValue = component.selectAlertPipeline(0);

    expect(returnValue).toBeDefined();
  });

  it("should selectAlertPipeline return true", () => {
    authServiceResSpy = spyOn(authService, "getProjectToken").and.returnValues(
      of(true)
    );
    component.alertPipelines = [
      {
        id: 0,
        name: "filetest",
        projectID: "19e7ef3d-d69f-3166-a26d-525c96ae537e",
        newAlerts: 20,
      },
      {
        id: 1,
        name: "pipeline1",
        projectID: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
        newAlerts: 0,
      },
    ];
    component.selectedAlertPipeline = {
      id: 0,
      name: "filetest",
      projectID: "19e7ef3d-d69f-3166-a26d-525c96ae537e",
      newAlerts: 20,
    };

    const returnValue = component.selectAlertPipeline(1);
    expect(authServiceResSpy).toHaveBeenCalled();
    expect(returnValue).toBeDefined();
  });
});
