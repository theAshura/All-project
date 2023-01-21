import cx from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { getListPscActions } from 'store/psc-action/psc-action.action';
import { getListPSCDeficiencyActions } from 'store/psc-deficiency/psc-deficiency.action';
import { getListVIQActions } from 'store/viq/viq.action';
import { getListUserRecordActions } from 'store/user/user.action';
import useEffectOnce from 'hoc/useEffectOnce';
import queryString from 'query-string';
import { PortStateControlRequest } from 'pages/vessel-screening/utils/models/common.model';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import RiskSection from 'pages/vessel-screening/components/RiskSection';
import history from 'helpers/history.helper';
import { ModuleName } from 'constants/common.const';
import { AppRouteConst } from 'constants/route.const';
import { useLocation, useParams } from 'react-router';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { getPortStateControlDetailActions } from 'store/port-state-control/port-state-control.action';
import {
  getVesselPortStateControlRequestDetailActions,
  updateVesselScreeningPortStateControlActions,
} from 'pages/vessel-screening/store/vessel-port-state-control.action';
import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  ActionTypeEnum,
  Features,
  FIXED_ROLE_NAME,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { getListRolesDefaultsApi } from 'api/role.api';
import { Role } from 'models/api/role/role.model';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonType } from 'components/ui/button/Button';
import PermissionCheck from 'hoc/withPermissionCheck';
import images from 'assets/images/images';
import {
  RISK_LEVEL_OPTIONS,
  RISK_LEVEL_TO_SCORE,
  RISK_LEVEL_TO_VALUE,
  RISK_VALUE_TO_LEVEL,
} from 'pages/vessel-screening/utils/constant';
import AddRemark from './components/add-remark';
import Place from './components/place';
import GeneralInformationPSC from './components/general-info';
import styles from './detail-port-state-control.module.scss';

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
    I18nNamespace.COMMON,
  ]);
  const [roles, setRoles] = useState<Role[]>(null);

  const { id } = useParams<{ id: string }>();
  const { search, pathname } = useLocation();
  const { recordStatus, recordId, requestId } = useMemo(
    () => queryString.parse(search),
    [search],
  );

  const isEdit = useMemo(() => recordStatus === 'edit', [recordStatus]);
  const editMode = useMemo(() => pathname.includes('edit'), [pathname]);

  const { portStateControlDetail } = useSelector(
    (state) => state.portStateControl,
  );
  const { portStateRequestDetail, loading } = useSelector(
    (state) => state.vesselPortStateControl,
  );

  const schema = Yup.object().shape({
    potentialRisk: Yup.string()
      .nullable()
      .required(t('thisFieldIsRequired'))
      .oneOf(RISK_LEVEL_OPTIONS, t('thisFieldIsRequired')),
    observedRisk: Yup.string()
      .nullable()
      .required(t('thisFieldIsRequired'))
      .oneOf(RISK_LEVEL_OPTIONS, t('thisFieldIsRequired')),
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

  const inspectorRole = useMemo(
    () => roles?.find((item) => item?.name === FIXED_ROLE_NAME.INSPECTOR),
    [roles],
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
      comments: values?.comments ?? [],
    };

    defaultParams = {
      potentialRisk: portStateRequestDetail?.potentialRisk ?? null,
      potentialScore: portStateRequestDetail?.potentialScore ?? null,
      observedRisk: portStateRequestDetail?.observedRisk ?? null,
      observedScore: portStateRequestDetail?.observedScore ?? null,
      timeLoss: portStateRequestDetail?.timeLoss !== false ?? null,
      comments: portStateRequestDetail?.PSRComments ?? [],
    };

    if (isEqual(defaultParams, params)) {
      history.push(
        `${AppRouteConst.getVesselScreeningById(
          id,
          editMode ? 'edit' : 'detail',
        )}?tab=inspections&subTab=port-state-control`,
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
            )}?tab=inspections&subTab=port-state-control`,
          );
        },
      });
    }
  }, [
    methods,
    portStateRequestDetail?.potentialRisk,
    portStateRequestDetail?.potentialScore,
    portStateRequestDetail?.observedRisk,
    portStateRequestDetail?.observedScore,
    portStateRequestDetail?.timeLoss,
    portStateRequestDetail?.PSRComments,
    id,
    t,
    resetDefault,
    editMode,
  ]);

  useEffect(() => {
    dispatch(getListPscActions.request({ pageSize: -1, status: 'active' }));
    dispatch(
      getListPSCDeficiencyActions.request({ pageSize: -1, status: 'active' }),
    );

    dispatch(getListVIQActions.request({ pageSize: -1, status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getPortStateControlDetailActions.request({
        id: recordId?.toString(),
        vesselScreeningId: id,
      }),
    );
    if (requestId) {
      dispatch(
        getVesselPortStateControlRequestDetailActions.request({
          vesselScreeningId: id,
          id: requestId,
        }),
      );
    }
    return () => {
      dispatch(getPortStateControlDetailActions.success(null));
    };
  }, [dispatch, id, recordId, requestId]);

  useEffect(() => {
    setValue(
      'potentialRisk',
      RISK_VALUE_TO_LEVEL[portStateRequestDetail?.potentialRisk] ?? null,
    );
    setValue(
      'observedRisk',
      RISK_VALUE_TO_LEVEL[portStateRequestDetail?.observedRisk] ?? null,
    );
    setValue('timeLoss', portStateRequestDetail?.timeLoss !== false);
    setValue('comments', portStateRequestDetail?.PSRComments ?? []);
  }, [portStateRequestDetail, setValue]);

  useEffect(() => {
    if (portStateControlDetail?.attachments?.length) {
      setValue('attachments', portStateControlDetail?.attachments || []);
    }
  }, [portStateControlDetail?.attachments, setValue]);

  const handleBackToList = useCallback(() => {
    history.push(
      `${AppRouteConst.getVesselScreeningById(
        id,
        editMode ? 'edit' : 'detail',
      )}?tab=inspections&subTab=port-state-control`,
    );
  }, [id, editMode]);

  const onSubmitForm = useCallback(
    (dataForm: PortStateControlRequest) => {
      const params: PortStateControlRequest = {
        portStateControlId: portStateControlDetail?.id,
        ...dataForm,
        potentialRisk: RISK_LEVEL_TO_VALUE[dataForm?.potentialRisk],
        potentialScore: RISK_LEVEL_TO_SCORE[dataForm?.potentialRisk] ?? null,
        observedRisk: RISK_LEVEL_TO_VALUE[dataForm?.observedRisk],
        observedScore: RISK_LEVEL_TO_SCORE[dataForm?.observedRisk] ?? null,
        comments: dataForm?.comments?.length ? dataForm?.comments : null,
        vesselScreeningId: id,
      };
      dispatch(
        updateVesselScreeningPortStateControlActions.request({
          id,
          data: params,
          handleSuccess: handleBackToList,
        }),
      );
    },
    [dispatch, handleBackToList, id, portStateControlDetail?.id],
  );

  useEffect(() => {
    if (inspectorRole) {
      dispatch(
        getListUserRecordActions.request({
          pageSize: -1,
          status: 'active',
          role: inspectorRole?.id,
          vesselId: portStateControlDetail?.vesselId || undefined,
          moduleName: portStateControlDetail?.vesselId
            ? ModuleName.QA
            : undefined,
        }),
      );
    }
  }, [dispatch, inspectorRole, portStateControlDetail?.vesselId]);

  useEffectOnce(() => {
    getListRolesDefaultsApi()
      .then((res) => {
        setRoles(res.data);
      })
      .catch((e) => {
        setRoles([]);
      });
  });

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
              {t('titles.portStateControl')}
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
                            let url = `${AppRouteConst.getVesselScreeningPSCById(
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
                {portStateControlDetail?.refId || ''}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...methods}>
          <GeneralInformationPSC
            data={portStateControlDetail}
            isEdit={isEdit}
          />
          <Place data={portStateControlDetail} isEdit={isEdit} />

          <AddRemark
            setRemarkList={() => {}}
            values={portStateControlDetail?.portStateInspectionReports?.map(
              (item) => ({
                ...item,
                viqId: item?.viq?.id,
                pscDeficiencyId: item?.pscDeficiency?.id,
                pscActionId: item?.pscDeficiency?.id,
              }),
            )}
            disable
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
                  featurePage={Features.QUALITY_ASSURANCE}
                  subFeaturePage={SubFeatures.VESSEL_SCREENING}
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
