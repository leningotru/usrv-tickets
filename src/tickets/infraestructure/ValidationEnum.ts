export enum PriorityEnum {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
  }
  export enum StatusEnum {
    PENDING = "pending",
    VERIFIED = "verified",
    APPROVED = "approved",
    REJECTED = "rejected",
  }
  export enum CategoryEnum {
    INCIDENT = "incident",
    SUPPORT = "support",
    ERROR = "error",
  }
  
  export const CategoryMapping = {
    [CategoryEnum.INCIDENT]: 1,
    [CategoryEnum.SUPPORT]: 2,
    [CategoryEnum.ERROR]: 3,
  };