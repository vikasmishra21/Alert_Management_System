import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { ApiPathService } from "./api-path.service";
import { UserService } from "./user.service";
import { AlertMember } from "../classes/alert-member";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(
    private http: HttpClient,
    private apiPath: ApiPathService,
    private userService: UserService
  ) {}

  public getAlertPipelines(): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines`;
    return this.http.get(apiPath);
  }

  public getAlerts(
    alertPipelineId: string | number,
    query: string
  ): Observable<any> {
    let apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines/${alertPipelineId}/alerts`;

    if (query) apiPath += `?${query}`;

    return this.http.get(apiPath);
  }

  public getSurveyTree(treeType): Observable<any> {
    const apiPath = `${
      this.apiPath.baseUrl
    }/projects/${this.userService.getCurrentProjectId()}/variables?$treetype=${treeType}`;

    return this.http.get(apiPath);
  }

  public getAlertDetails(
    alertPipelineId: string | number,
    alertId: string | number
  ): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines/${alertPipelineId}/alerts/${alertId}/activities`;

    return this.http.get(apiPath);
  }

  // public getSelectedVariableOptions(): Observable<any> {
  //   return;
  // }

  public postAlertActivity(
    alertPipelineId: string | number,
    alertId: string | number,
    body: any
  ): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines/${alertPipelineId}/alerts/${alertId}/activities`;

    return this.http.post(apiPath, body);
  }

  public getAlertActivities(
    alertPipelineId: string | number,
    alertId: string | number
  ): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines/${alertPipelineId}/alerts/${alertId}/activities`;

    return this.http.get(apiPath);
  }

  public getUsers(): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/users/subscription/${
      this.userService.getUserInfo().CustomerID
    }/projects/${this.userService.getCurrentProjectId()}`;

    return this.http.get(apiPath);
  }

  public addMembers(
    alertPipelineId: string | number,
    alertId: string | number,
    members: AlertMember[]
  ): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines/${alertPipelineId}/alerts/${alertId}/members`;

    return this.http.post(apiPath, members);
  }

  public getMedianTTC(
    alertPipelineId: string | number,
    tableName: string
  ): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines/${alertPipelineId}/alerts/ttc?$tablename=${tableName}`;

    return this.http.get(apiPath);
  }

  public uploadFile(
    alertPipelineId: string | number,
    alertId: string | number,
    uploadedFile: FormData
  ): Observable<any> {
    return this.http.post(
      `${this.apiPath.baseUrl}/subscription/${
        this.userService.getUserInfo().CustomerID
      }/alertpipelines/${alertPipelineId}/alerts/${alertId}/uploadfile`,
      uploadedFile
    );
  }

  public downloadFile(
    alertPipelineId: string | number,
    alertId: string | number,
    fileName: string
  ): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines/${alertPipelineId}/alerts/${alertId}/downloadfile/${fileName}`;

    return this.http.request("GET", apiPath, {
      responseType: "arraybuffer",
      observe: "response",
    });
  }

  public getFields(
    projectId: string,
    pipelineId: string | number,
    page: string
  ): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/projects/${projectId}/variables/${
      this.userService.getUserInfo().CustomerID
    }/${pipelineId}?$page=${page}`;

    return this.http.get(apiPath);
  }

  public saveFields(fields: any[], page: string): Observable<any> {
    const apiPath = `${
      this.apiPath.baseUrl
    }/projects/${this.userService.getCurrentProjectId()}/variables?$page=${page}`;

    fields.map(
      (x) => (x.SubscriptionId = this.userService.getUserInfo().CustomerID)
    );

    return this.http.post(apiPath, fields);
  }

  public deleteMember(
    alertPipelineId: string | number,
    alertId: string | number,
    memberId: string
  ) {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines/${alertPipelineId}/alerts/${alertId}/members/${memberId}`;

    return this.http.delete(apiPath);
  }

  public getSessionId(respondentId: string | number): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/Projects/${this.userService.getCurrentProjectId()}/hash?rid=${respondentId}`;

    return this.http.get(apiPath);
  }

  public getFilterOptions(filterString: string): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/projects/${this.userService.getCurrentProjectId()}/analysis/filtercascading`;

    let httpHeader = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.post(
      apiPath,
      JSON.stringify(JSON.stringify(filterString)),
      {
        headers: httpHeader,
      }
    );
  }

  public getAlert(
    alertPipelineId: string | number,
    alertId: string | number
  ): Observable<any> {
    const apiPath = `${this.apiPath.baseUrl}/subscription/${
      this.userService.getUserInfo().CustomerID
    }/alertpipelines/${alertPipelineId}/alerts/${alertId}`;

    return this.http.get(apiPath);
  }

  public deleteVariable(
    alertPipelineId: string | number,
    queryString: string
  ): Observable<any> {
    const apiPath = `${
      this.apiPath.baseUrl
    }/projects/${this.userService.getCurrentProjectId()}/variables/${
      this.userService.getUserInfo().CustomerID
    }/${alertPipelineId}/delete?$ids=${queryString}`;

    return this.http.delete(apiPath);
  }
}
