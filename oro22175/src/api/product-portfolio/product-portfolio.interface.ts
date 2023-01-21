export interface ProductPortfolioRequest {
  literature: string;
}
export interface ProductPortfolioResponse {
  _id: string;
  literature: FileUploadResponse;
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
