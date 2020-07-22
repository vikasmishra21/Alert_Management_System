import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PhoneCallComponent } from "./phone-call.component";
import { AlertNotificationService } from "src/app/services/alert-notification.service";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DebugElement } from "@angular/core";
import { of } from "rxjs/internal/observable/of";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

describe("PhoneCallComponent", () => {
  let component: PhoneCallComponent;
  let fixture: ComponentFixture<PhoneCallComponent>;
  let de: DebugElement;
  let alertNotificationService: AlertNotificationService;
  let alertNotificationResSpy: jasmine.Spy;
  let alertNotificationErrSpy: jasmine.Spy;

  const dialogMock = {
    close: () => {},
    updatePosition: (obj) => {},
    afterClosed: () => of(true),
  };

  const dataMock = {
    respondentPhone: "12345678900",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule],
      declarations: [PhoneCallComponent],
      providers: [
        AlertNotificationService,
        ConfirmDialogComponent,
        { provide: MatDialog, useValue: {} },
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
    fixture = TestBed.createComponent(PhoneCallComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    alertNotificationService = de.injector.get(AlertNotificationService);
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should call respondent be true", () => {
    component.callRespondent();
  });

  it("should onDialogSave return error if note is empty", () => {
    component.callDetails.status = 2;
    component.callDetails.note = " ";
    component.onDialogSave();

    expect(component.displayError).toBe(true);
  });

  it("should onDialogSave save if status is defined", () => {
    component.callDetails.status = 2;
    component.callDetails.note = "Test";
    component.onDialogSave();

    expect(component.displayError).toBe(false);
    dialogMock.close();
  });

  it("should onDialogCancel not call alertNotificationService", () => {
    component.callDetails.note = "";
    component.onDialogCancel();
    dialogMock.close();
  });

  // it("should onDialogCancel call alertNotificationService", () => {
  //   component.callDetails.note = "test";
  //   component.onDialogCancel();
  // });
});
