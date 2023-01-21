export enum RoleType {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}
export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface ApplicationParams {
  dataForm: {
    name?: string;
    status?: Status.ACTIVE;
  };
  getData?: () => void;
  closeModal?: () => void;
  openModal?: () => void;
}
export interface ApplicationEditParams {
  dataForm: {
    name?: string;
    status?: Status;
  };
  id: string;
  getData: () => void;
}

export interface DataApllication {
  _id: string;
  name: string;
  status: Status;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export interface ApplicationResponse {
  count: number;
  currentPage: number;
  data: DataApllication[];
  totalPage: number;
}
