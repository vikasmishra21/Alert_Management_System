export enum AlertCategory {
  OPEN = 1,
  OVERDUE = 2,
  ALL = 3,
  MEMBER = 4,
  ALL_ALERTS = 5,
}

export enum DateRange {
  NONE = -1,
  TODAY = 1,
  YESTERDAY = 2,
  LAST_7_DAYS = 3,
  CUSTOM = 4,
}

export enum Status {
  NONE = -1,
  NEW = 1,
  WAITING_ON_CUSTOMER = 2,
  WAITING_ON_US = 3,
  CLOSED = 4,
}

export enum Priority {
  NONE = -1,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export enum SortOn {
  NONE = -1,
  CREATED_ON = 1,
  LAST_ACTIVITY = 2,
  PRIORITY = 3,
}

export enum TreeType {
  SYSTEM = 1,
  SURVEY = 2,
  SAMPLE = 3,
  CALCULATED = 4,
}

export enum VariableType {
  SINGLE_CHOICE = 1,
  MULTIPLE_CHOICE = 2,
  TEXT = 3,
  NUMERIC = 4,
  DATE_TIME = 5,
}

export enum ActivityType {
  STATUS = 1,
  ASSIGNMENT = 2,
  NOTE = 3,
  EMAIL = 4,
  CALL = 5,
  UPLOAD = 6,
  PRIORITY = 7,
  ADD_MEMBER = 8,
  DELETE_MEMBER = 9,
}

export enum AlertEmailType {
  AgentReply = 1,
  CustomerResponse = 2,
}

export enum CallStatus {
  ANSWERED = 1,
  NOT_AVAILABLE = 2,
  DID_NOT_ANSWER = 3,
  VOICE_MAIL = 4,
  DISCONNECTED = 5,
}
