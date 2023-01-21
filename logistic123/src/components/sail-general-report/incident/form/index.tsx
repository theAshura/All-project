import cx from 'classnames';
import moment from 'moment';
import Container from 'components/common/container/ContainerPage';

import { FC, useCallback, useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import {
  CreateIncidentInvestigationParams,
  IncidentInvestigationDetailResponse,
} from 'models/api/incident-investigation/incident-investigation.model';

import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { clearIncidentInvestigationErrorsReducer } from 'store/incident-investigation/incident-investigation.action';
import {
  checkLatitudeDMS,
  checkLatitudeMessage,
  checkLongitudeDMS,
  checkLongitudeMessage,
} from 'helpers/utils.helper';
import { STATUS_COORDINATES } from 'constants/common.const';
import { AppRouteConst } from 'constants/route.const';
import { useParams } from 'react-router';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import styles from './form.module.scss';
import GeneralInformation from './GeneralInformationIncident';
import Place from './Place';
import CauseSection from './CauseSection';
import ActionSection from './ActionSection';

interface IncidentFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  loading?: boolean;
  data: IncidentInvestigationDetailResponse;
  onSubmit: (data: CreateIncidentInvestigationParams) => void;
}

const defaultValues = {
  atPort: true,
  description: null,
  title: null,
  voyageNo: null,
  totalNumberOfCrew: null,
  dateTimeOfIncident: null,
  typeIds: [],
  latitude: '',
  longitude: '',
  portId: null,
  portToId: null,
  typeOfLoss: null,
  otherType: '',
  immediateDirectCause: null,
  basicUnderlyingCauses: null,
  rootCause: null,
  contributionFactor: null,
  nonContributionFactor: null,
  actionControlNeeds: null,
  immediateAction: null,
  preventiveAction: null,
  attachments: [],
  correctionAction: null,
  comments: null,
};

const IncidentForm: FC<IncidentFormProps> = ({
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
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    description: Yup.string().nullable().required(t('errors.required')),
    title: Yup.string().nullable().required(t('errors.required')),
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
        (value) => (value ? checkLatitudeDMS(value) : true),
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
  });

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { getValues, setValue } = methods;

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
        atPort: Boolean(data?.atPort),
        description: data?.description || null,
        title: data?.title || null,
        voyageNo: data?.voyageNo || null,
        totalNumberOfCrew: data?.totalNumberOfCrew || null,
        dateTimeOfIncident:
          moment(data?.dateTimeOfIncident)?.format('MM/DD/YYYY') || null,
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
        comments: data?.incidentInvestigationComments ?? null,
        attachments: data?.attachments || [],
      };
    }

    if (isEqual(defaultParams, params)) {
      history.push(
        `${AppRouteConst.SAIL_GENERAL_REPORT}/detail/${vesselRequestId}?tab=safety-management&subTab=incident`,
      );
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () =>
          history.push(
            `${AppRouteConst.SAIL_GENERAL_REPORT}/detail/${vesselRequestId}?tab=safety-management&subTab=incident`,
          ),
      });
    }
  }, [data, getValues, isCreate, t, vesselRequestId]);

  const onSubmitForm = useCallback(
    (data: CreateIncidentInvestigationParams) => {
      const { latitude, longitude, ...filterData } = data;

      let params: CreateIncidentInvestigationParams = {
        ...filterData,
        vesselId: vesselRequestId,
        dateTimeOfIncident: moment(data?.dateTimeOfIncident).toISOString(),
        typeIds: data?.typeIds,
        otherType: data?.otherType,
        comments: data?.comments?.length ? data?.comments : null,
      };

      if (data?.latitude) {
        params = { ...params, latitude: data?.latitude };
      }
      if (data?.longitude) {
        params = { ...params, longitude: data?.longitude };
      }
      onSubmit(params);
    },
    [onSubmit, vesselRequestId],
  );

  useEffect(() => {
    if (data) {
      const typeIncidentIds = data?.typeIncidents?.map((item) => item?.id);

      setValue('description', data?.description || null);
      setValue('title', data?.title || null);
      setValue('voyageNo', data?.voyageNo || null);
      setValue('totalNumberOfCrew', data?.totalNumberOfCrew || null);
      setValue('dateTimeOfIncident', moment(data?.dateTimeOfIncident) || null);
      setValue('typeIds', typeIncidentIds || []);
      setValue('otherType', data?.otherType || '');

      setValue('atPort', Boolean(data?.atPort));
      setValue('latitude', data?.latitude || '');
      setValue('longitude', data?.longitude || '');
      setValue('portId', data?.portId || null);
      setValue('portToId', data?.portToId || null);
      setValue('typeOfLoss', data?.typeOfLoss || null);
      setValue('immediateDirectCause', data?.immediateDirectCause || null);
      setValue('basicUnderlyingCauses', data?.basicUnderlyingCauses || null);
      setValue('rootCause', data?.rootCause || null);
      setValue('contributionFactor', data?.contributionFactor || null);
      setValue('nonContributionFactor', data?.nonContributionFactor || null);
      setValue('attachments', data?.attachments ?? []);

      setValue('actionControlNeeds', data?.actionControlNeeds || null);
      setValue('immediateAction', data?.immediateAction || null);
      setValue('preventiveAction', data?.preventiveAction || null);
      setValue('correctionAction', data?.correctionAction || null);
      setValue('comments', data?.incidentInvestigationComments ?? null);
    }
    return () => {
      dispatch(clearIncidentInvestigationErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  if (loading && !isCreate) {
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
    <Container>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...methods}>
          <GeneralInformation data={data} isEdit={isEdit} />
          <Place isEdit={isEdit} data={data} />
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
                  classWrapper="p-0"
                  loading={false}
                  disable={!isEdit}
                  isEdit={!loading && isEdit}
                  isCreate={!isEdit}
                  value={field.value}
                  buttonName="Attach"
                  disableFeatureChecking
                  onchange={field.onChange}
                />
              )}
            />
          </div>
          {isEdit && (
            <GroupButton
              className="mt-4 pb-4 justify-content-end"
              handleCancel={handleCancel}
              visibleSaveBtn
              handleSubmit={methods.handleSubmit(onSubmitForm)}
            />
          )}
        </FormProvider>
      </div>
    </Container>
  );
};

export default IncidentForm;
