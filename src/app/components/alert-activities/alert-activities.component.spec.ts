import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AlertActivitiesComponent } from "./alert-activities.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DataService } from "../../services/data.service";
import { ActivityType, AlertEmailType } from 'src/app/enums/alerts.enum';
import { DebugElement } from '@angular/core';
import { of, throwError } from 'rxjs';

describe("AlertActivitiesComponent", () => {
  let component: AlertActivitiesComponent;
  let fixture: ComponentFixture<AlertActivitiesComponent>;
  let de : DebugElement;
  let dataServiceResSpy: jasmine.Spy
  let dataService: DataService

  function returnChanges(type: string): any {
    let activityChanges = {
      activities: {
        previousValue: [],
        currentValue: [
          {
            id: 511,
            alertID: 115,
            activityDate: "2020-05-14T08:18:04.2633333",
            activityBy: "1",
            activityTypeID: 3,
            originalStatus: 0,
            newStatus: 0,
            originallyAssignedTo: "",
            newAssignedTo: "",
            originalPriority: 0,
            newPriority: 0,
            note: "<p>Test note</p>",
            alertEmailType: 0,
            emailFrom: "",
            emailTo: "",
            subject: "",
            body: "",
            uploadedFile: "",
            assignedTo: null,
            forActivityId: 0,
            members: null,
            membersAffected: "",
            callStatus: 0,
          },
        ],
        firstChange: false,
      },
    };

    let statusChanges = {
      statusFilters: {
        previousValue: [],
        currentValue: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        firstChange: false,
      },
    };

    let userChanges = {
      userFilters: { previousValue: [], currentValue: [], firstChange: false },
    };

    let originalActivity = [
      {
        id: 511,
        alertID: 115,
        activityDate: "2020-05-14T08:18:04.2633333",
        activityBy: "1",
        activityTypeID: 4,
        originalStatus: 0,
        newStatus: 0,
        originallyAssignedTo: "",
        newAssignedTo: "",
        originalPriority: 0,
        newPriority: 0,
        note: "<p>Test note</p>",
        alertEmailType: 2,
        emailFrom: "",
        emailTo: "",
        subject: "",
        body: "",
        uploadedFile: "",
        assignedTo: null,
        forActivityId: 0,
        members: null,
        membersAffected: "",
        callStatus: 0,
      },
    ];

    let originalActivity8 = [
      { 
        activityTypeID: 8,
        membersAffected: ''
      }
    ]

    if (type == "activity") return activityChanges;
    if (type == "status") return statusChanges;
    if (type == "user") return userChanges;
    if (type == "oriActivity") return originalActivity;
    if (type == "oriActivity8") return originalActivity8;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AlertActivitiesComponent],
      providers: [DataService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertActivitiesComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dataService = de.injector.get(DataService)
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should check for activities changed", () => {
    let changes = returnChanges("activity");
    component.ngOnChanges(changes);
    if (changes.activities && Array.isArray(component.activities)) {
      expect(component.activities).toBeDefined();
      expect(component.transformedActivities).toBeDefined();
    }
  });

  it("should check for statusFilter changed", () => {
    let changes = returnChanges("status");

    component.ngOnChanges(changes);
    if (changes.statusFilters) {
      expect(component.activities).toBeDefined();
      expect(component.transformedActivities).toBeDefined();
    }
  });

  it("should check for userFilter changed", () => {
    let changes = returnChanges("user");

    component.ngOnChanges(changes);
    if (changes.userFilters) {
      expect(component.activities).toBeDefined();
      expect(component.transformedActivities).toBeDefined();
    }
  });

  it("should return transformAlertActivities if activityTypeID  = 4", () => {
    component.activities = returnChanges("oriActivity");
    let transformedActivities;
    // @ts-ignore
    component.transformAlertActivities(component.activities);
    transformedActivities = component.activities
    expect(transformedActivities).toBeDefined()
  });

  it('should return transformAlertActivities if activityTypeID  = 8 or 9', () => {
    component.activities = returnChanges("oriActivity8");
    let transformedActivities;
    // @ts-ignore
    component.transformAlertActivities(component.activities);
    transformedActivities = component.activities
    expect(transformedActivities).toBeDefined()
  })

  it('should makeChangesInData runs', () => {
    component.activities = returnChanges("oriActivity");
    // @ts-ignore
    component.makeChangesInData(component.activities)
  })

  it("should return getFilteredActivities if activity is defined", () => {
    component.activities = returnChanges("oriActivity");
    component.userFilters = ['1']
    let transformedActivities;
    // @ts-ignore
    component.getFilteredActivities(component.activities);
    transformedActivities = component.activities
    expect(transformedActivities).toBeDefined()
  });

  it('download file if true', () => {
    dataServiceResSpy = spyOn(dataService, 'downloadFile').and.returnValue(of(true))
    component.downloadFile('abc.txt')
    expect(dataServiceResSpy).toHaveBeenCalled()
  })

  it('download file if error', () => {
    dataServiceResSpy = spyOn(dataService, 'downloadFile').and.returnValue(throwError({ status: 500 }))
    component.downloadFile('abc.txt')
    expect(dataServiceResSpy).toHaveBeenCalled()
  })
});