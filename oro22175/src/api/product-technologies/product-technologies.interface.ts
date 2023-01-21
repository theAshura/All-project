export interface ProductTectnologiesRequest {
  literature: { file: string; title: string }[];
  videos: string[];
}
export interface ProductTectnologiesResponse {
  _id: string;
  literature: { file: FileUploadResponse; title: string }[];
  videos: FileUploadResponse[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FileUploadResponse {
  _id: string;
  fileName: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
