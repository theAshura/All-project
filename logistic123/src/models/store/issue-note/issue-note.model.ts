import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  checkExitResponse,
  GetIssueNotesResponse,
  IssueNoteDetailResponse,
} from '../../api/issue-note/issue-note.model';

export interface IssueNoteStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  isExistField: checkExitResponse;
  listIssues: GetIssueNotesResponse;
  issueDetail: IssueNoteDetailResponse;
  errorList: ErrorField[];
}
