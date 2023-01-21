import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  ListAttachmentKitResponse,
  AttachmentKitDetail,
} from 'models/api/attachment-kit/attachment-kit.model';

export interface AttachmentKitStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  attachmentKitDetail: AttachmentKitDetail;
  listAttachmentKit: ListAttachmentKitResponse;
  errorList: ErrorField[];
}
