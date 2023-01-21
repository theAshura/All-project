import cx from 'classnames';
import { useCallback, useEffect, useMemo } from 'react';
import {
  FormProvider,
  FieldValues,
  useForm,
  Controller,
} from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { GroupButton } from 'components/ui/button/GroupButton';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import RiskSection from 'pages/vessel-screening/components/RiskSection';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { useLocation, useParams } from 'react-router';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';

import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonType } from 'components/ui/button/Button';
import PermissionCheck from 'hoc/withPermissionCheck';
import images from 'assets/images/images';
import {
  RISK_LEVEL_TO_SCORE,
  RISK_LEVEL_TO_VALUE,
  RISK_VALUE_TO_LEVEL,
} from 'pages/vessel-screening/utils/constant';

import VesselInformationPilotTerminalFeedback from 'pages/pilot-terminal-feedback/form/VesselInformationPilotTerminalFeedback';
import GeneralInformationPilotTerminalFeedback from 'pages/pilot-terminal-feedback/form/GeneralInformationPilotTerminalFeedback';
import ChecklistPilotTerminalFeedback from 'pages/pilot-terminal-feedback/form/ChecklistPilotTerminalFeedback';
import moment from 'moment';
import {
  getPilotTerminalFeedbackDetailActions,
  updatePilotTerminalFeedbacksActions,
} from 'pages/pilot-terminal-feedback/store/action';
import styles from './detail-pilot-terminal-feedback.module.scss';

const defaultValues = {
  potentialRisk: null,
  observedRisk: null,
  timeLoss: true,
  comments: [],
};

const DetailVesselScreeningPortStateControl = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.PILOT_TERMINAL_FEEDBACK,
    I18nNamespace.COMMON,
  ]);

  const { id } = useParams<{ id: string }>();
  const { search, pathname } = useLocation();
  const { recordStatus, recordId, requestId } = useMemo(
    () => queryString.parse(search),
    [search],
  );

  const isEdit = useMemo(() => recordStatus === 'edit', [recordStatus]);
  const editMode = useMemo(() => pathname.includes('edit'), [pathname]);

  const { pilotTerminalFeedbackDetail, loading } = useSelector(
    (state) => state.pilotTerminalFeedback,
  );

  const schema = Yup.object().shape({
    vesselId: Yup.array()
      .nullable()
      .min(1, t('errors.required'))
      .required(t('errors.required')),
    feedbackType: Yup.string().nullable().required(t('errors.required')),
    dateOfInteraction: Yup.string().nullable().required(t('errors.required')),
  });

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { setValue, control } = methods;

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
      potentialRisk: values?.potentialRisk ?? null,
      potentialScore: values?.potentialScore ?? null,
      observedRisk: values?.observedRisk ?? null,
      observedScore: values?.observedScore ?? null,
      timeLoss: values?.timeLoss !== false ?? null,
    };

    defaultParams = {
      potentialRisk: pilotTerminalFeedbackDetail?.potentialRisk ?? null,
      potentialScore: pilotTerminalFeedbackDetail?.potentialScore ?? null,
      observedRisk: pilotTerminalFeedbackDetail?.observedRisk ?? null,
      observedScore: pilotTerminalFeedbackDetail?.observedScore ?? null,
      timeLoss: pilotTerminalFeedbackDetail?.timeLoss !== false ?? null,
    };

    if (isEqual(defaultParams, params)) {
      history.push(
        `${AppRouteConst.getVesselScreeningById(
          id,
          editMode ? 'edit' : 'detail',
        )}?tab=pilot-terminal-feedback`,
      );
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          resetDefault(defaultParams);
          history.push(
            `${AppRouteConst.getVesselScreeningById(
              id,
              editMode ? 'edit' : 'detail',
            )}?tab=pilot-terminal-feedback`,
          );
        },
      });
    }
  }, [
    methods,
    pilotTerminalFeedbackDetail?.potentialRisk,
    pilotTerminalFeedbackDetail?.potentialScore,
    pilotTerminalFeedbackDetail?.observedRisk,
    pilotTerminalFeedbackDetail?.observedScore,
    pilotTerminalFeedbackDetail?.timeLoss,
    id,
    t,
    resetDefault,
    editMode,
  ]);

  useEffect(() => {
    dispatch(
      getPilotTerminalFeedbackDetailActions.request(recordId?.toString()),
    );

    return () => {
      dispatch(getPilotTerminalFeedbackDetailActions.success(null));
    };
  }, [dispatch, id, recordId]);

  useEffect(() => {
    setValue(
      'vesselId',
      pilotTerminalFeedbackDetail?.vesselId
        ? [pilotTerminalFeedbackDetail?.vesselId]
        : [],
    );
    setValue('feedbackType', pilotTerminalFeedbackDetail?.feedbackType || '');
    setValue(
      'dateOfInteraction',
      pilotTerminalFeedbackDetail?.vesselId
        ? moment(pilotTerminalFeedbackDetail?.dateOfInteraction)
        : null,
    );
    setValue(
      'terminalId',
      pilotTerminalFeedbackDetail?.terminalId
        ? [pilotTerminalFeedbackDetail?.terminalId]
        : [],
    );
    setValue(
      'portId',
      pilotTerminalFeedbackDetail?.portId
        ? [pilotTerminalFeedbackDetail?.portId]
        : [],
    );
    setValue(
      'country',
      pilotTerminalFeedbackDetail?.country
        ? [pilotTerminalFeedbackDetail?.country]
        : [],
    );
    setValue('pilotAgeArea', pilotTerminalFeedbackDetail?.pilotAgeArea || '');
    setValue('feedBack', pilotTerminalFeedbackDetail?.feedBack || '');
    setValue('attachments', pilotTerminalFeedbackDetail?.attachments || []);
    setValue(
      'pilotTerminalFeedbackChecklists',
      pilotTerminalFeedbackDetail?.pilotTerminalFeedbackChecklists || [],
    );
    setValue(
      'potentialRisk',
      RISK_VALUE_TO_LEVEL[pilotTerminalFeedbackDetail?.potentialRisk] ?? null,
    );
    setValue(
      'observedRisk',
      RISK_VALUE_TO_LEVEL[pilotTerminalFeedbackDetail?.observedRisk] ?? null,
    );
    setValue('timeLoss', pilotTerminalFeedbackDetail?.timeLoss ?? null);
    setValue('comments', pilotTerminalFeedbackDetail?.PTFComments ?? []);
  }, [pilotTerminalFeedbackDetail, setValue]);

  const handleBackToList = useCallback(() => {
    history.push(
      `${AppRouteConst.getVesselScreeningById(
        id,
        editMode ? 'edit' : 'detail',
      )}?tab=pilot-terminal-feedback`,
    );
  }, [id, editMode]);

  const onSubmitForm = useCallback(
    (dataForm) => {
      const { country, dateOfInteraction, portId, terminalId, vesselId } =
        dataForm;
      const params = {
        ...dataForm,
        country: country?.[0] || null,
        portId: portId?.[0] || null,
        terminalId: terminalId?.[0] || null,
        vesselId: vesselId?.[0] || null,
        dateOfInteraction: moment(dateOfInteraction).toISOString(),
        potentialRisk: RISK_LEVEL_TO_VALUE[dataForm?.potentialRisk],
        potentialScore: RISK_LEVEL_TO_SCORE[dataForm?.potentialRisk] ?? null,
        observedRisk: RISK_LEVEL_TO_VALUE[dataForm?.observedRisk],
        observedScore: RISK_LEVEL_TO_SCORE[dataForm?.observedRisk] ?? null,
        comments: dataForm?.comments?.length ? dataForm?.comments : null,
        vesselScreeningId: id,
      };
      dispatch(
        updatePilotTerminalFeedbacksActions.request({
          id: recordId?.toString(),
          data: params,
          handleSuccess: handleBackToList,
        }),
      );
    },
    [dispatch, handleBackToList, id, recordId],
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
              {t('collapsesTitle.pilotTerminalFeedback')}
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
                            let url = `${AppRouteConst.getVesselScreeningPilotTerminalFeedbackById(
                              id,
                              editMode ? 'edit' : 'detail',
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
                {pilotTerminalFeedbackDetail?.refId || ''}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...methods}>
          <VesselInformationPilotTerminalFeedback
            isEdit={false}
            loading={loading}
          />
          <GeneralInformationPilotTerminalFeedback
            isEdit={false}
            loading={loading}
          />
          <Controller
            control={control}
            name="pilotTerminalFeedbackChecklists"
            render={({ field }) => (
              <ChecklistPilotTerminalFeedback
                isEdit={false}
                value={field.value}
                onChange={field.onChange}
                loading={loading}
              />
            )}
          />

          <div className={cx(styles.wrapperAttachments)}>
            <Controller
              control={control}
              name="attachments"
              render={({ field: { onChange, value } }) => (
                <TableAttachment
                  scrollVerticalAttachment
                  loading={false}
                  disable
                  value={value}
                  buttonName="Attach"
                  onchange={onChange}
                  isEdit={false}
                  disableFeatureChecking
                />
              )}
            />
          </div>

          <RiskSection
            className="mt-3"
            potentialRiskName="potentialRisk"
            observedRiskName="observedRisk"
            timeLossName="timeLoss"
            isEdit={isEdit}
          />

          <Controller
            control={control}
            name="comments"
            render={({ field }) => (
              <TableComment
                disable={!isEdit}
                loading={false}
                value={field.value}
                onchange={field.onChange}
              />
            )}
          />

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
    </div>
  );
};

export default DetailVesselScreeningPortStateControl;
