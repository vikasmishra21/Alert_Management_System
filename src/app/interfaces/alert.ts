export interface IAlert {
  id: number;
  respondentName: string;
  status: number;
  openedOn: string;
  respondentPhone: string;
  lastActivityOn: string;
  priority: number;
  assignedTo: string;
  closedDate: string;
  showNotification: boolean;
  expired: boolean;
  alertMembers: any[];
  fields: any;
  tableName: string;
}
