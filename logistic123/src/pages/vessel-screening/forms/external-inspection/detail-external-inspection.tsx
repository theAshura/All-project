import cx from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FormProvider,
  FieldValues,
  useForm,
  Controller,
} from 'react-hook-form';
import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import { useDispatch, useSelector } from 'react-redux';
import { getListPscActions } from 'store/psc-action/psc-action.action';
import { getListPSCDeficiencyActions } from 'store/psc-deficiency/psc-deficiency.action';
import { getListVIQActions } from 'store/viq/viq.action';
import { getListUserRecordActions } from 'store/user/user.action';
import {
  ExternalInspectionsRequests,
  UpdateExternalInspectionRequestParams,
} from 'pages/vessel-screening/utils/models/external-inspection.model';
import { useParams, useLocation } from 'react-router-dom';
import {
  clearVesselExternalInspectionReducer,
  getExternalInspectionRequestDetailActions,
  getVesselScreeningExternalInspectionDetailActions,
  updateExternalInspectionRequestActions,
} from 'pages/vessel-screening/store/vessel-external-inspection.action';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { I18nNamespace } from 'constants/i18n.const';
import { ModuleName } from 'constants/common.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import * as yup from 'yup';
import Button, { ButtonType } from 'components/ui/button/Button';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import {
  ActionTypeEnum,
  Features,
  FIXED_ROLE_NAME,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { parseQueries } from 'helpers/utils.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import history from 'helpers/history.helper';
import { getListRolesDefaultsApi } from 'api/role.api';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import { Role } from 'models/api/role/role.model';
import { AppRouteConst } from 'constants/route.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import styles from './detail-external-inspection.module.scss';
import GeneralInformationExternal from './components/general-info';
import Place from '../../components/Place';
import AddRemark from '../../components/AddRemark';

const defaultValues = {
  comments: [],
};

const VesselScreeningExternalInspectionDetail = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);
  const { search, pathname } = useLocation();
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { externalInspectionDetail, externalInspectionRequestDetail, loading } =
    useSelector((state) => state.vesselExternalInspection);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { recordId, recordStatus, requestId } = useMemo(
    () => parseQueries(search),
    [search],
  );

  const isEdit = useMemo(() => pathname.includes('edit'), [pathname]);

  const schema = useMemo(() => yup.object().shape({}), []);

  const canCurrentUserEdit = useMemo(
    () =>
      externalInspectionDetail
        ? checkDocHolderChartererVesselOwner(
            {
              createdAt: externalInspectionDetail?.createdAt,
              vesselCharterers:
                externalInspectionDetail?.vessel?.vesselCharterers || [],
              vesselDocHolders:
                externalInspectionDetail?.vessel?.vesselOwners || [],
              vesselOwners:
                externalInspectionDetail?.vessel?.vesselDocHolders || [],
            },
            userInfo,
          )
        : false,
    [externalInspectionDetail, userInfo],
  );

  const method = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { setValue, watch, handleSubmit, control } = method;
  const [roles, setRoles] = useState<Role[]>(null);

  const watchFindings = watch('externalInspectionReports');
  const watchDetention = watch('detention');
  const watchNoFinding = watch('noFindings');

  const handleBackToList = useCallback(() => {
    history.push(
      `${AppRouteConst.getVesselScreeningById(
        vesselScreeningId,
        isEdit ? 'edit' : 'detail',
      )}?tab=inspections&subTab=other-inspections`,
    );
  }, [isEdit, vesselScreeningId]);

  const onSubmitForm = useCallback(
    (formData: ExternalInspectionsRequests) => {
      const params: UpdateExternalInspectionRequestParams = {
        id: vesselScreeningId,
        data: {
          vesselScreeningId,
          externalInspectionsId: recordId,
          comments: formData?.comments?.length ? formData?.comments : null,
        },
      };

      dispatch(
        updateExternalInspectionRequestActions.request({
          ...params,
          handleSuccess: handleBackToList,
        }),
      );
    },
    [dispatch, handleBackToList, recordId, vesselScreeningId],
  );

  const resetDefault = useCallback(
    (defaultParams) => {
      method.reset(defaultParams);
    },
    [method],
  );

  const onCancel = useCallback(() => {
    let defaultParams = {};

    const values = method.getValues();
    const params = {
      potentialRisk: values?.potentialRisk ?? null,
      observedRisk: values?.observedRisk ?? null,
      timeLoss: values?.timeLoss !== false ?? null,
      comments: values?.comments ?? [],
    };

    defaultParams = {
      potentialRisk: externalInspectionRequestDetail?.potentialRisk ?? null,
      observedRisk: externalInspectionRequestDetail?.observedRisk ?? null,
      timeLoss: externalInspectionRequestDetail?.timeLoss !== false ?? null,
      comments: externalInspectionRequestDetail?.EIRComments ?? [],
    };

    if (isEqual(defaultParams, params)) {
      handleBackToList();
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          resetDefault(defaultParams);
          handleBackToList();
        },
      });
    }
  }, [
    externalInspectionRequestDetail?.EIRComments,
    externalInspectionRequestDetail?.observedRisk,
    externalInspectionRequestDetail?.potentialRisk,
    externalInspectionRequestDetail?.timeLoss,
    handleBackToList,
    method,
    resetDefault,
    t,
  ]);

  useEffect(() => {
    dispatch(
      getVesselScreeningExternalInspectionDetailActions.request({
        id: recordId,
      }),
    );
    if (requestId) {
      dispatch(
        getExternalInspectionRequestDetailActions.request({
          vesselScreeningId,
          id: requestId,
        }),
      );
    }
    return () => {
      dispatch(clearVesselExternalInspectionReducer());
    };
  }, [dispatch, recordId, requestId, vesselScreeningId]);

  const inspectorRole = useMemo(
    () => roles?.find((item) => item?.name === FIXED_ROLE_NAME.INSPECTOR),
    [roles],
  );

  useEffectOnce(() => {
    dispatch(getListPscActions.request({ pageSize: -1, status: 'active' }));
    dispatch(
      getListPSCDeficiencyActions.request({ pageSize: -1, status: 'active' }),
    );

    dispatch(getListVIQActions.request({ pageSize: -1, status: 'active' }));
  });

  useEffect(() => {
    if (inspectorRole) {
      dispatch(
        getListUserRecordActions.request({
          pageSize: -1,
          status: 'active',
          role: inspectorRole?.id,
          vesselId: externalInspectionDetail?.vesselId || undefined,
          moduleName: externalInspectionDetail?.vesselId
            ? ModuleName.QA
            : undefined,
        }),
      );
    }
  }, [dispatch, externalInspectionDetail?.vesselId, inspectorRole]);

  useEffectOnce(() => {
    getListRolesDefaultsApi()
      .then((res) => {
        setRoles(res.data);
      })
      .catch((e) => {
        setRoles([]);
      });
  });

  useEffect(() => {
    setValue(
      'potentialRisk',
      externalInspectionRequestDetail?.potentialRisk ?? null,
    );
    setValue(
      'observedRisk',
      externalInspectionRequestDetail?.observedRisk ?? null,
    );
    setValue('timeLoss', externalInspectionRequestDetail?.timeLoss !== false);
    setValue('comments', externalInspectionRequestDetail?.EIRComments ?? []);
  }, [externalInspectionRequestDetail, setValue]);

  useEffect(() => {
    if (watchFindings?.length) {
      const findSpecialCode = watchFindings?.find(
        (item) => item?.pscAction?.code === '30',
      );
      if (findSpecialCode) {
        setValue('detention', 'Yes');
      } else {
        setValue('detention', 'No');
      }
    }
    // TODO: error render when add methods
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchFindings, watchDetention]);

  useEffect(() => {
    if (watchNoFinding && watchFindings?.length) {
      setValue('externalInspectionReports', []);
    }
  }, [watchNoFinding, watchFindings, setValue]);

  useEffect(() => {
    if (externalInspectionDetail?.attachments?.length) {
      setValue('attachments', externalInspectionDetail?.attachments || []);
    }
  }, [externalInspectionDetail?.attachments, setValue]);

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
              {t('titles.externalInspection')}
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
                      hasPermission &&
                      canCurrentUserEdit && (
                        <Button
                          className={cx(styles.buttonFilter)}
                          onClick={(e) => {
                            let url = `${AppRouteConst.getVesselScreeningExternalById(
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
                {externalInspectionDetail?.refId || ''}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...method}>
          <GeneralInformationExternal data={externalInspectionDetail} />
          <Place />
          <Controller
            control={control}
            name="externalInspectionReports"
            render={({ field: { onChange, value } }) => (
              <AddRemark setRemarkList={onChange} data={value} disable />
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
                disable={recordStatus !== 'edit'}
                loading={false}
                value={field.value}
                onchange={field.onChange}
              />
            )}
          />

          {recordStatus === 'edit' && (
            <GroupButton
              className="mt-4 pb-4 justify-content-end"
              handleCancel={onCancel}
              visibleSaveBtn
              handleSubmit={handleSubmit(onSubmitForm)}
            />
          )}
        </FormProvider>
      </div>
    </div>
  );
};

export default VesselScreeningExternalInspectionDetail;
