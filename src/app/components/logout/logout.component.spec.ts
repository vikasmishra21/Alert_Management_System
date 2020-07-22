import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';


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
}

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let mockUserService: UserServiceMock;
  let de: DebugElement;
  let navigateSpy: jasmine.Spy;
  let authServiceSpy: jasmine.Spy;
  let authService: AuthService;
  let router: Router;
  let userService: UserServiceMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ LogoutComponent ],
      providers: [AuthService, UserServiceMock]
    })
    .compileComponents();
    userService = new UserServiceMock()
    userService.setUserInfo(userInfo)
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    authService = de.injector.get(AuthService);
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('initial state to get username', () => {
    
    component.username = userService.getUserInfo().username
    expect(component.username).not.toBe('')
  })
  
  it('should logout and navigate to login component', () => {
    authServiceSpy = spyOn(authService, 'logout')
    navigateSpy = spyOn(router, "navigate");
    component.logout()
    expect(authServiceSpy).toHaveBeenCalled()
    expect(navigateSpy).toHaveBeenCalledWith(["login"]);
  })
});
