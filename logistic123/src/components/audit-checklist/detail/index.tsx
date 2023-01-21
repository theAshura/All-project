import { getGeneralInfoDetailApi } from 'api/audit-checklist.api';
import images from 'assets/images/images';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import {
  Item,
  ItemStatus,
  StepStatus,
} from 'components/common/step-line/lineStepInfoCP';
import Button from 'components/ui/button/Button';
// import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
// import ModalComponent from 'components/ui/modal/Modal';
import ModalRemark from 'components/ui/modal/modal-remark/ModalRemark';
import {
  ActivePermission,
  CommonQuery,
  MasterDataId,
} from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS,
  AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS,
} from 'constants/dynamic/auditInspectionTemplate.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import history from 'helpers/history.helper';
import { toastError } from 'helpers/notification.helper';
import {
  permissionCheck,
  checkAssignmentPermission,
} from 'helpers/permissionCheck.helper';
import { convertDataUserAssignment } from 'helpers/userAssignment.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import useEffectOnce from 'hoc/useEffectOnce';
import capitalize from 'lodash/capitalize';
import uniq from 'lodash/uniq';
import {
  CreateGeneralInfoBody,
  GetGeneralInfoDetailResponse,
} from 'models/api/audit-checklist/audit-checklist.model';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  acceptAuditCheckListAction,
  approveAuditCheckListAction,
  cancelAuditCheckListAction,
  checkIsCreatedInitialData,
  clearAuditCheckListDetail,
  clearCreatedAuditCheckListAction,
  clearErrorMessages,
  createQuestionAction,
  deleteAuditCheckListAction,
  getAuditCheckListDetailAction,
  getListQuestionAction,
  getListROFFromIARAction,
  submitAuditCheckListAction,
  updateGeneralInfoAction,
  updateQuestionAction,
} from 'store/audit-checklist/audit-checklist.action';
import { v4 } from 'uuid';
import Assignment from '../common/assignment/Assignment';
import { useFormHelper } from '../common/form-helper/useFormHelper';
import HeaderButtons, {
  HeaderBtn,
  HeaderBtnType,
} from '../common/header-buttons/HeaderButtons';
import PopoverStatus from '../common/popover-status/PopoverStatus';
import PreviewModal from '../common/preview-modal/PreviewModal';
import { GENERAL_INFORMATION, QUESTION_LIST } from '../create';
import GeneralInfoForm, {
  GeneralInfoFormModel,
} from '../forms/AuditCheckListGeneralInfoForm';
import QuestionListForm, {
  AnswerOptionModel,
  HasRemarkType,
} from '../forms/AuditCheckListQuestionListForm';
import styles from './detail.module.scss';

export interface EditQuestionProgress {
  id: string;
  formValue: any;
  isMultiQuestion: boolean;
  aOptions: AnswerOptionModel[];
}

export default function AuditCheckListDetailContainer() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { search } = useLocation();

  const { auditCheckListDetail, listQuestion, loading } = useSelector(
    (store) => store.auditCheckList,
  );
  const [generalInfoDetail, setGeneralInfoDetail] =
    useState<GetGeneralInfoDetailResponse>();
  const [previewModal, setPreviewModal] = useState<boolean>(false);
  const [generalLoading, setGeneralLoading] = useState<boolean>(true);
  // const [remarks, setRemarks] = useState('');
  const [modalAssignMentVisible, openModalAssignment] =
    useState<boolean>(false);
  // const [isFirstChange, setIsFirstChange] = useState(true);
  const [isStatusActionHeader, setIsStatusActionHeader] = useState('');
  const [modalRemarkVisible, openModalRemark] = useState<boolean>(false);
  const [titleModalRemark, setTitleModalRemark] = useState<string>('');

  const [currentActiveTab, setCurrentActiveTab] =
    useState<string>(GENERAL_INFORMATION);
  const formHelper = useFormHelper();
  const [questionProgress, setQuestionProgress] = useState();
  const [isMultiQuestion, setIsMultiQuestion] = useState(false);
  const [aOptions, setAOptions] = useState<
    (AnswerOptionModel & { hasRemark: boolean })[]
  >([
    { id: v4(), value: '', hasRemark: false },
    { id: v4(), value: '', hasRemark: false },
  ]);

  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
    modulePage: getCurrentModulePageByStatus(
      search === CommonQuery.EDIT,
      false,
    ),
  });

  const setAnswerOptions = (
    data: (AnswerOptionModel & { hasRemark: boolean })[],
  ) => {
    setAOptions(data);
  };
  const { userInfo } = useSelector((state) => state.authenticate);

  const dataUserAssignmentConvert = useMemo(
    () => convertDataUserAssignment(auditCheckListDetail?.userAssignments),
    [auditCheckListDetail?.userAssignments],
  );

  const handleGetGeneralInfo = useCallback(() => {
    getGeneralInfoDetailApi(id)
      .then((r) => {
        setGeneralInfoDetail(r.data);
        const referencesCategory = r.data?.referencesCategory?.map((i) => i.id);
        formHelper?.setListRefCategory(referencesCategory);
      })
      .catch((e) => {
        toastError(e);
      })
      .finally(() => {
        setGeneralLoading(false);
      });
  }, [formHelper, id]);

  useEffect(() => {
    dispatch(getAuditCheckListDetailAction.request(id));
    dispatch(
      getListROFFromIARAction.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
    dispatch(
      getListQuestionAction.request({
        companyId: userInfo?.mainCompanyId,
        id,
        body: { page: 1, pageSize: -1 },
      }),
    );

    handleGetGeneralInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (generalInfoDetail?.statusHistory) {
      formHelper?.setStatusHistory(generalInfoDetail?.statusHistory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalInfoDetail?.statusHistory]);

  useEffectOnce(() => () => {
    dispatch(checkIsCreatedInitialData(false));
    dispatch(clearCreatedAuditCheckListAction());
    dispatch(clearAuditCheckListDetail());
    dispatch(clearErrorMessages());
  });

  const reviewerAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.REVIEWER,
        auditCheckListDetail?.userAssignments,
      ),
    [auditCheckListDetail?.userAssignments, userInfo?.id],
  );

  const approverAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.APPROVER,
        auditCheckListDetail?.userAssignments,
      ),
    [auditCheckListDetail?.userAssignments, userInfo?.id],
  );

  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );

  const stepStatusItems = useMemo(() => {
    const items: Item[] = formHelper.DEFAULT_STATUS_ITEMS;

    switch (auditCheckListDetail?.status) {
      case ItemStatus.DRAFT: {
        const newItems = items.map((i, index) => {
          if (index < 1) {
            return { ...i, status: StepStatus.ACTIVE };
          }
          return { ...i, info: null };
        });
        return newItems;
      }

      case ItemStatus.SUBMITTED: {
        const newItems = items.map((i, index) => {
          if (index < 2) {
            return { ...i, status: StepStatus.ACTIVE };
          }
          return { ...i, info: null };
        });
        return newItems;
      }
      case ItemStatus.REVIEWED: {
        const newItems = items.map((i, index) => {
          if (index < 3) {
            return { ...i, status: StepStatus.ACTIVE };
          }
          return { ...i, info: null };
        });
        return newItems;
      }

      case ItemStatus.APPROVED: {
        const newItems = items.map((i, index) => {
          if (index < 4) {
            return { ...i, status: StepStatus.ACTIVE };
          }
          return { ...i, info: null };
        });
        return newItems;
      }
      case ItemStatus.REJECTED: {
        const statusAudit: string =
          generalInfoDetail?.statusHistory &&
          generalInfoDetail?.statusHistory[
            generalInfoDetail?.statusHistory?.length - 2
          ]?.status;
        let indexActive: number = 0;
        formHelper.DEFAULT_STATUS_ITEMS.forEach((i, index) => {
          if (i.id === statusAudit) {
            indexActive = index;
          }
        });
        indexActive += 1;
        const newItems = items.map((i, index) => {
          if (index < indexActive) {
            return { ...i, status: StepStatus.ACTIVE };
          }
          if (index === indexActive) {
            return { ...i, status: StepStatus.ERROR };
          }
          return { ...i, info: null };
        });
        return newItems;
      }

      case ItemStatus.CANCELLED: {
        const newItems = items.map((i, index) => {
          if (index < 4) {
            return { ...i, status: StepStatus.ACTIVE };
          }
          if (i.id === ItemStatus.CANCELLED) {
            return { ...i, status: StepStatus.ERROR };
          }
          return { ...i, info: null };
        });
        return newItems;
      }

      default:
        return items;
    }
  }, [
    auditCheckListDetail,
    generalInfoDetail,
    formHelper.DEFAULT_STATUS_ITEMS,
  ]);

  const handleSaveQuestion = useCallback(
    (data: any) => {
      const checkIdValue = aOptions?.some((i) => !i?.idValue);
      if (checkIdValue) {
        toastError('Please add value for answer options');
        return null;
      }
      let referencesCategoryData: any = [];
      let finalData: any = {};
      let finalAnswerOptions: AnswerOptionModel[] = [];
      let finalRemarkSpecificAnswers: string[];
      let questions: string[];
      let order: number = 0;

      listQuestion?.forEach((item) => {
        if (item.order > order) order = item.order;
      });
      if (isMultiQuestion) {
        questions = data?.questions.split('\n').filter((i) => i !== '');
      } else {
        questions = [data?.questions?.trim()];
      }

      finalAnswerOptions = aOptions.map((i) => {
        if (i?.idValue) {
          return {
            id: i.id,
            content: i.value,
            valueId: i.idValue,
          };
        }
        return {
          id: i.id,
          content: i.value,
        };
      });
      if (data.isHasRemark && data.hasRemark === HasRemarkType.SPECIFIC) {
        finalRemarkSpecificAnswers = aOptions
          .filter((i) => i.hasRemark)
          .map((i) => i.value);
      }
      if (data.attachments?.length > 0) {
        finalData = {
          ...finalData,
          attachments: data.attachments,
        };
      }
      if (data?.type) {
        finalData = {
          ...finalData,
          isHasRemark: undefined,
          order: formHelper.questionDetail
            ? formHelper.questionDetail.order
            : order + 1,
          remarkSpecificAnswers: finalRemarkSpecificAnswers,
          requireEvidencePicture: data?.requireEvidencePicture,
          hasRemark: data?.hasRemark,
          isMandatory: data?.isMandatory,
          minPictureRequired:
            !Number.isNaN(Number(data?.minPictureRequired)) &&
            Number(data?.minPictureRequired) > 0
              ? Number(data?.minPictureRequired)
              : 0,
          answerOptions: finalAnswerOptions,
        };
      }

      if (data?.reg) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.REG, value: data?.reg },
        ];
      }

      if (data?.infor) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.INFOR, value: data?.infor },
        ];
      }
      if (data?.CDI?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.CDI, value: data?.CDI[0]?.value },
        ];
      }
      if (data?.VIQ?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.VIQ, value: data?.VIQ[0]?.value },
        ];
      }
      if (data?.category2nd?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          {
            id: MasterDataId.THIRD_CATEGORY,
            value: data?.category2nd[0]?.value,
          },
        ];
      }
      if (data?.subCategory1st?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          {
            id: MasterDataId.SECOND_CATEGORY,
            value: data?.subCategory1st[0]?.value,
          },
        ];
      }
      if (data?.charterOwner?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          {
            id: MasterDataId.CHARTER_OWNER,
            value: data?.charterOwner[0]?.value,
          },
        ];
      }
      if (data?.mainCategory?.length > 0) {
        finalData = {
          ...finalData,
          mainCategoryId: data?.mainCategory[0]?.value,
        };
      }
      if (data?.locationId?.length > 0) {
        finalData = { ...finalData, locationId: data?.locationId[0]?.value };
      }
      if (data?.code?.trim()?.length > 0) {
        finalData = { ...finalData, code: data?.code?.trim() };
      }
      if (data?.type?.length > 0) {
        finalData = { ...finalData, type: data?.type };
      }

      if (data?.potentialRisk?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.POTENTIAL_RISK, value: data?.potentialRisk },
        ];
      }
      if (data?.criticality?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          { id: MasterDataId.CRITICALITY, value: data?.criticality },
        ];
      }
      if (data?.ratingCriteria?.trim()?.length > 0) {
        finalData = {
          ...finalData,
          ratingCriteria: data?.ratingCriteria?.trim(),
        };
      }
      if (data?.topicId?.length > 0) {
        finalData = { ...finalData, topicId: data?.topicId[0]?.value };
      }
      if (data?.hint?.trim()?.length > 0) {
        finalData = { ...finalData, hint: data?.hint?.trim() };
      }
      if (data?.department?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.department?.map((i) => ({
            id: MasterDataId.DEPARTMENT,
            value: i?.value,
          })),
        ];
      }

      if (data?.shoreRank?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.shoreRank?.map((i) => ({
            id: MasterDataId.SHORE_RANK,
            value: i?.value,
          })),
        ];
      }
      if (data?.shipDepartment?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.shipDepartment?.map((i) => ({
            id: MasterDataId.SHIP_DEPARTMENT,
            value: i?.value,
          })),
        ];
      }
      if (data?.shipRanks?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.shipRanks?.map((i) => ({
            id: MasterDataId.SHIP_RANK,
            value: i?.value,
          })),
        ];
      }
      if (data?.shoreDepartment?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.shoreDepartment?.map((i) => ({
            id: MasterDataId.SHORE_DEPARTMENT,
            value: i?.value,
          })),
        ];
      }
      if (data?.vesselType?.length > 0) {
        referencesCategoryData = [
          ...referencesCategoryData,
          ...data?.vesselType?.map((i) => ({
            id: MasterDataId.VESSEL_TYPE,
            value: i?.value,
          })),
        ];
      }
      if (formHelper.questionDetail) {
        dispatch(
          updateQuestionAction.request({
            hasSubmit: data?.hasSubmit,
            idAuditChecklist: id,
            idQuestion: formHelper.questionDetail?.id,
            body: {
              ...finalData,
              question: questions[0],
              referencesCategoryData: [...referencesCategoryData],
            },

            handleSuccess: () => {
              data?.handleSuccess();
              if (generalInfoDetail?.status === 'Rejected') {
                dispatch(getAuditCheckListDetailAction.request(id));
                handleGetGeneralInfo();
              }
            },
          }),
        );
      } else {
        dispatch(
          createQuestionAction.request({
            id,
            body: {
              ...finalData,
              questions,
              referencesCategoryData: [...referencesCategoryData],
            },
            isDuplicate: true,
            handleSuccess: (dataQuestion) => {
              data?.handleSuccess(dataQuestion);
              if (generalInfoDetail?.status === 'Rejected') {
                dispatch(getAuditCheckListDetailAction.request(id));
                handleGetGeneralInfo();
              }
            },
          }),
        );
      }
      return null;
    },
    [
      listQuestion,
      isMultiQuestion,
      formHelper.questionDetail,
      aOptions,
      dispatch,
      id,
      generalInfoDetail?.status,
      handleGetGeneralInfo,
    ],
  );

  const handlePreview = () => {
    setPreviewModal(true);
  };

  const dataUserAssignmentBody = useCallback(
    (value) => {
      const currentApprover =
        dataUserAssignmentConvert?.find(
          (item) => item?.permission === ActivePermission.APPROVER,
        )?.userIds || [];
      const currentReviewer =
        dataUserAssignmentConvert?.find(
          (item) => item?.permission === ActivePermission.REVIEWER,
        )?.userIds || [];
      const currentCreator =
        dataUserAssignmentConvert?.find(
          (item) => item?.permission === ActivePermission.CREATOR,
        )?.userIds || [];

      const usersPermissions = [
        {
          permission: ActivePermission.APPROVER,
          userIds: uniq(
            currentApprover?.concat(
              value?.approver?.map((item) => item?.id) || [],
            ),
          ),
        },
        {
          permission: ActivePermission.REVIEWER,
          userIds: currentReviewer,
        },
        {
          permission: ActivePermission.CREATOR,
          userIds: currentCreator,
        },
      ]?.filter((item) => item?.userIds?.length);
      return usersPermissions?.map((item) => ({
        permission: item?.permission,
        userIds: item?.userIds?.map((i) => i.toString()),
      }));
    },
    [dataUserAssignmentConvert],
  );

  const handleAccept = (data) => {
    const { input, ...other } = data;
    const userAssignment = dataUserAssignmentBody(other);
    dispatch(
      acceptAuditCheckListAction.request({
        id,
        body: {
          status: 'Reviewed',
          remark: data?.dataInput || '',
          userAssignment: {
            planningRequestId: id,
            usersPermissions: userAssignment,
          },
        },
        requestSuccess: () => {
          dispatch(getAuditCheckListDetailAction.request(id));
          handleGetGeneralInfo();
          setIsStatusActionHeader('');
        },
      }),
    );
  };

  const handleReject = (remark?: string) => {
    if (auditCheckListDetail.status === 'Reviewed') {
      dispatch(
        approveAuditCheckListAction.request({
          id,
          body: {
            status: 'Rejected',
            remark: remark || '',
            userAssignment: {
              planningRequestId: id,
              usersPermissions: dataUserAssignmentConvert,
            },
          },

          requestSuccess: () => {
            dispatch(getAuditCheckListDetailAction.request(id));
            handleGetGeneralInfo();
            setIsStatusActionHeader('');
            // setRemarks('');
            // setIsFirstChange(true);
          },
        }),
      );
    } else {
      dispatch(
        acceptAuditCheckListAction.request({
          id,
          body: {
            status: 'Rejected',
            remark: remark || '',
            userAssignment: {
              planningRequestId: id,
              usersPermissions: dataUserAssignmentConvert,
            },
          },
          requestSuccess: () => {
            dispatch(getAuditCheckListDetailAction.request(id));

            handleGetGeneralInfo();

            setIsStatusActionHeader('');
            // setRemarks('');
            // setIsFirstChange(true);
          },
        }),
      );
    }
  };

  const handleApprove = (remark?: string) => {
    dispatch(
      approveAuditCheckListAction.request({
        id,
        body: {
          status: 'Approved',
          remark: remark || '',
          userAssignment: {
            planningRequestId: id,
            usersPermissions: dataUserAssignmentConvert,
          },
        },
        requestSuccess: () => {
          dispatch(getAuditCheckListDetailAction.request(id));
          handleGetGeneralInfo();
          setIsStatusActionHeader('');
        },
      }),
    );
  };

  const handleCancelled = (remark?: string) => {
    dispatch(
      cancelAuditCheckListAction.request({
        id,
        body: {
          status: 'Cancelled',
          remark: remark || '',
          userAssignment: {
            planningRequestId: id,
            usersPermissions: dataUserAssignmentConvert,
          },
        },

        requestSuccess: () => {
          dispatch(getAuditCheckListDetailAction.request(id));
          handleGetGeneralInfo();
          setIsStatusActionHeader('');
        },
      }),
    );
  };
  const isCreator = userInfo?.id === generalInfoDetail?.createdUserId;
  const headerButtons: HeaderBtn[] = useMemo(() => {
    let buttons: HeaderBtn[] = [
      {
        name: HeaderBtnType.PREVIEW,
        onClick: handlePreview,
        disabled: false,
      },
    ];

    const caseEditDraft =
      generalInfoDetail?.status === ItemStatus.DRAFT && isCreator;

    const caseEditSubmitted =
      generalInfoDetail?.status === ItemStatus.SUBMITTED &&
      workFlowActiveUserPermission.includes(ActivePermission.REVIEWER) &&
      reviewerAssignmentPermission;

    const caseEditRejected =
      generalInfoDetail?.status === ItemStatus.REJECTED && isCreator;

    const caseReview =
      generalInfoDetail?.status === ItemStatus.REVIEWED &&
      workFlowActiveUserPermission.includes(ActivePermission.APPROVER) &&
      approverAssignmentPermission;

    const caseApprover =
      generalInfoDetail?.status === ItemStatus.APPROVED &&
      workFlowActiveUserPermission.includes(ActivePermission.APPROVER) &&
      approverAssignmentPermission;

    if (
      search !== CommonQuery.EDIT &&
      (caseEditRejected ||
        caseEditSubmitted ||
        caseEditDraft ||
        caseReview ||
        caseApprover)
    ) {
      const hasEdit = permissionCheck(
        userInfo,
        {
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.AUDIT_CHECKLIST,
          action: ActionTypeEnum.EXECUTE,
        },
        search,
      );
      if (
        hasEdit &&
        userInfo?.mainCompanyId === auditCheckListDetail?.companyId
      ) {
        buttons = [
          ...buttons,
          {
            name: HeaderBtnType.EDIT,
            onClick: () => {
              history.push(
                `${AppRouteConst.auditCheckListDetail(id)}${CommonQuery.EDIT}`,
              );
            },
            disabled: false,
          },
        ];
      }
    }
    buttons = [
      {
        name: HeaderBtnType.BACK,
        onClick: () => {
          history.goBack();
        },
        disabled: false,
      },
      ...buttons,
    ];

    if (
      search !== CommonQuery.EDIT &&
      generalInfoDetail?.status === 'Draft' &&
      isCreator &&
      workFlowActiveUserPermission.includes(ActivePermission.CREATOR)
    ) {
      buttons = [
        ...buttons,
        {
          name: HeaderBtnType.DELETE,
          onClick: () => {
            showConfirmBase({
              isDelete: true,
              txTitle: renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS['Delete?'],
              ),
              txMsg: renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS[
                  'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
                ],
              ),
              txButtonLeft: renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS.Cancel,
              ),
              txButtonRight: renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_LIST_FIELDS.Delete,
              ),
              onPressButtonRight: () =>
                dispatch(
                  deleteAuditCheckListAction.request({
                    id,
                    getListAuditCheckList: () => {
                      history.push(AppRouteConst.AUDIT_CHECKLIST);
                    },
                  }),
                ),
            });
          },
          disabled: false,
        },
      ];
    }
    if (
      search === CommonQuery.EDIT &&
      auditCheckListDetail?.status === 'Submitted' &&
      reviewerAssignmentPermission &&
      workFlowActiveUserPermission.includes(ActivePermission.REVIEWER)
    ) {
      buttons = [
        ...buttons,
        {
          name: HeaderBtnType.ACCEPT,
          onClick: () => {
            setIsStatusActionHeader(HeaderBtnType.ACCEPT);
            openModalAssignment(true);
            setTitleModalRemark(HeaderBtnType.ACCEPT);
          },
          disabled: false,
        },
        {
          name: HeaderBtnType.REJECT,
          onClick: () => {
            setIsStatusActionHeader(HeaderBtnType.REJECT);
            openModalRemark(true);
            setTitleModalRemark(HeaderBtnType.REJECT);
          },
          disabled: false,
        },
      ];
    }

    if (
      search === CommonQuery.EDIT &&
      auditCheckListDetail?.status === 'Reviewed' &&
      approverAssignmentPermission &&
      workFlowActiveUserPermission.includes(ActivePermission.APPROVER)
    ) {
      buttons = [
        ...buttons,
        {
          name: HeaderBtnType.APPROVE,
          onClick: () => {
            setIsStatusActionHeader(HeaderBtnType.APPROVE);
            openModalRemark(true);
            setTitleModalRemark(HeaderBtnType.APPROVE);
          },
          disabled: false,
        },
        {
          name: HeaderBtnType.REJECT,
          onClick: () => {
            setIsStatusActionHeader(HeaderBtnType.REJECT);
            openModalRemark(true);
            setTitleModalRemark(HeaderBtnType.REJECT);
          },
          disabled: false,
        },
      ];
    }

    if (
      search === CommonQuery.EDIT &&
      auditCheckListDetail?.status === 'Approved' &&
      approverAssignmentPermission &&
      workFlowActiveUserPermission.includes(ActivePermission.APPROVER)
    ) {
      buttons = [
        ...buttons,
        {
          name: HeaderBtnType.CANCEL,
          onClick: () => {
            setIsStatusActionHeader(HeaderBtnType.CANCEL);
            openModalRemark(true);
            setTitleModalRemark(HeaderBtnType.CANCEL);
          },
          disabled: false,
        },
      ];
    }

    return buttons;
  }, [
    generalInfoDetail?.status,
    isCreator,
    workFlowActiveUserPermission,
    reviewerAssignmentPermission,
    approverAssignmentPermission,
    search,
    auditCheckListDetail?.status,
    auditCheckListDetail?.companyId,
    userInfo,
    id,
    dynamicFields,
    dispatch,
  ]);

  const switchTab = (newTab: string) => {
    setCurrentActiveTab(newTab);
  };

  const handleSubmitAction = (remark?: string) => {
    switch (isStatusActionHeader) {
      case HeaderBtnType.ACCEPT: {
        handleAccept(remark);
        break;
      }
      case HeaderBtnType.REJECT: {
        handleReject(remark);
        break;
      }
      case HeaderBtnType.APPROVE: {
        handleApprove(remark);
        break;
      }

      case HeaderBtnType.CANCEL: {
        handleCancelled(remark);
        break;
      }

      default:
    }
  };

  const handleSubmitAuditCheckList = useCallback(
    (data?: any) => {
      dispatch(
        submitAuditCheckListAction.request({
          ...data,
          id: auditCheckListDetail?.id,
        }),
      );
    },
    [auditCheckListDetail?.id, dispatch],
  );

  const handleSubmitGeneralInfo = useCallback(
    (data: GeneralInfoFormModel) => {
      const body: CreateGeneralInfoBody = {
        // id: generalInfoDetail.id,
        timezone: formHelper.currentTimeZone,
        // appType: data.appType,
        // chkType: data.chkType,
        // code: formHelper.chkCode.verifySignature,
        auditEntity: data.auditEntity,
        name: data.name,
        revisionDate: moment(data.revisionDate).format(),
        revisionNumber: data.revisionNumber,
        validityFrom: data.validityPeriod[0].format(),
        validityTo: data.validityPeriod[1].format(),
        visitTypes: data.visitTypes,
        inspectionModule: data.inspectionModule,
        referencesCategory: data.referencesCategory,
      };

      dispatch(
        updateGeneralInfoAction.request({
          id: generalInfoDetail?.id,
          body,
          handleSuccess: () => {
            handleGetGeneralInfo();
            dispatch(getAuditCheckListDetailAction.request(id));
            history.push(
              AppRouteConst.auditCheckListDetail(generalInfoDetail?.id),
            );
          },
        }),
      );
    },
    [
      formHelper.currentTimeZone,
      dispatch,
      generalInfoDetail?.id,
      handleGetGeneralInfo,
      id,
    ],
  );

  const isEditForm = useMemo(() => {
    if (
      auditCheckListDetail?.status === ItemStatus.APPROVED ||
      auditCheckListDetail?.status === ItemStatus.CANCELLED
    ) {
      return false;
    }
    return search === CommonQuery.EDIT;
  }, [auditCheckListDetail?.status, search]);

  // This field is required
  // const messageError = (length: number) =>
  //   length > 0
  //     ? 'Remark must be longer than or equal to 2 characters'
  //     : 'This field is required';

  // const renderActionHeader = () => (
  //   <div>
  //     {isStatusActionHeader === HeaderBtnType.REJECT ? (
  //       <Input
  //         label="Reviewers are required to enter remarks for their rejection"
  //         maxLength={128}
  //         isRequired
  //         placeholder="Enter remarks"
  //         onChange={(e) => {
  //           setRemarks(e.target.value);
  //           setIsFirstChange(false);
  //         }}
  //         messageRequired={
  //           !isFirstChange &&
  //           remarks.trim().length < 2 &&
  //           messageError(remarks.trim().length)
  //         }
  //       />
  //     ) : (
  //       <p>Are you sure you want to proceed with this action?</p>
  //     )}

  //     <div className="d-flex w-50 mx-auto mt-4">
  //       <Button
  //         className={cx('w-100 me-3')}
  //         buttonType={ButtonType.CancelOutline}
  //         onClick={() => {
  //           setRemarks('');
  //           setIsFirstChange(true);
  //           setIsStatusActionHeader('');
  //         }}
  //       >
  //         Cancel
  //       </Button>
  //       <Button
  //         onClick={() => {
  //           if (
  //             remarks.trim().length < 2 &&
  //             isStatusActionHeader === HeaderBtnType.REJECT
  //           ) {
  //             setIsFirstChange(false);
  //           } else {
  //             handleSubmitAction();
  //           }
  //         }}
  //         buttonType={ButtonType.Primary}
  //         className={cx('w-100 ms-3')}
  //       >
  //         Confirm
  //       </Button>
  //     </div>
  //   </div>
  // );

  return (
    <div className={styles.wrapDetail}>
      <Container className={styles.headerContainer}>
        <div className={cx(styles.headers)}>
          <div className="d-flex justify-content-between">
            <div className="">
              <BreadCrumb
                current={
                  search === CommonQuery.EDIT
                    ? BREAD_CRUMB.AUDIT_CHECKLIST_EDIT
                    : BREAD_CRUMB.AUDIT_CHECKLIST_DETAIL
                }
              />

              <div className={cx('fw-bold', styles.title)}>
                {renderDynamicModuleLabel(
                  listModuleDynamicLabels,
                  DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
                )}
              </div>
            </div>
            <HeaderButtons
              buttons={headerButtons}
              dynamicLabels={dynamicFields}
            />
          </div>
        </div>
        <div className={cx('d-flex flex-row justify-content-between')}>
          <div className={cx('d-flex ', styles.tabsWrapper)}>
            <Button
              onClick={() => switchTab(GENERAL_INFORMATION)}
              type="button"
              className={cx('fw-bold', styles.tabsButton, {
                [styles.tabsButtonActive]:
                  currentActiveTab.includes(GENERAL_INFORMATION),
              })}
            >
              {renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                  'General information'
                ],
              )}
            </Button>
            <Button
              onClick={() => switchTab(QUESTION_LIST)}
              type="button"
              className={cx('fw-bold', styles.tabsButton, {
                [styles.tabsButtonActive]:
                  currentActiveTab.includes(QUESTION_LIST),
              })}
            >
              {renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Question list'],
              )}
            </Button>
          </div>
          <div className="d-flex align-items-center">
            {currentActiveTab !== GENERAL_INFORMATION && (
              <div className="d-flex align-items-center">
                <div className={styles.codeTitle}>
                  {renderDynamicLabel(
                    dynamicFields,
                    AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                      'Checklist code'
                    ],
                  )}
                  :
                  <span className={styles.codeValue}>
                    {auditCheckListDetail?.code}
                  </span>
                </div>
                <div className={styles.stick} />
              </div>
            )}
            <PopoverStatus
              header={renderDynamicLabel(
                dynamicFields,
                AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
                  'Workflow progress'
                ],
              )}
              dynamicLabels={dynamicFields}
              stepStatusItems={stepStatusItems}
              status={generalInfoDetail?.status}
              lineStepStyle={styles.lineStepStyle}
            />
          </div>
        </div>
      </Container>
      {currentActiveTab === GENERAL_INFORMATION ? (
        <>
          {generalLoading || formHelper.loading || loading ? (
            <div className="d-flex justify-content-center">
              <img
                src={images.common.loading}
                className={styles.loading}
                alt="loading"
              />
            </div>
          ) : (
            <GeneralInfoForm
              isEdit={
                search === CommonQuery.EDIT &&
                (generalInfoDetail.status === ItemStatus.DRAFT ||
                  generalInfoDetail.status === ItemStatus.REJECTED)
              }
              data={generalInfoDetail}
              isTemplateChosen={false}
              isCreate={false}
              masterDataOptions={formHelper.masterDataOptions}
              onSubmit={handleSubmitGeneralInfo}
              statusHistory={formHelper?.statusHistory}
            />
          )}
        </>
      ) : (
        <>
          <QuestionListForm
            id={id}
            inProgressData={questionProgress}
            isMultiQuestion={isMultiQuestion}
            answerOptions={aOptions}
            setAnswerOptions={setAnswerOptions}
            setQuestionProgress={setQuestionProgress}
            setIsMultiQuestion={setIsMultiQuestion}
            isEdit={isEditForm}
            dataPackage={formHelper.dataPackage}
            loadingQuestionDetail={formHelper.loadingQuestionDetail}
            handleSaveQuestion={handleSaveQuestion}
            fetchLocationData={formHelper.fetchLocationData}
            fetchCategoryData={formHelper.fetchCategoryData}
            fetchVesselTypeData={formHelper.fetchVesselTypeData}
            fetchCDIData={formHelper.fetchCDIData}
            fetchCharterOwnerData={formHelper.fetchCharterOwnerData}
            fetchShipRanksData={formHelper.fetchShipRanksData}
            fetchShoreDepartmentData={formHelper.fetchShoreDepartmentData}
            fetchVIQData={formHelper.fetchVIQData}
            fetchShoreRankData={formHelper.fetchShoreRankData}
            fetchTopicsData={formHelper.fetchTopicsData}
            fetchShipDepartmentData={formHelper.fetchShipDepartmentData}
            removeDataQuestionDetail={formHelper.removeDataQuestionDetail}
            fetchShipDirectResponsibleData={
              formHelper.fetchShipDirectResponsibleData
            }
            setQuestionDetailChecklist={formHelper.setQuestionDetailChecklist}
            questionDetail={formHelper.questionDetail}
            handleSubmitAuditCheckList={handleSubmitAuditCheckList}
            disabledSubmit={listQuestion?.length === 0}
            status={auditCheckListDetail?.status}
            moreButton={
              auditCheckListDetail?.status === ItemStatus.DRAFT ||
              auditCheckListDetail?.status === ItemStatus.REJECTED
            }
            isCreator={isCreator}
          />
        </>
      )}
      <PreviewModal
        header={renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Checklist preview'],
        )}
        bodyClassName={styles.modalBody}
        toggle={() => setPreviewModal(!previewModal)}
        data={auditCheckListDetail}
        modal={previewModal}
        dynamicLabels={dynamicFields}
      />
      <Assignment
        titleModal={renderDynamicLabel(
          dynamicFields,
          AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Accept,
        )}
        initialData={dataUserAssignmentConvert}
        userAssignmentDetails={auditCheckListDetail?.userAssignments}
        isOpen={modalAssignMentVisible}
        onClose={() => openModalAssignment(false)}
        onConfirm={(values) => {
          handleAccept(values);
          openModalAssignment(false);
        }}
        dynamicLabel={dynamicFields}
      />

      {/* {isStatusActionHeader?.length > 0 && !modalRemarkVisible && (
        <ModalComponent
          isOpen={
            isStatusActionHeader.length > 0 &&
            isStatusActionHeader !== HeaderBtnType.ACCEPT
          }
          title="Confirmation"
          toggle={() => {
            setIsStatusActionHeader('');
            setRemarks('');
            setIsFirstChange(true);
          }}
          content={renderActionHeader()}
          w="500px"
        />
      )} */}
      <ModalRemark
        isOpen={modalRemarkVisible}
        onClose={async () => {
          await setIsStatusActionHeader('');
          openModalRemark(false);
        }}
        title={renderDynamicLabel(dynamicFields, capitalize(titleModalRemark))}
        content={`${renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['Are you sure you want to'],
        )} ${renderDynamicLabel(
          dynamicFields,
          String(titleModalRemark).toLowerCase(),
        )}?`}
        onConfirm={(remark) => {
          handleSubmitAction(remark);
          openModalRemark(false);
        }}
        dynamicLabels={dynamicFields}
      />
    </div>
  );
}
