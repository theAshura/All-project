import {
  GetAnalysisSectionResponse,
  GetListActivityResponse,
  GetRemarksByDateResponse,
} from 'models/api/home-page/home-page.model';
import { ErrorField } from 'models/common.model';

export interface HomePageStoreModel {
  loading: boolean;
  loadingModal: boolean;
  errorList: ErrorField[];

  listActivity: GetListActivityResponse;
  analysisData: GetAnalysisSectionResponse;
  remarksByDate: GetRemarksByDateResponse;
}
