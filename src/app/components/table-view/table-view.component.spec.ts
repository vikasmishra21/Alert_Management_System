import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TableViewComponent } from "./table-view.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Router } from "@angular/router";

describe("TableViewComponent", () => {
  let component: TableViewComponent;
  let fixture: ComponentFixture<TableViewComponent>;
  let navigateSpy: jasmine.Spy;
  let router: Router;

  function setData(closedDate, lastActivityOnDate) {
    component.selectedColumns = [
      { property: "openedOn", text: "Opened On", type: "date" },
      { property: "status", text: "Status", type: "status" },
      { property: "priority", text: "Priority", type: "priority" },
      { property: "closedDate", text: "Closed Date", type: "date" },
      { property: "id", text: "ID", type: "number" },
    ];
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
    ];
    component.alerts = [
      {
        id: 116,
        respondentName: "ashish",
        status: 2,
        openedOn: "2020-04-23T18:23:05",
        lastActivityOn: lastActivityOnDate,
        priority: 3,
        assignedTo: "brahmansh.k@rebuscode.com",
        closedDate: closedDate,
        showNotification: false,
        expired: false,
        alertMembers: [
          {
            id: 329,
            alertId: 116,
            member: "ashish.p@rebuscode.com",
            memberName: "Ashish Pandey",
          },
        ],
        fields: { RespondentID: "30", v2: "1", v3: "Detractor", v5: "blue" },
        respondentPhone: "234",
        tableName: "amsbrahmansh.k14113823",
      },
      {
        id: 116,
        respondentName: "ashish",
        status: 2,
        openedOn: "2020-04-23T18:23:05",
        lastActivityOn: lastActivityOnDate,
        priority: 3,
        assignedTo: "brahmansh.k@rebuscode.com",
        closedDate: closedDate,
        showNotification: false,
        expired: false,
        alertMembers: [
          {
            id: 329,
            alertId: 116,
            member: "ashish.p@rebuscode.com",
            memberName: "Ashish Pandey",
          },
        ],
        fields: { RespondentID: "30", v2: "1", v3: "Detractor", v5: "blue" },
        respondentPhone: "234",
        tableName: "amsbrahmansh.k14113823",
      },
    ];

    component.orderBy = "";
    component.sortedColumnIndex = 2;
    component.pipelineId = 37;
  }

  function setTableData() {
    component.tableData = [
      {
        openedOn_value: "2020-04-23T18:23:05",
        openedOn: "4/23/2020",
        v3: "Detractor",
        v3_value: "Detractor",
        v5: "blue",
        v5_value: "blue",
        v2: "1",
        v2_value: "1",
        id_value: 116,
        id: 116,
        status_value: 2,
        status: "WAITING_ON_CUSTOMER",
        priority_value: 3,
        priority: "LOW",
        lastActivityOn_value: "2020-05-14T10:41:47.98",
        lastActivityOn: "5/14/2020",
        closedDate_value: null,
        closedDate: "",
      },
      {
        closedDate: "",
        closedDate_value: null,
        id: 115,
        id_value: 115,
        lastActivityOn: "5/14/2020",
        lastActivityOn_value: "2020-05-14T08:18:04.3466667",
        openedOn: "4/23/2020",
        openedOn_value: "2020-04-23T18:07:54",
        priority: "MEDIUM",
        priority_value: 2,
        status: "NEW",
        status_value: 1,
        v2: "1",
        v2_value: "1",
        v3: "Detractor",
        v3_value: "Detractor",
        v5: "blue",
        v5_value: "blue",
      },
    ];

    component.tableHeaders = [
      { property: "openedOn", text: "Opened On", type: "date" },
      { property: "id", text: "ID", type: "number" },
      { property: "status", text: "Status", type: "status" },
      { property: "priority", text: "Priority", type: "priority" },
      { property: "lastActivityOn", text: "Last Activity On", type: "date" },
      { property: "closedDate", text: "Closed Date", type: "date" },
      { property: "v3", text: "NPS", type: "field" },
      { property: "v5", text: "Click to edit question text.", type: "field" },
      { property: "v2", text: "Recommendation", type: "field" },
      { property: "respondentName", text: "Respondent Name", type: "text" },
    ];
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [TableViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableViewComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    navigateSpy = spyOn(router, "navigate");
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("ngOnChanges with alert having defined closed date and last activity date", () => {
    const lastActivityOnDate = "2020-05-14T10:41:47.98";
    const closeDate = "2020-05-14T10:41:47.98";
    setData(lastActivityOnDate, closeDate);
    component.ngOnChanges(null);

    expect(component.tableData).toBeDefined();
  });

  it("ngOnChanges with alert having undefined closed date and last activity date", () => {
    const lastActivityOnDate = null;
    const closedDate = null;
    setData(lastActivityOnDate, closedDate);
    component.ngOnChanges(null);

    expect(component.tableData).toBeDefined();
  });

  it("should openAlert run successfully", () => {
    const lastActivityOnDate = null;
    const closedDate = null;
    setData(lastActivityOnDate, closedDate);
    component.openAlert(0);

    expect(navigateSpy).toHaveBeenCalledWith([
      "alert-details",
      component.pipelineId,
      component.alerts[0].id,
    ]);
  });

  it("should sortOnColumn none", () => {
    component.sortedColumnIndex = 2;
    setTableData();

    const returnValue = component.sortOnColumn(1);
    expect(returnValue).toBeUndefined();
  });

  it("should sortOnColumn when desc", () => {
    component.sortedColumnIndex = 2;
    component.orderBy = "desc";
    setTableData();
    const returnValue = component.sortOnColumn(2);
    expect(returnValue).toBeUndefined();
  });

  it("should sortOnColumn when asc", () => {
    component.sortedColumnIndex = 2;
    component.orderBy = "asc";
    setTableData();
    const returnValue = component.sortOnColumn(2);
    expect(returnValue).toBeUndefined();
  });

  it("should sortOnColumn when asc case date", () => {
    component.sortedColumnIndex = 2;
    component.orderBy = "asc";
    setTableData();
    const returnValue = component.sortOnColumn(4);
    expect(returnValue).toBeUndefined();

  });

  it("should sortOnColumn when asc case priority status", () => {
    component.sortedColumnIndex = 1;
    component.orderBy = "asc";
    setTableData();
    const returnValue = component.sortOnColumn(2);
    expect(returnValue).toBeUndefined();
  });

  it("should sortOnColumn when desc case number", () => {
    component.sortedColumnIndex = 1;
    component.orderBy = "desc";
    setTableData();
    const returnValue = component.sortOnColumn(1);
    expect(returnValue).toBeUndefined();
  });
});
