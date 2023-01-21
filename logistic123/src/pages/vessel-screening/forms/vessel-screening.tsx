import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { ModuleName, SCREEN_STATUS } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { DATA_SPACE } from 'constants/components/ag-grid.const';
import { REGEXP_INPUT_NUMBER } from 'constants/regExpValidate.const';
import { getListPortActions } from 'store/port/port.action';
import { getListTerminalActions } from 'store/terminal/terminal.action';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { getListTransferTypeActions } from 'pages/transfer-type/store/action';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import isEqual from 'lodash/isEqual';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { getListCargoTypeActions } from 'pages/cargo-type/store/action';
import { getListCargoActions } from 'pages/cargo/store/action';
import SelectUI from 'components/ui/select/Select';
import LabelUI from 'components/ui/label/LabelUI';
import { createVesselScreeningActions } from '../store/action';
import styles from './vessel-screening.module.scss';
import AddPort from './basic-info/common/AddPort';

interface Props {
  screen: SCREEN_STATUS;
}

const defaultValues = {
  dateRequest: null,
  nameRequest: null,
  companyRequestId: null,
  nominatingCounterPartyRequest: null,
  phoneRequest: null,
  emailRequest: null,
  vesselId: null,
  transferTypeId: null,
  cargoTypeId: null,
  cargoId: null,
  totalQuantity: null,
  units: 'Metric tonne',
  portId: null,
  ports: null,
  terminalId: null,
  portBerth: null,
  portLayCanDate: null,
  remark: null,
};

const FormVesselScreening = ({ screen }: Props) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { listVesselResponse, loading } = useSelector((state) => state.vessel);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listTransferTypes } = useSelector((state) => state.transferType);
  const { listCargoTypes } = useSelector((state) => state.cargoType);
  const { listCargos } = useSelector((state) => state.cargo);

  const requireAsString = useMemo(
    () => yup.string().nullable().trim().required(t('errors.required')),
    [t],
  );

  const requireAsDynamicOption = useMemo(
    () =>
      yup
        .array()
        .nullable()
        .required(t('errors.required'))
        .min(1, t('errors.required')),
    [t],
  );

  const schema = useMemo(
    () =>
      yup.object().shape({
        dateRequest: requireAsString,
        nominatingCounterPartyRequest: requireAsString,
        vesselId: requireAsDynamicOption,
        transferTypeId: requireAsDynamicOption,
        cargoTypeId: requireAsDynamicOption,
        ports: requireAsDynamicOption,
        totalQuantity: requireAsString,
        units: requireAsString,
      }),
    [requireAsDynamicOption, requireAsString],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const sortPosition = useMemo(() => ['targetCompletionDate'], []);
  const watchVesselId = watch('vesselId');
  const watchDateRequest = watch('dateRequest');

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

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const values = getValues();
    const params = {
      dateRequest: values?.dateRequest || null,
      nameRequest: values?.nameRequest || null,
      companyRequestId: values?.companyRequestId || null,
      nominatingCounterPartyRequest:
        values?.nominatingCounterPartyRequest || null,
      phoneRequest: values?.phoneRequest || null,
      emailRequest: values?.emailRequest || null,
      vesselId: values?.vesselId || null,
      transferTypeId: values?.transferTypeId || null,
      cargoTypeId: values?.cargoTypeId || null,
      cargoId: values?.cargoId || null,
      totalQuantity: values?.totalQuantity || null,
      units: values?.units || 'Metric tonne',
      portId: values?.portId || null,
      ports: values?.ports || null,
      terminalId: values?.terminalId || null,
      portBerth: values?.portBerth || null,
      portLayCanDate: values?.portLayCanDate || null,
      remark: values?.remark || null,
    };

    defaultParams = {
      ...defaultValues,
    };

    if (isEqual(defaultParams, params)) {
      history.push(AppRouteConst.VESSEL_SCREENING);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => history.push(AppRouteConst.VESSEL_SCREENING),
      });
    }
  }, [getValues, t]);

  const renderPortChecking = useCallback(
    (error, listPort) => {
      if (error) {
        return (
          <div className={cx(styles.message, 'message-required')}>{error}</div>
        );
      }

      const existLayCanDateLessThanDateRequest = listPort?.some((item) => {
        if (
          watchDateRequest &&
          moment(item.layCanDate).diff(watchDateRequest, 'days') < 0
        ) {
          return true;
        }
        return false;
      });
      if (existLayCanDateLessThanDateRequest) {
        return (
          <div className={cx(styles.message, 'message-required')}>
            Laycan/BL date should be greater than Request date
          </div>
        );
      }
      return null;
    },
    [watchDateRequest],
  );

  const onSubmitForm = useCallback(
    (formData) => {
      const existError = renderPortChecking(null, formData?.ports);
      if (existError) {
        return;
      }
      const params = {
        cargoId: formData?.cargoId?.[0]?.value,
        cargoTypeId: formData?.cargoTypeId?.[0]?.value,
        companyRequestId: userInfo.companyId,
        dateRequest: moment(formData?.dateRequest).toISOString(),
        emailRequest: userInfo.email,
        nameRequest: `${userInfo.firstName} ${userInfo.lastName}`,
        nominatingCounterPartyRequest: formData?.nominatingCounterPartyRequest,
        phoneRequest: userInfo.phoneNumber,
        remark: formData.remark,
        ports: formData?.ports,
        totalQuantity: formData?.totalQuantity,
        transferTypeId: formData?.transferTypeId?.[0]?.value,
        units: formData?.units,
        vesselId: formData?.vesselId?.[0]?.value,
        handleSuccess: () => history.push(AppRouteConst.VESSEL_SCREENING),
      };
      dispatch(createVesselScreeningActions.request(params));
    },
    [
      dispatch,
      renderPortChecking,
      userInfo.companyId,
      userInfo.email,
      userInfo.firstName,
      userInfo.lastName,
      userInfo.phoneNumber,
    ],
  );

  const renderButtonGroup = useMemo(
    () => (
      <GroupButton
        className="pt-3"
        handleCancel={handleCancel}
        handleSubmit={handleSubmit(onSubmitForm, scrollToView)}
        txButtonBetween={t('buttons.save')}
        txButtonLeft={t('buttons.cancel')}
        buttonTypeLeft={ButtonType.CancelOutline}
      />
    ),
    [handleCancel, handleSubmit, onSubmitForm, scrollToView, t],
  );

  const createDynamicOptions = useCallback(
    (source: any, cb?: (item: any) => void) => {
      const defaultCb = (item) => ({
        label: item?.name,
        value: item?.id,
      });
      return source?.map(cb ?? defaultCb);
    },
    [],
  );

  const vesselAndCargoVesselOptions = useMemo(
    () =>
      createDynamicOptions(listVesselResponse?.data, (item) => ({
        label: `${item?.name} - ${item?.imoNumber}`,
        value: item?.id,
      })),
    [createDynamicOptions, listVesselResponse?.data],
  );

  const transferTypeOptions = useMemo(
    () => createDynamicOptions(listTransferTypes?.data),
    [createDynamicOptions, listTransferTypes?.data],
  );

  const cargoTypeOptions = useMemo(
    () => createDynamicOptions(listCargoTypes?.data),
    [createDynamicOptions, listCargoTypes?.data],
  );

  const vesselAndCargoCargoIDOptions = useMemo(
    () =>
      createDynamicOptions(listCargos?.data, (item) => ({
        label: item?.name,
        value: item?.id,
      })),
    [createDynamicOptions, listCargos?.data],
  );

  const unitOptions = useMemo(
    () => [
      {
        value: 'Metric tonne',
        label: t('metricTonne'),
      },
      {
        value: 'Kilogram',
        label: t('kilogram'),
      },
    ],
    [t],
  );

  const changeSearchCallback = useCallback(
    (action: any, params?: any) => (value: string) =>
      dispatch(
        action?.({
          pageSize: -1,
          isRefreshLoading: false,
          content: value,
          status: 'active',
          ...params,
        }),
      ),
    [dispatch],
  );

  const fieldChangeSearch = useMemo(
    () => ({
      vesselId: changeSearchCallback((params) =>
        getListVesselActions.request({ ...params, moduleName: ModuleName.QA }),
      ),
      transferType: changeSearchCallback(getListTransferTypeActions.request),
      cargoType: changeSearchCallback(getListCargoTypeActions.request),
      cargoID: changeSearchCallback(getListCargoActions.request),
      portId: changeSearchCallback(getListPortActions.request),
      terminalId: changeSearchCallback(getListTerminalActions.request),
    }),
    [changeSearchCallback],
  );

  const vesselDetail = useMemo(
    () =>
      listVesselResponse?.data?.find(
        (item) => item.id === watchVesselId?.[0]?.value,
      ),
    [listVesselResponse?.data, watchVesselId],
  );

  useEffect(() => {
    setValue(
      'nameRequest',
      `${userInfo.firstName} ${userInfo.lastName}` || null,
    );
    setValue('phoneRequest', userInfo.phoneNumber || null);
    setValue('companyRequestId', userInfo.company.name || null);
    setValue('emailRequest', userInfo.email || null);
  }, [
    setValue,
    userInfo.company.name,
    userInfo.email,
    userInfo.firstName,
    userInfo.lastName,
    userInfo.phoneNumber,
  ]);

  useEffectOnce(() => {
    const params = { pageSize: -1, status: 'active' };
    dispatch(
      getListVesselActions.request({ ...params, moduleName: ModuleName.QA }),
    );
    dispatch(getListPortActions.request(params));
    dispatch(getListTerminalActions.request(params));
    dispatch(getListTransferTypeActions.request(params));
    dispatch(getListCargoTypeActions.request(params));
    dispatch(getListCargoActions.request(params));
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
    <>
      <div className={cx(styles.wrapperContainer)}>
        <Container className={cx(styles.container, 'pb-4')}>
          <div className={cx(styles.part)}>
            <div className={cx('fw-bold', styles.titleForm)}>
              {t('requesterInformation')}
            </div>
            <Row className="pt-2 mx-0">
              <Col className={cx('p-0 me-3')}>
                <DateTimePicker
                  messageRequired={errors?.dateRequest?.message || ''}
                  label={t('labels.requesterDate')}
                  control={control}
                  className={cx('w-100')}
                  name="dateRequest"
                  id="dateRequest"
                  isRequired
                  inputReadOnly
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('labels.requesterName')}
                  {...register('nameRequest')}
                  disabled
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('labels.requesterCompany')}
                  {...register('companyRequestId')}
                  disabled
                />
              </Col>
            </Row>

            <Row className="pt-2 mx-0">
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('labels.requesterPhone')}
                  {...register('phoneRequest')}
                  disabled
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('labels.requesterEmail')}
                  {...register('emailRequest')}
                  disabled
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('labels.requesterNominatingCounterParty')}
                  className={cx({
                    [styles.disabledInput]: screen === SCREEN_STATUS.VIEW,
                  })}
                  maxLength={300}
                  placeholder={t(
                    'placeholders.requesterNominatingCounterParty',
                  )}
                  {...register('nominatingCounterPartyRequest')}
                  messageRequired={
                    errors?.nominatingCounterPartyRequest?.message || ''
                  }
                  disabled={screen === SCREEN_STATUS.VIEW}
                  isRequired
                />
              </Col>
            </Row>
          </div>
        </Container>

        <Container className={cx('mt-3 pb-4', styles.container)}>
          <div className={cx(styles.part)}>
            <div className={cx('fw-bold', styles.titleForm)}>
              {t('vesselAndCargoInformation')}
            </div>
            <Row className="pt-2 mx-0">
              <Col className={cx('p-0 me-3')}>
                <AsyncSelectForm
                  control={control}
                  name="vesselId"
                  id="vesselId"
                  labelSelect={t('labels.vesselAndCargoVessel')}
                  searchContent={t('vesselNameAndIMONumber')}
                  isRequired
                  placeholder={t('placeholders.vesselAndCargoVessel')}
                  className={cx({
                    [styles.disabledInput]: screen === SCREEN_STATUS.VIEW,
                  })}
                  onChangeSearch={fieldChangeSearch.vesselId}
                  options={vesselAndCargoVesselOptions}
                  messageRequired={errors?.vesselId?.message || ''}
                  disabled={screen === SCREEN_STATUS.VIEW}
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('labels.vesselAndCargoIMO')}
                  className={cx({
                    [styles.disabledInput]: screen === SCREEN_STATUS.VIEW,
                  })}
                  value={vesselDetail?.imoNumber || DATA_SPACE}
                  disabled
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <AsyncSelectForm
                  control={control}
                  name="transferTypeId"
                  id="transferTypeId"
                  labelSelect={t('labels.transferType')}
                  searchContent={t('labels.transferType')}
                  isRequired
                  placeholder={t('placeholders.transferType')}
                  className={cx({
                    [styles.disabledInput]: screen === SCREEN_STATUS.VIEW,
                  })}
                  onChangeSearch={fieldChangeSearch.transferType}
                  options={transferTypeOptions}
                  messageRequired={errors?.transferTypeId?.message || ''}
                  disabled={screen === SCREEN_STATUS.VIEW}
                />
              </Col>
            </Row>

            <Row className="pt-2 mx-0">
              <Col className={cx('p-0 me-3')}>
                <AsyncSelectForm
                  control={control}
                  name="cargoTypeId"
                  id="cargoTypeId"
                  labelSelect={t('labels.cargoType')}
                  searchContent={t('labels.cargoType')}
                  isRequired
                  placeholder={t('placeholders.cargoType')}
                  className={cx({
                    [styles.disabledInput]: screen === SCREEN_STATUS.VIEW,
                  })}
                  onChangeSearch={fieldChangeSearch.cargoType}
                  options={cargoTypeOptions}
                  messageRequired={errors?.cargoTypeId?.message || ''}
                  disabled={screen === SCREEN_STATUS.VIEW}
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <AsyncSelectForm
                  control={control}
                  name="cargoId"
                  id="cargoId"
                  labelSelect="&nbsp;"
                  searchContent="Cargo name"
                  placeholder="Please select"
                  className={cx({
                    [styles.disabledInput]: screen === SCREEN_STATUS.VIEW,
                  })}
                  onChangeSearch={fieldChangeSearch.cargoID}
                  options={vesselAndCargoCargoIDOptions}
                  messageRequired={errors?.cargoId?.message || ''}
                  disabled={screen === SCREEN_STATUS.VIEW}
                />
              </Col>
              <Col className={cx('p-0 me-3')}>
                <Row className="p-0 mx-0">
                  <LabelUI
                    label={t('labels.totalQuantity')}
                    isRequired
                    className="ps-0"
                  />
                  <Col className={cx('p-0 me-2')}>
                    <InputForm
                      patternValidate={REGEXP_INPUT_NUMBER}
                      control={control}
                      name="totalQuantity"
                      className={cx({
                        [styles.disabledInput]: screen === SCREEN_STATUS.VIEW,
                      })}
                      placeholder={t('placeholders.totalQuantity')}
                      disabled={screen === SCREEN_STATUS.VIEW}
                      maxLength={10}
                    />
                  </Col>
                  <Col className={cx('p-0 me-0')}>
                    <SelectUI
                      data={unitOptions}
                      disabled={screen === SCREEN_STATUS.VIEW}
                      id="units"
                      name="units"
                      className={cx(styles.units, 'w-100')}
                      messageRequired={errors?.units?.message || null}
                      control={control}
                    />
                  </Col>
                </Row>
                {errors?.totalQuantity?.message && (
                  <div className="message-required mt-2">
                    {errors?.totalQuantity?.message}
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Container>

        <Container className={cx('mt-3 pb-4', styles.container)}>
          <Controller
            control={control}
            name="ports"
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <AddPort
                  setValues={onChange}
                  values={value}
                  className="p-0"
                  dateRequest={watchDateRequest}
                  title={t('portInformation')}
                  disable={screen === SCREEN_STATUS.VIEW}
                />
                {renderPortChecking(fieldState?.error?.message, value)}
              </>
            )}
          />
          <Row className="pt-3 mx-0">
            <div className={cx('d-flex pb-1 ps-0 ', styles.wrapLabel)}>
              <LabelUI label={t('labels.portRemarks')} />
            </div>
            <TextAreaForm
              name="remark"
              placeholder={t('placeholders.portRemarks')}
              maxLength={2000}
              control={control}
              rows={3}
              disabled={screen === SCREEN_STATUS.VIEW}
            />
          </Row>
        </Container>
        <div className={styles.groupButtons}>{renderButtonGroup}</div>
      </div>
    </>
  );
};

export default FormVesselScreening;
