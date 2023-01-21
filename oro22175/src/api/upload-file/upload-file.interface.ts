export interface UploadFileResponse {
  isDelete: boolean;
  createdAt: string;
  fileName: string;
  minetype: string;
  path: string;
  size: number;
  updatedAt: string;
  _id: string;
}

export interface UrlUpload {
  url?: string;
}
export interface FileUploads {
  _id?: string;
  name?: string;
  fileName?: string;
  index?: number;
  isDeleted?: boolean;
  url?: string;
  path?: string;
  originalFile?: File;
  title?: string;
}
