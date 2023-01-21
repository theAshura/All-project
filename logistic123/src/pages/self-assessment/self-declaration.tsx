import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import PopoverStatus from 'components/audit-checklist/common/popover-status/PopoverStatus';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import { Item, StepStatus } from 'components/common/step-line/lineStepCP';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import Input from 'components/ui/input/Input';
import SelectUI from 'components/ui/select/Select';
import queryString from 'query-string';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { ActivePermission, WorkFlowType } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useParams } from 'react-router-dom';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { Col, Row } from 'reactstrap';
import { clearDMSReducer, getListFileActions } from 'store/dms/dms.action';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import * as yup from 'yup';
import ModalPastComments from './modals/PastComments';
import styles from './self-declaration.module.scss';
import {
  approveSelfDeclarationActions,
  clearLookBackCommentReducer,
  clearSelfAssessmentErrorsReducer,
  getLookUpCompanyCommentActions,
  getSelfDeclarationDetailActions,
  getStandardMasterDetailActions,
  reAssignSelfDeclarationApprovedActions,
} from './store/action';
// import TableAttachment from './tables/Attachment';
import TableComment from './tables/Comment';
import TableUserHistorySection from './tables/UserHistorySection';
import {
  COMMENT_TYPE,
  SELF_ASSESSMENT_STEPS,
  SELF_DECLARATION_COMMENT_TITLE,
  SELF_DECLARATION_STATUS,
} from './utils/constant';
import { SelfDeclarationParams } from './utils/model';

const defaultValues = {
  compliance: undefined,
  comments: [],
  commentConfirm: '',
};

const types = {
  working: 'Working',
  reviewPrep: 'Review Prep',
};

const defaultConfirmInfo = {
  status: false,
  title: '',
};

const PageSelfDeclaration = () => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const [openPastCommentModal, setOpenPastCommentModal] =
    useState<boolean>(false);
  const [data, setData] = useState(defaultValues);
  const [confirmInfo, setConfirmInfo] = useState(defaultConfirmInfo);
  const { id } = useParams<{ id: string }>();
  const {
    selfDeclarationDetail,
    standardMasterDetail,
    // listLookUpCompanyComment,
    loading,
  } = useSelector((state) => state.selfAssessment);
  const { userInfo } = useSelector((state) => state.authenticate);

  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );

  const parsedQueries = useMemo(() => queryString.parse(search), [search]);

  const isEdit = useMemo(() => !!parsedQueries?.edit, [parsedQueries?.edit]);

  const reviewerAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.REVIEWER,
        selfDeclarationDetail?.selfAssessment?.userAssignments,
      ),
    [selfDeclarationDetail?.selfAssessment?.userAssignments, userInfo?.id],
  );

  const canApprove = useMemo(() => {
    if (
      isEdit &&
      userInfo?.id === selfDeclarationDetail?.selfAssessment?.createdUserId &&
      (selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.pending ||
        selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.reassigned)
    ) {
      return true;
    }
    return false;
  }, [
    isEdit,
    selfDeclarationDetail?.selfAssessment?.createdUserId,
    selfDeclarationDetail?.status,
    userInfo?.id,
  ]);

  const whenStatusPendingOrReassignAndByCreator = useMemo(
    () =>
      selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.pending ||
      (selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.reassigned &&
        workFlowActiveUserPermission.includes(ActivePermission.CREATOR)),
    [selfDeclarationDetail?.status, workFlowActiveUserPermission],
  );

  const whenStatusPendingOrReassignAndByReviewer = useMemo(
    () =>
      (selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.pending ||
        selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.reassigned) &&
      workFlowActiveUserPermission.includes(ActivePermission.REVIEWER) &&
      !workFlowActiveUserPermission.includes(ActivePermission.CREATOR),
    [selfDeclarationDetail?.status, workFlowActiveUserPermission],
  );

  const canReviewAndReassign = useMemo(() => {
    if (
      isEdit &&
      reviewerAssignmentPermission &&
      selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.submitted
    ) {
      return true;
    }
    return false;
  }, [isEdit, reviewerAssignmentPermission, selfDeclarationDetail?.status]);

  const whenTypeIsReviewPrep = useMemo(
    () =>
      !isEdit ||
      selfDeclarationDetail?.selfAssessment?.type === types.reviewPrep,
    [isEdit, selfDeclarationDetail?.selfAssessment?.type],
  );
  const whenStatusIsReassigned = useMemo(
    () => selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.reassigned,
    [selfDeclarationDetail?.status],
  );

  const schema = useMemo(
    () =>
      yup.object().shape(
        !whenTypeIsReviewPrep
          ? {
              targetCompletionDate:
                isEdit &&
                whenStatusPendingOrReassignAndByCreator &&
                yup.string().nullable().trim().required(t('errors.required')),
              compliance:
                isEdit &&
                whenStatusPendingOrReassignAndByCreator &&
                yup.string().nullable().trim().required(t('errors.required')),
              companyCommentsInternal: yup.string().nullable().trim(),
              companyCommentsExternal: yup
                .string()
                .nullable()
                .trim()
                .required(t('errors.required')),
              commentConfirm:
                canReviewAndReassign &&
                confirmInfo.title === SELF_DECLARATION_COMMENT_TITLE.reassign &&
                yup.string().nullable().trim().required(t('errors.required')),
            }
          : {},
      ),
    [
      whenTypeIsReviewPrep,
      isEdit,
      whenStatusPendingOrReassignAndByCreator,
      t,
      canReviewAndReassign,
      confirmInfo.title,
    ],
  );
  const DEFAULT_ITEMS: Item[] = useMemo(
    () => [
      {
        id: SELF_DECLARATION_STATUS.pending,
        name: t('statusFlow.pending'),
        status: StepStatus.INACTIVE,
      },
      {
        id: SELF_DECLARATION_STATUS.submitted,
        name: t('statusFlow.submitted'),
        status: StepStatus.INACTIVE,
      },
      {
        id: SELF_DECLARATION_STATUS.approved,
        name: t('statusFlow.approved'),
        status: StepStatus.INACTIVE,
      },
    ],
    [t],
  );

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const sortPosition = useMemo(() => ['targetCompletionDate'], []);

  // const watchCompanyCommentsInternal = watch('companyCommentsInternal');
  // const watchSameAsCompanyCommentsInternal = watch(
  //   'sameAsCompanyCommentsInternal',
  // );

  // const disabledCompanyCommentsExternal = useMemo(
  //   () =>
  //     !isEdit ||
  //     watchSameAsCompanyCommentsInternal ||
  //     selfDeclarationDetail?.selfAssessment?.type === types.reviewPrep,
  //   [
  //     watchSameAsCompanyCommentsInternal,
  //     isEdit,
  //     selfDeclarationDetail?.selfAssessment?.type,
  //   ],
  // );

  const COMPLIANCE_OPTIONS = useMemo(
    () =>
      standardMasterDetail?.complianceAnswers?.map((item) => ({
        label: item.answer,
        value: item.id,
      })) || [],
    [standardMasterDetail?.complianceAnswers],
  );

  const scrollToView = useCallback(
    (errors) => {
      if (!isEmpty(errors)) {
        const firstError = sortPosition.find((item) => errors[item]);
        const el = document.querySelector(`#${firstError}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [sortPosition],
  );

  const findHistoryByStatus = useCallback(
    (status: string) => {
      const statusHistory =
        selfDeclarationDetail?.selfDeclarationHistories || [];
      const historyFiltered = statusHistory.filter(
        (item) => item.status === status,
      );
      const dataPopulated = historyFiltered.map((item) => ({
        datetime: item?.createdAt,
        description: item?.createdUser?.username,
        name: item?.createdUser?.jobTitle,
      }));
      return dataPopulated;
    },
    [selfDeclarationDetail?.selfDeclarationHistories],
  );

  const stepStatusItems = useMemo(() => {
    const items: Item[] = DEFAULT_ITEMS;
    switch (selfDeclarationDetail?.status) {
      case SELF_DECLARATION_STATUS.pending: {
        const newItems = items.map((i, index) => {
          if (index < 1) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          return i;
        });
        return newItems;
      }

      case SELF_DECLARATION_STATUS.submitted: {
        const newItems = items.map((i, index) => {
          if (index < 2) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          return i;
        });
        return newItems;
      }

      case SELF_DECLARATION_STATUS.approved: {
        const newItems = items.map((i, index) => {
          if (index < 3) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          return i;
        });
        return newItems;
      }

      case SELF_DECLARATION_STATUS.reassigned: {
        const newItems = items.map((i, index) => {
          if (index < 2) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          if (index === 2) {
            return {
              ...i,
              status: StepStatus.ERROR,
              info: findHistoryByStatus(SELF_DECLARATION_STATUS.reassigned),
            };
          }
          return i;
        });
        return newItems;
      }

      default:
        return items;
    }
  }, [DEFAULT_ITEMS, findHistoryByStatus, selfDeclarationDetail?.status]);

  const watchConfirmComment = watch('commentConfirm');

  const hanleToggleComment = useCallback(() => {
    setValue('commentConfirm', '');
    setError('commentConfirm', { message: '' });
    setConfirmInfo(defaultConfirmInfo);
  }, [setError, setValue]);

  const onSubmitForm = useCallback(
    (formData) => {
      let selfDeclarationComment = [];

      if (formData?.companyCommentsInternal) {
        selfDeclarationComment = [
          ...selfDeclarationComment,
          {
            type: COMMENT_TYPE.CompanyInternal,
            comment: formData?.companyCommentsInternal,
          },
        ];
      }
      if (formData?.companyCommentsExternal) {
        selfDeclarationComment = [
          ...selfDeclarationComment,
          {
            type: COMMENT_TYPE.CompanyExternal,
            comment: formData?.companyCommentsExternal || '',
          },
        ];
      }
      const payload: SelfDeclarationParams = {
        complianceId: formData?.compliance || undefined,
        selfClose: formData?.selfClose,
        targetCompletionDate: formData?.targetCompletionDate
          ? moment(formData?.targetCompletionDate)?.toISOString()
          : undefined,
        selfDeclarationComment: selfDeclarationComment.length
          ? selfDeclarationComment
          : undefined,
        reviewPrepComment: data?.comments?.length ? data?.comments : undefined,
        attachments: formData?.attachments || [],
        selfDeclarationHistory: {
          comment: watchConfirmComment,
        },
      };
      dispatch(
        approveSelfDeclarationActions.request({
          selfAssessmentId: parsedQueries?.selfAssessmentId?.toString(),
          id,
          data: payload,
          handleSuccess: () => {
            hanleToggleComment();
            dispatch(
              getSelfDeclarationDetailActions.request({
                id,
                selfAssessmentId: parsedQueries?.selfAssessmentId?.toString(),
              }),
            );
            history.replace(
              `${AppRouteConst.getSelfAssessmentDeclarationById(
                id,
              )}?selfAssessmentId=${parsedQueries?.selfAssessmentId?.toString()}`,
            );
          },
        }),
      );
    },
    [
      data?.comments,
      dispatch,
      hanleToggleComment,
      id,
      parsedQueries?.selfAssessmentId,
      watchConfirmComment,
    ],
  );

  const handleBackDeclaration = useCallback(() => {
    let link = `${
      AppRouteConst.SELF_ASSESSMENT_DETAIL
    }/${parsedQueries?.selfAssessmentId?.toString()}?${
      SELF_ASSESSMENT_STEPS.declaration
    }`;
    if (isEdit) {
      link += '&edit';
    }
    history.push(link);
  }, [isEdit, parsedQueries?.selfAssessmentId]);

  // const lookUpPassComments = useCallback(() => {
  //   setOpenPastCommentModal(true);
  // }, []);

  const toggleLookUpPassComments = useCallback(() => {
    setOpenPastCommentModal(!openPastCommentModal);
  }, [openPastCommentModal]);

  const handleReassign = useCallback(() => {
    dispatch(
      reAssignSelfDeclarationApprovedActions.request({
        selfAssessmentId: parsedQueries?.selfAssessmentId?.toString(),
        id,
        comment: watchConfirmComment,
        handleSuccess: () => {
          hanleToggleComment();
          dispatch(
            getSelfDeclarationDetailActions.request({
              id,
              selfAssessmentId: parsedQueries?.selfAssessmentId?.toString(),
            }),
          );
        },
      }),
    );
  }, [
    dispatch,
    hanleToggleComment,
    id,
    parsedQueries?.selfAssessmentId,
    watchConfirmComment,
  ]);

  const handleOpenConfirmReviewReassign = useCallback(
    (title: string) => () => {
      setConfirmInfo({
        title,
        status: true,
      });
    },
    [],
  );

  const renderButtonGroup = useMemo(() => {
    if (canApprove) {
      return (
        <GroupButton
          className="pt-3"
          handleCancel={handleBackDeclaration}
          handleSubmit={handleSubmit(onSubmitForm, scrollToView)}
          txButtonBetween="Submit"
        />
      );
    }

    if (canReviewAndReassign && !whenTypeIsReviewPrep) {
      return (
        <GroupButton
          className="pt-3"
          handleCancel={handleOpenConfirmReviewReassign(
            SELF_DECLARATION_COMMENT_TITLE.review,
          )}
          handleSubmit={handleOpenConfirmReviewReassign(
            SELF_DECLARATION_COMMENT_TITLE.reassign,
          )}
          txButtonBetween={t('button.reassign')}
          txButtonLeft="Approve"
          buttonTypeLeft={ButtonType.Green}
        />
      );
    }

    return null;
  }, [
    canApprove,
    canReviewAndReassign,
    handleBackDeclaration,
    handleOpenConfirmReviewReassign,
    handleSubmit,
    onSubmitForm,
    scrollToView,
    t,
    whenTypeIsReviewPrep,
  ]);

  const renderBackAndEditButtons = useMemo(() => {
    const shouldEditButton =
      (reviewerAssignmentPermission &&
        selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.submitted) ||
      ((selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.pending ||
        selfDeclarationDetail?.status === SELF_DECLARATION_STATUS.reassigned) &&
        userInfo?.id === selfDeclarationDetail?.selfAssessment?.createdUserId);

    if (!isEdit) {
      return (
        <div>
          <PermissionCheck
            options={{
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.SELF_ASSESSMENT,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <>
                  <Button
                    className={cx('me-2', styles.buttonFilter)}
                    buttonType={ButtonType.CancelOutline}
                    onClick={handleBackDeclaration}
                  >
                    <span className="pe-2">Back</span>
                  </Button>
                  {shouldEditButton && (
                    <Button
                      onClick={() => {
                        history.push(
                          `${AppRouteConst.getSelfAssessmentDeclarationById(
                            id,
                          )}?selfAssessmentId=${parsedQueries?.selfAssessmentId?.toString()}&edit=true`,
                        );
                      }}
                      buttonSize={ButtonSize.Medium}
                      renderSuffix={
                        <img
                          src={images.icons.icEdit}
                          alt="edit"
                          className={styles.icEdit}
                        />
                      }
                      disabled={loading}
                    >
                      {t('button.edit')}&nbsp;&nbsp;
                    </Button>
                  )}
                </>
              )
            }
          </PermissionCheck>
        </div>
      );
    }
    return null;
  }, [
    handleBackDeclaration,
    id,
    isEdit,
    loading,
    parsedQueries?.selfAssessmentId,
    reviewerAssignmentPermission,
    selfDeclarationDetail?.selfAssessment?.createdUserId,
    selfDeclarationDetail?.status,
    t,
    userInfo?.id,
  ]);

  useEffect(() => {
    if (selfDeclarationDetail) {
      setData((prev) => ({
        ...prev,
        comments: selfDeclarationDetail?.reviewPrepComments || [],
      }));
    }
  }, [selfDeclarationDetail]);

  useEffect(() => {
    if (selfDeclarationDetail) {
      setValue('elementName', selfDeclarationDetail?.elementMaster?.name || '');
      setValue(
        'elementNumber',
        selfDeclarationDetail?.elementMaster?.number || '',
      );
      setValue('stage', selfDeclarationDetail?.elementMaster?.stage || '');
      setValue(
        'questionNumber',
        selfDeclarationDetail?.elementMaster?.questionNumber || '',
      );
      setValue(
        'elementStageQ',
        selfDeclarationDetail?.elementMaster?.elementStageQ || '',
      );
      setValue(
        'keyPerformanceIndicator',
        selfDeclarationDetail?.elementMaster?.keyPerformanceIndicator || '',
      );
      setValue(
        'bestPracticeGuidance',
        selfDeclarationDetail?.elementMaster?.bestPracticeGuidance || '',
      );
      setValue('compliance', selfDeclarationDetail?.complianceId || '');
      setValue('selfClose', selfDeclarationDetail?.selfClose || false);
      setValue(
        'companyCommentsInternal',
        selfDeclarationDetail?.newestInternalComment || '',
      );
      setValue(
        'companyCommentsExternal',
        selfDeclarationDetail?.newestExternalComment || '',
      );
      setValue(
        'targetCompletionDate',
        selfDeclarationDetail?.targetCompletionDate
          ? moment(selfDeclarationDetail?.targetCompletionDate)
          : '',
      );
      setValue(
        'attachments',
        selfDeclarationDetail?.attachments?.length
          ? [...selfDeclarationDetail?.attachments]
          : [],
      );
    }
    return () => {
      dispatch(clearSelfAssessmentErrorsReducer());
    };
  }, [dispatch, selfDeclarationDetail, setValue]);

  useEffect(() => {
    if (id && parsedQueries?.selfAssessmentId?.toString()) {
      dispatch(
        getSelfDeclarationDetailActions.request({
          id,
          selfAssessmentId: parsedQueries?.selfAssessmentId?.toString(),
        }),
      );
      dispatch(
        getWorkFlowActiveUserPermissionActions.request({
          workflowType: WorkFlowType.SELF_ASSESSMENT,
          isRefreshLoading: false,
        }),
      );
    }
  }, [dispatch, id, parsedQueries?.selfAssessmentId]);

  useEffect(() => {
    if (selfDeclarationDetail?.elementMaster?.standardMasterId) {
      dispatch(
        getStandardMasterDetailActions.request(
          selfDeclarationDetail?.elementMaster?.standardMasterId,
        ),
      );
    }
  }, [dispatch, selfDeclarationDetail?.elementMaster?.standardMasterId]);

  useEffect(() => {
    if (id && parsedQueries?.selfAssessmentId) {
      dispatch(
        getLookUpCompanyCommentActions.request({
          selfAssessmentId: parsedQueries?.selfAssessmentId,
          id,
          type: COMMENT_TYPE.CompanyInternal,
        }),
      );
    }
    return () => {
      dispatch(clearLookBackCommentReducer());
    };
  }, [dispatch, id, parsedQueries?.selfAssessmentId]);

  // useEffect(() => {
  //   if (watchSameAsCompanyCommentsInternal) {
  //     setValue('companyCommentsExternal', watchCompanyCommentsInternal);
  //     setError('companyCommentsExternal', { message: '' });
  //   }
  // }, [
  //   setError,
  //   setValue,
  //   watchCompanyCommentsInternal,
  //   watchSameAsCompanyCommentsInternal,
  // ]);

  useEffect(() => {
    if (selfDeclarationDetail?.attachments?.length > 0) {
      dispatch(
        getListFileActions.request({
          ids: selfDeclarationDetail?.attachments || [],
        }),
      );
    }
    return () => {
      dispatch(clearDMSReducer());
    };
  }, [selfDeclarationDetail?.attachments, dispatch]);

  // const disabledBtnCompanyLookUp = useMemo(
  //   () => !isEdit || !listLookUpCompanyComment?.data?.length,
  //   [isEdit, listLookUpCompanyComment],
  // );

  const workflowStatusDict = useMemo(
    () => ({
      [SELF_DECLARATION_STATUS.pending]: SELF_DECLARATION_STATUS.pending,
      [SELF_DECLARATION_STATUS.submitted]: SELF_DECLARATION_STATUS.submitted,
      [SELF_DECLARATION_STATUS.approved]: SELF_DECLARATION_STATUS.approved,
      [SELF_DECLARATION_STATUS.reassigned]: SELF_DECLARATION_STATUS.reassigned,
    }),
    [],
  );

  const handleWithConfirmComment = useCallback(
    (title: string) => () => {
      switch (title) {
        case SELF_DECLARATION_COMMENT_TITLE.reassign:
          handleSubmit(handleReassign)();
          break;
        case SELF_DECLARATION_COMMENT_TITLE.review:
          handleSubmit(onSubmitForm, scrollToView)?.();
          break;
        default:
          break;
      }
    },
    [handleReassign, handleSubmit, onSubmitForm, scrollToView],
  );

  const confirmReviewReassignContent = useMemo(
    () => (
      <>
        <div className={cx('fw-bold mb-4', styles.title)}>
          {`${confirmInfo.title} ?`}
        </div>
        <Input
          label={`Are you sure you want to ${confirmInfo.title?.toLowerCase()}?`}
          {...register('commentConfirm')}
          placeholder={t('placeholder.enterConfirmation')}
          messageRequired={errors?.commentConfirm?.message || null}
          isRequired={
            canReviewAndReassign &&
            !whenTypeIsReviewPrep &&
            confirmInfo.title === SELF_DECLARATION_COMMENT_TITLE.reassign
          }
        />
        <div className="d-flex justify-content-end mt-4">
          <Button
            className={cx('me-2')}
            buttonType={ButtonType.CancelOutline}
            onClick={hanleToggleComment}
          >
            Cancel
          </Button>
          <Button
            onClick={handleWithConfirmComment(confirmInfo.title)}
            buttonType={ButtonType.Primary}
            className={cx('ms-2')}
          >
            Confirm
          </Button>
        </div>
      </>
    ),
    [
      confirmInfo.title,
      register,
      t,
      errors?.commentConfirm?.message,
      canReviewAndReassign,
      whenTypeIsReviewPrep,
      handleWithConfirmComment,
      hanleToggleComment,
    ],
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <img
          src={images.common.loading}
          className={styles.loading}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <>
      <div className={cx(styles.wrapHeader, 'd-flex justify-content-between')}>
        <div className={cx(styles.headers)}>
          <div className="d-flex justify-content-between">
            <BreadCrumb
              current={
                isEdit
                  ? BREAD_CRUMB.SELF_ASSESSMENT_EDIT
                  : BREAD_CRUMB.SELF_ASSESSMENT_DETAIL
              }
            />
            {renderBackAndEditButtons}
          </div>
          <div className="d-flex justify-content-between">
            <div className={cx('fw-bold', styles.title)}>
              {t('selfAssessmentList')}
            </div>
            <div
              className={cx(
                'fw-bold d-flex align-items-center',
                styles.refIDAndStatus,
              )}
            >
              <span>
                {t('refID')}&nbsp;
                <span className={styles.refId}>
                  {selfDeclarationDetail?.refId || ''}
                </span>
              </span>
              <PopoverStatus
                header="Workflow progress"
                stepStatusItems={stepStatusItems}
                status={
                  workflowStatusDict[selfDeclarationDetail?.status] ||
                  selfDeclarationDetail?.status
                }
                lineStepStyle={styles.lineStep}
                className={styles.historySteps}
                labelClassName={
                  styles[workflowStatusDict[selfDeclarationDetail?.status]] ||
                  ''
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className={cx(styles.wrapperContainer)}>
        <Container>
          <div className={cx(styles.part)}>
            <div className={cx('fw-bold', styles.titleForm)}>
              {t('personResponsible')}
            </div>
            <Row className="pt-2 mx-0">
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('form.elementName')}
                  className={cx({ [styles.disabledInput]: !isEdit })}
                  {...register('elementName')}
                  disabled
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('form.elementNumber')}
                  className={cx({ [styles.disabledInput]: !isEdit })}
                  disabled
                  {...register('elementNumber')}
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('form.stage')}
                  className={cx({ [styles.disabledInput]: !isEdit })}
                  disabled
                  {...register('stage')}
                />
              </Col>
              <Col className={cx('p-0 mx-3')}>
                <Input
                  label={t('form.questionNumber')}
                  className={cx({ [styles.disabledInput]: !isEdit })}
                  {...register('questionNumber')}
                  disabled
                />
              </Col>
              <Col className={cx('p-0 ms-3')}>
                <Input
                  label={t('form.elementStageQ')}
                  className={cx({ [styles.disabledInput]: !isEdit })}
                  {...register('elementStageQ')}
                  disabled
                />
              </Col>
            </Row>

            <Row className="pt-3 mx-0">
              <div className={cx('d-flex pb-1 pt-2', styles.wrapLabel)}>
                <p className={cx('mb-0', styles.label)}>
                  {t('form.keyPerformanceIndicator')}
                </p>
              </div>
              <TextAreaForm
                {...register('keyPerformanceIndicator')}
                placeholder={t('placeholder.keyPerformanceIndicator')}
                maxLength={5000}
                control={control}
                rows={3}
                disabled
              />
            </Row>

            <Row className="pt-3 mx-0">
              <div className={cx('d-flex pb-1 pt-2', styles.wrapLabel)}>
                <p className={cx('mb-0', styles.label)}>
                  {t('form.bestPracticeGuidance')}
                </p>
              </div>
              <TextAreaForm
                {...register('bestPracticeGuidance')}
                placeholder={t('placeholder.bestPracticeGuidance')}
                maxLength={5000}
                control={control}
                rows={3}
                disabled
              />
            </Row>

            <Row className="pt-3 mx-0">
              <Col className={cx('p-0 me-3')}>
                <SelectUI
                  labelSelect={t('form.compliance')}
                  data={COMPLIANCE_OPTIONS}
                  disabled={
                    whenTypeIsReviewPrep ||
                    !whenStatusPendingOrReassignAndByCreator ||
                    whenStatusIsReassigned
                  }
                  placeholder={t('placeholder.pleaseSelect')}
                  name="compliance"
                  id="compliance"
                  className={cx('w-100')}
                  messageRequired={errors?.compliance?.message || null}
                  control={control}
                  isRequired={
                    !whenTypeIsReviewPrep &&
                    whenStatusPendingOrReassignAndByCreator &&
                    !whenStatusIsReassigned
                  }
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <DateTimePicker
                  wrapperClassName={cx(styles.datePickerWrapper)}
                  messageRequired={errors?.targetCompletionDate?.message || ''}
                  className="w-100 "
                  label={t('form.targetCompletionDate')}
                  placeholder={t('placeholder.pleaseSelect')}
                  name="targetCompletionDate"
                  id="targetCompletionDate"
                  isRequired={
                    !whenTypeIsReviewPrep &&
                    whenStatusPendingOrReassignAndByCreator &&
                    !whenStatusIsReassigned
                  }
                  control={control}
                  disabled={
                    whenTypeIsReviewPrep ||
                    !whenStatusPendingOrReassignAndByCreator ||
                    whenStatusIsReassigned
                  }
                  inputReadOnly
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <div
                  className={cx(
                    styles.labelSelect,
                    'd-flex align-items-start pb-2',
                  )}
                >
                  <span className={styles.label}>{t('selfClose')} </span>
                </div>
                <ToggleSwitch
                  disabled={
                    whenTypeIsReviewPrep ||
                    !whenStatusPendingOrReassignAndByCreator ||
                    whenStatusIsReassigned
                  }
                  control={control}
                  name="selfClose"
                />
              </Col>
              {/* <Col
                className={cx('d-flex justify-content-end align-items-end p-0')}
              >
                <Button
                  onClick={lookUpPassComments}
                  className={styles.btnAdd}
                  disabled={
                    disabledBtnCompanyLookUp ||
                    whenTypeIsReviewPrep ||
                    !(
                      canReviewAndReassign ||
                      whenStatusPendingOrReassignAndByCreator
                    )
                  }
                  disabledCss={
                    disabledBtnCompanyLookUp ||
                    whenTypeIsReviewPrep ||
                    !(
                      canReviewAndReassign ||
                      whenStatusPendingOrReassignAndByCreator
                    )
                  }
                >
                  {t('button.lookUpPastComments')}
                </Button>
              </Col> */}
            </Row>

            {/* <Row className="pt-3 mx-0">
              <div className={cx('d-flex pb-1 pt-2', styles.wrapLabel)}>
                <p className={cx('mb-0', styles.label)}>
                  {t('form.companyCommentsInternal')}{' '}
                  {!whenTypeIsReviewPrep &&
                    (whenStatusPendingOrReassignAndByCreator ||
                      canReviewAndReassign) && (
                      <span className={styles.dotRequired}>*</span>
                    )}
                </p>
              </div>
              <TextAreaForm
                {...register('companyCommentsInternal')}
                placeholder={t('placeholder.companyCommentsInternal')}
                maxLength={500}
                disabled={
                  whenTypeIsReviewPrep ||
                  !(
                    canReviewAndReassign ||
                    whenStatusPendingOrReassignAndByCreator
                  )
                }
                control={control}
                rows={3}
                required
              />
            </Row> */}

            {/* <Row className="pt-3 mx-0">
              <Col className={cx('p-0 me-3')}>
                <div className={cx('d-flex')}>
                  <span
                    className={cx(
                      styles.labelSelect,
                      'd-flex align-items-start',
                    )}
                  >
                    <span className={styles.label}>
                      {t('sameAsCompanyCommentsInternal')}
                      &nbsp;&nbsp;
                    </span>
                  </span>
                  <ToggleSwitch
                    disabled={
                      whenTypeIsReviewPrep ||
                      !(
                        canReviewAndReassign ||
                        whenStatusPendingOrReassignAndByCreator
                      )
                    }
                    control={control}
                    name="sameAsCompanyCommentsInternal"
                  />
                </div>
              </Col>
            </Row> */}

            <Row className="pt-3 mx-0">
              <div className={cx('d-flex pb-1 pt-2', styles.wrapLabel)}>
                <p className={cx('mb-0', styles.label)}>
                  {t('form.companyCommentsExternal')}{' '}
                  {!whenTypeIsReviewPrep &&
                    (whenStatusPendingOrReassignAndByCreator ||
                      canReviewAndReassign) && (
                      <span className={styles.dotRequired}>*</span>
                    )}
                </p>
              </div>
              <TextAreaForm
                {...register('companyCommentsExternal')}
                placeholder={t('placeholder.companyCommentsExternal')}
                maxLength={500}
                disabled={
                  whenTypeIsReviewPrep ||
                  !(
                    canReviewAndReassign ||
                    whenStatusPendingOrReassignAndByCreator
                  )
                }
                rows={3}
                control={control}
                required
              />
            </Row>
          </div>
        </Container>

        <Container className="pb-3">
          <div className={cx(styles.part, 'pb-3')}>
            <>
              <div className={cx('fw-bold mb-3', styles.titleForm)}>
                {t('objectiveEvidence')}
              </div>
              {selfDeclarationDetail?.selfAssessment?.type !== types.working ? (
                <TableComment
                  comments={data.comments}
                  setData={setData}
                  loading={loading}
                  className={cx(styles.resetSizing, 'mb-5')}
                  disabled={
                    !isEdit ||
                    !whenStatusPendingOrReassignAndByCreator ||
                    whenStatusPendingOrReassignAndByReviewer
                  }
                />
              ) : null}

              <Controller
                control={control}
                name="attachments"
                render={({ field }) => (
                  <div>
                    <TableAttachment
                      loading={loading}
                      value={field.value}
                      classWrapper="pt-0"
                      featurePage={Features.AUDIT_INSPECTION}
                      subFeaturePage={SubFeatures.INTERNAL_AUDIT_REPORT}
                      onchange={field.onChange}
                      isEdit={
                        !(
                          !isEdit ||
                          !whenStatusPendingOrReassignAndByCreator ||
                          whenStatusPendingOrReassignAndByReviewer ||
                          whenStatusIsReassigned
                        )
                      }
                      disable={
                        !isEdit ||
                        !whenStatusPendingOrReassignAndByCreator ||
                        whenStatusPendingOrReassignAndByReviewer ||
                        whenStatusIsReassigned
                      }
                    />
                  </div>
                )}
              />
            </>
          </div>
        </Container>
        <Container className="pb-3">
          <div className={cx(styles.part, 'pb-3')}>
            <>
              <div className={cx('fw-bold mb-3', styles.titleForm)}>
                {t('userHistorySection')}
              </div>
              <TableUserHistorySection
                data={selfDeclarationDetail?.selfDeclarationHistories}
                loading={loading}
              />
            </>
          </div>
        </Container>
      </div>

      <ModalPastComments
        isOpen={openPastCommentModal}
        toggle={toggleLookUpPassComments}
      />

      <ModalComponent
        hiddenHeader
        isOpen={confirmInfo.status}
        title={confirmInfo.title}
        toggle={hanleToggleComment}
        content={confirmReviewReassignContent}
        w="425px"
      />

      <div className={styles.groupButtons}>{renderButtonGroup}</div>
    </>
  );
};

export default PageSelfDeclaration;
