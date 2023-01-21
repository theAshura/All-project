import {
  createContext,
  useState,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  Item,
  ItemStatus,
  StepStatus,
} from 'components/common/step-line/lineStepCP';
import { UploadResponsive } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { UserRecord } from 'models/api/user/user.model';
import { updateInternalAuditReportPermissionDetailActionsApi } from 'api/internal-audit-report.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { useParams } from 'react-router-dom';
import uniq from 'lodash/uniq';
import { Image } from 'models/api/support.model';
import {
  AdditionalReviewerSection,
  NonConformity,
  IReportFindingForm,
  IARReportHeaderDescriptions,
  StaticFindingItems,
  StaticFindingItemManual,
  PreviousInternalAuditReport,
} from 'models/api/internal-audit-report/internal-audit-report.model';
import { AppRouteConst } from 'constants/route.const';
import { useSelector } from 'react-redux';
import history from 'helpers/history.helper';
import { ViqResponse } from 'models/api/viq/viq.model';
import { DepartmentMaster } from 'models/api/department-master/department-master.model';
import { MainCategory } from 'models/api/main-category/main-category.model';
import { ActivePermission, IARReviewPermission } from 'constants/common.const';

export enum ReportHeaderTopics {
  SMS = 'Safety management system related',
  OVERVIEW = 'Overview',
  IHAS = 'Inspection history and status',
}

export interface InternalAuditComment {
  label: string;
  name: string;
  value: string;
}
export interface CommentProps {
  id: string;
  comment: string;
  isNew: boolean;
  commentedDate?: string | Date;
  commentedBy?: string;
  username?: string;
  jobTitle?: string;
}

export type DescriptionProps = IARReportHeaderDescriptions;

export type IARReportHeaderComments = {
  id: string;
  reportHeaderId: string;
  headerTopic: string;
  headerComment: string;
};

export type IARReportSubHeaderComments = IARReportHeaderComments & {
  parentId: string;
};

export type IARReportHeaderDescriptionState = {
  id: string;
  headerId: string;
  topic: string;
  score: number;
  minScore: number | null;
  maxScore: number | null;
  description: string;
  isNew: boolean;
};

export enum WorkflowStatus {
  OPENED = 'Opened',
  CLOSE_OUT = 'Close out',
  REASSIGNED = 'Reassigned',
}

export enum FindingStatus {
  OPENED = 'Opened',
  CLOSED = 'Closed',
}

export type IARReportSubHeaderDescriptionState =
  IARReportHeaderDescriptionState & {
    parentId: string;
  };
interface IARFormProps {
  internalAuditComments: InternalAuditComment[];
  stepStatusItems: Item[];
  isTouched: boolean;
  officeComment: CommentProps[];
  listAttachments: any[];
  additionalReviewerSection: AdditionalReviewerSection[];
  nonConformityList: NonConformity[];
  OBSList: NonConformity[];
  NCListAttachments: UploadResponsive[];
  listLastAuditFindings: any[];
  OBSListAttachments: UploadResponsive[];
  schedulerROFStatus: IReportFindingForm;
  department: DepartmentMaster[];
  mainCategory: MainCategory[];
  secondCategory: any[];
  workflowRemarks: string;
  reportFindingItems: any[];
  viqCategory: ViqResponse[];
  backgroundImage: Image;
  IHASListofItems: StaticFindingItems[];
  IHASListofItemsManual: StaticFindingItemManual[];
  IARRpHeaderDescription: IARReportHeaderDescriptionState[];
  IARRpSubHeaderDescription: IARReportSubHeaderDescriptionState[];
  IARRpHeaderComments: IARReportHeaderComments[];
  IARRpSubHeaderComments: IARReportSubHeaderComments[];
  listPreviousIAR: PreviousInternalAuditReport[];
  updateRpHeaders: {
    id: string;
    IARReportHeaderDescriptions: IARReportHeaderDescriptions[];
    headerComment: string;
  }[];
  globalLoading: boolean;
  users: UserRecord[];
  handleSetBackgroundImage: (data: Image) => void;
  handleSetGlobalLoading: (loading: boolean) => void;
  handleSetUsers: (list: UserRecord[]) => void;
  handleGetRpHeaderComment: (params: {
    headerId: string;
    isChild: boolean;
  }) => string;
  handleFillRpHeaderComment: (params: {
    headerId: string;
    isChild: boolean;
    data: string;
  }) => void;
  handleSetUpdateRpHeader: (
    data: {
      id: string;
      IARReportHeaderDescriptions: IARReportHeaderDescriptions[];
      headerComment: string;
    }[],
  ) => void;
  handleSetListPreviousIAR: (data: PreviousInternalAuditReport[]) => void;
  handleGetOverview: (id?: string) => string;
  handleChangeOverview: (data: string, id?: string) => void;
  handleGetSMSComment: () => string;
  handleGetIHASComment: () => string;
  handleChangeRpHeaderComments: (
    data: string,
    headerId: string,
    isChild: boolean,
  ) => void;
  handleAddRpHeaderDescription: (data: {
    id: string;
    headerId: string;
    topic: string;
    score: number;
    minScore: number | null;
    maxScore: number | null;
    description: string;
    isNew: boolean;
    parentId: string;
  }) => void;
  handleChangeRpHeaderDescription: (
    id: string,
    topic: string,
    score: number,
    description: string,
    isChild: boolean,
  ) => void;
  handleSetRpHeaderDescription: (
    data: IARReportHeaderDescriptionState[],
  ) => void;
  handleSetRpSubHeaderDescription: (
    data: IARReportSubHeaderDescriptionState[],
  ) => void;
  handleDeleteRpHeaderDescription: (id: string, isChild: boolean) => void;
  handleSetRpHeaderComments: (data: IARReportHeaderComments[]) => void;
  handleSetRpSubHeaderComments: (data: IARReportSubHeaderComments[]) => void;
  handleSetSMSComment: (data: string) => void;
  handleSetIHASComment: (data: string) => void;
  handleSetIHASListofItems: (data: any[]) => void;
  handleSetIHASListOfItemsManual: (data: any[]) => void;
  handleSetViqCategory: (data: any[]) => void;
  handleSubmitReportFindingItems: (data: any) => void;
  handleSetDepartment: (data: DepartmentMaster[]) => void;
  handleSetMainCategory: (data: MainCategory[]) => void;
  handleSetSecondCategory: (data: any[]) => void;
  setTouched: (touched: boolean) => void;
  handleSetWorkFlowRemarks: (data: string) => void;
  handleSetNonConformityList: (NCList: NonConformity[]) => void;
  handleSetOBSList: (OBSList: NonConformity[]) => void;
  handleSetStepStatusItems: (steps: Item[]) => void;
  handleFillComment: (field: string, value: string) => void;
  handleGetComment: (field: string) => string;
  handleSetOfficeComment: (comments: CommentProps[]) => void;
  handleSetListAttachment: (attachments: string[]) => void;
  handleSetListLastAuditFindings: (data: any[]) => void;
  handleSetAdditionalReviewerSection: (
    item: AdditionalReviewerSection[],
  ) => void;
  handleSetNCListAttachment: (attachments: UploadResponsive[]) => void;
  handleSetOBSListAttachment: (attachments: UploadResponsive[]) => void;
  handleSetSchedulerROFStatus: (scheduler: IReportFindingForm) => void;
  listCarCap?: any;
  setListCarCap?: any;
  modalRemarkVisible?: any;
  openModalRemark?: any;
  handleSubmit?: (isSubmitted?: boolean, userAssignment?: any) => void;
  populateAssignment?: (values: any) => any;
  userAssignmentFromDetail?: any;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const InternalAuditReportFormContext = createContext<
  IARFormProps | undefined
>(undefined);

const DEFAULT_STATUS_ITEMS: Item[] = [
  {
    id: ItemStatus.DRAFT,
    name: 'Draft',
    status: StepStatus.ACTIVE,
  },
  {
    id: ItemStatus.SUBMITTED,
    name: 'Submitted',
    status: StepStatus.INACTIVE,
  },
  {
    id: ItemStatus.REVIEWED,
    name: 'Reviewed',
    status: StepStatus.INACTIVE,
  },
  {
    id: ItemStatus.APPROVED,
    name: 'Approved',
    status: StepStatus.INACTIVE,
  },
  {
    id: ItemStatus.CLOSED_OUT,
    name: 'Closed out',
    status: StepStatus.INACTIVE,
  },
];

const InternalAuditReportProvider = ({ children }) => {
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const [listCarCap, setListCarCap] = useState([]);
  const [modalRemarkVisible, openModalRemark] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSetGlobalLoading = (loading: boolean) => {
    setGlobalLoading(loading);
  };

  /* ---Internal Audit Comments --- */
  const [internalAuditComments, setInternalAuditComments] = useState<
    InternalAuditComment[]
  >([
    { label: 'Executive summary', name: 'executiveSummary', value: '' },
    {
      label: 'Status of last audit findings',
      name: 'statusLastAuditFinding',
      value: '',
    },
    { label: 'Hull and deck', name: 'hullAndDeck', value: '' },
    { label: 'Navigation', name: 'navigation', value: '' },
    {
      label: 'Machinery and technical',
      name: 'machineryAndTechnical',
      value: '',
    },
    { label: 'Cargo and ballast', name: 'cargoAndBallast', value: '' },
    { label: 'Crew management', name: 'crewManagement', value: '' },
    { label: 'Pollution prevention', name: 'pollutionPrevention', value: '' },
    { label: 'Safety culture', name: 'safetyCulture', value: '' },
    { label: 'Others', name: 'other', value: '' },
  ]);
  const handleFillComment = (name: string, value: string) => {
    const newComments = [...internalAuditComments];
    const commentIndex = newComments?.findIndex((i) => i.name === name);
    if (commentIndex > -1) {
      newComments[commentIndex].value = value;
    }
    setInternalAuditComments(newComments);
  };
  const handleGetComment = (name: string) => {
    const comment = internalAuditComments?.find((i) => i.name === name);
    return comment ? comment.value : '';
  };

  /* ---Step Status Items--- */
  const [stepStatusItems, setStepStatusItems] =
    useState<any[]>(DEFAULT_STATUS_ITEMS);
  const handleSetStepStatusItems = (steps: Item[]) => {
    setStepStatusItems(steps || []);
  };

  /* ---Office Comments--- */
  const [officeComment, setOfficeComment] = useState<CommentProps[]>([]);
  const handleSetOfficeComment = (comments: CommentProps[]) => {
    setOfficeComment(comments);
  };

  /* ---Additional Reviewer Section--- */
  const [additionalReviewerSection, setAdditionalReviewerSection] = useState<
    AdditionalReviewerSection[]
  >([]);
  const handleSetAdditionalReviewerSection = (
    comments: AdditionalReviewerSection[],
  ) => {
    setAdditionalReviewerSection(comments);
  };

  /* ---WorkFlow Remarks--- */
  const [workflowRemarks, setWorkFlowRemarks] = useState<string>('');
  const handleSetWorkFlowRemarks = (data: string) => {
    setWorkFlowRemarks(data);
  };

  /* ---Background Image--- */
  const [backgroundImage, setBackgroundImage] = useState<Image>(null);
  const handleSetBackgroundImage = (data: Image) => {
    setBackgroundImage(data);
  };

  /* ---List Users--- */
  const [users, setUsers] = useState<UserRecord[]>([]);
  const handleSetUsers = (list: UserRecord[]) => {
    setUsers(list);
  };

  /* ---Non Conformity--- */
  const [nonConformityList, setNonConformityList] = useState<NonConformity[]>(
    [],
  );
  const handleSetNonConformityList = (NCList: NonConformity[]) => {
    setNonConformityList(NCList);
  };

  /* ---Observation--- */
  const [OBSList, setOBSList] = useState<NonConformity[]>([]);
  const handleSetOBSList = (OBSList: NonConformity[]) => {
    setOBSList(OBSList);
  };

  /* ---Main Attachments List--- */
  const [listAttachments, setListAttachments] = useState<string[]>([]);
  const handleSetListAttachment = (attachments: string[]) => {
    setListAttachments(attachments);
  };

  /* ---Non Conformity Attachments--- */
  const [NCListAttachments, setNCListAttachments] = useState<
    UploadResponsive[]
  >([]);
  const handleSetNCListAttachment = (attachments: UploadResponsive[]) => {
    setNCListAttachments(attachments);
  };

  /* ---Observation Attachments--- */
  const [OBSListAttachments, setOBSListAttachments] = useState<
    UploadResponsive[]
  >([]);
  const handleSetOBSListAttachment = (attachments: UploadResponsive[]) => {
    setOBSListAttachments(attachments);
  };

  /* ---Scheduler and Report of Findings status--- */
  const [schedulerROFStatus, setSchedulerROFStatus] =
    useState<IReportFindingForm>(null);
  const handleSetSchedulerROFStatus = (scheduler: IReportFindingForm) => {
    setSchedulerROFStatus(scheduler);
  };

  /* ---Department--- */
  const [department, setDepartment] = useState<DepartmentMaster[]>([]);
  const handleSetDepartment = (data: DepartmentMaster[]) => {
    setDepartment(data);
  };

  /* ---Main Category--- */
  const [mainCategory, setMainCategory] = useState<MainCategory[]>([]);
  const handleSetMainCategory = (data: MainCategory[]) => {
    setMainCategory(data);
  };

  /* ---Sub Category--- */
  const [secondCategory, setSecondCategory] = useState<any[]>([]);
  const handleSetSecondCategory = (data: any[]) => {
    setSecondCategory(data);
  };

  /* ---Vessel Inspection Questionnaire--- */
  const [viqCategory, setViqCategory] = useState<ViqResponse[]>([]);
  const handleSetViqCategory = (data: any[]) => {
    setViqCategory(data);
  };

  /* ---Submit Report Finding Items--- */
  const [reportFindingItems, setReportFindingItems] = useState<any[]>([]);
  const handleSubmitReportFindingItems = (data: any) => {
    let newList = [...reportFindingItems];
    newList = newList.filter((item) => item.id !== data.id);
    newList.push(data);
    setReportFindingItems(newList);
  };

  /* ---Status of Last Audit Findings--- */
  const [listLastAuditFindings, setListLastAuditFindings] = useState<any[]>([]);
  const handleSetListLastAuditFindings = (data: any[]) => {
    setListLastAuditFindings(data);
  };

  /* ---IHAS List of Items--- */
  const [IHASListofItems, setIHASListofItems] = useState<any[]>([]);
  const handleSetIHASListofItems = (data: any[]) => {
    setIHASListofItems(data);
  };

  /* ---IHAS List of Items--- */
  const [IHASListofItemsManual, setIHASListofItemsManual] = useState<any[]>([]);
  const handleSetIHASListOfItemsManual = (data: any[]) => {
    setIHASListofItemsManual(data);
  };

  /* ---Previous Internal Audits List--- */
  const [listPreviousIAR, setListPreviousIAR] = useState<
    PreviousInternalAuditReport[]
  >([]);
  const handleSetListPreviousIAR = (data: PreviousInternalAuditReport[]) => {
    setListPreviousIAR(data);
  };

  /* ---Report Headers--- */
  const [IARRpHeaderComments, setIARRpHeaderComments] = useState<
    IARReportHeaderComments[]
  >([]);
  const [IARRpSubHeaderComments, setIARRpSubHeaderComments] = useState<
    IARReportSubHeaderComments[]
  >([]);
  const [IARRpHeaderDescription, setIARRpHeaderDescription] = useState<
    IARReportHeaderDescriptionState[]
  >([]);
  const [IARRpSubHeaderDescription, setIARRpSubHeaderDescripton] = useState<
    IARReportSubHeaderDescriptionState[]
  >([]);
  const [updateRpHeaders, setUpdateRpHeader] = useState<
    {
      id: string;
      IARReportHeaderDescriptions: IARReportHeaderDescriptions[];
      headerComment: string;
    }[]
  >([]);

  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { id } = useParams<{ id: string }>();

  const handleSetUpdateRpHeader = (
    data: {
      id: string;
      IARReportHeaderDescriptions: IARReportHeaderDescriptions[];
      headerComment: string;
    }[],
  ) => {
    setUpdateRpHeader(data);
  };
  const handleSetRpHeaderComments = (data: IARReportHeaderComments[]) => {
    setIARRpHeaderComments(data);
  };
  const handleSetRpSubHeaderComments = (data: IARReportSubHeaderComments[]) => {
    setIARRpSubHeaderComments(data);
  };
  const handleGetRpHeaderComment = useCallback(
    (params: { headerId: string; isChild: boolean }) => {
      if (params.isChild) {
        const subHeader = IARRpSubHeaderComments.find(
          (i) => i.reportHeaderId === params.headerId,
        );
        return subHeader?.headerComment || '';
      }
      const header = IARRpHeaderComments.find(
        (i) => i.reportHeaderId === params.headerId,
      );
      return header?.headerComment || '';
    },
    [IARRpSubHeaderComments, IARRpHeaderComments],
  );
  const handleFillRpHeaderComment = (params: {
    headerId: string;
    isChild: boolean;
    data: string;
  }) => {
    if (params.isChild) {
      const newRpSubHeader = [...IARRpSubHeaderComments];
      const subHeaderIndex = newRpSubHeader.findIndex(
        (i) => i.reportHeaderId === params.headerId,
      );
      if (subHeaderIndex > -1) {
        newRpSubHeader[subHeaderIndex].headerComment = params.data;
        setIARRpSubHeaderComments(newRpSubHeader);
      }
    } else {
      const newRpHeader = [...IARRpHeaderComments];
      const headerIndex = newRpHeader.findIndex(
        (i) => i.reportHeaderId === params.headerId,
      );
      if (headerIndex > -1) {
        newRpHeader[headerIndex].headerComment = params.data;
        setIARRpHeaderComments(newRpHeader);
      }
    }
  };
  const handleGetOverview = useCallback(
    (id?: string) => {
      const overview = IARRpHeaderComments.find((i) => i?.id === id);
      return overview?.headerComment || '';
    },
    [IARRpHeaderComments],
  );
  const handleChangeOverview = (data: string, id?: string) => {
    const newRpHeaderComments = [...IARRpHeaderComments];
    const overviewIndex = newRpHeaderComments.findIndex((i) => i.id === id);
    if (overviewIndex || overviewIndex === 0) {
      newRpHeaderComments[overviewIndex].headerComment = data;
    }

    setIARRpHeaderComments(newRpHeaderComments);
  };
  const handleGetSMSComment = useCallback(() => {
    const SMSComment = IARRpHeaderComments.find(
      (i) => i?.headerTopic === ReportHeaderTopics.SMS,
    );
    return SMSComment?.headerComment || '';
  }, [IARRpHeaderComments]);
  const handleSetSMSComment = (data: string) => {
    const newRpHeaderComments = [...IARRpHeaderComments];
    const SMSIndex = newRpHeaderComments.findIndex(
      (i) => i.headerTopic === ReportHeaderTopics.SMS,
    );
    newRpHeaderComments[SMSIndex].headerComment = data;
    setIARRpHeaderComments(newRpHeaderComments);
  };
  const handleGetIHASComment = () => {
    const IHASComment = IARRpHeaderComments.find(
      (i) => i?.id === internalAuditReportDetail?.IARReportHeaders[1]?.id,
    );
    return IHASComment?.headerComment || '';
  };
  const handleSetIHASComment = useCallback(
    (data: string) => {
      const newRpHeaderComments = [...IARRpHeaderComments];

      const IHASIndex = newRpHeaderComments?.findIndex(
        (i) => i?.id === internalAuditReportDetail?.IARReportHeaders[1]?.id,
      );

      newRpHeaderComments[IHASIndex].headerComment = data;
      setIARRpHeaderComments(newRpHeaderComments);
    },
    [IARRpHeaderComments, internalAuditReportDetail?.IARReportHeaders],
  );
  const handleChangeRpHeaderComments = (
    data: string,
    headerId: string,
    isChild: boolean,
  ) => {
    if (isChild) {
      const newRpSubHeaderComments = [...IARRpSubHeaderComments];
      const commentIndex = newRpSubHeaderComments.findIndex(
        (i) => i.id === headerId,
      );
      if (commentIndex > -1) {
        newRpSubHeaderComments[commentIndex].headerComment = data;
        setIARRpSubHeaderComments(newRpSubHeaderComments);
      }
    } else {
      const newRpHeaderComments = [...IARRpHeaderComments];
      const commentIndex = newRpHeaderComments.findIndex(
        (i) => i.id === headerId,
      );
      if (commentIndex > -1) {
        newRpHeaderComments[commentIndex].headerComment = data;
        setIARRpHeaderComments(newRpHeaderComments);
      }
    }
  };
  const handleSetRpHeaderDescription = (
    data: IARReportHeaderDescriptionState[],
  ) => {
    setIARRpHeaderDescription(data);
  };
  const handleSetRpSubHeaderDescription = (
    data: IARReportSubHeaderDescriptionState[],
  ) => {
    setIARRpSubHeaderDescripton(data);
  };
  const handleAddRpHeaderDescription = (data: {
    id: string;
    headerId: string;
    topic: string;
    score: number;
    minScore: number | null;
    maxScore: number | null;
    description: string;
    isNew: boolean;
    parentId: string;
  }) => {
    if (data.parentId) {
      const newRpSubHeaderDescription = [...IARRpSubHeaderDescription];
      newRpSubHeaderDescription.push(data);
      setIARRpSubHeaderDescripton(newRpSubHeaderDescription);
    } else {
      const newDescription = { ...data, parentId: undefined };
      const newRpHeaderDescription = [...IARRpHeaderDescription];
      newRpHeaderDescription.push(newDescription);
      setIARRpHeaderDescription(newRpHeaderDescription);
    }
  };
  const handleChangeRpHeaderDescription = (
    id: string,
    topic: string,
    score: number,
    description: string,
    isChild: boolean,
  ) => {
    if (isChild) {
      const newRpSubHeaderDescription = [...IARRpSubHeaderDescription];
      const descriptionIndex = newRpSubHeaderDescription.findIndex(
        (i) => i.id === id,
      );
      if (descriptionIndex > -1) {
        newRpSubHeaderDescription[descriptionIndex].description = description;
        newRpSubHeaderDescription[descriptionIndex].topic = topic;
        newRpSubHeaderDescription[descriptionIndex].score = score;
        setIARRpSubHeaderDescripton(newRpSubHeaderDescription);
      }
    } else {
      const newRpHeaderDescription = [...IARRpHeaderDescription];
      const descriptionIndex = newRpHeaderDescription.findIndex(
        (i) => i.id === id,
      );
      if (descriptionIndex > -1) {
        newRpHeaderDescription[descriptionIndex].description = description;
        newRpHeaderDescription[descriptionIndex].topic = topic;
        newRpHeaderDescription[descriptionIndex].score = score;
        setIARRpHeaderDescription(newRpHeaderDescription);
      }
    }
  };
  const handleDeleteRpHeaderDescription = (id: string, isChild: boolean) => {
    if (isChild) {
      const newRpSubHeaderDescription = IARRpSubHeaderDescription.filter(
        (i) => i.id !== id,
      );
      setIARRpSubHeaderDescripton(newRpSubHeaderDescription);
    } else {
      const newRpHeaderDescription = IARRpHeaderDescription.filter(
        (i) => i.id !== id,
      );
      setIARRpHeaderDescription(newRpHeaderDescription);
    }
  };
  const setTouched = (touched: boolean) => {
    setIsTouched(touched);
  };

  const buildIARRpHeaderResponse = useCallback(() => {
    const IARReportHeaders = IARRpHeaderComments.map((header) => {
      const rpHeaderDescription = IARRpHeaderDescription.filter(
        (description) => description.headerId === header.reportHeaderId,
      ).map((description) => ({
        id: !description.isNew ? description.id : undefined,
        topic: description.topic,
        score: description.score,
        description: description.description,
      }));
      return {
        id: header.id,
        reportHeaderId: header.reportHeaderId,
        headerComment: header.headerComment || '',
        IARReportHeaderDescriptions:
          rpHeaderDescription.length > 0 ? rpHeaderDescription : [],
      };
    });
    const IARReportSubHeaders = IARRpSubHeaderComments.map((subHeader) => {
      const rpSubHeaderDescription = IARRpSubHeaderDescription.filter(
        (description) => description.headerId === subHeader.reportHeaderId,
      ).map((description) => ({
        id: !description.isNew ? description.id : undefined,
        topic: description.topic,
        score: description.score,
        description: description.description,
      }));
      return {
        id: subHeader.id,
        reportHeaderId: subHeader.reportHeaderId,
        headerComment: subHeader.headerComment || '',
        IARReportHeaderDescriptions:
          rpSubHeaderDescription.length > 0 ? rpSubHeaderDescription : [],
      };
    });
    const finalRpHeaderList = [...IARReportHeaders, ...IARReportSubHeaders];
    return finalRpHeaderList;
  }, [
    IARRpHeaderDescription,
    IARRpSubHeaderDescription,
    IARRpHeaderComments,
    IARRpSubHeaderComments,
  ]);

  const handleSubmit = useCallback(
    async (isSubmitted: boolean, userAssignment?: any) => {
      const IARComment = {
        id: internalAuditReportDetail?.internalAuditReportComment?.id,
        executiveSummary: internalAuditComments?.find(
          (i) => i.name === 'executiveSummary',
        )?.value,
        statusLastAuditFinding: internalAuditComments?.find(
          (i) => i.name === 'statusLastAuditFinding',
        )?.value,
        hullAndDeck: internalAuditComments?.find(
          (i) => i.name === 'hullAndDeck',
        )?.value,
        navigation: internalAuditComments?.find((i) => i.name === 'navigation')
          ?.value,
        machineryAndTechnical: internalAuditComments?.find(
          (i) => i.name === 'machineryAndTechnical',
        )?.value,
        cargoAndBallast: internalAuditComments?.find(
          (i) => i.name === 'cargoAndBallast',
        )?.value,
        crewManagement: internalAuditComments?.find(
          (i) => i.name === 'crewManagement',
        )?.value,
        pollutionPrevention: internalAuditComments?.find(
          (i) => i.name === 'pollutionPrevention',
        )?.value,
        safetyCulture: internalAuditComments?.find(
          (i) => i.name === 'safetyCulture',
        )?.value,
        other: internalAuditComments?.find((i) => i.name === 'other')?.value,
      };
      const newComments =
        officeComment.map((item) => {
          if (item.isNew) {
            return { comment: item.comment };
          }
          return { id: item.id, comment: item.comment };
        }) || [];
      let finalData: any = {
        background: backgroundImage?.id,
        attachments: listAttachments?.length > 0 ? listAttachments : [],
        internalAuditComment: IARComment,
        officeComments: newComments.length > 0 ? newComments : [],
        IARReportHeaders: buildIARRpHeaderResponse(),
        workflowRemarks,
      };
      if (userAssignment) {
        finalData = { ...finalData, userAssignment };
      }
      try {
        setLoading(true);
        await updateInternalAuditReportPermissionDetailActionsApi({
          id,
          isSubmitted,
          data: finalData,
        });
        toastSuccess(
          isSubmitted
            ? 'You have submitted successfully'
            : 'You have saved successfully',
        );
        history.push(AppRouteConst.INTERNAL_AUDIT_REPORT);
      } catch (e) {
        toastError(e);
      } finally {
        setLoading(false);
      }
    },
    [
      internalAuditReportDetail?.internalAuditReportComment?.id,
      internalAuditComments,
      officeComment,
      backgroundImage?.id,
      listAttachments,
      buildIARRpHeaderResponse,
      workflowRemarks,
      id,
    ],
  );

  const userAssignmentFromDetail = useMemo(() => {
    if (!internalAuditReportDetail?.userAssignments) {
      return null;
    }
    let usersPermissions = [];

    internalAuditReportDetail?.userAssignments?.forEach((item) => {
      if (usersPermissions?.some((i) => i.permission === item?.permission)) {
        usersPermissions = usersPermissions?.map((i) =>
          i?.permission === item?.permission
            ? {
                permission: i?.permission,
                userIds: [item?.user?.id]?.concat(i.userIds),
              }
            : i,
        );
      } else {
        usersPermissions?.push({
          permission: item.permission,
          userIds: [item?.user?.id],
        });
      }
    });

    return usersPermissions;
  }, [internalAuditReportDetail?.userAssignments]);

  const populateAssignment = useCallback(
    (value?: any) => {
      const currentReview1 =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === IARReviewPermission.REVIEWER_1,
        )?.userIds || [];
      const currentReview2 =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === IARReviewPermission.REVIEWER_2,
        )?.userIds || [];
      const currentReview3 =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === IARReviewPermission.REVIEWER_3,
        )?.userIds || [];
      const currentReview4 =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === IARReviewPermission.REVIEWER_4,
        )?.userIds || [];
      const currentReview5 =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === IARReviewPermission.REVIEWER_5,
        )?.userIds || [];

      const currentApprover =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === ActivePermission.APPROVER,
        )?.userIds || [];

      const reviewer1Ids = value?.reviewer1?.map((item) => item?.id);
      const reviewer2Ids = value?.reviewer2?.map((item) => item?.id);
      const reviewer3Ids = value?.reviewer3?.map((item) => item?.id);
      const reviewer4Ids = value?.reviewer4?.map((item) => item?.id);
      const reviewer5Ids = value?.reviewer5?.map((item) => item?.id);
      const approverIds = value?.approver?.map((item) => item?.id);

      const userAssignment = {
        usersPermissions: [
          {
            permission: IARReviewPermission.REVIEWER_1,
            userIds: reviewer1Ids?.length
              ? reviewer1Ids
              : uniq(currentReview1?.concat(reviewer1Ids || [])),
          },
          {
            permission: IARReviewPermission.REVIEWER_2,
            userIds: reviewer2Ids?.length
              ? reviewer2Ids
              : uniq(currentReview2?.concat(reviewer2Ids || [])),
          },
          {
            permission: IARReviewPermission.REVIEWER_3,
            userIds: reviewer3Ids?.length
              ? reviewer3Ids
              : uniq(currentReview3?.concat(reviewer3Ids || [])),
          },
          {
            permission: IARReviewPermission.REVIEWER_4,
            userIds: reviewer4Ids?.length
              ? reviewer4Ids
              : uniq(currentReview4?.concat(reviewer4Ids || [])),
          },
          {
            permission: IARReviewPermission.REVIEWER_5,
            userIds: reviewer5Ids?.length
              ? reviewer5Ids
              : uniq(currentReview5?.concat(reviewer5Ids || [])),
          },
          {
            permission: ActivePermission.APPROVER,
            userIds: approverIds?.length
              ? approverIds
              : uniq(currentApprover?.concat(approverIds || [])),
          },
        ]?.filter((item) => item?.userIds?.length),
      };

      if (!userAssignment?.usersPermissions?.length) {
        return null;
      }

      return userAssignment;
    },
    [userAssignmentFromDetail],
  );

  const themeContextData = {
    internalAuditComments,
    stepStatusItems,
    isTouched,
    officeComment,
    listAttachments,
    schedulerROFStatus,
    additionalReviewerSection,
    NCListAttachments,
    OBSListAttachments,
    nonConformityList,
    OBSList,
    users,
    department,
    mainCategory,
    secondCategory,
    reportFindingItems,
    workflowRemarks,
    viqCategory,
    listLastAuditFindings,
    IHASListofItems,
    IHASListofItemsManual,
    IARRpHeaderDescription,
    IARRpSubHeaderDescription,
    updateRpHeaders,
    IARRpHeaderComments,
    IARRpSubHeaderComments,
    listPreviousIAR,
    globalLoading,
    backgroundImage,
    handleSetBackgroundImage,
    handleSetGlobalLoading,
    handleSetListPreviousIAR,
    handleSetUsers,
    handleGetRpHeaderComment,
    handleFillRpHeaderComment,
    handleSetUpdateRpHeader,
    handleGetSMSComment,
    handleGetIHASComment,
    handleChangeRpHeaderComments,
    handleAddRpHeaderDescription,
    handleChangeRpHeaderDescription,
    handleDeleteRpHeaderDescription,
    handleGetOverview,
    handleChangeOverview,
    handleSetRpHeaderComments,
    handleSetRpSubHeaderComments,
    handleSetRpHeaderDescription,
    handleSetRpSubHeaderDescription,
    handleSetSMSComment,
    handleSetIHASComment,
    handleSetIHASListofItems,
    handleSetIHASListOfItemsManual,
    handleSubmitReportFindingItems,
    handleSetWorkFlowRemarks,
    handleSetViqCategory,
    handleSetSecondCategory,
    handleSetMainCategory,
    handleSetDepartment,
    handleSetNonConformityList,
    handleSetOBSList,
    setTouched,
    handleSetStepStatusItems,
    handleFillComment,
    handleGetComment,
    handleSetOfficeComment,
    handleSetListAttachment,
    handleSetAdditionalReviewerSection,
    handleSetNCListAttachment,
    handleSetOBSListAttachment,
    handleSetSchedulerROFStatus,
    handleSetListLastAuditFindings,
    listCarCap,
    setListCarCap,
    modalRemarkVisible,
    openModalRemark,
    handleSubmit,
    populateAssignment,
    userAssignmentFromDetail,
    loading,
    setLoading,
  };

  return (
    <InternalAuditReportFormContext.Provider value={themeContextData}>
      {children}
    </InternalAuditReportFormContext.Provider>
  );
};

export default InternalAuditReportProvider;
