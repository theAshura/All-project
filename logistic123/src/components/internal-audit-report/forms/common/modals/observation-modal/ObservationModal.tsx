import {
  forwardRef,
  useState,
  useImperativeHandle,
  createRef,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import {
  InternalAuditReportFormContext,
  WorkflowStatus,
  FindingStatus,
} from 'contexts/internal-audit-report/IARFormContext';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import { Row, Col } from 'reactstrap';
import { useForm, FieldValues, Controller } from 'react-hook-form';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { Option } from 'constants/filter.const';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  assignPICInternalAuditReportActionsApi,
  editFindingItemActionsApi,
  reviewFindingItemActionsApi,
  editFindingItemActionsByPicApi,
} from 'api/internal-audit-report.api';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import Input from 'components/ui/input/Input';
import cx from 'classnames';
import images from 'assets/images/images';
import moment from 'moment';
import { ModuleName, CommonQuery } from 'constants/common.const';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import {
  useReviewStatus,
  useAuditor,
  useDraftOrReassigned,
} from 'components/internal-audit-report/forms/helpers/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { NonConformity } from 'models/api/internal-audit-report/internal-audit-report.model';
import 'components/internal-audit-report/forms/form.scss';
import { getListUserRecordActionsApi } from 'api/user.api';
import { getListDepartmentMasterActionsApi } from 'api/department-master.api';
import { getListVIQsActionsApi } from 'api/viq.api';
import { getListMainCategoryActionsApi } from 'api/main-category.api';
import { getListSecondCategoryActionsApi } from 'api/second-category.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { getListFileActions } from 'store/dms/dms.action';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import styles from 'components/internal-audit-report/forms/form.module.scss';
import { useLocation } from 'react-router-dom';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  SubmitFormAction,
  ReviewAction,
} from '../non-comformity-modal/NonCoformityModal';

interface ObservationModalData {
  isEdit: boolean;
  data: NonConformity;
}

const ObservationModalComponent = forwardRef((_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { checkReviewStatus, isReviewerOrApprover } = useReviewStatus();
  const isAuditor = useAuditor();
  const isDraftOrReassigned = useDraftOrReassigned();
  const [loading, setLoading] = useState<boolean>(false);
  const { userInfo } = useSelector((store) => store.authenticate);
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const paramsMaster = {
    page: 1,
    pageSize: -1,
    status: 'active',
    companyId: userInfo?.mainCompanyId,
  };

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [data, setData] = useState<NonConformity>();
  const { search } = useLocation();
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });

  const {
    users,
    department,
    mainCategory,
    secondCategory,
    viqCategory,
    handleSetUsers,
    handleSetDepartment,
    handleSetMainCategory,
    handleSetSecondCategory,
    handleSetViqCategory,
    handleSetOBSList,
    handleSubmitReportFindingItems,
    OBSList,
  } = useContext(InternalAuditReportFormContext);
  const defaultValues = {
    auditType: '',
    natureFindings: '',
    department: [],
    mainCategoryId: [],
    secondCategoryId: [],
    reference: '',
    viqId: [],
    picId: [],
    picRemark: '',
    findings: '',
    findingRemark: '',
    isSignificant: false,
    rectifiedOnBoard: false,
    findingStatus: null,
    remark: '',
    planedCompletionDate: null,
    actualCompletionDate: null,
    immediateAction: '',
    preventiveAction: '',
    correctiveAction: '',
    findingAttachments: [],
  };

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

  const dispatch = useDispatch();

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

      if (data?.findingAttachments?.length > 0) {
        dispatch(
          getListFileActions.request({ ids: data?.findingAttachments || [] }),
        );
      }
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
    showObservationModal: (data: ObservationModalData) => {
      setVisible(true);
      setIsEdit(data.isEdit);
      setData(data.data);
    },
  }));

  const handleCancel = useCallback(() => {
    if (!isEdit) {
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
        picId: (formData?.picId && formData?.picId[0]?.value) || undefined,
      }),

      ...(action === SubmitFormAction.EDIT_FINDING_ITEM && {
        mainCategoryId:
          (formData.mainCategoryId && formData.mainCategoryId[0]?.value) ||
          undefined,
        secondCategoryId:
          (formData.secondCategoryId && formData.secondCategoryId[0]?.value) ||
          undefined,
        findingStatus: formData.findingStatus,
        picId: (formData?.picId && formData?.picId[0]?.value) || undefined,
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
        picId: (formData?.picId && formData?.picId[0]?.value) || undefined,
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
      rectifiedOnBoard: formData?.rectifiedOnBoard,
    };

    return dataBody;
  };

  const handleStoreOBSInContext = (formData) => {
    const newOBSList = [...OBSList];
    const currentRecordIndex = newOBSList.findIndex((i) => i.id === data?.id);
    const newRecord = buildDataBody(
      formData,
      SubmitFormAction.NEW_RECORD_IN_CONTEXT,
    );
    newOBSList[currentRecordIndex] = newRecord;
    handleSetOBSList(newOBSList);
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
        handleStoreOBSInContext(formData);
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
        handleStoreOBSInContext(formData);
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
        handleStoreOBSInContext(formData);
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
        const newOBSList = [...OBSList];
        const currentRecordIndex = newOBSList.findIndex(
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
        newOBSList[currentRecordIndex] = newRecord;
        handleSetOBSList(newOBSList);
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
      } else {
        handleEditFindingItems(formData);
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
      } else {
        handleEditFindingItems(formData);
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

  return (
    <Modal
      isOpen={visible}
      title={
        isEdit
          ? renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Edit observation'],
            )
          : renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS.Observation,
            )
      }
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
          <div className={cx(styles.nonConformityModal, 'mb-4')}>
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
                      control={control}
                      name="isSignificant"
                      disabled={!isEdit || loading}
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
                      control={control}
                      name="rectifiedOnBoard"
                      disabled={!isEdit || loading}
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
                          COMMON_DYNAMIC_FIELDS['Please select'],
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
                  name="mainCategoryId"
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Main category'],
                  )}
                  disabled={!isEdit || loading}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Please select'],
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
                    labelSelect={renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS['Second category'],
                    )}
                    disabled={!isEdit || loading}
                    placeholder={
                      isEdit
                        ? renderDynamicLabel(
                            dynamicLabels,
                            COMMON_DYNAMIC_FIELDS['Please select'],
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
                            COMMON_DYNAMIC_FIELDS['Please select'],
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
                    data?.workflowStatus === WorkflowStatus.CLOSE_OUT ||
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
                          COMMON_DYNAMIC_FIELDS['Please select'],
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
                    INSPECTION_REPORT_FIELDS_DETAILS['PIC Remark'],
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
                disabled={isFindingStatusDisable()}
                name="findingStatus"
                placeholder={
                  isEdit &&
                  (userInfo?.id === data?.picId ||
                    (!data?.picId &&
                      (checkReviewStatus() ||
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
                        COMMON_DYNAMIC_FIELDS['Please select'],
                      )
                    : ''
                }
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Finding Status'],
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
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Select date'],
                        )
                      : ''
                  }
                  messageRequired={errors?.planedCompletionDate?.message || ''}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Planned completion date'],
                  )}
                  className="w-100"
                  control={control}
                  name="planedCompletionDate"
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
                  dynamicLabels={dynamicLabels}
                  isEdit={isEdit && !loading}
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
              dynamicLabels={dynamicLabels}
              handleSubmit={handleSubmit(handleSave)}
              txButtonRight={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              disable={loading}
              saveStyle={{ marginLeft: 0 }}
            >
              {data?.findingStatus === FindingStatus.CLOSED &&
              (checkReviewStatus() ||
                (internalAuditReportDetail?.status ===
                  InternalAuditReportStatus.APPROVED &&
                  isReviewerOrApprover())) ? (
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
  showObservationModal: (data: ObservationModalData) => void;
};
const modalRef = createRef<ModalRef>();
export const ObservationModal = () => (
  <ObservationModalComponent ref={modalRef} />
);
export const showObservationModal = (data: ObservationModalData) => {
  modalRef.current?.showObservationModal(data);
};
