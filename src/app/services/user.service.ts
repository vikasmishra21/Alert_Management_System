import { Injectable } from "@angular/core";
import { IProjectInfo } from "../interfaces/project-info";
import { IUserInfo } from "../interfaces/user-info";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private userInfo: IUserInfo | null = null;
  private projectInfo: { [key: string]: IProjectInfo } = {};
  private currentProjectId: string;
  private storageKey = "userInfo";
  private projectInfoStorageKey = "projectInfo";
  private projectIdStorageKey = "projectId";

  constructor() {
    let userInfo = localStorage.getItem(this.storageKey);
    let currentProjectId = localStorage.getItem(this.projectIdStorageKey);
    let projectInfo = localStorage.getItem(this.projectInfoStorageKey);

    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }

    if (currentProjectId) {
      this.currentProjectId = currentProjectId;
    }

    if (projectInfo) {
      this.projectInfo = JSON.parse(projectInfo);
    }
  }

  public setUserInfo(userInfo: IUserInfo): void {
    this.userInfo = userInfo;
    this.saveUserInfo(this.userInfo);
  }

  public getUserInfo(): IUserInfo {
    return this.userInfo;
  }

  private saveUserInfo(userInfo): void {
    localStorage.setItem(this.storageKey, JSON.stringify(userInfo));
  }

  public removeUserInfo(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.projectInfoStorageKey);
    localStorage.removeItem(this.projectIdStorageKey);

    this.userInfo = null;
    this.projectInfo = {};
    this.currentProjectId = "";
  }

  public setCurrentProjectId(projectId: string): void {
    this.currentProjectId = projectId;
    localStorage.setItem(this.projectIdStorageKey, this.currentProjectId);
  }

  public getCurrentProjectId(): string {
    return this.currentProjectId;
  }

  public setProjectInfo(projectInfo: IProjectInfo): void {
    this.projectInfo[projectInfo.Guid] = projectInfo;
    localStorage.setItem(
      this.projectInfoStorageKey,
      JSON.stringify(this.projectInfo)
    );
  }

  public getProjectInfo(projectId: string): IProjectInfo {
    return this.projectInfo[projectId];
  }
}
