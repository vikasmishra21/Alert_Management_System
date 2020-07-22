export class AlertActivity {
  public id: number;
  public alertID: number;
  public activityDate: string;
  public activityBy: string;
  public activityTypeID: number;
  public originalStatus: number;
  public newStatus: number;
  public originalPriority: number;
  public newPriority: number;
  public forActivityId: number;
  public originallyAssignedTo: string;
  public newAssignedTo: string;
  public note: string;
  public callStatus: number;
  public alertEmailType: number;
  public emailFrom: string;
  public emailTo: string;
  public subject: string;
  public body: string;
  public uploadedFile: string;
  public assignedTo: string;
  public members: any[];
  public membersAffected: string;
}

