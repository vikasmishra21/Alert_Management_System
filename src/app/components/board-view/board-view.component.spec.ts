import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BoardViewComponent } from "./board-view.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DebugElement } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { IAlert } from "src/app/interfaces/alert";
import { of } from 'rxjs/internal/observable/of';

describe("BoardViewComponent", () => {
  let component: BoardViewComponent;
  let fixture: ComponentFixture<BoardViewComponent>;
  let de: DebugElement;
  let dataService: DataService;
  let dataServiceResSpy: jasmine.Spy;
  let dataServiceErrSpy: jasmine.Spy;
  let alert = {
    id: 116,
    respondentName: "ashish",
    status: 2,
    openedOn: "2020-04-23T18:23:05",
    lastActivityOn: "2020-05-08T11:37:27.1333333",
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
        id: 316,
        alertId: 116,
        member: "ashish.p@rebuscode.com",
        memberName: "Ashish Pandey",
      },
    ],
    fields: { RespondentID: "30", v2: "1", v3: "Detractor" },
    respondentEmail: "ashish.p@rebuscode.com",
    respondentPhone: "234",
    tableName: "amsbrahmansh.k812259",
  };

  function getAlertData(): any {
    let alertData: IAlert[] = [
      {
        id: 1,
        respondentName: "Manish Pandey",
        status: 1,
        openedOn: "2020-04-05T12:50:04.3466667",
        lastActivityOn: "2020-04-29T10:24:50.6666667",
        priority: 2,
        assignedTo: "pooja.a@rebuscode.com",
        closedDate: "2020-04-28T06:17:04.653",
        showNotification: true,
        expired: true,
        alertMembers: [
          {
            id: 165,
            alertId: 1,
            member: "supriya.m@rebuscode.com",
            memberName: "Supriya Mohapatra",
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
        respondentPhone: "12345678900",
        tableName: "amsbrahmansh.k8115135",
      },
      {
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
            id: 165,
            alertId: 1,
            member: "supriya.m@rebuscode.com",
            memberName: "Supriya Mohapatra",
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
        respondentPhone: "12345678900",
        tableName: "amsbrahmansh.k8115135",
      },
      {
        id: 1,
        respondentName: "Manish Pandey",
        status: 3,
        openedOn: "2020-04-05T12:50:04.3466667",
        lastActivityOn: "2020-04-29T10:24:50.6666667",
        priority: 2,
        assignedTo: "pooja.a@rebuscode.com",
        closedDate: "2020-04-28T06:17:04.653",
        showNotification: true,
        expired: true,
        alertMembers: [
          {
            id: 165,
            alertId: 1,
            member: "supriya.m@rebuscode.com",
            memberName: "Supriya Mohapatra",
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
        respondentPhone: "12345678900",
        tableName: "amsbrahmansh.k8115135",
      },
      {
        id: 1,
        respondentName: "Manish Pandey",
        status: 4,
        openedOn: "2020-04-05T12:50:04.3466667",
        lastActivityOn: "2020-04-29T10:24:50.6666667",
        priority: 2,
        assignedTo: "pooja.a@rebuscode.com",
        closedDate: "2020-04-28T06:17:04.653",
        showNotification: true,
        expired: true,
        alertMembers: [
          {
            id: 165,
            alertId: 1,
            member: "supriya.m@rebuscode.com",
            memberName: "Supriya Mohapatra",
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
        respondentPhone: "12345678900",
        tableName: "amsbrahmansh.k8115135",
      },
    ];

    return alertData;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        DragDropModule,
      ],
      declarations: [BoardViewComponent],
      providers: [DataService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardViewComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dataService = de.injector.get(DataService);
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should resetStatuses return response", () => {
    //@ts-ignore
    component.resetStatuses();

    expect(component.statuses.new).toEqual([]);
    expect(component.statuses.waitingOnCustomer).toEqual([]);
    expect(component.statuses.waitingOnUs).toEqual([]);
    expect(component.statuses.closed).toEqual([]);
  });

  it("should detect changes via ngOnChanges", () => {
    let changes = {
      alerts: {
        previousValue: [],
        currentValue: [
          {
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
                id: 165,
                alertId: 1,
                member: "supriya.m@rebuscode.com",
                memberName: "Supriya Mohapatra",
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
            tableName: "amsbrahmansh.k8112949",
          },
        ],
        firstChange: false,
      },
    };

    component.ngOnChanges(changes);
    expect(component.statuses.closed).toEqual([]);
  });

  it("should loadData return response", () => {
    let alertData = getAlertData();
    component.loadData(alertData);
    expect(component.statuses.new).toBeDefined();
    expect(component.statuses.waitingOnCustomer).toBeDefined();
    expect(component.statuses.waitingOnUs).toBeDefined();
    expect(component.statuses.closed).toBeDefined();
  });

  it("should updateAlertStats return true", () => {
    dataServiceResSpy = spyOn(dataService, "postAlertActivity").and.returnValue(
      of(true)
    );
    component.updateAlertStatus(1, 2, alert);
  });
});
