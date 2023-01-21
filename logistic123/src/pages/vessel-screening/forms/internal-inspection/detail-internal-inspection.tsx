import cx from 'classnames';
import { useCallback, useEffect, useMemo } from 'react';
import {
  FormProvider,
  FieldValues,
  useForm,
  Controller,
} from 'react-hook-form';
import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import { useDispatch, useSelector } from 'react-redux';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  InternalInspectionsRequests,
  UpdateInternalInspectionRequestParams,
} from 'pages/vessel-screening/utils/models/internal-inspection.model';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import {
  clearVesselInternalInspectionReducer,
  getInternalInspectionRequestDetailActions,
  getVesselScreeningInternalInspectionDetailActions,
  updateInternalInspectionRequestActions,
} from 'pages/vessel-screening/store/vessel-internal-inspection.action';
import { useParams, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import { parseQueries } from 'helpers/utils.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import styles from './detail-internal-inspection.module.scss';
import GeneralInformationInternal from './components/general-info';

const defaultValues = {
  comments: [],
};

const VesselScreeningInternalInspectionDetail = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const { search, pathname } = useLocation();

  const { internalInspectionDetail, internalInspectionRequestDetail, loading } =
    useSelector((state) => state.vesselInternalInspection);

  const { recordId, recordStatus, requestId } = useMemo(
    () => parseQueries(search),
    [search],
  );

  const isEdit = useMemo(() => pathname.includes('edit'), [pathname]);

  const schema = yup.object().shape({});

  const method = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { setValue, control, handleSubmit } = method;

  const handleBackToList = useCallback(() => {
    history.push(
      `${AppRouteConst.getVesselScreeningById(
        vesselScreeningId,
        isEdit ? 'edit' : 'detail',
      )}?tab=inspections&subTab=other-inspections`,
    );
  }, [isEdit, vesselScreeningId]);

  const onSubmitForm = useCallback(
    (formData: InternalInspectionsRequests) => {
      const params: UpdateInternalInspectionRequestParams = {
        id: vesselScreeningId,
        data: {
          vesselScreeningId,
          internalInspectionsId: recordId,
          comments: formData?.comments?.length ? formData?.comments : null,
        },
      };

      dispatch(
        updateInternalInspectionRequestActions.request({
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
      potentialRisk: internalInspectionRequestDetail?.potentialRisk ?? null,
      observedRisk: internalInspectionRequestDetail?.observedRisk ?? null,
      timeLoss: internalInspectionRequestDetail?.timeLoss !== false ?? null,
      comments: internalInspectionRequestDetail?.IIRComments ?? [],
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
    handleBackToList,
    internalInspectionRequestDetail?.IIRComments,
    internalInspectionRequestDetail?.observedRisk,
    internalInspectionRequestDetail?.potentialRisk,
    internalInspectionRequestDetail?.timeLoss,
    method,
    resetDefault,
    t,
  ]);

  useEffect(() => {
    dispatch(
      getVesselScreeningInternalInspectionDetailActions.request({
        id: recordId,
        vesselScreeningId,
      }),
    );
    return () => {
      dispatch(clearVesselInternalInspectionReducer());
    };
  }, [dispatch, recordId, vesselScreeningId]);

  useEffect(() => {
    if (requestId) {
      dispatch(
        getInternalInspectionRequestDetailActions.request({
          vesselScreeningId,
          id: requestId,
        }),
      );
    }
  }, [dispatch, requestId, vesselScreeningId]);

  useEffect(() => {
    if (internalInspectionDetail?.attachments?.length) {
      setValue(
        'attachments',
        internalInspectionDetail?.attachments?.length
          ? [...internalInspectionDetail?.attachments]
          : [],
      );
    }
  }, [internalInspectionDetail?.attachments, setValue]);

  useEffect(() => {
    setValue(
      'potentialRisk',
      internalInspectionRequestDetail?.potentialRisk ?? null,
    );
    setValue(
      'observedRisk',
      internalInspectionRequestDetail?.observedRisk ?? null,
    );
    setValue('timeLoss', internalInspectionRequestDetail?.timeLoss !== false);
    setValue('comments', internalInspectionRequestDetail?.IIRComments ?? []);
  }, [internalInspectionRequestDetail, setValue]);

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
              {t('titles.internalInspection')}
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
                            let url = `${AppRouteConst.getVesselScreeningInternalById(
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
                {internalInspectionDetail?.refId || ''}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...method}>
          <GeneralInformationInternal data={internalInspectionDetail} />
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

export default VesselScreeningInternalInspectionDetail;
