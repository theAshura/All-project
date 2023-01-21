import cx from 'classnames';
import { useState, useEffect, useCallback, ReactElement, useMemo } from 'react';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import { Col, Row } from 'reactstrap';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import images from 'assets/images/images';
import ModalListTableForm from 'components/react-hook-form/modal-list-form/ModalListTableForm';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { DATA_SPACE } from 'constants/components/ag-grid.const';
import { I18nNamespace } from 'constants/i18n.const';
import { convertDataUserAssignment } from 'helpers/userAssignment.helper';
import history from 'helpers/history.helper';
import isEmpty from 'lodash/isEmpty';
import { StandardMaster } from 'models/api/standard-master/standard-master.model';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import { getListAuthorityMasterActions } from 'store/authority-master/authority-master.action';
import { getListStandardMasterActions } from 'store/standard-master/standard-master.action';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import * as yup from 'yup';
import { toastSuccess } from 'helpers/notification.helper';
import { AppRouteConst } from 'constants/route.const';
import { ActivePermission } from 'constants/common.const';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import Matrix from '../components/Matrix';
import ModalAssignment from '../modals/Assignment';
import {
  clearSelfAssessmentMatrixReducer,
  clearSelfAssessmentReducer,
  publishOfficialSelfAssessmentActions,
  unpublishSelfAssessmentActions,
} from '../store/action';
import {
  SELF_ASSESSMENT_TYPE_OPTIONS,
  SELF_DECLARATION_STATUS,
  STANDARD_TYPE,
} from '../utils/constant';
import { SelfAssessmentDetailResponse } from '../utils/model';
import styles from './standard-and-matrix.module.scss';

interface SelfAssessmentFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: SelfAssessmentDetailResponse;
  onDelete?: () => void;
  onSubmit: (payload: any) => void;
  screen: 'detail' | 'edit' | 'create';
}

export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

const sortPosition = [
  'type',
  'standardMaster',
  'lastExternalSubmission',
  'companyName',
  'submittedTo',
  'inspectionType',
  'authority',
];

const defaultValueCreate = {
  standardType: STANDARD_TYPE.NoSelf,
  type: SELF_ASSESSMENT_TYPE_OPTIONS[0].value,
  standardMaster: '',
  lastExternalSubmission: '',
  submittedTo: '',
  inspectionType: '',
  attachments: [],
  closeOpenReviewPrep: undefined,
  companyName: '',
};

const StandardAndMatrixForm = ({
  isEdit,
  onSubmit,
  isCreate,
  screen,
}: SelfAssessmentFormProps) => {
  const { t } = useTranslation([
    I18nNamespace.SELF_ASSESSMENT,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState<string>('');
  const [dataForm, setDataForm] = useState(null);
  const [modalAssignMentVisible, openModalAssignment] =
    useState<boolean>(false);
  const [type, setType] = useState('');
  const { listStandardMasters, loading } = useSelector(
    (state) => state.standardMaster,
  );
  const { listAuthorityMasters } = useSelector(
    (state) => state.authorityMaster,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const { errorList, listAuditTypes } = useSelector((state) => state.auditType);
  const { selfAssessmentDetail, loading: selfAssessmentLoading } = useSelector(
    (state) => state.selfAssessment,
  );

  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );

  const typeSelectOption = useMemo(() => {
    if (
      selfAssessmentDetail &&
      selfAssessmentDetail?.selfDeclarations?.length
    ) {
      const isTotalStatusApproved =
        selfAssessmentDetail?.selfDeclarations?.every(
          (selfDeclaration) =>
            selfDeclaration?.status === SELF_DECLARATION_STATUS.approved,
        );

      return isTotalStatusApproved && SELF_ASSESSMENT_TYPE_OPTIONS.slice(0, 2);
    }
    return SELF_ASSESSMENT_TYPE_OPTIONS.slice(0, 1);
  }, [selfAssessmentDetail]);

  const { id } = useParams<{ id: string }>();

  const schema = useMemo(
    () =>
      yup.object().shape({
        type: yup.string().nullable().trim().required(t('thisFieldIsRequired')),
        standard: yup
          .string()
          .nullable()
          .trim()
          .required(t('thisFieldIsRequired')),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isDirty },
    watch,
    setValue,
    getValues,
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: defaultValueCreate,
    resolver: yupResolver(schema),
  });

  const chooseStandardModalRadios = useMemo(
    () => [
      { value: '-1', label: t('newSubmission') },
      { value: '1', label: t('reUsePreviousSubmission') },
    ],
    [t],
  );

  const listAuthorityMastersOption = useMemo(
    () =>
      listAuthorityMasters?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })) || [],
    [listAuthorityMasters?.data],
  );

  const listAuditTypeOption = useMemo(
    () =>
      listAuditTypes?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })) || [],
    [listAuditTypes],
  );

  const initSelectedStandard = useMemo(() => {
    if (isCreate) {
      return undefined;
    }
    return listStandardMasters?.data?.find(
      (el) => el.id === selfAssessmentDetail?.standardMasterId,
    );
  }, [
    isCreate,
    listStandardMasters?.data,
    selfAssessmentDetail?.standardMasterId,
  ]);

  const [selectedStandard, setSelectedStandard] =
    useState<StandardMaster>(initSelectedStandard);

  const dataUserAssignmentConvert = useMemo(() => {
    if (
      isCreate &&
      selectedStandard?.selfAssessments?.[0]?.userAssignments?.length
    ) {
      return convertDataUserAssignment(
        selectedStandard?.selfAssessments?.[0]?.userAssignments,
      );
    }
    return convertDataUserAssignment(selfAssessmentDetail?.userAssignments);
  }, [isCreate, selectedStandard, selfAssessmentDetail?.userAssignments]);

  const publisherAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.PUBLISHER,
        selfAssessmentDetail?.userAssignments,
      ),
    [selfAssessmentDetail?.userAssignments, userInfo?.id],
  );

  const watchStandardType = watch('standardType');
  const watchCloseOpenReviewPrep = watch('closeOpenReviewPrep');
  const handleChangeType = useCallback(
    (value) => {
      setType(value);
      if (value === SELF_ASSESSMENT_TYPE_OPTIONS[0].value) {
        setValue('typeOfInspection', '');
        setValue('authority', '');
        setValue('submittedTo', selfAssessmentDetail?.submittedTo);
        setValue('companyName', selfAssessmentDetail?.companyName);
        setStartDate(selfAssessmentDetail?.lastExternalSubmission);
      } else if (value === SELF_ASSESSMENT_TYPE_OPTIONS[1].value) {
        setStartDate('');
        setValue('submittedTo', '');
        setValue('lastExternalSubmission', '');
        if (screen === 'edit') {
          setValue('typeOfInspection', '');
          setValue('authority', '');
        } else if (screen === 'detail') {
          const typeOfInspection = listAuditTypeOption?.filter(
            (i) => i.value === selfAssessmentDetail?.inspectionTypeId,
          );
          const authority = listAuthorityMastersOption?.filter(
            (i) => i.value === selfAssessmentDetail?.authorityId,
          );
          setValue('typeOfInspection', typeOfInspection);
          setValue('authority', authority);
        }
      }
    },
    [
      setValue,
      selfAssessmentDetail?.submittedTo,
      selfAssessmentDetail?.companyName,
      selfAssessmentDetail?.lastExternalSubmission,
      selfAssessmentDetail?.inspectionTypeId,
      selfAssessmentDetail?.authorityId,
      screen,
      listAuditTypeOption,
      listAuthorityMastersOption,
    ],
  );

  const scrollToView = useCallback((errors) => {
    if (!isEmpty(errors)) {
      const firstError = sortPosition.find((item) => errors[item]);
      const el = document.querySelector(`.form_data #${firstError}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const dataUserAssignmentBody = useCallback((value) => {
    const userAssignment = {
      usersPermissions: [
        {
          permission: ActivePermission.PUBLISHER,
          userIds: value?.publisher?.map((item) => item?.id) || [],
        },
        {
          permission: ActivePermission.REVIEWER,
          userIds: value?.reviewer?.map((item) => item?.id) || [],
        },
        {
          permission: ActivePermission.CREATOR,
          userIds: value?.creator?.map((item) => item?.id) || [],
        },
      ]?.filter((item) => item?.userIds?.length),
    };
    return userAssignment;
  }, []);

  const handleSubmitForm = useCallback(
    (values) => {
      const { input, ...other } = values;
      const dataUser = dataUserAssignmentBody(other);
      onSubmit({
        ...dataForm,
        userAssignment: {
          selfAssessmentId: id,
          usersPermissions: dataUser?.usersPermissions,
        },
      });
    },
    [dataForm, dataUserAssignmentBody, id, onSubmit],
  );

  const onSubmitForm = useCallback(
    (data, selectedStandardDirect) => {
      const workData = {
        type: data?.type,
        standardMasterId: selectedStandardDirect?.id || selectedStandard?.id,
        lastExternalSubmission: startDate
          ? new Date(startDate).toISOString()
          : undefined,
        submittedTo: data?.submittedTo,
        attachments: data?.attachments,
        companyName: data?.companyName,
      };

      if (isCreate) {
        setDataForm(workData);
        openModalAssignment(true);
      } else {
        onSubmit(workData);
      }
    },
    [isCreate, onSubmit, selectedStandard?.id, startDate],
  );

  const rowLabelsStandardList = useMemo(() => {
    const defaultRows = [
      {
        title: t('table.standardName'),
        dataIndex: 'standardName',
        width: 175,
      },
      {
        title: t('table.standardCode'),
        dataIndex: 'standardCode',
        width: 175,
      },
    ];

    if (Number(watchStandardType) === -1) {
      return defaultRows;
    }

    return [
      ...defaultRows,
      {
        title: t('table.lastExtSubmittedDate'),
        dataIndex: 'lastExtSubmittedDate',
        width: 175,
      },
      {
        title: t('table.lastExtSubmittedUser'),
        dataIndex: 'lastExtSubmittedUser',
        width: 175,
      },
    ];
  }, [t, watchStandardType]);

  const handleChangeSearchValue = useCallback((value: string) => {
    setStartDate(value);
  }, []);

  const publishOfficial = useCallback(() => {
    if (id) {
      dispatch(
        publishOfficialSelfAssessmentActions.request({
          id,
          handleSuccess: () => {
            history.push(AppRouteConst.SELF_ASSESSMENT);
          },
        }),
      );
    }
  }, [dispatch, id]);

  const unpublishOfficial = useCallback(() => {
    if (id) {
      dispatch(
        unpublishSelfAssessmentActions.request({
          id,
          handleSuccess: () => {
            history.push(AppRouteConst.SELF_ASSESSMENT);
          },
        }),
      );
    }
  }, [dispatch, id]);

  const dataTableChooseStandard = useMemo(() => {
    const lastExtSubmittedDate = (item: StandardMaster) => {
      if (item?.selfAssessments.length) {
        if (item?.selfAssessments[0].lastExternalSubmission) {
          return moment(item?.selfAssessments[0].lastExternalSubmission).format(
            'DD/MM/YYYY',
          );
        }
        return DATA_SPACE;
      }

      return DATA_SPACE;
    };
    return listStandardMasters?.data?.map((item) => ({
      id: item?.id,
      standardCode: item?.code,
      standardName: item?.name,
      lastExtSubmittedDate: lastExtSubmittedDate(item),
      lastExtSubmittedUser:
        item?.selfAssessments?.[0]?.createdUser?.username || DATA_SPACE,
    }));
  }, [listStandardMasters?.data]);

  const handleCancel = useCallback(() => {
    const values = getValues();
    let isSameData = false;

    if (screen === 'edit') {
      if (
        selfAssessmentDetail?.type === SELF_ASSESSMENT_TYPE_OPTIONS[0].value
      ) {
        // Type = Working, only need to compare included attachments
        const originalValues = {
          attachments: selfAssessmentDetail?.attachments?.length
            ? [...selfAssessmentDetail?.attachments]
            : [],
        };

        const currentValues = {
          attachments: values?.attachments,
        };

        isSameData = isEqual(originalValues, currentValues);
      } else if (
        selfAssessmentDetail?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value
      ) {
        // Type = Review Prep, only need to compare if current type is Review Prep too

        if (type === SELF_ASSESSMENT_TYPE_OPTIONS[0].value) {
          isSameData = false;
        } else {
          const currentValues = {
            attachments: values?.attachments,
            typeOfInspection: values?.typeOfInspection,
            authority: values?.authority,
            closeOpenReviewPrep: values?.closeOpenReviewPrep,
          };

          const typeOfInspection = listAuditTypeOption?.filter(
            (i) => i.value === selfAssessmentDetail?.inspectionTypeId,
          );
          const authority = listAuthorityMastersOption?.filter(
            (i) => i.value === selfAssessmentDetail?.authorityId,
          );

          const originalValues = {
            attachments: selfAssessmentDetail?.attachments?.length
              ? [...selfAssessmentDetail?.attachments]
              : [],
            typeOfInspection: typeOfInspection?.length ? typeOfInspection : '',
            authority: authority?.length ? authority : '',
            closeOpenReviewPrep: selfAssessmentDetail?.closeOpenReviewPrep,
          };

          isSameData = isEqual(originalValues, currentValues);
        }
      }
    } else if (screen === 'create') {
      isSameData = !isDirty;
    }

    if (isSameData) {
      history.push(AppRouteConst.SELF_ASSESSMENT);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          history.push(AppRouteConst.SELF_ASSESSMENT);
        },
      });
    }
  }, [
    getValues,
    isDirty,
    listAuditTypeOption,
    listAuthorityMastersOption,
    screen,
    selfAssessmentDetail?.attachments,
    selfAssessmentDetail?.authorityId,
    selfAssessmentDetail?.closeOpenReviewPrep,
    selfAssessmentDetail?.inspectionTypeId,
    selfAssessmentDetail?.type,
    t,
    type,
  ]);

  const buttonGroups = useMemo(() => {
    const isAllSelfDeclarationAprroved =
      selfAssessmentDetail?.selfDeclarations?.every(
        (selfDeclaration) =>
          selfDeclaration?.status === SELF_DECLARATION_STATUS.approved,
      );
    if (screen === 'detail') {
      return null;
    }

    if (screen === 'create') {
      return (
        <>
          <Button
            className="me-2"
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.CancelOutline}
            onClick={handleCancel}
          >
            {t('button.cancel')}
          </Button>
          <Button
            buttonSize={ButtonSize.Medium}
            onClick={handleSubmit(onSubmitForm, scrollToView)}
          >
            {t('button.save')}
          </Button>
        </>
      );
    }

    // EXPLAINATION: From this line, screen is always `edit`

    if (
      publisherAssignmentPermission &&
      selfAssessmentDetail?.status === 'Closed'
    ) {
      return (
        <Button buttonSize={ButtonSize.Medium} onClick={unpublishOfficial}>
          {t('button.unpublishAndMakeItAsNonOfficial')}
        </Button>
      );
    }

    if (
      publisherAssignmentPermission &&
      selfAssessmentDetail?.status === 'Open' &&
      isAllSelfDeclarationAprroved
    ) {
      return (
        <Button buttonSize={ButtonSize.Medium} onClick={publishOfficial}>
          {t('button.publishAndMakeItAsOfficial')}
        </Button>
      );
    }

    if (selfAssessmentDetail?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value) {
      return (
        <>
          <Button
            className="me-2"
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.CancelOutline}
            onClick={handleCancel}
          >
            {t('button.cancel')}
          </Button>
          <Button
            buttonSize={ButtonSize.Medium}
            onClick={handleSubmit(onSubmitForm, scrollToView)}
          >
            {t('button.save')}
          </Button>
        </>
      );
    }
    return (
      <>
        <Button
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Outline}
          onClick={handleCancel}
          className={styles.buttonCancel}
        >
          {t('button.cancel')}
        </Button>
        <Button
          buttonSize={ButtonSize.Medium}
          onClick={handleSubmit(onSubmitForm, scrollToView)}
        >
          {t('button.save')}
        </Button>
      </>
    );
  }, [
    handleCancel,
    handleSubmit,
    onSubmitForm,
    publishOfficial,
    publisherAssignmentPermission,
    screen,
    scrollToView,
    selfAssessmentDetail?.selfDeclarations,
    selfAssessmentDetail?.status,
    selfAssessmentDetail?.type,
    t,
    unpublishOfficial,
  ]);

  const isFieldWorkingDisabled = useMemo(() => {
    if (
      screen === 'detail' ||
      (screen === 'create' && type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value) ||
      (screen === 'edit' && type === selfAssessmentDetail?.type) ||
      !workFlowActiveUserPermission.includes(ActivePermission.CREATOR) ||
      selfAssessmentDetail?.type === SELF_ASSESSMENT_TYPE_OPTIONS[2].value
    ) {
      return true;
    }

    return false;
  }, [screen, type, workFlowActiveUserPermission, selfAssessmentDetail?.type]);

  const isJustCreated = useMemo(
    () => !selfAssessmentDetail?.updatedUserId,
    [selfAssessmentDetail?.updatedUserId],
  );

  const renderMatrix = useMemo(() => {
    if (screen === 'detail' || screen === 'edit') {
      return (
        <Matrix
          useDefaultScoreStyle={isJustCreated}
          showScore={selfAssessmentDetail?.standardMaster?.scoreApplicable}
        />
      );
    }
    return (
      <div className={cx(styles.dataWrapperEmpty)}>
        <img
          src={images.icons.icNoData}
          className={styles.noData}
          alt="no data"
        />
      </div>
    );
  }, [
    isJustCreated,
    screen,
    selfAssessmentDetail?.standardMaster?.scoreApplicable,
  ]);

  useEffect(() => {
    if (screen !== 'create' && selfAssessmentDetail) {
      const typeOfInspection = listAuditTypeOption?.filter(
        (i) => i.value === selfAssessmentDetail?.inspectionTypeId,
      );
      const authority = listAuthorityMastersOption?.filter(
        (i) => i.value === selfAssessmentDetail?.authorityId,
      );

      setValue('type', selfAssessmentDetail?.type);
      setValue('companyName', selfAssessmentDetail?.companyName);
      setType(selfAssessmentDetail?.type);
      setValue('standard', selfAssessmentDetail?.standardMaster?.name ?? '');
      setValue('submittedTo', selfAssessmentDetail?.submittedTo);
      setValue(
        'attachments',
        selfAssessmentDetail?.attachments?.length
          ? [...selfAssessmentDetail?.attachments]
          : [],
      );
      setStartDate(selfAssessmentDetail?.lastExternalSubmission);
      setValue('typeOfInspection', typeOfInspection);
      setValue('authority', authority);
      setValue(
        'closeOpenReviewPrep',
        selfAssessmentDetail?.closeOpenReviewPrep,
      );
    }
    return () => {
      dispatch(clearSelfAssessmentReducer());
    };
    // don't handle when change listAuditTypeOption and listAuthorityMastersOption
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    screen,
    selfAssessmentDetail,
    setValue,
    listAuthorityMastersOption,
  ]);

  useEffect(() => {
    if (isCreate) {
      setValue('standard', selectedStandard?.name || '');
    } else {
      setValue('standard', '');
    }
  }, [isCreate, selectedStandard, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        if (['code', 'name'].includes(item.fieldName)) {
          return setError(item.fieldName, { message: item.message });
        }
        return null;
      });
    } else {
      clearErrors();
    }
  }, [clearErrors, errorList, setError]);

  useEffectOnce(() => {
    if (screen === 'create') {
      setType(SELF_ASSESSMENT_TYPE_OPTIONS[0].value);
      setValue('attachments', []);
      dispatch(clearSelfAssessmentMatrixReducer());
    }

    dispatch(
      getListAuthorityMasterActions.request({
        isRefreshLoading: false,
        pageSize: -1,
        status: 'active',
      }),
    );

    dispatch(
      getListAuditTypeActions.request({
        isRefreshLoading: false,
        pageSize: -1,
        status: 'active',
      }),
    );
  });

  useEffect(() => {
    const chooseStandardTypeSelf =
      watchStandardType || chooseStandardModalRadios[0].value;
    dispatch(
      getListStandardMasterActions.request({
        pageSize: -1,
        hasElement: STANDARD_TYPE.Element,
        hasSelf: chooseStandardTypeSelf,
      }),
    );
  }, [chooseStandardModalRadios, dispatch, watchStandardType]);

  const disabledType = useMemo(() => {
    const disable =
      watchCloseOpenReviewPrep ||
      screen === 'detail' ||
      !workFlowActiveUserPermission.includes(ActivePermission.CREATOR) ||
      selfAssessmentDetail?.type === SELF_ASSESSMENT_TYPE_OPTIONS[2].value ||
      (screen === 'edit' &&
        selfAssessmentDetail?.type === SELF_ASSESSMENT_TYPE_OPTIONS[0].value);
    return disable;
  }, [
    screen,
    selfAssessmentDetail?.type,
    watchCloseOpenReviewPrep,
    workFlowActiveUserPermission,
  ]);

  const disabledAttachment = useMemo(
    () =>
      !isEdit ||
      watchCloseOpenReviewPrep ||
      !workFlowActiveUserPermission.includes(ActivePermission.CREATOR) ||
      SELF_ASSESSMENT_TYPE_OPTIONS[2].value === selfAssessmentDetail?.type,
    [
      isEdit,
      selfAssessmentDetail?.type,
      watchCloseOpenReviewPrep,
      workFlowActiveUserPermission,
    ],
  );

  const handleCloseOpenReviewPrep = useCallback(
    (value) => {
      setValue('closeOpenReviewPrep', value);
      const toastSubject = value ? 'Close' : 'Open';
      toastSuccess(`${toastSubject} successfully!`);
    },
    [setValue],
  );

  const handleCancelStandardModal = useCallback(() => {
    setValue('standardType', STANDARD_TYPE.NoSelf);
  }, [setValue]);

  const showCloseOpenReviewPrepToggler = useMemo(() => {
    if (type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value) {
      return true;
    }

    return false;
  }, [type]);

  const handleChangeStandard = useCallback(
    async (value) => {
      if (value) {
        const standard = listStandardMasters?.data?.find((item) =>
          value.includes(item.id),
        );
        setSelectedStandard(standard);
        await setValue('standard', standard?.name || '');
        // submit after choose standard
        handleSubmit(
          (formData) => onSubmitForm(formData, standard),
          scrollToView,
        )();
      }
    },
    [
      handleSubmit,
      listStandardMasters?.data,
      onSubmitForm,
      scrollToView,
      setValue,
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
    <div className="form_data">
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <p className={cx('fw-bold', styles.titleForm)}>
            {t('generalInformation')}
          </p>
          <Row className={styles.separateRow}>
            <Col xs={4}>
              <SelectUI
                labelSelect={t('type')}
                data={typeSelectOption}
                disabled={disabledType}
                placeholder={t('placeholder.pleaseSelect')}
                isRequired
                name="type"
                id="type"
                className={cx('w-100')}
                messageRequired={errors?.type?.message || null}
                control={control}
                onChange={handleChangeType}
              />
            </Col>
            <Col xs={4} className={cx('d-flex', styles.standardWrap)}>
              <InputForm
                label={t('standard')}
                className={cx(
                  'd-flex',
                  styles.standardInput,
                  styles.disabledInput,
                )}
                maxLength={250}
                control={control}
                patternValidate={/^[a-z\d\-_\s]+$/i}
                name="standard"
                id="standard"
                wrapperInput={styles.standardInput}
                messageRequired={
                  !selectedStandard && errors?.standard?.message
                    ? errors?.standard?.message
                    : ''
                }
                disabled
                isRequired
              />

              <ModalListTableForm
                name="standardListId"
                disable={
                  !!selectedStandard || !isCreate || watchCloseOpenReviewPrep
                }
                onCancel={handleCancelStandardModal}
                control={control}
                title={t('standard')}
                data={dataTableChooseStandard}
                rowLabels={rowLabelsStandardList}
                buttonName={t('button.chooseStandard')}
                size="xl"
                disableCloseWhenClickOut
                onChangeValues={handleChangeStandard}
                subHeader={
                  <RadioForm
                    className={styles.radioStandardForm}
                    isRequired
                    name="standardType"
                    control={control}
                    disabled={loading || !isEdit}
                    radioOptions={chooseStandardModalRadios}
                  />
                }
              />
            </Col>
            <Col xs={4}>
              <DateTimePicker
                wrapperClassName={styles.datePickerWrapper}
                className="w-100 "
                label={t('table.lastExternalSubmission')}
                value={startDate ? moment(startDate) : undefined}
                control={control}
                name="lastExternalSubmission"
                id="lastExternalSubmission"
                placeholder={
                  isFieldWorkingDisabled
                    ? undefined
                    : t('placeholder.pleaseSelect')
                }
                onChangeDate={(e) => {
                  handleChangeSearchValue(e?.startOf('day').toISOString());
                }}
                disabled={isFieldWorkingDisabled || watchCloseOpenReviewPrep}
                maxDate={moment()}
                inputReadOnly
              />
            </Col>
          </Row>

          <Row className={styles.separateRow}>
            <Col xs={4}>
              <InputForm
                label="Company name"
                className={cx({
                  [styles.disabledInput]: isFieldWorkingDisabled,
                })}
                name="companyName"
                id="companyName"
                placeholder={
                  isFieldWorkingDisabled ? undefined : 'Enter company name'
                }
                control={control}
                patternValidate={/^[a-z\d\-_\s]+$/i}
                disabled={isFieldWorkingDisabled}
              />
            </Col>
            <Col xs={4}>
              <InputForm
                label={t('submittedTo')}
                className={cx({
                  [styles.disabledInput]: isFieldWorkingDisabled,
                })}
                name="submittedTo"
                id="submittedTo"
                placeholder={
                  isFieldWorkingDisabled
                    ? undefined
                    : t('placeholder.enterSubmittedTo')
                }
                maxLength={100}
                control={control}
                patternValidate={/^[a-z\d\-_\s]+$/i}
                disabled={isFieldWorkingDisabled || watchCloseOpenReviewPrep}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className={cx(styles.wrapperContainer)}>
        <p className={cx('fw-bold', styles.titleForm)}>
          {t('selfDeclarationMatrix')}
        </p>
        {renderMatrix}
      </div>
      <Controller
        control={control}
        name="attachments"
        render={({ field }) => (
          <div className="wrap__attachments">
            <TableAttachment
              featurePage={Features.QUALITY_ASSURANCE}
              subFeaturePage={SubFeatures.SELF_ASSESSMENT}
              disable={disabledAttachment}
              loading={false}
              isCreate={isCreate}
              isEdit={isEdit}
              value={field.value}
              onchange={field.onChange}
            />
          </div>
        )}
      />

      <div className="d-flex justify-content-between mt-3 pb-5">
        <div
          className={cx('d-flex', {
            invisible: !showCloseOpenReviewPrepToggler,
          })}
        >
          <span className={cx(styles.labelSelect, 'mr-1')}>
            {t('closeOpenReviewPrep')}&nbsp;&nbsp;
          </span>
          <ToggleSwitch
            disabled={!isEdit}
            control={control}
            name="closeOpenReviewPrep"
            onChange={handleCloseOpenReviewPrep}
          />
        </div>
        <div>{buttonGroups}</div>
      </div>

      <ModalAssignment
        titleModal="creator"
        userAssignmentDetails={selfAssessmentDetail?.userAssignments}
        initialData={dataUserAssignmentConvert}
        isOpen={modalAssignMentVisible}
        onClose={() => {
          if (isCreate) {
            setSelectedStandard(null);
            setValue('standard', '');
          }
          openModalAssignment(false);
        }}
        isCreate={isCreate}
        onConfirm={(values) => {
          handleSubmitForm(values);
          openModalAssignment(false);
        }}
        loading={selfAssessmentLoading}
      />
    </div>
  );
};

export default StandardAndMatrixForm;
