import {
  forwardRef,
  useState,
  useImperativeHandle,
  createRef,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { I18nNamespace } from 'constants/i18n.const';
import { Row, Col } from 'reactstrap';
import { useForm, FieldValues, Controller } from 'react-hook-form';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { Option } from 'constants/filter.const';
import { GroupButton } from 'components/ui/button/GroupButton';
import {
  InternalAuditReportFormContext,
  WorkflowStatus,
  FindingStatus,
} from 'contexts/internal-audit-report/IARFormContext';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { NonConformity } from 'models/api/internal-audit-report/internal-audit-report.model';
import { getListDepartmentMasterActionsApi } from 'api/department-master.api';
import { getListVIQsActionsApi } from 'api/viq.api';
import { getListMainCategoryActionsApi } from 'api/main-category.api';
import { getListSecondCategoryActionsApi } from 'api/second-category.api';
import {
  assignPICInternalAuditReportActionsApi,
  editFindingItemActionsApi,
  editFindingItemActionsByPicApi,
  reviewFindingItemActionsApi,
} from 'api/internal-audit-report.api';
import { getListUserRecordActionsApi } from 'api/user.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import moment from 'moment';
import Input from 'components/ui/input/Input';
import { getListFileActions } from 'store/dms/dms.action';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import cx from 'classnames';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import images from 'assets/images/images';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import {
  IARReviewPermission,
  ModuleName,
  CommonQuery,
} from 'constants/common.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { useLocation } from 'react-router-dom';
import styles from 'components/internal-audit-report/forms/form.module.scss';
import {
  useReviewStatus,
  useAuditor,
  useDraftOrReassigned,
  populateStatus,
} from 'components/internal-audit-report/forms/helpers/helpers';
import 'components/internal-audit-report/forms/form.scss';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface NonConformityModalData {
  isEdit: boolean;
  data: NonConformity;
}

export enum ReviewAction {
  REASSIGN = 'reassigned',
  CLOSE_OUT = 'close out',
}

export enum SubmitFormAction {
  NEW_RECORD_IN_CONTEXT = 'newRecord',
  SUBMIT_ROF_IN_REVIEW_IAR = 'submitInReview',
  ASSIGN_PIC = 'assignPIC',
  EDIT_FINDING_ITEM_BY_PIC = 'editByPIC',
  EDIT_FINDING_ITEM = 'editItems',
}

const NonConformityModalComponent = forwardRef((_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { checkReviewStatus, isReviewerOrApprover } = useReviewStatus();
  const isAuditor = useAuditor();
  const isDraftOrReassigned = useDraftOrReassigned();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.INTERNAL_AUDIT_REPORT,
    I18nNamespace.COMMON,
  ]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { search } = useLocation();
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });

  const { userInfo } = useSelector((store) => store.authenticate);
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { workFlowActiveUserPermission } = useSelector(
    (store) => store.workFlow,
  );
  const paramsMaster = {
    page: 1,
    pageSize: -1,
    status: 'active',
    companyId: userInfo?.mainCompanyId,
  };

  const [data, setData] = useState<NonConformity>();
  const {
    users,
    department,
    mainCategory,
    secondCategory,
    viqCategory,
    nonConformityList,
    handleSetDepartment,
    handleSetUsers,
    handleSetMainCategory,
    handleSetSecondCategory,
    handleSetViqCategory,
    handleSubmitReportFindingItems,
    handleSetNonConformityList,
  } = useContext(InternalAuditReportFormContext);
  const departmentOption = useMemo(
    () =>
      department?.map((i) => ({
        value: i.id,
        label: i.name,
      })),
    [department],
  );
  const mainCategoryOption = useMemo(
    () =>
      mainCategory?.map((i) => ({
        value: i.id,
        label: i.name,
      })),
    [mainCategory],
  );
  const secondCategoryOption = useMemo(
    () =>
      secondCategory?.map((i) => ({
        value: i.id,
        label: i.name,
      })),
    [secondCategory],
  );
  const viqCategoryOption = useMemo(
    () =>
      viqCategory?.map((i) => ({
        value: i.id,
        label: i.refNo,
      })),
    [viqCategory],
  );

  const picOption = useMemo(
    () =>
      users?.map((i) => ({
        value: i.id,
        label: i.username,
      })),
    [users],
  );

  const defaultValues = {
    auditType: '',
    natureFindings: '',
    department: [],
    mainCategoryId: [],
    secondCategoryId: [],
    picId: [],
    picRemark: '',
    viqId: [],
    findings: '',
    findingRemark: '',
    isSignificant: false,
    rectifiedOnBoard: false,
    findingStatus: null,
    reference: '',
    remark: '',
    planedCompletionDate: null,
    actualCompletionDate: null,
    immediateAction: '',
    preventiveAction: '',
    correctiveAction: '',
    findingAttachments: [],
  };

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const hideViqAutogenerate = useMemo(() => {
    if (
      data?.chkQuestionId &&
      !data?.viqId &&
      !data?.chkQuestion?.referencesCategoryData?.[0]?.valueId
    ) {
      return true;
    }
    return false;
  }, [
    data?.chkQuestion?.referencesCategoryData,
    data?.chkQuestionId,
    data?.viqId,
  ]);

  const hideSecondCategoryAutogenerate = useMemo(() => {
    if (data?.chkQuestionId && !data?.secondCategoryId) {
      return true;
    }
    return false;
  }, [data?.chkQuestionId, data?.secondCategoryId]);

  useEffect(() => {
    if (data) {
      const isCloseoutItem =
        internalAuditReportDetail?.status ===
        InternalAuditReportStatus.CLOSEOUT;

      const viqId =
        data?.viqId ||
        data?.chkQuestion?.referencesCategoryData?.[0]?.valueId ||
        null;

      const newDepartment = departmentOption.find(
        (i) => i.value === data?.departmentId,
      );

      const newMainCategory = mainCategoryOption.find(
        (i) => i.value === data.mainCategoryId,
      );

      const newSecondCategory = secondCategoryOption.find(
        (i) => i.value === data.secondCategoryId,
      );

      const newViqCategory = viqCategoryOption.find((i) => i.value === viqId);
      const newPIC = picOption.find((i) => i.value === data.picId);

      // in closeout status display by name(can't change by update master data)
      if (isCloseoutItem) {
        if (newDepartment?.label) {
          newDepartment.label = data.departmentName;
        }
        if (newMainCategory?.label) {
          newMainCategory.label = data.mainCategoryName;
        }
        if (newSecondCategory?.label) {
          newSecondCategory.label = data.secondCategoryName;
        }
        if (newPIC?.label) {
          newPIC.label = data.picUsername;
        }
      }
      if (data?.findingAttachments?.length > 0) {
        dispatch(
          getListFileActions.request({ ids: data?.findingAttachments || [] }),
        );
      }
      setValue('findingAttachments', data.findingAttachments || []);
      setValue('auditType', data?.auditTypeName);
      setValue('natureFindings', data?.natureFindingName);
      setValue('department', newDepartment ? [newDepartment] : []);
      setValue('mainCategoryId', newMainCategory ? [newMainCategory] : []);
      setValue(
        'secondCategoryId',
        newSecondCategory ? [newSecondCategory] : [],
      );
      setValue('picId', newPIC ? [newPIC] : []);
      setValue('picRemark', data.picRemark);
      setValue('viqId', newViqCategory ? [newViqCategory] : []);
      setValue('findings', data.findingComment);
      setValue('findingRemark', data.findingRemark || '');
      setValue('isSignificant', data.isSignificant || false);
      setValue('rectifiedOnBoard', data?.rectifiedOnBoard || false);
      setValue('findingStatus', data.findingStatus);
      setValue('remark', data.remark || '');
      setValue(
        'planedCompletionDate',
        moment(data.planedCompletionDate).isValid() === true
          ? moment(data.planedCompletionDate)
          : '',
      );
      setValue(
        'actualCompletionDate',
        moment(data.actualCompletionDate).isValid() === true
          ? moment(data.actualCompletionDate)
          : '',
      );
      setValue('immediateAction', data.immediateAction || '');
      setValue('preventiveAction', data.preventiveAction || '');
      setValue('correctiveAction', data.correctiveAction || '');
      setValue('reference', data?.reference || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useImperativeHandle(ref, () => ({
    showNonConformityModal: (data: NonConformityModalData) => {
      setVisible(true);
      setIsEdit(data.isEdit);
      setData(data.data);
    },
  }));

  const handleCancel = useCallback(() => {
    if (isEdit) {
      setVisible(false);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Cancel?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () => setVisible(false),
      });
    }
  }, [dynamicLabels, isEdit]);

  // Build data body for each actions
  const buildDataBody = (formData: any, action: SubmitFormAction) => {
    const dataBody = {
      ...(action === SubmitFormAction.NEW_RECORD_IN_CONTEXT && {
        ...data,
        findingStatus: formData.findingStatus,
      }),

      ...(action === SubmitFormAction.SUBMIT_ROF_IN_REVIEW_IAR && {
        id: data.id,
        natureFindingId: data?.natureFindingId,
        auditTypeId: data?.auditTypeId,
        findingRemark: formData.findingRemark,
        findingComment: formData.findings,
        reference: data?.reference || undefined,
      }),

      ...(action === SubmitFormAction.ASSIGN_PIC && {
        workflowStatus: data?.workflowStatus,
      }),

      ...(action === SubmitFormAction.EDIT_FINDING_ITEM_BY_PIC && {
        findingStatus: formData.findingStatus,
        picId: (formData?.picId && formData?.picId[0]?.value) || null,
      }),
      ...(action === SubmitFormAction.EDIT_FINDING_ITEM && {
        mainCategoryId:
          (formData.mainCategoryId && formData.mainCategoryId[0]?.value) ||
          undefined,
        secondCategoryId:
          (formData.secondCategoryId && formData.secondCategoryId[0]?.value) ||
          undefined,
        findingStatus: formData.findingStatus,
        picId: (formData?.picId && formData?.picId[0]?.value) || null,
      }),
      ...([
        SubmitFormAction.NEW_RECORD_IN_CONTEXT.toString(),
        SubmitFormAction.SUBMIT_ROF_IN_REVIEW_IAR.toString(),
      ].includes(action) && {
        mainCategoryId:
          (formData.mainCategoryId && formData.mainCategoryId[0]?.value) ||
          undefined,
        secondCategoryId:
          (formData.secondCategoryId && formData.secondCategoryId[0]?.value) ||
          undefined,
        findingStatus: formData.findingStatus,
      }),

      ...([
        SubmitFormAction.NEW_RECORD_IN_CONTEXT.toString(),
        SubmitFormAction.SUBMIT_ROF_IN_REVIEW_IAR.toString(),
        SubmitFormAction.ASSIGN_PIC.toString(),
      ].includes(action) && {
        picId: (formData?.picId && formData?.picId[0]?.value) || null,
      }),

      planedCompletionDate: moment(formData?.planedCompletionDate).isValid()
        ? moment(formData?.planedCompletionDate).toISOString()
        : undefined,
      actualCompletionDate: moment(formData?.actualCompletionDate).isValid()
        ? moment(formData?.actualCompletionDate).toISOString()
        : undefined,
      picRemark: formData.picRemark,
      departmentId:
        (formData?.department && formData?.department[0]?.value) || undefined,
      viqId: (formData?.viqId && formData.viqId[0]?.value) || undefined,
      immediateAction: formData.immediateAction,
      preventiveAction: formData.preventiveAction,
      correctiveAction: formData.correctiveAction,
      findingAttachments: formData.findingAttachments,
      remark: formData.remark,
      isSignificant: formData.isSignificant,
      rectifiedOnBoard: formData.rectifiedOnBoard,
    };

    return dataBody;
  };

  const handleStoreNonConformityInContext = (formData) => {
    const newNonConformityList = [...nonConformityList];
    const currentRecordIndex = newNonConformityList.findIndex(
      (i) => i.id === data?.id,
    );
    const newRecord = buildDataBody(
      formData,
      SubmitFormAction.NEW_RECORD_IN_CONTEXT,
    );
    newNonConformityList[currentRecordIndex] = newRecord;
    handleSetNonConformityList(newNonConformityList);
  };

  const handleSubmitReportFindingItemsInReviewIAR = (formData) => {
    const dataForReviewIAR = buildDataBody(
      formData,
      SubmitFormAction.SUBMIT_ROF_IN_REVIEW_IAR,
    );
    handleSubmitReportFindingItems(dataForReviewIAR);
  };

  const handleAssignPIC = (formData) => {
    const dataForAssignPIC = buildDataBody(
      formData,
      SubmitFormAction.ASSIGN_PIC,
    );
    setLoading(true);
    assignPICInternalAuditReportActionsApi({
      id: data?.internalAuditReportId,
      findingItemId: data?.id,
      data: dataForAssignPIC,
    })
      .then((r) => {
        handleStoreNonConformityInContext(formData);
        toastSuccess('You have updated item successfully');
      })
      .catch((e) => {
        toastError(
          `An error occurred while updating finding item: ${e?.message}`,
        );
      })
      .finally(() => {
        setLoading(false);
        setVisible(false);
      });
  };

  const handleEditFindingItemsByPIC = (formData) => {
    const dataForEditFindingItemsByPIC = buildDataBody(
      formData,
      SubmitFormAction.EDIT_FINDING_ITEM_BY_PIC,
    );
    setLoading(true);

    editFindingItemActionsByPicApi({
      id: data?.internalAuditReportId,
      findingItemId: data?.id,
      data: dataForEditFindingItemsByPIC,
    })
      .then((r) => {
        handleStoreNonConformityInContext(formData);
        handleSubmitReportFindingItemsInReviewIAR(formData);
        toastSuccess('You have updated item successfully');
      })
      .catch((e) =>
        toastError(
          `An error occurred while updating finding item: ${e?.message}`,
        ),
      )
      .finally(() => {
        setLoading(false);
        setVisible(false);
      });
  };

  const handleEditFindingItems = (formData) => {
    const dataForEditFindingItemsByPIC = buildDataBody(
      formData,
      SubmitFormAction.EDIT_FINDING_ITEM,
    );
    setLoading(true);
    editFindingItemActionsApi({
      id: data?.internalAuditReportId,
      findingItemId: data?.id,
      data: dataForEditFindingItemsByPIC,
    })
      .then((r) => {
        handleStoreNonConformityInContext(formData);
        handleSubmitReportFindingItemsInReviewIAR(formData);
        toastSuccess('You have updated item successfully');
      })
      .catch((e) =>
        toastError(
          `An error occurred while updating finding item: ${e?.message}`,
        ),
      )
      .finally(() => {
        setLoading(false);
        setVisible(false);
      });
  };

  const handleReviewFindingItem = (action: ReviewAction) => {
    const dataForReviewFindingItem = {
      workflowStatus:
        action === ReviewAction.REASSIGN
          ? WorkflowStatus.REASSIGNED
          : WorkflowStatus.CLOSE_OUT,
    };
    setLoading(true);
    reviewFindingItemActionsApi({
      id: data?.internalAuditReportId,
      findingItemId: data?.id,
      data: dataForReviewFindingItem,
    })
      .then((r) => {
        const newNonConformityList = [...nonConformityList];
        const currentRecordIndex = newNonConformityList.findIndex(
          (i) => i.id === data?.id,
        );
        const newRecord = {
          ...data,
          workflowStatus:
            action === ReviewAction.REASSIGN
              ? WorkflowStatus.REASSIGNED
              : WorkflowStatus.CLOSE_OUT,
          ...(action === ReviewAction.REASSIGN && {
            findingStatus: FindingStatus.OPENED,
          }),
        };
        newNonConformityList[currentRecordIndex] = newRecord;
        handleSetNonConformityList(newNonConformityList);
        toastSuccess('You have updated item successfully');
      })
      .catch((e) =>
        toastError(
          `An error occurred while updating finding item: ${e?.message}`,
        ),
      )
      .finally(() => {
        setLoading(false);
        setVisible(false);
      });
  };

  const handleSave = (formData) => {
    if (userInfo?.id === data?.picId) {
      // if (
      //   isDraftOrReassigned() &&
      //   isAuditor() &&
      //   !internalAuditReportDetail?.internalAuditReportHistories?.find(
      //     (i) => i?.status === 'submitted',
      //   )
      // ) {
      //   handleAssignPIC(formData);
      // } else if (data?.workflowStatus !== WorkflowStatus.CLOSE_OUT) {
      //   handleEditFindingItemsByPIC(formData);
      // }
      if (isDraftOrReassigned()) {
        if (isAuditor()) {
          handleAssignPIC(formData);
        } else if (
          internalAuditReportDetail?.internalAuditReportHistories?.find(
            (i) => i?.status === 'submitted',
          )
        ) {
          handleEditFindingItemsByPIC(formData);
        }
      } else if (data?.workflowStatus !== WorkflowStatus.CLOSE_OUT) {
        handleEditFindingItemsByPIC(formData);
      }
    } else if (!data?.picId) {
      if (
        formData?.picId &&
        formData?.picId[0]?.value &&
        (checkReviewStatus() ||
          (internalAuditReportDetail?.status ===
            InternalAuditReportStatus.APPROVED &&
            isReviewerOrApprover()) ||
          (isAuditor() && isDraftOrReassigned()))
      ) {
        handleAssignPIC(formData);
      } else if (
        !(formData?.picId && formData?.picId[0]?.value) &&
        (checkReviewStatus() ||
          (internalAuditReportDetail?.status ===
            InternalAuditReportStatus.APPROVED &&
            isReviewerOrApprover()))
      ) {
        handleEditFindingItems(formData);
      } else {
        handleEditFindingItems(formData);
        setVisible(false);
      }
    } else if (data?.picId && userInfo?.id !== data?.picId) {
      if (isDraftOrReassigned()) {
        if (isAuditor()) {
          handleAssignPIC(formData);
        }
      } else if (
        data?.workflowStatus !== WorkflowStatus.CLOSE_OUT &&
        (checkReviewStatus() ||
          (internalAuditReportDetail?.status ===
            InternalAuditReportStatus.APPROVED &&
            isReviewerOrApprover()))
      ) {
        handleEditFindingItems(formData);
        setVisible(false);
      } else {
        handleEditFindingItems(formData);
        setVisible(false);
      }
    }
  };

  const isFindingStatusDisable = () => {
    const picIdIsMainAccount = data?.picId && userInfo?.id === data?.picId;
    const picIdIsNotMainAccount = data?.picId && userInfo?.id !== data?.picId;
    const checkStatusIsInValid =
      (isDraftOrReassigned() && !data?.picId) ||
      (isDraftOrReassigned() && data?.picId && userInfo?.id !== data?.picId);
    if (loading) {
      return true;
    }
    if (internalAuditReportDetail?.status === InternalAuditReportStatus.DRAFT) {
      return true;
    }
    if (!isEdit) {
      return true;
    }
    if (!data?.picId) {
      return false;
    }
    if (picIdIsNotMainAccount) {
      return true;
    }
    if (picIdIsMainAccount) {
      return false;
    }
    if (!data?.picId) {
      return false;
    }

    if (checkStatusIsInValid) {
      return true;
    }

    return false;
  };

  const findingStatusOptions: Option[] = [
    { value: FindingStatus.CLOSED, label: FindingStatus.CLOSED },
    { value: FindingStatus.OPENED, label: FindingStatus.OPENED },
  ];

  const reassignCloseOutVisible = useMemo(() => {
    const isNotAssignPicWhenReviewOrApprover =
      isReviewerOrApprover() &&
      !data?.picId &&
      data?.workflowStatus !== 'Close out';
    return (
      isNotAssignPicWhenReviewOrApprover ||
      checkReviewStatus() ||
      (internalAuditReportDetail?.status ===
        InternalAuditReportStatus.REVIEWED_5 &&
        workFlowActiveUserPermission?.includes(
          IARReviewPermission.REVIEWER_5,
        )) ||
      (internalAuditReportDetail?.status ===
        InternalAuditReportStatus.APPROVED &&
        isReviewerOrApprover())
    );
  }, [
    checkReviewStatus,
    data?.picId,
    data?.workflowStatus,
    internalAuditReportDetail?.status,
    isReviewerOrApprover,
    workFlowActiveUserPermission,
  ]);

  return (
    <Modal
      isOpen={visible}
      title={isEdit ? t('editNonConformity') : 'Non conformity'}
      modalType={ModalType.CENTER}
      hiddenFooter
      className={styles.modalWrapCustom}
      bodyClassName={styles.scrollModal}
      toggle={() => {
        setVisible((prev) => !prev);
        setData(undefined);
      }}
      content={
        <>
          <div className={styles.nonConformityModal}>
            <Row className={cx('mx-0', styles.firstRow)}>
              <Col xs={6} className={cx('p-0', styles.col)}>
                <Input
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
                  )}
                  className={styles.disabledInput}
                  readOnly
                  isRequired
                  {...register('auditType')}
                />
              </Col>
              <Col xs={6} className={cx('p-0', styles.col)}>
                <Input
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Nature of findings'],
                  )}
                  className={styles.disabledInput}
                  readOnly
                  isRequired
                  {...register('natureFindings')}
                />
              </Col>
              <Col xs={6} className={cx('p-0', styles.col)}>
                <Row>
                  <Col>
                    <div className="d-flex align-items-start pb-3">
                      <div>
                        {renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_REPORT_FIELDS_DETAILS['Is significant'],
                        )}
                      </div>
                    </div>
                    <ToggleSwitch
                      disabled={!isEdit || loading}
                      control={control}
                      name="isSignificant"
                    />
                  </Col>
                  <Col>
                    <div className="d-flex align-items-start pb-3">
                      <div>
                        {renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_REPORT_FIELDS_DETAILS[
                            'Rectified on board'
                          ],
                        )}
                      </div>
                    </div>
                    <ToggleSwitch
                      disabled={!isEdit || loading}
                      control={control}
                      name="rectifiedOnBoard"
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={6} className={cx('p-0', styles.col)}>
                <AsyncSelectForm
                  control={control}
                  name="department"
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS.Department,
                  )}
                  disabled={!isEdit || loading}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_REPORT_FIELDS_DETAILS['Please select'],
                        )
                      : ''
                  }
                  textSelectAll={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Select all'],
                  )}
                  textBtnConfirm={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Confirm,
                  )}
                  onChangeSearch={(value: string) => {
                    getListDepartmentMasterActionsApi({
                      ...paramsMaster,
                      content:
                        value !== '' && value !== null ? value : undefined,
                    })
                      .then((r) => handleSetDepartment(r?.data?.data))
                      .catch((e) =>
                        toastError(
                          `An error occurred while fetching department data: ${e?.message}`,
                        ),
                      );
                  }}
                  options={departmentOption || []}
                />
              </Col>
              <Col xs={6} className={cx('p-0', styles.col)}>
                <AsyncSelectForm
                  control={control}
                  disabled={!isEdit || loading}
                  name="mainCategoryId"
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Main category'],
                  )}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_REPORT_FIELDS_DETAILS['Please select'],
                        )
                      : ''
                  }
                  textSelectAll={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Select all'],
                  )}
                  textBtnConfirm={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Confirm,
                  )}
                  onChangeSearch={(value: string) => {
                    getListMainCategoryActionsApi({
                      ...paramsMaster,
                      content:
                        value !== '' && value !== null ? value : undefined,
                    })
                      .then((r) => handleSetMainCategory(r?.data?.data))
                      .catch((e) =>
                        toastError(
                          `An error occurred while fetching main category data: ${e?.message}`,
                        ),
                      );
                  }}
                  options={mainCategoryOption || []}
                />
              </Col>
              {!hideSecondCategoryAutogenerate && (
                <Col xs={6} className={cx('p-0', styles.col)}>
                  <AsyncSelectForm
                    control={control}
                    name="secondCategoryId"
                    disabled={!isEdit || loading}
                    labelSelect={renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS['Second Category'],
                    )}
                    placeholder={
                      isEdit
                        ? renderDynamicLabel(
                            dynamicLabels,
                            INSPECTION_REPORT_FIELDS_DETAILS['Please select'],
                          )
                        : ''
                    }
                    textSelectAll={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Select all'],
                    )}
                    textBtnConfirm={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.Confirm,
                    )}
                    onChangeSearch={(value: string) => {
                      getListSecondCategoryActionsApi({
                        ...paramsMaster,
                        content:
                          value !== '' && value !== null ? value : undefined,
                      })
                        .then((r) => handleSetSecondCategory(r?.data?.data))
                        .catch((e) =>
                          toastError(
                            `An error occurred while fetching second category data: ${e?.message}`,
                          ),
                        );
                    }}
                    options={secondCategoryOption || []}
                  />
                </Col>
              )}
              <Col xs={6} className={cx('p-0', styles.col)}>
                <Input
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS.Reference,
                  )}
                  className={styles.disabledInput}
                  readOnly
                  {...register('reference')}
                />
              </Col>
              {!hideViqAutogenerate && (
                <Col xs={6} className={cx('p-0', styles.col)}>
                  <AsyncSelectForm
                    control={control}
                    name="viqId"
                    disabled={!isEdit || loading}
                    labelSelect={renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS['VIQ category'],
                    )}
                    placeholder={
                      isEdit
                        ? renderDynamicLabel(
                            dynamicLabels,
                            INSPECTION_REPORT_FIELDS_DETAILS['Please select'],
                          )
                        : ''
                    }
                    searchContent={renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS['VIQ category'],
                    )}
                    messageRequired={errors?.VIQ?.message || ''}
                    onChangeSearch={(value: string) => {
                      getListVIQsActionsApi({
                        ...paramsMaster,
                        content:
                          value !== '' && value !== null ? value : undefined,
                      })
                        .then((r) => handleSetViqCategory(r?.data?.data))
                        .catch((e) =>
                          toastError(
                            `An error occurred while fetching VIQ data: ${e?.message}`,
                          ),
                        );
                    }}
                    options={viqCategoryOption || []}
                  />
                </Col>
              )}
              <Col xs={6} className={cx('p-0', styles.col)}>
                <AsyncSelectForm
                  control={control}
                  name="picId"
                  disabled={
                    !isEdit ||
                    loading ||
                    (!isAuditor() && isDraftOrReassigned()) ||
                    (!isDraftOrReassigned() && !checkReviewStatus()) ||
                    // data?.workflowStatus === WorkflowStatus.CLOSE_OUT ||
                    data?.findingStatus !== FindingStatus.OPENED
                  }
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS.PIC,
                  )}
                  placeholder={
                    !isEdit ||
                    loading ||
                    (!isAuditor() && isDraftOrReassigned()) ||
                    (!isDraftOrReassigned() && !checkReviewStatus()) ||
                    data?.workflowStatus === WorkflowStatus.CLOSE_OUT ||
                    data?.findingStatus !== FindingStatus.OPENED
                      ? ''
                      : renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_REPORT_FIELDS_DETAILS['Please select'],
                        )
                  }
                  searchContent={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS.PIC,
                  )}
                  onChangeSearch={(value: string) => {
                    getListUserRecordActionsApi({
                      ...paramsMaster,
                      vesselId:
                        internalAuditReportDetail?.entityType !== 'Office'
                          ? internalAuditReportDetail?.vesselId
                          : undefined,
                      moduleName:
                        internalAuditReportDetail?.entityType !== 'Office'
                          ? ModuleName.INSPECTION
                          : undefined,
                      content:
                        value !== '' && value !== null ? value : undefined,
                    })
                      .then((r) => handleSetUsers(r?.data?.data))
                      .catch((e) =>
                        toastError(
                          `An error occurred while fetching PIC data: ${e?.message}`,
                        ),
                      );
                  }}
                  options={picOption || []}
                />
              </Col>
              <Col xs={6} className={cx('p-0', styles.col)}>
                <Input
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['PIC remark'],
                  )}
                  placeholder={
                    !isEdit || loading
                      ? ''
                      : renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_REPORT_FIELDS_DETAILS['Enter remark'],
                        )
                  }
                  disabled={!isEdit || loading}
                  {...register('picRemark')}
                />
              </Col>
            </Row>
            <div className={styles.secondRow}>
              <div className={styles.textAreaWrapper}>
                <div className="d-flex align-items-start pb-2">
                  <div>
                    {renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS.Findings,
                    )}
                  </div>
                  <img src={images.icons.icRequiredAsterisk} alt="required" />
                </div>
                <TextAreaForm
                  disabled
                  control={control}
                  minRows={2}
                  name="findings"
                  maxLength={500}
                />
              </div>
              <div className={styles.textAreaWrapper}>
                <div className="d-flex align-items-start pb-2">
                  <div>
                    {renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS['Findings remark'],
                    )}
                  </div>
                </div>
                <TextAreaForm
                  disabled
                  control={control}
                  minRows={2}
                  name="findingRemark"
                  maxLength={500}
                />
              </div>
              <SelectUI
                className="w-100"
                data={findingStatusOptions}
                control={control}
                name="findingStatus"
                disabled={isFindingStatusDisable()}
                placeholder={
                  isEdit &&
                  (userInfo?.id === data?.picId ||
                    (!data?.picId &&
                      (checkReviewStatus() ||
                        populateStatus(internalAuditReportDetail?.status) ===
                          populateStatus(
                            InternalAuditReportStatus.REVIEWED_5,
                          ) ||
                        (internalAuditReportDetail?.status ===
                          InternalAuditReportStatus.APPROVED &&
                          isReviewerOrApprover())))) &&
                  data?.workflowStatus !== WorkflowStatus.CLOSE_OUT &&
                  internalAuditReportDetail?.internalAuditReportHistories?.find(
                    (i) => i?.status === 'submitted',
                  ) &&
                  !loading
                    ? renderDynamicLabel(
                        dynamicLabels,
                        INSPECTION_REPORT_FIELDS_DETAILS['Please select'],
                      )
                    : ''
                }
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Finding status'],
                )}
              />
              <div className={styles.textAreaWrapper}>
                <div className="d-flex align-items-start pb-2">
                  <div>
                    {renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS.Remark,
                    )}
                  </div>
                </div>
                <TextAreaForm
                  disabled={!isEdit || loading}
                  control={control}
                  minRows={2}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_REPORT_FIELDS_DETAILS['Enter remark'],
                        )
                      : ''
                  }
                  name="remark"
                  maxLength={500}
                />
              </div>
            </div>
            <Row className={cx('mx-0', styles.thirdRow)}>
              <Col xs={6} className={cx('p-0', styles.col)}>
                <DateTimePicker
                  disabled={!isEdit || loading}
                  messageRequired={errors?.planedCompletionDate?.message || ''}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          INSPECTION_REPORT_FIELDS_DETAILS['Select date'],
                        )
                      : ''
                  }
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Planned completion date'],
                  )}
                  className="w-100"
                  control={control}
                  name="planedCompletionDate"
                  inputReadOnly
                />
              </Col>
              <Col xs={6} className={cx('p-0', styles.col)}>
                <DateTimePicker
                  disabled={!isEdit || loading}
                  messageRequired={errors?.actualCompletionDate?.message || ''}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Actual completion date'],
                  )}
                  className="w-100"
                  control={control}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Select date'],
                        )
                      : ''
                  }
                  name="actualCompletionDate"
                  inputReadOnly
                />
              </Col>
            </Row>
            <div className={styles.divider} />
            <Controller
              control={control}
              name="findingAttachments"
              render={({ field }) => (
                <TableAttachment
                  featurePage={Features.AUDIT_INSPECTION}
                  subFeaturePage={SubFeatures.INTERNAL_AUDIT_REPORT}
                  loading={false}
                  isEdit={isEdit && !loading}
                  dynamicLabels={dynamicLabels}
                  value={field.value}
                  buttonName={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Attach,
                  )}
                  onchange={field.onChange}
                />
              )}
            />
            <div className={styles.divider} />
            <div className={styles.secondRow}>
              <Col className="p-0">
                <Input
                  disabled={!isEdit || loading}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Immediate action'],
                  )}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Enter action'],
                        )
                      : ''
                  }
                  {...register('immediateAction')}
                />
              </Col>
              <Col className="p-0">
                <Input
                  disabled={!isEdit || loading}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Preventive action'],
                  )}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Enter action'],
                        )
                      : ''
                  }
                  {...register('preventiveAction')}
                />
              </Col>
              <Col className="p-0">
                <Input
                  disabled={!isEdit || loading}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Corrective action'],
                  )}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Enter action'],
                        )
                      : ''
                  }
                  {...register('correctiveAction')}
                />
              </Col>
            </div>
          </div>
          {isEdit && (
            <GroupButton
              className={styles.modalGroupBtns}
              handleCancel={handleCancel}
              handleSubmit={handleSubmit(handleSave)}
              disable={loading}
              dynamicLabels={dynamicLabels}
              txButtonRight={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              saveStyle={{ marginLeft: 0 }}
            >
              {data?.findingStatus === FindingStatus.CLOSED &&
              reassignCloseOutVisible ? (
                <>
                  <Button
                    buttonType={ButtonType.Dangerous}
                    buttonSize={ButtonSize.Medium}
                    onClick={() =>
                      handleReviewFindingItem(ReviewAction.REASSIGN)
                    }
                  >
                    <span>
                      {renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS.Reassign,
                      )}
                    </span>
                  </Button>
                  <Button
                    className={styles.submitBtn}
                    onClick={() =>
                      handleReviewFindingItem(ReviewAction.CLOSE_OUT)
                    }
                  >
                    <span>
                      {renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS['Close out'],
                      )}
                    </span>
                  </Button>
                </>
              ) : null}
            </GroupButton>
          )}
        </>
      }
    />
  );
});

type ModalRef = {
  showNonConformityModal: (data: NonConformityModalData) => void;
};
const modalRef = createRef<ModalRef>();
export const NonConformityModal = () => (
  <NonConformityModalComponent ref={modalRef} />
);
export const showNonConformityModal = (data: NonConformityModalData) => {
  modalRef.current?.showNonConformityModal(data);
};
