import {
  ListTemplate,
  TemplateDetail,
} from 'models/api/template/template.model';
import { CommonApiParam, ErrorField } from '../../common.model';

export interface TemplateState {
  loading: boolean;
  listTemplateDictionary: {
    [templateNameWithRecordId: string]: ListTemplate;
  };
  listTemplate: ListTemplate;
  listTemplate2: ListTemplate;
  listTemplate3: ListTemplate;
  listTemplate4: ListTemplate;
  templateDetailDictionary: {
    [templateNameWithRecordId: string]: TemplateDetail;
  };
  templateDetail: TemplateDetail;
  templateDetail2: TemplateDetail;
  templateDetail3: TemplateDetail;
  templateDetail4: TemplateDetail;
  errorList: ErrorField[];
  params: CommonApiParam;
  content: string;
}
