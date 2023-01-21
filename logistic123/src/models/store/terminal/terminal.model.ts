import {
  GetTerminalResponse,
  TerminalDetailResponse,
} from 'models/api/terminal/terminal.model';
import { CommonApiParam, ErrorField } from 'models/common.model';

export interface TerminalStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listTerminal: GetTerminalResponse;
  terminalDetail: TerminalDetailResponse;
  errorList: ErrorField[];
}
