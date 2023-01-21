import { ModalProps } from 'reactstrap';
import { PlanningAndRequest } from 'models/api/planning-and-request/planning-and-request.model';
import moment from 'moment';
import { MAIL_TYPES_IDS } from 'constants/planning-and-request.const';
import {
  MENTIONS,
  MENTION_MODULE_PLANNING,
  MENTION_MODULE_INSPECTION_REPORT,
  MENTION_MODULE_INSPECTION_FOLLOW_UP,
  MENTION_MODULE_REPORT_OF_FINDING,
  MENTION_TIME,
} from 'constants/common.const';

export const InputMails = {
  TO: 'to',
  CC: 'cc',
  BCC: 'bcc',
};

const MENTIONS_DATA_DATE = [
  '@DLI',
  '@DD',
  '@FPETA',
  '@FPETD',
  '@TPETA',
  '@TPETD',
  '@PFD',
  '@PTD',
];

const MAX_TIME = 1000;

export const getTextInHTML = (dataHTML: string) =>
  dataHTML
    ?.replace(/<[^>]+>/g, '')
    ?.replaceAll('&nbsp;', ' ')
    ?.trim() || '';

const convertDataDate = (
  idMention: string,
  dataMention: string,
  data: string,
) => {
  const dataArr = data?.split('</span>');
  const lengthData = dataArr?.length;
  for (let i = 0; i < lengthData; i += 1) {
    // eslint-disable-next-line no-useless-escape
    const hasMention = dataArr[i].includes(`data-mention=\"${idMention}\"`);
    const hasCheckTime = i < lengthData - 1;

    if (hasMention && hasCheckTime) {
      let typeTime;
      MENTION_TIME.forEach((time) => {
        // eslint-disable-next-line no-useless-escape
        const hasTime = dataArr[i + 1].includes(`data-mention=\"${time.id}\"`);
        if (hasTime) {
          typeTime = time.id.slice(1).toString() || 'days';
        }
      });

      if (typeTime) {
        const valueArr = dataArr[i + 1]
          .split('<span')?.[0]
          ?.replaceAll('&nbsp;', '');
        const countAdd = valueArr.split('+').length - 1;
        const countSub = valueArr.split('-').length - 1;
        if ((countAdd === 1 && !countSub) || (!countAdd && countSub === 1)) {
          const valueTime = countAdd
            ? valueArr.split('+')?.[1]
            : valueArr.split('-')?.[1];
          const valueTimeNumber = Number(valueTime?.trim());
          if (
            valueTimeNumber >= 0 &&
            dataMention &&
            valueTimeNumber <= MAX_TIME
          ) {
            let resultDate;
            if (!countAdd) {
              resultDate = moment(dataMention, 'DD/MM/YYYY')
                .subtract(valueTimeNumber, typeTime)
                ?.format('DD/MM/YYYY');
            } else {
              resultDate = moment(dataMention, 'DD/MM/YYYY')
                .add(valueTimeNumber, typeTime)
                ?.format('DD/MM/YYYY');
            }
            dataArr[i] = dataArr[i].replaceAll(`${idMention}`, resultDate);
            dataArr[i + 1] = '<span>';
            // eslint-disable-next-line no-continue
            continue;
          }
        }
      }
    }
  }
  return dataArr.join('</span>');
};

export const convertDataMention = (
  subject: string,
  data: PlanningAndRequest,
  mailType?: number,
) => {
  let dataMention = subject || '';
  let dataMentions = [];
  switch (mailType) {
    case MAIL_TYPES_IDS.PLANNING_AND_REQUEST:
      dataMentions = MENTION_MODULE_PLANNING;
      break;
    case MAIL_TYPES_IDS.INSPECTION_REPORT:
      dataMentions = MENTION_MODULE_INSPECTION_REPORT;
      break;
    case MAIL_TYPES_IDS.INSPECTION_FLOW_UP:
      dataMentions = MENTION_MODULE_INSPECTION_FOLLOW_UP;
      break;
    case MAIL_TYPES_IDS.REPORT_OF_FINDING:
      dataMentions = MENTION_MODULE_REPORT_OF_FINDING;
      break;
    default:
      dataMentions = MENTION_MODULE_PLANNING;
  }
  const mentionData = MENTIONS.map((i) => {
    let content = '';

    switch (i.id) {
      case '@VSM': {
        content = dataMentions.some((i) => i.id === '@VSM')
          ? data?.vesselManagerList
          : i.id;
        break;
      }
      case '@INN': {
        content = dataMentions.some((i) => i.id === '@INN')
          ? data?.auditNo
          : i.id;
        break;
      }
      case '@AFP': {
        content = dataMentions.some((i) => i.id === '@AFP')
          ? data?.fromPort?.name
          : i.id;
        break;
      }
      case '@ATP': {
        content = dataMentions.some((i) => i.id === '@ATP')
          ? data?.toPort?.name
          : i.id;
        break;
      }

      case '@LIN': {
        content = dataMentions.some((i) => i.id === '@LIN')
          ? data?.leadAuditorList
          : i.id;
        break;
      }
      case '@ISN': {
        content = dataMentions.some((i) => i.id === '@ISN')
          ? data?.auditorList
          : i.id;
        break;
      }
      case '@ETT': {
        content = dataMentions.some((i) => i.id === '@ETT')
          ? data?.entityType
          : i.id;
        break;
      }
      case '@VSN': {
        content = dataMentions.some((i) => i.id === '@VSN')
          ? data?.vessel?.name
          : i.id;
        break;
      }
      case '@VST': {
        content = dataMentions.some((i) => i.id === '@VST')
          ? data.vessel?.vesselType?.name
          : i.id;
        break;
      }
      case '@FLN': {
        content = dataMentions.some((i) => i.id === '@FLN')
          ? data.vessel?.fleetName
          : i.id;
        break;
      }
      case '@VIT': {
        content = dataMentions.some((i) => i.id === '@VIT')
          ? data?.typeOfAudit
          : i.id;
        break;
      }
      case '@IST': {
        content = dataMentions.some((i) => i.id === '@IST')
          ? data?.auditTypes?.map((i) => i?.name)?.join(', ')
          : i.id;
        break;
      }
      case '@DLI': {
        const contentDLI = data?.dateOfLastInspection
          ? moment(data?.dateOfLastInspection)?.local()?.format('DD/MM/YYYY')
          : '';
        content = dataMentions.some((i) => i.id === '@DLI') ? contentDLI : i.id;
        break;
      }
      case '@DD': {
        const contentDD = data?.dueDate
          ? moment(data?.dueDate)?.local()?.format('DD/MM/YYYY')
          : '';
        content = dataMentions.some((i) => i.id === '@DD') ? contentDD : i.id;
        break;
      }
      case '@WT': {
        content = dataMentions.some((i) => i.id === '@WT')
          ? data?.workingType
          : i.id;
        break;
      }
      case '@FRP': {
        content = dataMentions.some((i) => i.id === '@FRP')
          ? data?.fromPort?.name
          : i.id;
        break;
      }
      case '@FPETA': {
        const contentFPETA = data?.fromPortEstimatedTimeArrival
          ? moment(data?.fromPortEstimatedTimeArrival)
              ?.local()
              ?.format('DD/MM/YYYY')
          : '';
        content = dataMentions.some((i) => i.id === '@FPETA')
          ? contentFPETA
          : i.id;
        break;
      }
      case '@FPETD': {
        const contentFPETD = data?.fromPortEstimatedTimeDeparture
          ? moment(data?.fromPortEstimatedTimeDeparture)
              ?.local()
              ?.format('DD/MM/YYYY')
          : '';
        content = dataMentions.some((i) => i.id === '@FPETD')
          ? contentFPETD
          : i.id;
        break;
      }
      case '@TP': {
        content = dataMentions.some((i) => i.id === '@TP')
          ? data?.toPort?.name
          : i.id;
        break;
      }
      case '@TPETA': {
        const contentTPETA = data?.toPortEstimatedTimeArrival
          ? moment(data?.toPortEstimatedTimeArrival)
              ?.local()
              ?.format('DD/MM/YYYY')
          : '';
        content = dataMentions.some((i) => i.id === '@TPETA')
          ? contentTPETA
          : i.id;
        break;
      }
      case '@TPETD': {
        const contentTPETD = data?.toPortEstimatedTimeDeparture
          ? moment(data?.toPortEstimatedTimeDeparture)
              ?.local()
              ?.format('DD/MM/YYYY')
          : '';
        content = dataMentions.some((i) => i.id === '@TPETD')
          ? contentTPETD
          : i.id;
        break;
      }
      case '@PFD': {
        const contentPFD = data?.plannedFromDate
          ? moment(data?.plannedFromDate)?.local()?.format('DD/MM/YYYY')
          : '';
        content = dataMentions.some((i) => i.id === '@PFD') ? contentPFD : i.id;
        break;
      }
      case '@PTD': {
        const contentPTD = data?.plannedToDate
          ? moment(data?.plannedToDate)?.local()?.format('DD/MM/YYYY')
          : '';
        content = dataMentions.some((i) => i.id === '@PTD') ? contentPTD : i.id;
        break;
      }
      case '@NOI': {
        content = dataMentions.some((i) => i.id === '@NOI')
          ? data?.auditors?.map((i) => i?.username).join(', ')
          : i.id;
        break;
      }
      case '@NLI': {
        content = dataMentions.some((i) => i.id === '@NLI')
          ? data?.leadAuditor?.username
          : i.id;
        break;
      }
      case '@MEM': {
        content = dataMentions.some((i) => i.id === '@MEM') ? data?.memo : i.id;
        break;
      }
      default:
        content = '';
    }
    return { ...i, content: content || '' };
  });

  mentionData.forEach((item) => {
    const hasMention = dataMention?.includes(`${item.id}`);
    if (hasMention) {
      const hasMentionDate = MENTIONS_DATA_DATE.includes(item.id);
      if (hasMentionDate) {
        dataMention = convertDataDate(item.id, item?.content, dataMention);
      }
      dataMention = dataMention.replaceAll(`${item.id}`, item?.content);
    }
  });
  dataMention = dataMention.replaceAll(`class="mention"`, '');
  return dataMention;
};
export interface ModalSendValues {
  mailSendId?: string;
  senderEmail?: string;
  mailTemplateId?: string;
  to: any[];
  cc: any[];
  bcc: any[];
  sub: string;
  body: string;
  status?: string;
  attachments: any[];
}

export const defaultValues: ModalSendValues = {
  mailSendId: '',
  senderEmail: '',
  mailTemplateId: null,
  to: [],
  cc: [],
  bcc: [],
  sub: '',
  body: '',
  status: '',
  attachments: [],
};

export interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  classesName?: string;
  planningRequestId?: string;
  modalType?: string;
  onChangeModalType?: (type: string) => void;
  attachmentIdsPlanning?: string[];
  entityType?: string;
  vesselTypeId?: string;
  workingType?: string;
  zipFileName?: string;
  planningAndRequestDetail: PlanningAndRequest;
  exportApi?: () => any;
}
