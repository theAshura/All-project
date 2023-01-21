import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import ModalListTableForm from 'components/react-hook-form/modal-list-form/ModalListTableForm';

import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import images from 'assets/images/images';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { FC, useCallback, useEffect, useMemo } from 'react';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
// import SelectUI from 'components/ui/select/Select';
import { PortStateInspectionReportParams } from 'models/api/port-state-control/port-state-control.model';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import styles from './modal.module.scss';

interface ModalFindingProps {
  isOpen: boolean;
  isView?: boolean;
  toggle: () => void;
  handleSubmitForm?: (data, index?: number) => void;
  data: PortStateInspectionReportParams;
  index: number;
}

const defaultValues = {
  finding: null,
  pscActionId: null,
  pscDeficiencyId: null,
  // viqId: null,
  estimatedCompletion: null,
  actualCompletion: null,
  status: 'Open',
};

const ModalFinding: FC<ModalFindingProps> = (props) => {
  const { toggle, isOpen, index, data, handleSubmitForm, isView } = props;

  const { listPscActions, loading: loadingPSCAction } = useSelector(
    (state) => state.pscAction,
  );
  const { listPSCDeficiency, loading: loadingPSCDeficiency } = useSelector(
    (state) => state.pscDeficiency,
  );

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
    // viqId: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
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

  const rowLabelPscDeficiency = useMemo(
    () => [
      {
        title: t('pscDeficiencyCode'),
        width: 100,
        dataIndex: 'code',
        tooltip: false,
      },
      {
        title: t('pscDeficiencyName'),
        dataIndex: 'name',
        width: 100,
        tooltip: false,
      },
    ],
    [t],
  );

  const rowLabelPscAction = useMemo(
    () => [
      {
        title: t('pscActionCode'),
        width: 100,
        dataIndex: 'code',
        tooltip: false,
      },
      {
        title: t('pscActionName'),
        dataIndex: 'name',
        width: 100,
        tooltip: false,
      },
    ],
    [t],
  );

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

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (formData) => {
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
    },
    [
      handleCancel,
      handleSubmitForm,
      index,
      pscActionDetail?.code,
      pscActionDetail?.name,
      pscDeficiencyDetail?.code,
      pscDeficiencyDetail?.name,
    ],
  );

  const onSubmitAndNewForm = useCallback(
    (formData) => {
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
      // toggleSaveAndNew();
      resetForm();
    },
    [
      handleSubmitForm,
      index,
      pscActionDetail?.code,
      pscActionDetail?.name,
      pscDeficiencyDetail?.code,
      pscDeficiencyDetail?.name,
      resetForm,
    ],
  );

  const renderForm = useCallback(
    () => (
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
            <ModalListTableForm
              buttonName={t('choosePscDeficiency')}
              buttonClassName={cx(styles.btnChoose)}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  alt="createNew"
                  className={styles.icButton}
                />
              }
              title={t('choosePscDeficiency')}
              control={control}
              name="pscDeficiencyId"
              scroll={{ x: 700, y: 290 }}
              disable={loadingPSCDeficiency || isView}
              data={listToViewDeficiency}
              rowLabels={rowLabelPscDeficiency}
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
            <ModalListTableForm
              buttonName={t('choosePscAction')}
              buttonClassName={cx(styles.btnChoose)}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  alt="createNew"
                  className={styles.icButton}
                />
              }
              title={t('choosePscAction')}
              control={control}
              name="pscActionId"
              disable={loadingPSCAction || isView}
              data={listToViewAction}
              scroll={{ x: 700, y: 290 }}
              rowLabels={rowLabelPscAction}
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
            control={control}
            minRows={3}
            disabled={isView}
            maxLength={2000}
          />
        </div>
        <Row gutter={[21, 0]} className="pt-3">
          {/* <Col span={8}>
            <SelectUI
              isRequired
              labelSelect={t('viqCategory')}
              data={optionViq}
              disabled={loadingViq || isView}
              name="viqId"
              className={cx('w-100')}
              messageRequired={errors?.viqId?.message || ''}
              control={control}
            />
          </Col> */}
          <Col span={8}>
            <DateTimePicker
              label={t('estimatedCompletion')}
              className="w-100"
              isRequired
              disabled={isView}
              control={control}
              messageRequired={errors?.estimatedCompletion?.message || ''}
              name="estimatedCompletion"
              minDate={moment()}
              inputReadOnly
            />
          </Col>
          <Col span={8}>
            <DateTimePicker
              label={t('actualCompletion')}
              className="w-100"
              disabled={watchStatus === 'Open' || isView}
              isRequired={watchStatus === 'Closed'}
              control={control}
              messageRequired={errors?.actualCompletion?.message || ''}
              name="actualCompletion"
              maxDate={moment()}
              inputReadOnly
            />
          </Col>
          <Col span={8} />
        </Row>
        <div className={cx(styles.labelForm, 'pt-3')}>{t('status')}</div>
        <RadioForm
          name="status"
          labelClassName={styles.radioLabel}
          control={control}
          disabled={isView}
          radioOptions={[
            { value: 'Open', label: 'Open' },
            { value: 'Closed', label: 'Closed' },
          ]}
        />
      </>
    ),
    [
      control,
      errors?.actualCompletion?.message,
      errors?.estimatedCompletion?.message,
      errors?.pscActionId?.message,
      errors?.pscDeficiencyId?.message,
      isView,
      listToViewAction,
      listToViewDeficiency,
      loadingPSCAction,
      loadingPSCDeficiency,
      pscActionDetail?.code,
      pscActionDetail?.name,
      pscDeficiencyDetail?.code,
      pscDeficiencyDetail?.name,
      rowLabelPscAction,
      rowLabelPscDeficiency,
      t,
      watchStatus,
    ],
  );

  const renderFooter = useMemo(
    () => (
      <div>
        <GroupButton
          className="mt-4 justify-content-end"
          handleCancel={handleCancel}
          handleSubmitAndNew={handleSubmit(onSubmitAndNewForm)}
          handleSubmit={handleSubmit(onSubmitForm)}
        />
      </div>
    ),
    [handleCancel, handleSubmit, onSubmitAndNewForm, onSubmitForm],
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('finding', data.finding || null);
      // setValue('viqId', data.viqId || null);
      setValue('pscActionId', data.pscActionId || null);
      setValue('pscDeficiencyId', data.pscDeficiencyId || null);
      setValue('status', data?.status || null);
      setValue(
        'estimatedCompletion',
        data.estimatedCompletion ? moment(data.estimatedCompletion) : null,
      );
      setValue(
        'actualCompletion',
        data.actualCompletion ? moment(data.actualCompletion) : null,
      );
    } else {
      resetForm();
    }
  }, [data, resetForm, setValue]);

  useEffect(() => {
    if (watchStatus === 'Open') {
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
      footer={!isView && renderFooter}
    />
  );
};

export default ModalFinding;
