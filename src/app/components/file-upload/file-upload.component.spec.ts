import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FileUploadComponent } from "./file-upload.component";
import { AlertNotificationService } from "src/app/services/alert-notification.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { of, throwError } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { OverlayRef } from "@angular/cdk/overlay";
import { UserService } from "src/app/services/user.service";

describe("FileUploadComponent", () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let de: DebugElement;
  let dataService: DataService;
  let dataServiceResSpy: jasmine.Spy;
  let dataServiceErrSpy: jasmine.Spy;
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

  let alertNotification: AlertNotificationService;

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
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [FileUploadComponent],
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
    userService = new UserService();
    userService.setUserInfo(userInfo);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dataService = de.injector.get(DataService);
    alertNotification = de.injector.get(AlertNotificationService);
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  xit("should onFileUpload work", () => {
    let event: Event;
    component.onFileUpload(event);
    expect(component.fileToUpload).toBeDefined();
  });

  it("should uploadFile return true", () => {
    dataServiceResSpy = spyOn(dataService, "uploadFile").and.returnValue(
      of(true)
    );
    let file: File = new File([], "test");
    component.fileToUpload = file;

    component.uploadFile();
    expect(dataServiceResSpy).toHaveBeenCalled();
    dialogMock.close();
  });

  it("should uploadFile return false", () => {
    dataServiceErrSpy = spyOn(dataService, "uploadFile").and.returnValue(
      throwError({ status: 500 })
    );
    let mockFile: File = new File([], "test");
    component.fileToUpload = mockFile;

    component.uploadFile();
    expect(dataServiceErrSpy).toHaveBeenCalled();
  });

  it("should onDialogCancel not call alertNotification", () => {
    component.onDialogCancel();
    dialogMock.close();
  });
});
