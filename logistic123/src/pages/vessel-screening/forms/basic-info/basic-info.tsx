import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row } from 'antd/lib/grid';
import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { I18nNamespace } from 'constants/i18n.const';
import queryString from 'query-string';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { updateVesselScreeningActionsApi } from 'pages/vessel-screening/utils/api/common.api';
import { useCallback, useEffect, useMemo } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { UpdateStatusRequestParams } from 'pages/vessel-screening/utils/models/common.model';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import VoyageInfoForm from 'pages/vessel-screening/components/voyage-info/details/voyageInfoForm';
import styles from './basic-info.module.scss';
import VoyageInfo from './VoyageInfo';
import WebServiceAndStatus from './WebservicesAndStatus';

const defaultValues = {
  status: 'Open',
  reviewStatus: 'Accept',
  typeOfManagement: null,
  shipParticularStatus: null,
  remark: null,
  portId: [],
  vesselOwnerBusinessId: [],
  transferTypeId: [],
  cargoTypeId: [],
  cargoId: [],
  totalQuantity: null,
  units: 'Metric tonne',
  attachments: null,
  ports: [],
};

const BasicInfoVesselScreening = () => {
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);
  const { search } = useLocation();
  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );
  const { pathname } = useLocation();
  const metadata = useVesselMetadata(undefined, true);

  const editMode = useMemo(() => pathname.includes('edit'), [pathname]);

  const { id } = useParams<{ id: string }>();

  const schema = Yup.object().shape({
    // typeOfManagement: Yup.string()
    //   .trim()
    //   .nullable()
    //   .required(t('errors.required')),
    // shipParticularStatus: Yup.string()
    //   .trim()
    //   .nullable()
    //   .required(t('errors.required')),
    // portId: Yup.array()
    //   .nullable()
    //   .min(1, t('errors.required'))
    //   .required(t('errors.required')),
    ports: Yup.array()
      .nullable()
      .min(1, t('errors.required'))
      .required(t('errors.required')),
    transferTypeId: Yup.array()
      .nullable()
      .min(1, t('errors.required'))
      .required(t('errors.required')),
    cargoTypeId: Yup.array()
      .nullable()
      .min(1, t('errors.required'))
      .required(t('errors.required')),

    units: Yup.string().trim().nullable().required(t('errors.required')),
    totalQuantity: Yup.number()
      .nullable()
      .transform((v) => (v === '' || Number.isNaN(v) ? null : v))
      .required(t('errors.required')),
    remark: Yup.string().trim().nullable(),
    // vesselOwnerBusinessId: Yup.array()
    //   .nullable()
    //   .min(1, t('errors.required'))
    //   .required(t('errors.required')),
    picIds: Yup.array().nullable(),
    // .required(t('errors.required'))
    // .min(1, t('errors.required')),
  });

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, setValue, getValues } = methods;

  const sortPosition = useMemo(() => ['targetCompletionDate'], []);
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

  const resetDefault = useCallback(
    (defaultParams) => {
      methods.reset(defaultParams);
    },
    [methods],
  );

  const onCancel = useCallback(() => {
    let defaultParams = {};

    const values = getValues();
    const params = {
      ...values,
    };
    const { shipParticular } = vesselScreeningDetail;
    const picIds = vesselScreeningDetail?.pics?.map((item) => item?.id);
    defaultParams = {
      status: vesselScreeningDetail?.status || 'Open',
      totalQuantity: vesselScreeningDetail?.totalQuantity || null,
      units: vesselScreeningDetail?.units || 'Metric tonne',
      reviewStatus: vesselScreeningDetail?.reviewStatus || 'Accept',
      transferTypeId: vesselScreeningDetail?.transferTypeId
        ? [vesselScreeningDetail?.transferTypeId]
        : [],
      cargoTypeId: vesselScreeningDetail?.cargoTypeId
        ? [vesselScreeningDetail?.cargoTypeId]
        : [],
      cargoId: vesselScreeningDetail?.cargoId
        ? [vesselScreeningDetail?.cargoId]
        : [],
      shipParticularStatus: shipParticular?.status || null,
      remark: vesselScreeningDetail?.remark || null,
      portId: shipParticular?.portId ? [shipParticular?.portId] : [],
      vesselOwnerBusinessId: shipParticular?.vesselOwnerBusinessId
        ? [shipParticular?.vesselOwnerBusinessId]
        : [],
      attachments: shipParticular?.attachments || [],
      typeOfManagement: shipParticular?.typeOfManagement || null,
      ports: vesselScreeningDetail?.ports || [],
      picIds: picIds || [],
    };

    if (isEqual(defaultParams, params)) {
      history.push(AppRouteConst.VESSEL_SCREENING);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          history.push(AppRouteConst.VESSEL_SCREENING);
          resetDefault(defaultParams);
        },
      });
    }
  }, [getValues, resetDefault, t, vesselScreeningDetail]);

  const onSubmitForm = useCallback(
    async (data: UpdateStatusRequestParams) => {
      const newData = {
        id,
        vesselId: vesselScreeningDetail?.vesselId,
        status: data.status,
        reviewStatus: data.reviewStatus,
        picIds: data.picIds,
        ports: data?.ports || [],
        transferTypeId: data.transferTypeId?.[0],
        cargoTypeId: data.cargoTypeId?.[0],
        cargoId: data.cargoId?.[0],
        totalQuantity: data.totalQuantity,
        units: data.units,
        remark: data?.remark || '',
      };

      try {
        await updateVesselScreeningActionsApi(newData);
        toastSuccess('You have updated successfully');
        history.push(AppRouteConst.VESSEL_SCREENING);
      } catch (e) {
        toastError(e?.message);
      }
    },
    [id, vesselScreeningDetail?.vesselId],
  );

  const renderButtonGroup = useMemo(
    () => (
      <GroupButton
        handleCancel={onCancel}
        handleSubmit={handleSubmit(onSubmitForm, scrollToView)}
        txButtonBetween={t('buttons.save')}
        txButtonLeft={t('buttons.cancel')}
        buttonTypeLeft={ButtonType.CancelOutline}
        className="mt-3 mb-3"
      />
    ),
    [onCancel, handleSubmit, onSubmitForm, scrollToView, t],
  );

  useEffect(() => {
    // chưa check ky
    setValue('status', vesselScreeningDetail?.status || 'Open');
    setValue('reviewStatus', vesselScreeningDetail?.reviewStatus || 'Accept');
    setValue('ports', vesselScreeningDetail?.ports || []);
    setValue('transferTypeId', [vesselScreeningDetail?.transferTypeId] || []);
    setValue('cargoTypeId', [vesselScreeningDetail?.cargoTypeId] || []);
    setValue('cargoId', [vesselScreeningDetail?.cargoId] || []);
    setValue('totalQuantity', vesselScreeningDetail?.totalQuantity || null);
    setValue('units', vesselScreeningDetail?.units || 'Metric tonne');
    const picIds = vesselScreeningDetail?.pics?.map((item) => item?.id);
    setValue('picIds', picIds || []);
    setValue('remark', vesselScreeningDetail?.remark || null);
    if (vesselScreeningDetail?.shipParticular) {
      const { shipParticular } = vesselScreeningDetail;

      setValue('typeOfManagement', shipParticular?.typeOfManagement || null);
      setValue('shipParticularStatus', shipParticular?.status || null);

      setValue(
        'portId',
        shipParticular?.portId ? [shipParticular?.portId] : [],
      );
      setValue(
        'vesselOwnerBusinessId',
        shipParticular?.vesselOwnerBusinessId
          ? [shipParticular?.vesselOwnerBusinessId]
          : [],
      );
      setValue(
        'attachments',
        shipParticular?.attachments?.length
          ? [...shipParticular?.attachments]
          : [],
      );
    }
  }, [
    setValue,
    vesselScreeningDetail,
    vesselScreeningDetail?.reviewStatus,
    vesselScreeningDetail?.status,
  ]);
  const renderDetail = useMemo(() => {
    const params = queryString.parse(search);
    if (params?.voyageInfoId) {
      return <VoyageInfoForm isEdit={false} data={undefined} />;
    }

    return (
      <div className={cx(styles.wrapperContainer)}>
        <FormProvider {...methods}>
          {metadata}
          <Container className="pt-0">
            <Row gutter={16}>
              <Col span={18}>
                <VoyageInfo
                  isEdit={editMode}
                  btnGroup={editMode ? renderButtonGroup : null}
                />
              </Col>
              <Col span={6}>
                <WebServiceAndStatus
                  isEdit={editMode}
                  control={methods.control}
                  errors={methods.formState.errors}
                  handleSubmit={handleSubmit}
                />
              </Col>
            </Row>
          </Container>
        </FormProvider>
      </div>
    );
  }, [editMode, handleSubmit, metadata, methods, renderButtonGroup, search]);
  return renderDetail;
};
export default BasicInfoVesselScreening;
