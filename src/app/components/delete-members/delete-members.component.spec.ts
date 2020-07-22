import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DeleteMembersComponent } from "./delete-members.component";
import { AlertNotificationService } from "src/app/services/alert-notification.service";
import { DataService } from "src/app/services/data.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { of } from "rxjs";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AlertActivity } from "src/app/classes/alert-activity";

describe("DeleteMembersComponent", () => {
  let component: DeleteMembersComponent;
  let fixture: ComponentFixture<DeleteMembersComponent>;

  const dialogMock = {
    close: () => {},
    updatePosition: (obj) => {},
    afterClosed: () => of(true),
  };

  const dataMock = {
    alert: {
      alertMembers: [
        {
          id: 298,
          alertId: 116,
          member: "brahmansh.k@rebuscode.com",
          memberName: "brahmansh Kaushal",
        },
      ],
    },
    alertId: "116",
    alertPipelineId: "37",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [DeleteMembersComponent],
      providers: [
        AlertNotificationService,
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
    fixture = TestBed.createComponent(DeleteMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should createActivity work successfully", () => {
    //@ts-ignore
    component.alertActivity = new AlertActivity();
    let removedMembers = [
      {
        id: 330,
        alertId: 116,
        member: "Amsuser@rebuscode.com",
        memberName: "Amsuser suser",
      },
    ];
    //@ts-ignore
    component.createActivity(removedMembers);
    //@ts-ignore
    expect(component.alertActivity.membersAffected).toBeDefined();
  });

  it("should onDialogClose if case", () => {
    component.removedMemberIds = [1, 2, 3];
    component.onDialogClose();
  });

  it("should onDialogClose else case", () => {
    component.removedMemberIds = [];
    component.onDialogClose();
  });
});
