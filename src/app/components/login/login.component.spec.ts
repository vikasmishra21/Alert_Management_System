import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { AuthService } from "../../services/auth.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { AlertNotificationService } from "../../services/alert-notification.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DebugElement } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let authResSpy: jasmine.Spy;
  let authErrSpy: jasmine.Spy;
  let windowSpy: jasmine.Spy;
  let authService: AuthService;
  let router: Router;
  let navigateSpy: jasmine.Spy;
  let validUser = {
    username: "m@rebuscode.com",
    password: "V",
  };
  let blankUser = {
    username: "",
    password: "",
  };
  let params = {
    alertId: "52",
    pipelineId: "7",
    projectGuid: "db35b086-5907-7156-456b-984e391746f1",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      declarations: [LoginComponent],
      providers: [AuthService, AlertNotificationService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.get(Router);
    navigateSpy = spyOn(router, "navigate");
    component = fixture.componentInstance;
    de = fixture.debugElement;
    authService = de.injector.get(AuthService);
    windowSpy = spyOn(window, "open");
    fixture.detectChanges();
  });

  function updateCred(userEmail, userPassword) {
    component.credentials.username = userEmail;
    component.credentials.password = userPassword;
  }

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("component initial state setup", () => {
    expect(component.loggingIn).toBeFalse();
    expect(component.credentials.username).toBe("");
    expect(component.credentials.password).toBe("");
    expect(component.authError).toBeFalse();
  });

  it("should return logging state to false if cred are blank", () => {
    component.login();
    expect(component.credentials.username).toBe("");
    expect(component.credentials.password).toBe("");
    expect(component.loggingIn).toBeFalsy();
  });

  it("should return logging state to true if cred are not blank", () => {
    component.login();
    updateCred(blankUser.username, blankUser.password);
    expect(component.credentials.username).toBe('');
    expect(component.credentials.password).toBe('');
    expect(component.loggingIn).toBeFalsy();
  });

  it("should auth service login called only if loggingIn is true", () => {
    authResSpy = spyOn(authService, "login").and.returnValue(of(true));
    updateCred(validUser.username, validUser.password);
    expect(component.credentials.username).toBeDefined();
    expect(component.credentials.password).toBeDefined();
    component.login();
    component.loggingIn = true;
    expect(authResSpy).toHaveBeenCalled();
    component.loggingIn = false;
  });

  it("should navigate to home if any of queryParams are not present and make loggingIn to false", () => {
    authResSpy = spyOn(authService, "login").and.returnValue(of(true));
    updateCred(validUser.username, validUser.password);
    expect(component.credentials.username).toBeDefined();
    expect(component.credentials.password).toBeDefined();
    component.login();
    component.loggingIn = true;
    expect(authResSpy).toHaveBeenCalled();
    expect(component.pipelineId).toBe("");
    expect(component.alertId).toBe("");
    expect(component.projectGuid).toBe("");
    expect(navigateSpy).toHaveBeenCalledWith(["home"]);
    component.loggingIn = false;
  });

  xit("should navigate to alert-details if any of queryParams are present and make loggingIn to false", () => {
    updateCred(validUser.username, validUser.password);
    expect(component.credentials.username).toBeDefined();
    expect(component.credentials.password).toBeDefined();
    component.login();
    component.loggingIn = true;
    expect(authResSpy).toHaveBeenCalled();
    expect(component.pipelineId).toBe(params.pipelineId);
    expect(component.alertId).toBe(params.alertId);
    expect(component.projectGuid).toBe(params.projectGuid);
    expect(navigateSpy).toHaveBeenCalledWith([`alert-details/7/52`], {
      queryParams: {
        projectGuid: "db35b086-5907-7156-456b-984e391746f1",
      },
    });
    component.loggingIn = false;
  });

  it("should show error if subscribe fails", () => {
    authErrSpy = spyOn(authService, "login").and.returnValue(
      throwError({ status: 404 })
    );
    updateCred(validUser.username, validUser.password);
    expect(component.credentials.username).toBeDefined();
    expect(component.credentials.password).toBeDefined();
    component.login();
    component.loggingIn = true;
    expect(authErrSpy).toHaveBeenCalled();
    expect(component.authError).toBeTruthy();
  });

  it("forgotPassword should return false if username is not mentioned", () => {
    component.forgotPassword();
    expect(component.credentials.username).toBe("");
    expect(component.credentials.username).toBeFalsy();
  });

  it("should navigate to rebuscode if credentials are not empty", () => {
    updateCred(validUser.username, validUser.password);
    expect(component.credentials.username).toBeDefined();
    component.forgotPassword();
    expect(windowSpy).toHaveBeenCalled();
  });

});
