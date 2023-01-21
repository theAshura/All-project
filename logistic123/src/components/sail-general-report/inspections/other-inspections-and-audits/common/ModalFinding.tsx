import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import moment from 'moment';
import { getListMainCategoryActions } from 'store/main-category/main-category.action';
import { useSelector, useDispatch } from 'react-redux';
import { FC, useCallback, useEffect, useMemo } from 'react';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
import SelectUI from 'components/ui/select/Select';
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
  watchDateOfInspection?: moment.Moment;
}

const defaultValues = {
  finding: null,
  // viqId: null,
  estimatedCompletion: null,
  actualCompletion: null,
  status: 'Open',
  mainCategoryId: null,
};

const ModalFinding: FC<ModalFindingProps> = (props) => {
  const {
    toggle,
    isOpen,
    index,
    data,
    handleSubmitForm,
    isView,
    watchDateOfInspection,
  } = props;

  // const { listVIQs, loading: loadingViq } = useSelector((state) => state.viq);
  const { listMainCategories } = useSelector((state) => state.mainCategory);
  const { userInfo } = useSelector((state) => state.authenticate);
  const dispatch = useDispatch();

  const { t } = useTranslation([
    I18nNamespace.PORT_STATE_CONTROL,
    I18nNamespace.COMMON,
  ]);

  useEffect(() => {
    dispatch(
      getListMainCategoryActions.request({
        pageSize: -1,
        status: 'active',
        companyId: userInfo?.mainCompanyId,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schema = yup.object().shape({
    finding: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
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

  const watchStatus = watch('status');
  // const optionViq = useMemo(
  //   () =>
  //     listVIQs?.data?.map((item) => ({
  //       value: item.id,
  //       label: item.refNo,
  //     })),
  //   [listVIQs],
  // );

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
        // viq: {
        //   viqVesselType: viqDetail?.viqVesselType,
        // },
      };
      handleSubmitForm(params, index);
      handleCancel();
    },
    [handleCancel, handleSubmitForm, index],
  );

  const onSubmitAndNewForm = useCallback(
    (formData) => {
      // const viqDetail = listVIQs?.data?.find(
      //   (item) => item.id === formData?.viqId,
      // );
      const params = {
        ...formData,
        // viq: {
        //   viqVesselType: viqDetail?.viqVesselType,
        // },
      };
      handleSubmitForm(params, index);
      // toggleSaveAndNew();
      resetForm();
    },
    [handleSubmitForm, index, resetForm],
  );

  const optionDataMainCategories = useMemo(
    () =>
      listMainCategories?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listMainCategories],
  );

  const renderForm = useCallback(
    () => (
      <>
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
              disabled={isView}
              control={control}
              messageRequired={errors?.estimatedCompletion?.message || ''}
              name="estimatedCompletion"
              minDate={watchDateOfInspection || moment()}
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
      t,
      control,
      isView,
      errors?.estimatedCompletion?.message,
      errors?.actualCompletion?.message,
      watchDateOfInspection,
      watchStatus,
      optionDataMainCategories,
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
      setValue('status', data?.status || null);
      setValue(
        'estimatedCompletion',
        data.estimatedCompletion ? moment(data.estimatedCompletion) : null,
      );
      setValue(
        'actualCompletion',
        data.actualCompletion ? moment(data.actualCompletion) : null,
      );
      setValue('mainCategoryId', data?.mainCategory?.id || null);
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
