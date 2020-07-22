import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddMembersComponent } from "./add-members.component";
import { DataService } from "../../services/data.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { DebugElement } from "@angular/core";
import { AlertMember } from '../../classes/alert-member';
import { ActivityType } from "src/app/enums/alerts.enum";


let userInfo = {
  unique_name: "abc@rebuscode.com",
  username: "abc@rebuscode.com",
  userid: "12480",
  CustomerID: "145",
  subrole: "0",
  CustomerName: "Rebuscode",
  plan: "beta-enterprise",
  app: "dashboard",
};
class UserServiceMock {

  setUserInfo(userInfo) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }

}

describe("AddMembersComponent", () => {
  let component: AddMembersComponent;
  let fixture: ComponentFixture<AddMembersComponent>;
  let userService: UserServiceMock;
  let dataService: DataService;
  let dataServiceSpy: jasmine.Spy;
  let de: DebugElement;
  const dialogMock = {
    close: (args?) => {},
    updatePosition: (obj) => {},
    afterClosed: () => of(true),
  };

  let usersData = {
    ID: 17029,
    UserName: "ashish.p@rebuscode.com",
    RoleID: 15,
    DataFilter: "",
    ProjectGUID: "19e7ef3d-d69f-3166-a26d-525c96ae537e",
    NotificationFilter: "",
    Project: {
      ID: 2134,
      ProjectGuid: "19e7ef3d-d69f-3166-a26d-525c96ae537e",
      Name: "filetest",
      Description: null,
      CustomerID: 145,
      ProjectType: 0,
      IsArchived: 0,
      IsActive: 0,
      AllowAnonymousOfflineDataCollection: 0,
      IsAutoDataTransferEnabled: 0,
      AutoDataBackcheckStatus: 0,
      AutoDataSurveyStatus: 0,
      TemplateValue: 0,
      AddOnType: null,
      TemplateIcon: null,
      TemplateWhitepaper: null,
      ShowTemplate: 0,
      TemplateFlags: 0,
      IsSingleCountry: 0,
      CountryID: 0,
      UseBenchmarks: 0,
      IndustryID: 0,
      CompanySizeID: 0,
      ProjectSourceType: 0,
      SourceProjectID: 0,
      DataCount: 0,
      LastSeventDaysData: null,
      CreatedBy: null,
      CreatedOn: "0001-01-01T00:00:00",
      ModifiedBy: null,
      ModifiedOn: "0001-01-01T00:00:00",
      LastActivatedBy: null,
      LastActivatedOn: "0001-01-01T00:00:00",
      CompanyName: null,
      CountryName: null,
      IndustryName: null,
      CompanySizeName: null,
      ActiveQuestionnaireVersion: 0,
      DashboardUrl: null,
      Tags: [],
      TagIDs: [],
      Subscription: {
        ID: 0,
        CompanyName: null,
        SubscriptionKey: "rebuscode",
        SubscriptionPlanTypeID: 6,
        Licenses: 0,
        SubscriptionStatus: null,
        AutoCollection: false,
        SubscriptionOwner: null,
        Industry: null,
        Size: null,
        SubscriptionPlanType: null,
        SubscriptionDetails: [],
        Users: [],
      },
      UserProjectMapping: null,
    },
    User: {
      ID: 0,
      Username: null,
      Password: null,
      FirstName: "Ashish ",
      LastName: "Pandey",
      Salt: null,
      Status: 1,
      CompanyName: null,
      Designation: null,
      Gender: 0,
      Timezone: null,
      SignedUpOn: null,
      RemovedOn: null,
      AuthProviderTypes: 0,
      FBUniqueID: null,
      LinkedInUniqueID: null,
      ProfilePicProvider: 0,
      Country: null,
      SubscriptionRole: 0,
      SubscriptionID: 0,
      PhoneNumber: null,
      Subscription: null,
      UserProjectMappings: [],
    },
    Role: null,
    UserTags: [],
  };

  const dataMock = {
    alertPipelineId: "1",
    alertId: "1",
    alert: {
      id: 1,
      respondentName: "Manish Pandey",
      status: 2,
      openedOn: "2020-04-05T12:50:04.3466667",
      lastActivityOn: "2020-04-29T10:24:50.6666667",
      priority: 2,
      assignedTo: "pooja.a@rebuscode.com",
      closedDate: "2020-04-28T06:17:04.653",
      showNotification: true,
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
      tableName: "amsbrahmansh.k13124429",
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [AddMembersComponent],
      providers: [
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
    userService = new UserServiceMock();
    userService.setUserInfo(userInfo);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMembersComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dataService = de.injector.get(DataService);
    dataServiceSpy = spyOn(dataService, "getUsers").and.returnValue(
      of([usersData])
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should init state", () => {
    dialogMock.updatePosition({ right: "20px" });
    expect(dataServiceSpy).toHaveBeenCalled();
    expect(component.showProgress).toBeFalse();
  });

  it("add members", () => {
    component.addMembers();
    // console.log(component.filteredUsers, component.filteredUsers.length, component.selectedMembers[component.filteredUsers[0].UserName], component.filteredUsers[0].UserName, component.selectedMembers)
    expect(component.filteredUsers.length).not.toBe(0);
    component.selectedMembers = { "ashish.p@rebuscode.com": true };
    // component.members = {
    //   'alertId': dataMock.alertId,
    //   'member': component.filteredUsers[0].UserName,
    //   'memberName': component.filteredUsers[0].User.FirstName + " " + component.filteredUsers[0].User.LastName
    // }
    // expect(component.selectedMembers).toEqual()
    expect(
      component.selectedMembers[component.filteredUsers[0].UserName]
    ).toBe(true);
    // expect(component.members.length).not.toBe(0)
  });

  it('get add member query', () => {
    let mem = {
      'alertId': dataMock.alertId,
      'member': component.filteredUsers[0].UserName,
      'memberName': component.filteredUsers[0].User.FirstName + " " + component.filteredUsers[0].User.LastName
    }
    // @ts-ignore
    let returnValue = component.getAddMemberQueryString(mem)
    expect(returnValue).toBeDefined()
  })

  it('create activity', () => {
    let mem = {
      'alertId': dataMock.alertId,
      'member': component.filteredUsers[0].UserName,
      'memberName': component.filteredUsers[0].User.FirstName + " " + component.filteredUsers[0].User.LastName
    }
    // @ts-ignore
    component.createActivity(mem)
    // @ts-ignore
    component.alertActivity.alertID = component.dialogData.alertId;
    // @ts-ignore
    component.alertActivity.activityTypeID = ActivityType.ADD_MEMBER;
    // @ts-ignore
    let returnValue = component.getAddMemberQueryString(mem)
    // @ts-ignore
    component.alertActivity.membersAffected = returnValue
    // @ts-ignore
    expect(component.alertActivity.membersAffected).toBeDefined()
  })

  it('should dialog be clodes', () => {
    component.onDialogClose()
    dialogMock.close()
  })
});
