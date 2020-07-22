import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AlertBoxComponent } from "./alert-box.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AlertStateService } from "../../services/alert-state.service";
import { Router } from "@angular/router";
import { Status } from '../../enums/alerts.enum';

describe("AlertBoxComponent", () => {
  let component: AlertBoxComponent;
  let fixture: ComponentFixture<AlertBoxComponent>;
  let router: Router;
  let navigateSpy: jasmine.Spy;
  let alerts = {
    id: 116,
    respondentName: "ashish",
    status: 1,
    openedOn: "2020-04-23T18:23:05",
    lastActivityOn: "2020-05-14T07:08:42.4466667",
    priority: 3,
    assignedTo: "brahmansh.k@rebuscode.com",
    closedDate: null,
    showNotification: false,
    expired: false,
    alertMembers: [
      {
        id: 329,
        alertId: 116,
        member: "ashish.p@rebuscode.com",
        memberName: "Ashish Pandey",
      },
      {
        id: 332,
        alertId: 116,
        member: "Amsuser@rebuscode.com",
        memberName: "Amsuser suser",
      },
      {
        id: 333,
        alertId: 116,
        member: "brahmansh.k@rebuscode.com",
        memberName: "brahmansh Kaushal",
      },
    ],
    fields: { RespondentID: "30", v2: "1", v3: "Detractor", v5: "blue" },
    respondentEmail: "ashish.p@rebuscode.com",
    respondentPhone: "234",
    tableName: "amsbrahmansh.k148346",
  };

  let status = {
    "1": "NEW",
    "2": "WAITING_ON_CUSTOMER",
    "3": "WAITING_ON_US",
    "4": "CLOSED",
    NONE: -1,
    "-1": "NONE",
    NEW: 1,
    WAITING_ON_CUSTOMER: 2,
    WAITING_ON_US: 3,
    CLOSED: 4,
  };
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AlertBoxComponent],
      providers: [AlertStateService],
    }).compileComponents();
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(AlertBoxComponent);
    router = TestBed.get(Router);
    navigateSpy = spyOn(router, 'navigate');
    component = fixture.componentInstance;
    component.alert = alerts
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("init state if alert has its values", () => {
    expect(component.alert).toBeDefined();
    let openedOn = new Date(component.alert.openedOn);
    let newopenedOn = openedOn.toLocaleDateString('en-US')
    component.transformedAlertProperties.openedOn = newopenedOn
    expect(component.transformedAlertProperties.openedOn).toBe(newopenedOn)
  });

  it("init state if alert has its values but alert status is closed", () => {
    // component.alert.openedOn = alerts.openedOn
    component.alert.status = 4
    let openedOn = new Date(component.alert.openedOn);
    let newopenedOn = openedOn.toLocaleDateString('en-US')
    component.transformedAlertProperties.openedOn = newopenedOn
    expect(component.transformedAlertProperties.openedOn).toBe(newopenedOn)
    // expect(component.alert.status).toBe(Status.CLOSED)
  });

  it("init state if alert has its values but openedOn date is not present", () => {
    component.alert.openedOn = null
    component.transformedAlertProperties.openedOn = 'Never'
    expect(component.transformedAlertProperties.openedOn).toBe('Never')
  });

  it("init state if alert has its values but lastActivityOn date is not present", () => {
    component.alert.lastActivityOn = null
    component.transformedAlertProperties.lastActivityOn = 'Never'
    expect(component.transformedAlertProperties.lastActivityOn).toBe('Never')
  });

  it('should openAlert run successfully', () => {    
    component.openAlert()
    expect(navigateSpy).toHaveBeenCalledWith(['alert-details', component.pipelineId, component.id]);
  })
});
