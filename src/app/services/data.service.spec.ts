import { TestBed } from "@angular/core/testing";

import { DataService } from "./data.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AlertMember } from "../classes/alert-member";
import { UserService } from './user.service';

describe("DataService", () => {
  let service: DataService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DataService);
    let userService = new UserService();
    userService.setUserInfo(userInfo);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should getAlertPipelines return api call", () => {
    const returnValue = service.getAlertPipelines();

    expect(returnValue).toBeDefined();
  });

  it("should getAlerts return api call", () => {
    const returnValue = service.getAlerts("", "testquery");

    expect(returnValue).toBeDefined();
  });

  it("should getSurveyTree return api call", () => {
    const returnValue = service.getSurveyTree(2);

    expect(returnValue).toBeDefined();
  });

  it("should getAlertDetails return api call", () => {
    const returnValue = service.getAlertDetails("", "");

    expect(returnValue).toBeDefined();
  });

  it("should postAlertActivity return api call", () => {
    const returnValue = service.postAlertActivity("", "", "");

    expect(returnValue).toBeDefined();
  });

  it("should getAlertActivities return api call", () => {
    const returnValue = service.getAlertActivities("", "");

    expect(returnValue).toBeDefined();
  });

  it("should getUsers return api call", () => {
    const returnValue = service.getUsers();

    expect(returnValue).toBeDefined();
  });

  it("should addMembers return api call", () => {
    // const member = new AlertMember()
    const returnValue = service.addMembers("", "", []);

    expect(returnValue).toBeDefined();
  });

  it("should getMedianTTC return api call", () => {
    // const member = new AlertMember()
    const returnValue = service.getMedianTTC("", "");

    expect(returnValue).toBeDefined();
  });

  it("should uploadFile return api call", () => {
    const file = new FormData();
    const returnValue = service.uploadFile("", "", file);

    expect(returnValue).toBeDefined();
  });

  it("should downloadFile return api call", () => {
    const returnValue = service.downloadFile("", "", "");

    expect(returnValue).toBeDefined();
  });

  it("should getFields return api call", () => {
    const returnValue = service.getFields("", "", "");

    expect(returnValue).toBeDefined();
  });

  it("should saveFields return api call", () => {
    const returnValue = service.saveFields([{},{}], "");

    expect(returnValue).toBeDefined();
  });

  it("should deleteMember return api call", () => {
    const returnValue = service.deleteMember("", "", "");

    expect(returnValue).toBeDefined();
  });

  it("should getSessionId return api call", () => {
    const returnValue = service.getSessionId("");

    expect(returnValue).toBeDefined();
  });

  it("should getFilterOptions return api call", () => {
    const returnValue = service.getFilterOptions("");

    expect(returnValue).toBeDefined();
  });

  it("should getAlert return api call", () => {
    const returnValue = service.getAlert("", "");

    expect(returnValue).toBeDefined();
  });

  it("should deleteVariable return api call", () => {
    const returnValue = service.deleteVariable("", "");

    expect(returnValue).toBeDefined();
  });
});
