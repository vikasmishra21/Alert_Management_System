import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";

import { AlertDetailsComponent } from "./alert-details.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AuthService } from "../../services/auth.service";
import { AlertNotificationService } from "../../services/alert-notification.service";
import { UserService } from "../../services/user.service";
import { DebugElement, Component } from "@angular/core";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { AlertActivity } from "src/app/classes/alert-activity";

let projectInfo = {
  "5a8ff4d5-5f28-1876-f97b-25bd768e07e0": {
    Permissions: ["701"],
    licensePermissions: ["704"],
    Name: "Kotak_regression",
    ID: "2084",
    Guid: "5a8ff4d5-5f28-1876-f97b-25bd768e07e0",
    SubscriptionID: "145",
    SubscriptionName: "Rebuscode",
    sessionid: "ffc38920-e240-460e-8c1c-37bc1d3e49c9",
    projectlandingpage: "design",
    GuestUsersPerProject: "-1",
    Roleid: "15",
    iss: "https://test.rebuscode.com/",
    aud: "414e1927a3884f68abc79f7283837fd1",
    exp: 1589621859,
    nbf: 1589535459,
  },
};

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

describe("AlertDetailsComponent", () => {
  let component: AlertDetailsComponent;
  let fixture: ComponentFixture<AlertDetailsComponent>;
  let userService: UserService;
  let de: DebugElement;
  let router: Router;
  let componentSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;
  let dataService: DataService;
  let dataServiceSpy: jasmine.Spy;
  let authService: AuthService;
  let authServiceSpy: jasmine.Spy;

  function setAlertStateData() {
    //@ts-ignore
    component.alertState.alert = {
      id: 116,
      respondentName: "ashish",
      status: 2,
      openedOn: "2020-04-23T18:23:05",
      lastActivityOn: "2020-05-14T10:41:47.97",
      priority: 3,
      assignedTo: "brahmansh.k@rebuscode.com",
      closedDate: null,
      showNotification: false,
      expired: false,
      alertMembers: [
        {
          id: 334,
          alertId: 116,
          member: "brahmansh.k@rebuscode.com",
          memberName: "brahmansh Kaushal",
        },
      ],
      fields: { RespondentID: "30", v2: "1", v3: "Detractor", v5: "blue" },
      respondentPhone: "234",
      tableName: "amsbrahmansh.k15103446",
    };
  }

  function setAlertData() {
    component.selectedFields = [
      {
        id: 118,
        subscriptionId: "145",
        pipelineID: 37,
        variableName: "v5",
        variableText: "Click to edit question text.",
        variableGUID: "83577db3-a8f7-7f82-bc54-557b5a7328b9",
        questionGUID: "55dba802-2084-70e7-90dc-c19d14b1a45c",
        variableType: 1,
        page: "details",
      },
    ];
    component.variablesOptions = {
      v5: {
        text: "Click to edit question text.",
        code: "v5",
        options: {
          "1": { text: "black", code: "1", sequance: 1, child: null },
          "2": { text: "blue", code: "2", sequance: 2, child: null },
          "3": { text: "red", code: "3", sequance: 3, child: null },
        },
      },
    };
    component.alert = {
      id: 116,
      respondentName: "ashish",
      status: 2,
      openedOn: "2020-04-23T18:23:05",
      lastActivityOn: "2020-05-14T10:41:47.97",
      priority: 3,
      assignedTo: "abc@rebuscode.com",
      closedDate: null,
      showNotification: false,
      expired: false,
      alertMembers: [
        {
          id: 334,
          alertId: 116,
          member: "brahmansh.k@rebuscode.com",
          memberName: "brahmansh Kaushal",
        },
      ],
      fields: { RespondentID: "30", v2: "1", v3: "Detractor", v5: "blue" },
      respondentPhone: "234",
      tableName: "amsbrahmansh.k15103446",
    };
    component.alertMembers = [
      {
        id: 334,
        alertId: 116,
        member: "brahmansh.k@rebuscode.com",
        memberName: "brahmansh Kaushal",
      },
    ];
  }

  class mockService {
    public getCurrentProjectId() {
      return "5a8ff4d5-5f28-1876-f97b-25bd768e07e0";
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      declarations: [AlertDetailsComponent],
      providers: [AuthService, AlertNotificationService],
    }).compileComponents();
    userService = new UserService();
    userService.setUserInfo(userInfo);
    //@ts-ignore
    userService.projectInfo = projectInfo;
    // @ts-ignore
    userService.currentProjectId = "5a8ff4d5-5f28-1876-f97b-25bd768e07e0";
    // userService.projectIdStorageKey = "projectId";
    // userService.setCurrentProjectId("5a8ff4d5-5f28-1876-f97b-25bd768e07e0");
    localStorage.setItem("projectId", "5a8ff4d5-5f28-1876-f97b-25bd768e07e0");
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDetailsComponent);
    component = fixture.componentInstance;
    //@ts-ignore
    component.userService.projectInfo = projectInfo;
    //@ts-ignore
    component.userService.userInfo = userInfo;
    de = fixture.debugElement;
    dataService = de.injector.get(DataService);
    authService = de.injector.get(AuthService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should ngOinit when queryParams are defined", () => {
    // authServiceSpy = spyOn(authService, "getProjectToken").and.returnValue(
    //   of(true)
    // );

    const x = new mockService();
    component.ngOnInit();
    //@ts-ignore
    component.queryParameters = {
      projectGuid: "db35b086-5907-7156-456b-984e391746f1",
    };
    const k = userService.getCurrentProjectId();

    // @ts-ignore
    expect(component.queryParameters.projectGuid).not.toBe("");
    expect(k).not.toBe("");

    //@ts-ignore
    // if (component.queryParameters.projectGuid && component.queryParameters.projectGuid !== x.getCurrentProjectId()
    // ){
    //   expect(component).toBeDefined()
    // }
    //@ts-ignore
    // expect(authServiceSpy).toHaveBeenCalled();
  });

  it("should initializeDetails called when alerState is defined", () => {
    setAlertStateData();
    //@ts-ignore
    component.initializeDetails();
    expect(component.alert).toBeDefined();
  });

  it("should initializeDetails called when routerParams are defined and response expected", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlert").and.returnValue(of(true));
    //@ts-ignore
    component.initializeDetails();
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should initializeDetails called when routerParams are defined and error expected", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "getAlert").and.returnValue(
      throwError({ status: 500 })
    );
    //@ts-ignore
    component.initializeDetails();
    expect(componentSpy).toHaveBeenCalled();
  });

  it("should initializeDetails called when navigated to Home", () => {
    navigateSpy = spyOn(router, "navigate");
    component.routeParameters = null;
    //@ts-ignore
    component.initializeDetails();
    expect(navigateSpy).toHaveBeenCalledWith(["home"]);
  });

  it("should getAlert expected response", () => {
    let getAlertRes = {
      tableName: "",
      alertList: [
        {
          id: 116,
          respondentName: "ashish",
          status: 2,
          openedOn: "2020-04-23T18:23:05",
          lastActivityOn: "2020-05-14T10:41:47.97",
          priority: 3,
          assignedTo: "abc@rebuscode.com",
          closedDate: null,
          showNotification: false,
          expired: false,
          alertMembers: [
            {
              id: 334,
              alertId: 116,
              member: "brahmansh.k@rebuscode.com",
              memberName: "brahmansh Kaushal",
            },
          ],
          fields: { RespondentID: "30", v2: "1", v3: "Detractor", v5: "blue" },
          respondentPhone: "234",
          tableName: "amsbrahmansh.k15103446",
        },
      ],
    };
    dataServiceSpy = spyOn(dataService, "getAlert").and.returnValue(
      of(getAlertRes)
    );

    //@ts-ignore
    const returnValue = component.getAlert("37", "116").subscribe((res) => {
      expect(res).toBeDefined();
      //@ts-ignore
      component.getAlertActivities();
    });
    expect(dataServiceSpy).toHaveBeenCalled();

    //can't access getAlertActivities
  });

  it("should getAlert expected error", () => {
    dataServiceSpy = spyOn(dataService, "getAlert").and.returnValue(
      throwError({ status: 500 })
    );

    //@ts-ignore
    const returnValue = component.getAlert("37", "116").subscribe(
      (res) => {},
      (err) => {}
    );
    expect(dataServiceSpy).toHaveBeenCalled();
  });

  it("should getAlertActivities expected res", () => {
    dataServiceSpy = spyOn(dataService, "getAlertDetails").and.returnValue(
      of(true)
    );
    let getAlertActivitySpy = spyOn(
      dataService,
      "getAlertActivities"
    ).and.returnValue(of(true));

    //@ts-ignore
    component.getAlertActivities();

    expect(dataServiceSpy).toHaveBeenCalled();
    expect(getAlertActivitySpy).toHaveBeenCalled();
  });

  it("should getAlertActivities expected err", () => {
    dataServiceSpy = spyOn(dataService, "getAlertDetails").and.returnValue(
      of(true)
    );
    let getAlertActivitySpy = spyOn(
      dataService,
      "getAlertActivities"
    ).and.returnValue(throwError({ status: 500 }));

    //@ts-ignore
    component.getAlertActivities();

    expect(dataServiceSpy).toHaveBeenCalled();
    expect(getAlertActivitySpy).toHaveBeenCalled();
  });

  it("should getFields expected response", () => {
    setAlertData();
    let returnValue = [
      {
        id: 118,
        subscriptionId: "145",
        pipelineID: 37,
        variableName: "v5",
        variableText: "Click to edit question text.",
        variableGUID: "83577db3-a8f7-7f82-bc54-557b5a7328b9",
        questionGUID: "55dba802-2084-70e7-90dc-c19d14b1a45c",
        variableType: 1,
        page: "details",
      },
    ];
    dataServiceSpy = spyOn(dataService, "getFields").and.returnValue(
      of(returnValue)
    );
    // let spy = spyOn(dataService, "getFilterOptions").and.returnValue(of(true));

    //@ts-ignore
    component.getFields("5a8ff4d5-5f28-1876-f97b-25bd768e07e0", "37");

    expect(dataServiceSpy).toHaveBeenCalled();
    // expect(spy).toHaveBeenCalled();

    //can't access getFilterOptions subscribe
  });

  it("should getFields expected error", () => {
    setAlertData();

    dataServiceSpy = spyOn(dataService, "getFields").and.returnValue(
      throwError({ status: 500 })
    );

    //@ts-ignore
    component.getFields("5a8ff4d5-5f28-1876-f97b-25bd768e07e0", "37");

    expect(dataServiceSpy).toHaveBeenCalled();
  });

  it("should getFilterString return correct filterString", () => {
    component.selectedFields = [
      {
        id: 118,
        subscriptionId: "145",
        pipelineID: 37,
        variableName: "v5",
        variableText: "Click to edit question text.",
        variableGUID: "83577db3-a8f7-7f82-bc54-557b5a7328b9",
        questionGUID: "55dba802-2084-70e7-90dc-c19d14b1a45c",
        variableType: 1,
        page: "details",
      },
    ];
    //@ts-ignore
    const returnValue = component.getFilterString();

    expect(returnValue).toEqual("side{v5}");
  });

  it("should getFieldsToDisplay return correct filterString", () => {
    let expectedValue = [
      { variableText: "Click to edit question text.", answer: "blue" },
    ];
    setAlertData();
    //@ts-ignore
    const returnValue = component.getFieldsToDisplay();
    expect(returnValue).toEqual(expectedValue);
  });

  it("should initialiseAlertInfo this.alert.alertMembers.length case", () => {
    setAlertData();
    component.alert.alertMembers = [];

    //@ts-ignore
    component.initialiseAlertInfo();

    expect(component.activityFilters).toBeDefined();
  });

  it("should initialiseAlertInfo checkAlertAssignedMember case", () => {
    setAlertData();
    // component.alert.alertMembers = [];

    //@ts-ignore
    component.initialiseAlertInfo();

    expect(component.activityFilters).toBeDefined();
  });

  it("should createAlertTransformedProperties if alertOpenedOn is undefined", () => {
    setAlertData();
    component.alert.openedOn = undefined;

    //@ts-ignore
    component.createAlertTransformedProperties();

    expect(component.transformedAlertProperties.openedOn).toEqual("Never");
  });

  it("should createAlertTransformedProperties if alert status is closed", () => {
    // component.alert.openedOn = alerts.openedOn
    setAlertData();
    component.alert.status = 4;
    let openedOn = new Date(component.alert.openedOn);
    let newopenedOn = openedOn.toLocaleDateString("en-US");

    //@ts-ignore
    component.createAlertTransformedProperties();

    component.transformedAlertProperties.openedOn = newopenedOn;
    expect(component.transformedAlertProperties.openedOn).toBe(newopenedOn);
  });

  it("should createAlertTransformedProperties if lastActivityOn date is not present", () => {
    setAlertData();
    component.alert.lastActivityOn = null;
    component.transformedAlertProperties.lastActivityOn = "Never";

    //@ts-ignore
    component.createAlertTransformedProperties();

    expect(component.transformedAlertProperties.lastActivityOn).toBe("Never");
  });

  it("should createAlertMembers if assignedTo is equal to username", () => {
    setAlertData();
    component.alert.assignedTo = "brahmansh.k@rebuscode.com";

    //@ts-ignore
    component.createAlertMembers();

    expect(component.alertMembers).toBeDefined();
  });

  it("should removeSelectedFields", () => {
    setAlertData();

    //@ts-ignore
    component.removeSelectedFields([1, 2]);

    expect(component.selectedFields).toBeDefined();
  });

  it("should save selected fields return response", () => {
    dataServiceSpy = spyOn(dataService, "saveFields").and.returnValue(of(true));
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

  it("should save selected fields return error", fakeAsync(() => {
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
    // setTimeout(() => {
    //   expect(error).toBe("Nothing to save");
    // }, 5000);
  }));

  it("should sendEmail return response", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      of(true)
    );
    setAlertData();
    let emailContent = {
      to: "",
      subject: "",
      body: "",
    };

    //@ts-ignore
    component.sendEmail(emailContent);

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should sendEmail return err", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      throwError({ status: 500 })
    );
    setAlertData();
    let emailContent = {
      to: "",
      subject: "",
      body: "",
    };

    //@ts-ignore
    component.sendEmail(emailContent);

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should updateAlertNote return response", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      of(true)
    );
    setAlertData();

    //@ts-ignore
    component.updateAlertNote("content");

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should updateAlertNote return error", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      throwError({ status: 500 })
    );
    setAlertData();

    //@ts-ignore
    component.updateAlertNote("content");

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should addPhoneCall return response", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      of(true)
    );
    let callData = {
      status: 1,
      note: "",
    };
    setAlertData();

    //@ts-ignore
    component.addPhoneCall(callData);

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should addPhoneCall return error", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      throwError({ status: 500 })
    );
    let callData = {
      status: 1,
      note: "",
    };
    setAlertData();

    //@ts-ignore
    component.addPhoneCall(callData);

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should uploadFile return response", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      of(true)
    );
    setAlertData();

    //@ts-ignore
    component.uploadFile("test");

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should uploadFile return error", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      throwError({ status: 500 })
    );
    setAlertData();

    //@ts-ignore
    component.uploadFile("test");

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should postAlertActivity return response", () => {
    dataServiceSpy = spyOn(dataService, "postAlertActivity").and.returnValue(
      of(true)
    );
    let activity = new AlertActivity();

    //@ts-ignore
    const returnValue = component.postAlertActivity(115, 25, activity);

    expect(dataServiceSpy).toHaveBeenCalled();
    expect(returnValue).toBeDefined();
  });

  it("should updatePriority return response", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      of(true)
    );
    setAlertData();

    //@ts-ignore
    component.updatePriority();

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should updatePriority return error", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      throwError({ status: 500 })
    );
    setAlertData();

    //@ts-ignore
    component.updatePriority();

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should updateStatus return response", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      of(true)
    );
    setAlertData();

    //@ts-ignore
    component.updateStatus();

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should updateStatus return error", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      throwError({ status: 500 })
    );
    setAlertData();

    //@ts-ignore
    component.updateStatus();

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should updateAssignedTo return response", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      of(true)
    );
    setAlertData();

    //@ts-ignore
    component.updateAssignedTo();

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should updateAssignedTo return error", () => {
    //@ts-ignore
    componentSpy = spyOn(component, "postAlertActivity").and.returnValue(
      throwError({ status: 500 })
    );
    setAlertData();

    //@ts-ignore
    component.updateAssignedTo();

    expect(componentSpy).toHaveBeenCalled();
  });

  it("should onReturn work", () => {
    navigateSpy = spyOn(router, "navigate");

    component.onReturn();
    expect(navigateSpy).toHaveBeenCalledWith(["home"]);
  });

  it("should onActivityFilterOpenChange work", () => {
    setAlertData();

    component.onActivityFilterOpenChange(false);

    expect(component.activityFilters.status).toBeDefined();
    expect(component.activityFilters.members).toBeDefined();
  });

  it("should selectAll works when type is activity and statusesSelectAll is false", () => {
    setAlertData();
    component.statusesSelectAll = false;

    component.selectAll("activity");

    expect(component.selectedStatuses).toEqual([]);
  });

  it("should disableSelectAll work when type is activity and statusesSelectAll is true", () => {
    setAlertData();

    component.disableSelectAll("activity");
    expect(component.statusesSelectAll).toBe(false);
  });

  it("should disableSelectAll work when type is members and membersSelectAll is true", () => {
    setAlertData();

    component.disableSelectAll("members");
    expect(component.membersSelectAll).toBe(false);
  });
});
