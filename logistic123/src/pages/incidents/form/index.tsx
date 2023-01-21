import cx from 'classnames';
import moment from 'moment';
import Container from 'components/common/container/ContainerPage';

import { FC, useCallback, useState, useEffect, useMemo } from 'react';
import {
  FormProvider,
  FieldValues,
  useForm,
  Controller,
} from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import history from 'helpers/history.helper';
import { useDispatch, useSelector } from 'react-redux';

import { clearIncidentInvestigationErrorsReducer } from 'store/incident-investigation/incident-investigation.action';
import {
  checkLatitudeDMS,
  checkLatitudeMessage,
  checkLongitudeDMS,
  checkLongitudeMessage,
} from 'helpers/utils.helper';
import { AppRouteConst } from 'constants/route.const';
import { FIXED_ROLE_NAME, RoleScope } from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { ActivePermission, STATUS_COORDINATES } from 'constants/common.const';
import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import {
  RISK_LEVEL_TO_SCORE,
  RISK_LEVEL_TO_VALUE,
  RISK_VALUE_TO_LEVEL,
} from 'pages/vessel-screening/utils/constant';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import uniq from 'lodash/uniq';
import { ButtonType } from 'components/ui/button/Button';
import { IncidentsStatuses } from 'constants/components/incidents.const';
import TableHistoryAGGrid from 'components/report-template/forms/table-history/TableHistoryAGGrid';
import { TableComment } from '../common/Comment';
import styles from './form.module.scss';
import GeneralInformation from './GeneralInformationIncidents';
import Place from './Place';
import CauseSection from './CauseSection';
import ActionSection from './ActionSection';
import {
  IncidentDetail,
  CreateIncidentParams,
  IncidentsAssignment,
} from '../utils/models/common.model';
import AddRemark from './AddRemark';
import RiskSectionIncidents from './RiskSectionIncidents';
import IncidentDescription from './IncidentDescription';
import Assignment from './assignment/Assignment';

interface FormIncidentsProps {
  isEdit: boolean;
  isCreate?: boolean;
  loading?: boolean;
  data: IncidentDetail;
  onSubmit: (data: CreateIncidentParams) => void;
}

const defaultValues = {
  atPort: true,
  vesselId: [],
  description: null,
  title: null,
  voyageNo: null,
  totalNumberOfCrew: null,
  dateTimeOfIncident: null,
  typeIds: [],
  remarks: [],
  comments: null,
  latitude: '',
  longitude: '',
  portId: null,
  portToId: null,
  typeOfLoss: null,
  immediateDirectCause: null,
  basicUnderlyingCauses: null,
  rootCause: null,
  contributionFactor: null,
  nonContributionFactor: null,
  actionControlNeeds: null,
  immediateAction: null,
  preventiveAction: null,
  correctionAction: null,
  potentialRisk: null,
  observedRisk: null,
  timeLoss: true,
  reviewStatus: null,
  otherType: '',
  attachments: [],
};

const FormIncidents: FC<FormIncidentsProps> = ({
  isEdit,
  data,
  loading,
  onSubmit,
  isCreate,
}) => {
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.authenticate);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [titleModalRemark, setTitleModalRemark] = useState<string>('');
  const [modalAssignMentVisible, openModalAssignment] =
    useState<boolean>(false);

  const isOperatorDocHolder = useMemo(() => {
    const operatorDocHolderRole = userProfile?.roles?.find(
      (role) => role.name === FIXED_ROLE_NAME.OPERATOR_DOCHOLDER,
    );
    return !!operatorDocHolderRole;
  }, [userProfile?.roles]);

  const isCompanyAdmin = useMemo(
    () => userInfo?.roleScope === RoleScope.Admin,
    [userInfo?.roleScope],
  );

  const showRiskManagementSection = useMemo(
    () =>
      (isCompanyAdmin && isOperatorDocHolder && !isEdit) ||
      !isOperatorDocHolder,
    [isCompanyAdmin, isEdit, isOperatorDocHolder],
  );

  const schema = Yup.object().shape({
    description: Yup.string().nullable().required(t('errors.required')),
    title: Yup.string().nullable().required(t('errors.required')),
    vesselId: Yup.array().min(1, t('errors.required')),
    voyageNo: Yup.string().nullable().required(t('errors.required')),
    dateTimeOfIncident: Yup.string().nullable().required(t('errors.required')),
    typeIds: Yup.array().min(1, t('errors.required')),
    atPort: Yup.boolean().nullable().required(t('errors.required')),

    latitude: Yup.string()
      .nullable()
      .when('atPort', {
        is: (value) => value !== true,
        then: Yup.string().trim().required(t('errors.required')),
      })
      .test(
        'latitude',
        (params) => {
          switch (checkLatitudeMessage(params.value)) {
            case STATUS_COORDINATES.EQUAL_MAX_DEGREE:
              return t('latitudeCannotBeLargerThan');
            case STATUS_COORDINATES.WITHOUT_DIRECTION:
              return t('directionIsRequired');
            case STATUS_COORDINATES.OVER_DEGREE:
              return t('degreeLatitudeMustBeBetween');
            case STATUS_COORDINATES.OVER_MINUTE:
            case STATUS_COORDINATES.OVER_SECOND:
              return t('MinuteDegreeMustBeBetween');
            default:
              return '';
          }
        },
        (value, context) => (value ? checkLatitudeDMS(value) : true),
      ),
    longitude: Yup.string()
      .nullable()
      .when('atPort', {
        is: (value) => value !== true,
        then: Yup.string().nullable().trim().required(t('errors.required')),
      })
      .test(
        'longitude',
        (params) => {
          switch (checkLongitudeMessage(params.value)) {
            case STATUS_COORDINATES.EQUAL_MAX_DEGREE:
              return t('longitudeCannotBeLargerThan');
            case STATUS_COORDINATES.WITHOUT_DIRECTION:
              return t('directionIsRequired');
            case STATUS_COORDINATES.OVER_DEGREE:
              return t('degreeLongitudeMustBeBetween');
            case STATUS_COORDINATES.OVER_MINUTE:
            case STATUS_COORDINATES.OVER_SECOND:
              return t('MinuteDegreeMustBeBetween');
            default:
              return '';
          }
        },
        (value, context) => (value ? checkLongitudeDMS(value) : true),
      ),
    portId: Yup.string().nullable().required(t('errors.required')),
    portToId: Yup.string()
      .nullable()
      .when('atPort', {
        is: (value) => value !== true,
        then: Yup.string().nullable().trim().required(t('errors.required')),
      }),
    // potentialRisk: Yup.string()
    //   .nullable()
    //   .required(t('thisFieldIsRequired'))
    //   .oneOf(RISK_LEVEL_OPTIONS, t('thisFieldIsRequired')),
    // observedRisk: Yup.string()
    //   .nullable()
    //   .required(t('thisFieldIsRequired'))
    //   .oneOf(RISK_LEVEL_OPTIONS, t('thisFieldIsRequired')),
    // timeLoss: Yup.boolean().nullable().required(t('thisFieldIsRequired')),
  });

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { getValues } = methods;

  const resetDefault = useCallback(
    (defaultParams) => {
      methods.reset(defaultParams);
    },
    [methods],
  );

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const values = getValues();
    const params = {
      ...values,
      dateTimeOfIncident: values?.dateTimeOfIncident
        ? values?.dateTimeOfIncident?.format('MM/DD/YYYY')
        : null,
    };

    if (isCreate) {
      defaultParams = {
        ...defaultValues,
      };
    } else {
      const typeIncidentIds = data?.typeIncidents?.map((item) => item?.id);

      defaultParams = {
        vesselId: [data?.vesselId],
        atPort: Boolean(data?.atPort),
        timeLoss: Boolean(data?.timeLoss),
        description: data?.description || null,
        title: data?.title || null,
        voyageNo: data?.voyageNo || null,
        totalNumberOfCrew: data?.totalNumberOfCrew || null,
        dateTimeOfIncident: data?.dateTimeOfIncident
          ? moment(data?.dateTimeOfIncident)?.format('MM/DD/YYYY')
          : null,
        typeIds: typeIncidentIds || [],
        latitude: data?.latitude || '',
        longitude: data?.longitude || '',
        portId: data?.portId || null,
        portToId: data?.portToId || null,
        typeOfLoss: data?.typeOfLoss || null,
        immediateDirectCause: data?.immediateDirectCause || null,
        basicUnderlyingCauses: data?.basicUnderlyingCauses || null,
        rootCause: data?.rootCause || null,
        contributionFactor: data?.contributionFactor || null,
        nonContributionFactor: data?.nonContributionFactor || null,
        actionControlNeeds: data?.actionControlNeeds || null,
        immediateAction: data?.immediateAction || null,
        preventiveAction: data?.preventiveAction || null,
        correctionAction: data?.correctionAction || null,
        otherType: data?.otherType || '',
        remarks: data?.incidentInvestigationRemarks || [],
        comments: data?.incidentInvestigationComments ?? null,
        potentialRisk: data?.potentialRisk,
        observedRisk: data?.observedRisk,
        reviewStatus: data?.reviewStatus || null,
        attachments: data?.attachments || [],
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.INCIDENTS);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          if (isCreate) {
            history.push(AppRouteConst.INCIDENTS);
          } else {
            resetDefault({
              ...defaultParams,
              dateTimeOfIncident: moment(data?.dateTimeOfIncident),
            });
            history.goBack();
          }
        },
      });
    }
  }, [data, getValues, isCreate, resetDefault, t]);

  const onSubmitForm = useCallback(
    (formData: CreateIncidentParams) => {
      const { latitude, longitude, vesselId, status, ...filterData } = formData;
      let params: CreateIncidentParams = {
        ...filterData,
        dateTimeOfIncident: moment(formData?.dateTimeOfIncident).toISOString(),
        typeIds: formData?.typeIds,
        otherType: formData?.otherType,
        potentialRisk: RISK_LEVEL_TO_VALUE[formData?.potentialRisk] ?? null,
        observedRisk: RISK_LEVEL_TO_VALUE[formData?.observedRisk] ?? null,
        potentialScore: RISK_LEVEL_TO_SCORE[formData?.potentialRisk] ?? null,
        observedScore: RISK_LEVEL_TO_SCORE[formData?.observedRisk] ?? null,
        comments: formData?.comments?.length ? formData.comments : null,
        vesselId: vesselId?.[0],
        status: status || data?.status,
      };
      if (formData?.latitude) {
        params = { ...params, latitude: formData?.latitude };
      }
      if (formData?.longitude) {
        params = { ...params, longitude: formData?.longitude };
      }
      onSubmit(params);
    },
    [data?.status, onSubmit],
  );

  useEffect(() => {
    if (data) {
      const typeIncidentIds = data?.typeIncidents?.map((item) => item?.id);
      methods.setValue('description', data?.description || null);
      methods.setValue('vesselId', data?.vesselId ? [data?.vesselId] : null);
      methods.setValue('title', data?.title || null);
      methods.setValue('voyageNo', data?.voyageNo || null);
      methods.setValue('totalNumberOfCrew', data?.totalNumberOfCrew || null);
      methods.setValue(
        'dateTimeOfIncident',
        moment(data?.dateTimeOfIncident) || null,
      );
      methods.setValue('typeIds', typeIncidentIds || []);
      methods.setValue('otherType', data?.otherType || '');

      methods.setValue('atPort', Boolean(data?.atPort));
      methods.setValue('latitude', data?.latitude || '');
      methods.setValue('longitude', data?.longitude || '');
      methods.setValue('portId', data?.portId || null);
      methods.setValue('portToId', data?.portToId || null);
      methods.setValue('typeOfLoss', data?.typeOfLoss || null);
      methods.setValue(
        'immediateDirectCause',
        data?.immediateDirectCause || null,
      );
      methods.setValue(
        'basicUnderlyingCauses',
        data?.basicUnderlyingCauses || null,
      );
      methods.setValue('rootCause', data?.rootCause || null);
      methods.setValue('contributionFactor', data?.contributionFactor || null);
      methods.setValue(
        'nonContributionFactor',
        data?.nonContributionFactor || null,
      );
      methods.setValue('actionControlNeeds', data?.actionControlNeeds || null);
      methods.setValue('immediateAction', data?.immediateAction || null);
      methods.setValue('preventiveAction', data?.preventiveAction || null);
      methods.setValue('correctionAction', data?.correctionAction || null);
      methods.setValue('remarks', data?.incidentInvestigationRemarks || []);
      methods.setValue(
        'potentialRisk',
        RISK_VALUE_TO_LEVEL[data?.potentialRisk] ?? null,
      );
      methods.setValue(
        'observedRisk',
        RISK_VALUE_TO_LEVEL[data?.observedRisk] ?? null,
      );
      methods.setValue('reviewStatus', data?.reviewStatus || null);
      methods.setValue('timeLoss', data?.timeLoss);
      methods.setValue('comments', data?.incidentInvestigationComments ?? null);
      methods.setValue('attachments', data?.attachments || []);
    }
    return () => {
      dispatch(clearIncidentInvestigationErrorsReducer());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dispatch]);

  const reviewerAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.REVIEWER,
        data?.userAssignments,
      ),
    [data?.userAssignments, userInfo?.id],
  );

  const btnReviewVisible = useMemo(
    () => reviewerAssignmentPermission && isEdit,
    [isEdit, reviewerAssignmentPermission],
  );

  const renderActionsBtn = useMemo(() => {
    if (
      data?.status === IncidentsStatuses.Draft ||
      data?.status === IncidentsStatuses.Reassign ||
      isCreate
    ) {
      return {
        btnLeft: handleCancel,
        btnBetween: methods.handleSubmit(onSubmitForm),
        btnBetweenTxt: 'Save as draft',
        btnRightTxt: 'Submit',
        buttonTypeRight: ButtonType.Green,
        btnRight: () => openModalAssignment(true),
      };
    }
    if (data?.status === IncidentsStatuses.Submitted) {
      return {
        btnLeft: handleCancel,
        btnBetween: () => {
          openModalAssignment(true);
          setTitleModalRemark('reassign');
        },
        buttonTypeBetween: ButtonType.Dangerous,
        btnBetweenTxt: 'Reassign',
        btnRightTxt: btnReviewVisible ? 'Reviewed' : null,
        buttonTypeRight: ButtonType.Green,
        btnRight: btnReviewVisible
          ? () => {
              openModalAssignment(true);
              setTitleModalRemark('review');
            }
          : null,
      };
    }
    if (data?.status === IncidentsStatuses.Reviewed) {
      return {
        btnLeft: handleCancel,
        btnRightTxt: 'Save',
        btnRight: methods.handleSubmit(onSubmitForm),
      };
    }
    return {
      btnLeft: handleCancel,
      btnRightTxt: 'Save as draft',
      btnRight: methods.handleSubmit(onSubmitForm),
    };
  }, [
    btnReviewVisible,
    data?.status,
    handleCancel,
    isCreate,
    methods,
    onSubmitForm,
  ]);

  const userAssignmentFromDetail = useMemo(() => {
    if (!data?.userAssignments) {
      return null;
    }
    let usersPermissions = [];
    data?.userAssignments?.forEach((item) => {
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
  }, [data?.userAssignments]);

  const populateAssignment = useCallback(
    (value): IncidentsAssignment => {
      const currentReviwer =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === ActivePermission.REVIEWER,
        )?.userIds || [];

      const reviwerIds = value?.reviewer?.map((item) => item?.id);

      const userAssignment = {
        usersPermissions: [
          {
            permission: ActivePermission.REVIEWER,
            userIds: reviwerIds?.length
              ? reviwerIds
              : uniq(currentReviwer?.concat(reviwerIds || [])),
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

  const handleDataAssignment = useCallback(
    (values) => {
      const { dataInput, ...dataAssignment } = values;
      const userAssignment: IncidentsAssignment =
        populateAssignment(dataAssignment);
      // case submit
      if (
        data?.status === IncidentsStatuses.Draft ||
        data?.status === IncidentsStatuses.Reassign ||
        isCreate
      ) {
        methods.handleSubmit((data: CreateIncidentParams) =>
          onSubmitForm({
            ...data,
            status: IncidentsStatuses.Submitted,
            userAssignment,
          }),
        )();

        return;
      }

      // case reject
      if (titleModalRemark === 'reassign') {
        methods.handleSubmit((data: CreateIncidentParams) =>
          onSubmitForm({
            ...data,
            status: IncidentsStatuses.Reassign,
            userAssignment,
          }),
        )();
        return;
      }
      if (titleModalRemark === 'review') {
        methods.handleSubmit((data: CreateIncidentParams) =>
          onSubmitForm({
            ...data,
            status: IncidentsStatuses.Reviewed,
            userAssignment,
          }),
        )();
        return;
      }

      methods.handleSubmit((data: CreateIncidentParams) =>
        onSubmitForm({
          ...data,
          status: data?.status || IncidentsStatuses.Draft,
          userAssignment,
        }),
      )();
    },
    [
      data?.status,
      isCreate,
      methods,
      onSubmitForm,
      populateAssignment,
      titleModalRemark,
    ],
  );

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <Container className={cx(styles.wrapper, 'pt-0')}>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...methods}>
          <GeneralInformation data={data} isEdit={isEdit} />
          <Place isEdit={isEdit} data={data} />
          <IncidentDescription isEdit={isEdit} data={data} />
          <CauseSection isEdit={isEdit} />
          <ActionSection isEdit={isEdit} />
          <Controller
            control={methods.control}
            name="comments"
            render={({ field }) => (
              <TableComment
                disable={!isEdit}
                loading={false}
                value={field.value}
                onchange={field.onChange}
                className="mb-3"
                classNameBtn={styles.btnAdd}
              />
            )}
          />
          <div className={cx(styles.wrapperContainer)}>
            <Controller
              control={methods.control}
              name="attachments"
              render={({ field }) => (
                <TableAttachment
                  scrollVerticalAttachment
                  loading={false}
                  classWrapper="p-0"
                  disable={!isEdit}
                  isEdit={!loading && isEdit}
                  isCreate={isCreate}
                  value={field.value}
                  buttonName="Attach"
                  onchange={field.onChange}
                  disableFeatureChecking
                />
              )}
            />
          </div>
          {showRiskManagementSection && (
            <div className={cx(styles.wrapperContainer)}>
              <div className={cx('fw-bold ', styles.labelHeader)}>
                {t('riskManagement')}
              </div>
              <RiskSectionIncidents isEdit={isEdit} className="pt-2" />
              <Controller
                control={methods.control}
                name="remarks"
                render={({ field: { onChange, value } }) => (
                  <AddRemark
                    setRemarkList={onChange}
                    values={value}
                    className="p-0 pt-2"
                    disable={!isEdit}
                  />
                )}
              />
            </div>
          )}

          {!isCreate && (
            <TableHistoryAGGrid
              data={data?.incidentInvestigationHistories}
              loading={loading}
              pageSizeDefault={5}
              moduleTemplate={MODULE_TEMPLATE.incidents}
              aggridId="ag-grid-table-3"
            />
          )}

          {isEdit && (
            <GroupButton
              className="mt-4 pb-4 justify-content-end"
              handleCancel={renderActionsBtn?.btnLeft}
              disable={loading}
              visibleSaveBtn
              handleSubmit={renderActionsBtn?.btnBetween}
              buttonTypeBetween={renderActionsBtn?.buttonTypeBetween}
              txButtonBetween={renderActionsBtn?.btnBetweenTxt}
              txButtonRight={renderActionsBtn?.btnRightTxt}
              buttonTypeRight={renderActionsBtn?.buttonTypeRight}
              handleSubmitAndNew={renderActionsBtn?.btnRight}
            />
          )}
          <Assignment
            data={data}
            titleModalRemark={titleModalRemark}
            isOpen={modalAssignMentVisible}
            isCreate={isCreate}
            initialData={userAssignmentFromDetail}
            userAssignmentDetails={data?.userAssignments}
            onClose={() => openModalAssignment(false)}
            // vesselId={watchVesselId?.[0]?.value}
            // dynamicLabels={dynamicLabels}
            onConfirm={handleDataAssignment}
          />
        </FormProvider>
      </div>
    </Container>
  );
};

export default FormIncidents;
