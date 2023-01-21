import cx from 'classnames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  FormProvider,
  FieldValues,
  useForm,
  Controller,
} from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { IncidentInvestigationDetailResponse } from 'models/api/incident-investigation/incident-investigation.model';
import { getIncidentInvestigationDetailActionsApi } from 'api/incident-investigation.api';

import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import history from 'helpers/history.helper';
import AddRemark from 'pages/incidents/form/AddRemark';
import { AppRouteConst } from 'constants/route.const';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  CreateIncidentParams,
  IncidentDetail,
} from 'pages/incidents/utils/models/common.model';
import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import RiskSectionIncidents from 'pages/incidents/form/RiskSectionIncidents';
import { useLocation, useParams } from 'react-router';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { parseQueries } from 'helpers/utils.helper';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useDispatch } from 'react-redux';
import { updateIncidentsActions } from 'pages/incidents/store/action';
import {
  RISK_LEVEL_OPTIONS,
  RISK_LEVEL_TO_SCORE,
  RISK_LEVEL_TO_VALUE,
  RISK_VALUE_TO_LEVEL,
} from 'pages/vessel-screening/utils/constant';
import styles from './detail-incident-safety.module.scss';
import GeneralInformation from './components/general-info';
import Place from './components/place';
import CauseSection from './components/cause-section';
import ActionSection from './components/action-section';
import { TableComment } from '../../components/Comment';

interface IncidentFormProps {
  loading?: boolean;
  data: IncidentDetail;
  onSubmit: (data: CreateIncidentParams) => void;
  setSelected: (id) => void;
  isEdit?: boolean;
}

const defaultValues = {
  potentialRisk: null,
  observedRisk: null,
  timeLoss: true,
  reviewStatus: 'Pending',
  attachments: [],
};

const VesselScreeningIncidentSafetyDetail: FC<IncidentFormProps> = ({
  onSubmit,
}) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { search, pathname } = useLocation();
  const [detailIncident, setDetailIncident] =
    useState<IncidentInvestigationDetailResponse>(null);
  const [loading, setLoading] = useState(true);
  const isEdit = useMemo(() => pathname.includes('edit'), [pathname]);

  const { recordId, recordStatus, requestId } = useMemo(
    () => parseQueries(search),
    [search],
  );

  const handleBackToList = useCallback(() => {
    history.push(
      `${AppRouteConst.getVesselScreeningById(
        vesselScreeningId,
        isEdit ? 'edit' : 'detail',
      )}?tab=safety-management&subTab=incident`,
    );
  }, [isEdit, vesselScreeningId]);

  const schema = useMemo(
    () =>
      Yup.object().shape({
        // potentialRisk: Yup.string()
        //   .nullable()
        //   .required(t('thisFieldIsRequired'))
        //   .oneOf(RISK_LEVEL_OPTIONS, t('thisFieldIsRequired')),
        observedRisk: Yup.string()
          .nullable()
          .required(t('thisFieldIsRequired'))
          .oneOf(RISK_LEVEL_OPTIONS, t('thisFieldIsRequired')),
        timeLoss: Yup.boolean().nullable().required(t('thisFieldIsRequired')),
      }),
    [t],
  );

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { setValue, control } = methods;

  const onSubmitForm = useCallback(
    (dataForm) => {
      const { incidentInvestigationReviews } = detailIncident;
      const reviews = incidentInvestigationReviews?.map((item) => ({
        id: item.id,
        remark: item.remark,
        riskFactorId: item.riskFactorId,
        vesselAcceptable: item.vesselAcceptable,
        incidentStatus: item.incidentStatus,
        attachments: item.attachments || [],
      }));
      const data: CreateIncidentParams = {
        incidentId: detailIncident?.id,
        vesselId: detailIncident.vesselId,
        description: detailIncident?.description,
        title: detailIncident?.title,
        voyageNo: detailIncident?.voyageNo,
        totalNumberOfCrew: detailIncident?.totalNumberOfCrew,
        dateTimeOfIncident: detailIncident?.dateTimeOfIncident,
        typeIds: detailIncident?.typeIncidents?.map((item) => item?.id),
        typeOfLoss: detailIncident?.typeOfLoss,
        otherType: detailIncident?.otherType,
        atPort: detailIncident?.atPort,
        portId: detailIncident?.portId,
        portToId: detailIncident?.portToId,
        latitude: detailIncident?.latitude,
        longitude: detailIncident?.longitude,
        immediateDirectCause: detailIncident?.immediateDirectCause,
        basicUnderlyingCauses: detailIncident?.basicUnderlyingCauses,
        rootCause: detailIncident?.rootCause,
        contributionFactor: detailIncident?.contributionFactor,
        nonContributionFactor: detailIncident?.nonContributionFactor,
        immediateAction: detailIncident?.immediateAction,
        preventiveAction: detailIncident?.preventiveAction,
        correctionAction: detailIncident?.correctionAction,
        actionControlNeeds: detailIncident?.actionControlNeeds,
        reviews,
        potentialRisk: RISK_LEVEL_TO_VALUE[dataForm?.potentialRisk] ?? null,
        potentialScore: RISK_LEVEL_TO_SCORE[dataForm?.potentialRisk] ?? null,
        observedRisk: RISK_LEVEL_TO_VALUE[dataForm?.observedRisk] ?? null,
        observedScore: RISK_LEVEL_TO_SCORE[dataForm?.observedRisk] ?? null,
        timeLoss: dataForm?.timeLoss,
        remarks: dataForm?.remarks,
        comments: dataForm?.comments?.length ? dataForm?.comments : null,
        reviewStatus: dataForm?.reviewStatus || 'Pending',
        attachments: dataForm?.attachments || [],
      };

      dispatch(
        updateIncidentsActions.request({
          id: detailIncident?.id,
          data,
          handleSuccess: handleBackToList,
        }),
      );
    },
    [detailIncident, dispatch, handleBackToList],
  );

  useEffect(() => {
    setLoading(true);
    if (recordId) {
      getIncidentInvestigationDetailActionsApi(recordId)
        .then((res) => {
          const { data } = res;
          setDetailIncident(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setDetailIncident(null);
      setLoading(false);
    }
    return () => {
      setDetailIncident(null);
    };
  }, [recordId]);

  const resetDefault = useCallback(
    (defaultParams) => {
      methods.reset(defaultParams);
    },
    [methods],
  );

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const values = methods.getValues();
    const params = {
      ...values,
    };

    defaultParams = {
      remarks: detailIncident?.incidentInvestigationRemarks ?? null,
      potentialRisk: detailIncident?.potentialRisk ?? null,
      observedRisk: detailIncident?.observedRisk ?? null,
      timeLoss: detailIncident?.timeLoss !== false ?? null,
      comments: detailIncident?.incidentInvestigationComments ?? null,
      attachments: detailIncident?.attachments ?? [],
    };

    if (isEqual(defaultParams, params)) {
      history.push(
        `${AppRouteConst.VESSEL_SCREENING}/${
          isEdit ? 'edit' : 'detail'
        }/${vesselScreeningId}?tab=safety-management&subTab=incident`,
      );
      setDetailIncident(null);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          resetDefault(defaultParams);
          history.push(
            `${AppRouteConst.VESSEL_SCREENING}/${
              isEdit ? 'edit' : 'detail'
            }/${vesselScreeningId}?tab=safety-management&subTab=incident`,
          );
          setDetailIncident(null);
        },
      });
    }
  }, [detailIncident, isEdit, methods, resetDefault, t, vesselScreeningId]);

  useEffect(() => {
    if (detailIncident) {
      setValue('reviewStatus', detailIncident?.reviewStatus || 'Pending');
      setValue('remarks', detailIncident?.incidentInvestigationRemarks || null);
      setValue(
        'potentialRisk',
        RISK_VALUE_TO_LEVEL[detailIncident?.potentialRisk] ?? null,
      );
      setValue(
        'observedRisk',
        RISK_VALUE_TO_LEVEL[detailIncident?.observedRisk] ?? null,
      );
      setValue('timeLoss', detailIncident?.timeLoss !== false);
      setValue(
        'comments',
        detailIncident?.incidentInvestigationComments ?? null,
      );
      setValue('attachments', detailIncident?.attachments ?? []);
    }
  }, [detailIncident, setValue]);

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
    <div className={styles.container}>
      <div className={cx(styles.headers)}>
        <div className="d-flex justify-content-between">
          <div className="">
            <BreadCrumb
              current={
                recordStatus === 'edit'
                  ? BREAD_CRUMB.VESSEL_SCREENING_EDIT
                  : BREAD_CRUMB.VESSEL_SCREENING_DETAIL
              }
            />
            <div className={cx('fw-bold', styles.title)}>
              {t('titles.incidents')}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-between align-items-end">
            <div className="d-flex">
              {recordStatus !== 'edit' && (
                <Button
                  className="me-2"
                  buttonType={ButtonType.CancelOutline}
                  onClick={handleBackToList}
                >
                  <span className="pe-2">Back</span>
                </Button>
              )}
              {recordStatus !== 'edit' && (
                <div>
                  <PermissionCheck
                    options={{
                      feature: Features.QUALITY_ASSURANCE,
                      subFeature: SubFeatures.VESSEL_SCREENING,
                      action: ActionTypeEnum.UPDATE,
                    }}
                  >
                    {({ hasPermission }) =>
                      hasPermission && (
                        <Button
                          className={cx(styles.buttonFilter)}
                          onClick={(e) => {
                            let url = `${AppRouteConst.getVesselScreeningIncidentSafetyById(
                              vesselScreeningId,
                              isEdit ? 'edit' : 'detail',
                            )}?recordStatus=edit&recordId=${recordId}`;
                            if (requestId) {
                              url += `&requestId=${requestId}`;
                            }
                            history.push(url);
                          }}
                        >
                          <span className="pe-2">Edit</span>
                          <img
                            src={images.icons.icEdit}
                            alt="edit"
                            className={styles.icEdit}
                          />
                        </Button>
                      )
                    }
                  </PermissionCheck>
                </div>
              )}
            </div>
            <div
              className={cx(
                'fw-bold d-flex align-items-center',
                styles.refIDAndStatus,
              )}
            >
              {t('refID')}:&nbsp;
              <span className={styles.refId}>
                {detailIncident?.refId || ''}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(styles.wrapper)}>
        <GeneralInformation
          data={detailIncident}
          isEdit={recordStatus === 'edit'}
        />
        <Place data={detailIncident} isEdit={recordStatus === 'edit'} />
        <CauseSection data={detailIncident} isEdit={recordStatus === 'edit'} />
        <ActionSection data={detailIncident} isEdit={recordStatus === 'edit'} />

        <FormProvider {...methods}>
          <div className={cx(styles.wrapperContainer)}>
            <Controller
              control={methods.control}
              name="attachments"
              render={({ field }) => (
                <TableAttachment
                  scrollVerticalAttachment
                  classWrapper="p-0"
                  loading={false}
                  disable
                  isEdit={false}
                  isCreate={false}
                  value={field.value}
                  buttonName="Attach"
                  onchange={field.onChange}
                  featurePage={Features.QUALITY_ASSURANCE}
                  subFeaturePage={SubFeatures.VESSEL_SCREENING}
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="comments"
            render={({ field }) => (
              <TableComment
                disable
                loading={false}
                value={field.value}
                onchange={field.onChange}
                className="mb-3"
              />
            )}
          />

          <div className={cx(styles.wrapperContainer)}>
            <div className={cx('fw-bold ', styles.labelHeader)}>
              {t('riskManagement')}
            </div>
            <RiskSectionIncidents
              potentialRiskDisabled
              isEdit={recordStatus === 'edit'}
              className="pt-2"
            />
            <Controller
              control={methods.control}
              name="remarks"
              render={({ field: { onChange, value } }) => (
                <AddRemark
                  setRemarkList={onChange}
                  values={value}
                  className="p-0 pt-2"
                  disable={recordStatus !== 'edit'}
                />
              )}
            />
          </div>
        </FormProvider>

        {recordStatus === 'edit' && (
          <GroupButton
            className="mt-1 pb-4 justify-content-end"
            handleCancel={() => {
              handleCancel();
            }}
            visibleSaveBtn
            handleSubmit={methods.handleSubmit(onSubmitForm)}
            disable={loading}
          />
        )}
      </div>
    </div>
  );
};

export default VesselScreeningIncidentSafetyDetail;
