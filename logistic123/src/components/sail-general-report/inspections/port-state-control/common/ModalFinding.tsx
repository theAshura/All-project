import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import { getListMainCategoryActions } from 'store/main-category/main-category.action';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import images from 'assets/images/images';
import moment from 'moment';
import SelectUI from 'components/ui/select/Select';
import { useSelector, useDispatch } from 'react-redux';
import { FC, useCallback, useEffect, useMemo } from 'react';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
// import SelectUI from 'components/ui/select/Select';
import { PortStateInspectionReportParams } from 'models/api/port-state-control/port-state-control.model';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { useTranslation } from 'react-i18next';
import ChoosePortModal from 'pages/incidents/form/ChoostPortModal.tsx/ChoosePortModal';
import * as yup from 'yup';
import styles from './modal.module.scss';

interface ModalFindingProps {
  isOpen: boolean;
  isView: boolean;
  toggle: () => void;
  handleSubmitForm?: (data, index?: number) => void;
  data: PortStateInspectionReportParams;
  index: number;
}

enum STATUS_FINDING {
  OPEN = 'Open',
  CLOSED = 'Closed',
}

const defaultValues = {
  finding: null,
  pscActionId: null,
  pscDeficiencyId: null,
  // viqId: null,
  estimatedCompletion: null,
  actualCompletion: null,
  mainCategoryId: null,
  status: STATUS_FINDING.OPEN,
};

const ModalFinding: FC<ModalFindingProps> = (props) => {
  const { toggle, isOpen, index, data, isView, handleSubmitForm } = props;

  const { listPscActions, loading: loadingPSCAction } = useSelector(
    (state) => state.pscAction,
  );
  const { listPSCDeficiency, loading: loadingPSCDeficiency } = useSelector(
    (state) => state.pscDeficiency,
  );
  const { listMainCategories } = useSelector((state) => state.mainCategory);
  const { userInfo } = useSelector((state) => state.authenticate);

  const dispatch = useDispatch();
  // const { listVIQs, loading: loadingViq } = useSelector((state) => state.viq);

  const { t } = useTranslation([
    I18nNamespace.PORT_STATE_CONTROL,
    I18nNamespace.COMMON,
  ]);

  const schema = yup.object().shape({
    finding: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    pscActionId: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
    pscDeficiencyId: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
    estimatedCompletion: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
    actualCompletion: yup
      .string()
      .nullable()
      .when('status', {
        is: (value) => value === 'Closed',
        then: yup
          .string()
          .nullable()
          .trim()
          .required(t('requiredActualCompletion')),
      }),
  });

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchPscActionId = watch('pscActionId');
  const watchPscDeficiencyId = watch('pscDeficiencyId');
  const watchStatus = watch('status');

  const listToViewDeficiency = useMemo(
    () =>
      listPSCDeficiency?.data?.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
      })),
    [listPSCDeficiency],
  );

  // const optionViq = useMemo(
  //   () =>
  //     listVIQs?.data?.map((item) => ({
  //       value: item.id,
  //       label: item.refNo,
  //     })),
  //   [listVIQs],
  // );

  useEffect(() => {
    dispatch(
      getListMainCategoryActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
        status: 'active',
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listToViewAction = useMemo(
    () =>
      listPscActions?.data?.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
      })),
    [listPscActions],
  );

  const pscActionDetail = useMemo(
    () => listPscActions?.data?.find((item) => item.id === watchPscActionId),
    [listPscActions?.data, watchPscActionId],
  );

  const pscDeficiencyDetail = useMemo(
    () =>
      listPSCDeficiency?.data?.find((item) => item.id === watchPscDeficiencyId),
    [listPSCDeficiency?.data, watchPscDeficiencyId],
  );

  const resetForm = useCallback(() => {
    reset(defaultValues);
    clearErrors();
  }, [clearErrors, reset]);

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const onSubmitForm = (formData) => {
    // const viqDetail = listVIQs?.data?.find(
    //   (item) => item.id === formData?.viqId,
    // );
    const params = {
      ...formData,
      pscAction: { code: pscActionDetail?.code, name: pscActionDetail?.name },
      pscDeficiency: {
        code: pscDeficiencyDetail?.code,
        name: pscDeficiencyDetail?.name,
      },
      // viq: {
      //   viqVesselType: viqDetail?.viqVesselType,
      // },
    };
    handleSubmitForm(params, index);
    handleCancel();
  };

  const optionDataMainCategories = useMemo(
    () =>
      listMainCategories?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listMainCategories],
  );

  const renderForm = () => (
    <>
      <Row gutter={[21, 0]}>
        <Col span={8}>
          <div className={cx(styles.labelForm)}>
            {t('pscDeficiencyCode')}
            <span className={cx(styles.required)}>*</span>
          </div>
          <div className={cx(styles.contentForm)}>
            {pscDeficiencyDetail?.code || '-'}
          </div>
        </Col>
        <Col span={8}>
          <div className={cx(styles.labelForm)}>
            {t('pscDeficiencyName')}
            <span className={cx(styles.required)}>*</span>
          </div>
          <div className={cx(styles.contentForm)}>
            {pscDeficiencyDetail?.name || '-'}
          </div>
        </Col>
        <Col span={8}>
          <ChoosePortModal
            buttonName={t('choosePscDeficiency')}
            buttonClassName={cx(styles.btnChoose)}
            renderSuffix={
              <img
                src={images.icons.icAddCircle}
                alt="createNew"
                className={styles.icButton}
              />
            }
            disable={loadingPSCDeficiency || isView}
            title={t('choosePscDeficiency')}
            data={listToViewDeficiency}
            template="pscDeficiencyModal"
            value={watchPscDeficiencyId}
            setValue={setValue}
            name="pscDeficiencyId"
          />
        </Col>
      </Row>
      {errors?.pscDeficiencyId?.message && (
        <div className="message-required mt-2">
          {errors?.pscDeficiencyId?.message}
        </div>
      )}

      <Row gutter={[21, 0]} className="pt-3">
        <Col span={8}>
          <div className={cx(styles.labelForm)}>
            {t('pscActionCode')}
            <span className={cx(styles.required)}>*</span>
          </div>
          <div className={cx(styles.contentForm)}>
            {pscActionDetail?.code || '-'}
          </div>
        </Col>
        <Col span={8}>
          <div className={cx(styles.labelForm)}>
            {t('pscActionName')}
            <span className={cx(styles.required)}>*</span>
          </div>
          <div className={cx(styles.contentForm)}>
            {pscActionDetail?.name || '-'}
          </div>
        </Col>
        <Col span={8}>
          <ChoosePortModal
            buttonName={t('choosePscAction')}
            buttonClassName={cx(styles.btnChoose)}
            renderSuffix={
              <img
                src={images.icons.icAddCircle}
                alt="createNew"
                className={styles.icButton}
              />
            }
            disable={loadingPSCAction || isView}
            title={t('choosePscAction')}
            data={listToViewAction}
            template="pscActionModal"
            value={watchPscActionId}
            setValue={setValue}
            name="pscActionId"
          />
        </Col>
      </Row>
      {errors?.pscActionId?.message && (
        <div className="message-required mt-2">
          {errors?.pscActionId?.message}
        </div>
      )}
      <div>
        <div className={cx(styles.labelForm)}>
          {t('finding')}
          <span className={cx(styles.required)}>*</span>
        </div>
        <TextAreaForm
          name="finding"
          placeholder={t('placeholder.finding')}
          disabled={isView}
          control={control}
          minRows={3}
          maxLength={2000}
        />
      </div>
      <Row gutter={[21, 0]} className="pt-3">
        {/* <Col span={8}>
          <SelectUI
            labelSelect={t('viqCategory')}
            data={optionViq}
            disabled={loadingViq || isView}
            name="viqId"
            className={cx('w-100')}
            control={control}
          />
        </Col> */}
        <Col span={8}>
          <DateTimePicker
            label={t('estimatedCompletion')}
            className="w-100"
            isRequired
            control={control}
            messageRequired={errors?.estimatedCompletion?.message || ''}
            name="estimatedCompletion"
            minDate={moment()}
            disabled={isView}
            inputReadOnly
          />
        </Col>
        <Col span={8}>
          <DateTimePicker
            label={t('actualCompletion')}
            className="w-100"
            disabled={watchStatus === STATUS_FINDING.OPEN || isView}
            isRequired={watchStatus === STATUS_FINDING.CLOSED}
            control={control}
            messageRequired={errors?.actualCompletion?.message || ''}
            name="actualCompletion"
            maxDate={moment()}
            inputReadOnly
          />
        </Col>
        <Col span={8}>
          <SelectUI
            data={optionDataMainCategories}
            control={control}
            name="mainCategoryId"
            labelSelect="Main category"
            disabled={isView}
            className={cx(styles.inputSelect, styles.disabledSelect, 'w-100')}
          />
        </Col>
      </Row>
      <div className={cx(styles.labelForm, 'pt-3')}>{t('status')}</div>
      <RadioForm
        name="status"
        disabled={isView}
        labelClassName={styles.radioLabel}
        control={control}
        radioOptions={[
          { value: STATUS_FINDING.OPEN, label: STATUS_FINDING.OPEN },
          { value: STATUS_FINDING.CLOSED, label: STATUS_FINDING.CLOSED },
        ]}
        onChange={(e) => {
          setError('actualCompletion', { message: '' });
          // setValue('actualCompletion', null);
        }}
      />
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className="mt-4 justify-content-end"
          handleCancel={handleCancel}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
        />
      </div>
    </>
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('finding', data.finding || null);
      // setValue('viqId', data.viqId || null);
      setValue('pscActionId', data.pscActionId || null);
      setValue('pscDeficiencyId', data.pscDeficiencyId || null);
      setValue(
        'estimatedCompletion',
        data.estimatedCompletion ? moment(data.estimatedCompletion) : null,
      );
      setValue(
        'actualCompletion',
        data.actualCompletion ? moment(data.actualCompletion) : null,
      );
      setValue('status', data?.status || STATUS_FINDING.OPEN);
      setValue('mainCategoryId', data?.mainCategoryId || null);
    } else {
      resetForm();
    }
  }, [data, isOpen, resetForm, setValue]);

  useEffect(() => {
    if (watchStatus === STATUS_FINDING.OPEN) {
      setValue('actualCompletion', null);
    }
  }, [setValue, watchStatus]);

  return (
    <ModalComponent
      w={800}
      isOpen={isOpen}
      toggle={handleCancel}
      title={t('findingInformation')}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalFinding;
