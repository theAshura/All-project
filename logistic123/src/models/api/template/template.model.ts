export interface Template {
  id: string;
  name: string;
  type: string;
}
export interface TemplateDetail {
  templateName?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  module: string;
  name: string;
  type: string;
  defaultTemplate: string;
  template: string;
  createdUserId?: string;
  companyId?: string;
  handleSuccess?: () => void;
}

export interface ListTemplate {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<Template>;
}

export interface ListTemplateResponse {
  templateName?: string;
  gridTemplates: ListTemplate;
  firstGridTemplateDetail: TemplateDetail;
}

export interface UpdateTemplateParams {
  id: string;
  body: TemplateDetail;
}

export interface ParamsListTemplate {
  page: number;
  pageSize: number;
  content?: string;
}
