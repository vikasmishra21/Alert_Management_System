import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyViewComponent } from './survey-view.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../../services/user.service';
import { ApiPathService } from '../../services/api-path.service';
import { DataService } from '../../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of, throwError } from 'rxjs';

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
  getUserInfo() {
    return userInfo
  }

  setUserInfo(userInfo) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }

  getCurrentProjectId() {
    return localStorage.getItem('projectId');
  }

}

describe('SurveyViewComponent', () => {
  let component: SurveyViewComponent;
  let fixture: ComponentFixture<SurveyViewComponent>;
  const dialogMock = {
    close: () => {}
  };
  let userService: UserServiceMock;
  let dataServiceSpy: jasmine.Spy
  let dataServiceErrSpy: jasmine.Spy
  let dataService: DataService
  let de: DebugElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, MatSnackBarModule, BrowserAnimationsModule],
      declarations: [ SurveyViewComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogMock },
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: (ctx: any, val: string) => val,
            bypassSecurityTrustResourceUrl: (val: string) => val,
          },
        },
        DataService, ApiPathService, UserService
      ]
    })
    .compileComponents();
    userService = new UserServiceMock()
    userService.setUserInfo(userInfo)
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyViewComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dataService = de.injector.get(DataService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have survey data frame url ', () => {
    dataServiceSpy = spyOn(dataService, 'getSessionId').and.returnValue(of('df'))
    component.ngOnInit()
    expect(component.respondentId).toBeDefined()
    expect(dataServiceSpy).toHaveBeenCalled()
    expect(component.showIFrame).toBeDefined()
    expect(component.showIFrame).toBeTruthy()
    expect(component.showProgress).toBeFalsy()
  })

  it('should get error if no survey against the respondent id', () => {
    dataServiceErrSpy = spyOn(dataService, 'getSessionId').and.returnValue(throwError({ status: 500}))
    component.ngOnInit()
    expect(component.respondentId).toBeDefined()
    expect(dataServiceErrSpy).toHaveBeenCalled()
    expect(component.showProgress).toBeFalsy()
  })

  it('should dialog close', () => {
    component.close()
    dialogMock.close()
  })
});
