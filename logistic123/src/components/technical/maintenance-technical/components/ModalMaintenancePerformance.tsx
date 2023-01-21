import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import cx from 'classnames';
import InputForm from 'components/react-hook-form/input-form/InputForm';

import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { CreateMaintenancePerformanceParams } from 'models/api/maintenance-performance/maintenance-performance.model';
import { clearMaintenancePerformance } from 'store/maintenance-performance/maintenance-performance.action';
import { REGEXP_INPUT_NUMBER } from 'constants/regExpValidate.const';
import moment from 'moment';
import { convertToPercent } from 'helpers/utils.helper';
import { MaintenancePerformanceExtend } from '../maintenance-performance';
import styles from './modal.module.scss';

interface ModalProps {
  isOpen?: boolean;
  isView?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (
    data: CreateMaintenancePerformanceParams,
    isCreate: boolean,
  ) => void;
  data?: MaintenancePerformanceExtend;
  w?: string | number;
  setIsCreate?: (value: boolean) => void;
  isEdit?: boolean;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  eventType: 'Overdue Maintenance',
  recordDate: null,
  periodFrom: null,
  periodTo: null,
  totalPlannedJobs: null,
  overdueCriticalJobs: null,
  overdueJobs: null,
  remarks: null,
  attachments: null,
};
const ModalMaintenancePerformance: FC<ModalProps> = (props) => {
  const {
    loading,
    toggle,
    title,
    isOpen,
    onSubmit,
    data,
    isCreate,
    isEdit,
    isView,
  } = props;
  const { t } = useTranslation([
    I18nNamespace.MAINTENANCE_TECHNICAL,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();
  const { vesselDetail } = useSelector((state) => state.vessel);

  const schema = useMemo(
    () =>
      yup.object().shape({
        recordDate: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        periodFrom: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        periodTo: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        totalPlannedJobs: yup
          .number()
          .transform((v, o) => {
            if (o === '') {
              return null;
            }
            if (Number.isNaN(v)) {
              return -1;
            }
            return v;
          })
          .nullable()
          .required(t('ThisFieldIsRequired')),
        overdueCriticalJobs: yup
          .number()
          .transform((v, o) => {
            if (o === '') {
              return null;
            }
            if (Number.isNaN(v)) {
              return -1;
            }
            return v;
          })
          .nullable()
          .required(t('ThisFieldIsRequired')),
        overdueJobs: yup
          .number()
          .transform((v, o) => {
            if (o === '') {
              return null;
            }
            if (Number.isNaN(v)) {
              return -1;
            }
            return v;
          })
          .nullable()
          .required(t('ThisFieldIsRequired')),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchPeriodFrom = watch('periodFrom');
  const watchPeriodTo = watch('periodTo');

  const watchTotalPlannedJobs = watch('totalPlannedJobs');
  const watchOverdueJobs = watch('overdueJobs');

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (data) => {
      const dataSubmit: CreateMaintenancePerformanceParams = {
        ...data,
        periodFrom: moment(data?.periodFrom).toISOString(),
        periodTo: moment(data?.periodTo).toISOString(),
        recordDate: moment(data?.recordDate).toISOString(),
        attachments: data?.attachments || [],
        vesselId: vesselDetail?.id,
      };
      onSubmit(
        {
          ...dataSubmit,
          handleSuccess: () => {
            resetForm();
            toggle();
          },
        },
        isCreate,
      );
    },

    [isCreate, onSubmit, resetForm, toggle, vesselDetail?.id],
  );

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      dispatch(clearMaintenancePerformance());
    }
  }, [dispatch, isOpen, resetForm]);

  useEffect(() => {
    if ((isEdit || isView) && data) {
      setValue('recordDate', moment(data?.recordDate));
      setValue('periodFrom', moment(data?.periodFrom));
      setValue('periodTo', moment(data?.periodTo));
      setValue('totalPlannedJobs', data?.totalPlannedJobs);
      setValue('overdueCriticalJobs', data?.overdueCriticalJobs);
      setValue('overdueJobs', data?.overdueJobs);
      setValue('remarks', data?.remarks);
      setValue(
        'attachments',
        data?.attachments?.length ? [...data?.attachments] : [],
      );
    }
  }, [data, isEdit, isView, setValue]);

  useEffect(() => {
    setValue('vesselName', vesselDetail?.name);
    setValue('imoNumber', vesselDetail?.imoNumber);
  }, [setValue, vesselDetail?.imoNumber, vesselDetail?.name]);
  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('vesselName')}
              className={styles.disabledInput}
              readOnly
              id="vesselName"
              name="vesselName"
              {...register('vesselName')}
              disabled
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('imoNumber')}
              className={styles.disabledInput}
              maxLength={20}
              disabled
              id="imoNumber"
              name="imoNumber"
              {...register('imoNumber')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('eventTypeTx')}
              className={styles.disabledInput}
              disabled
              id="eventType"
              name="eventType"
              value="Overdue Maintenance"
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100"
              isRequired
              label={t('recordDateTx')}
              control={control}
              disabled={isView}
              name="recordDate"
              messageRequired={errors?.recordDate?.message || null}
              placeholder={t('placeholder.pleaseSelect')}
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Row className="pt-0 mx-0">
              <Col className={cx('p-0 me-1')}>
                <DateTimePicker
                  wrapperClassName={cx(styles.datePickerWrapper)}
                  className="w-100"
                  isRequired
                  label={t('periodFromTx')}
                  control={control}
                  disabled={isView}
                  maxDate={watchPeriodTo}
                  name="periodFrom"
                  messageRequired={errors?.periodFrom?.message || null}
                  placeholder={t('placeholder.pleaseSelect')}
                  inputReadOnly
                />
              </Col>
              <Col className={cx('p-0 ms-1')}>
                <DateTimePicker
                  wrapperClassName={cx(styles.datePickerWrapper)}
                  className="w-100"
                  isRequired
                  label={t('periodToTx')}
                  control={control}
                  minDate={watchPeriodFrom}
                  disabled={isView}
                  name="periodTo"
                  messageRequired={errors?.periodTo?.message || null}
                  placeholder={t('placeholder.pleaseSelect')}
                  inputReadOnly
                />
              </Col>
            </Row>
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <InputForm
              messageRequired={errors?.totalPlannedJobs?.message || ''}
              maxLength={4}
              placeholder={t('placeholder.totalPlannedJobs')}
              label={t('totalPlannedJobsTx')}
              patternValidate={REGEXP_INPUT_NUMBER}
              control={control}
              isRequired
              name="totalPlannedJobs"
              disabled={isView}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <InputForm
              label={t('overdueCriticalJobsTx')}
              className={styles.disabledInput}
              placeholder={t('placeholder.overdueCriticalJobs')}
              messageRequired={errors?.overdueCriticalJobs?.message || ''}
              patternValidate={REGEXP_INPUT_NUMBER}
              control={control}
              isRequired
              name="overdueCriticalJobs"
              disabled={isView}
              maxLength={9}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <InputForm
              label={t('overdueNonCriticalJobsTx')}
              className={styles.disabledInput}
              placeholder={t('placeholder.overdueNonCriticalJobs')}
              messageRequired={errors?.overdueJobs?.message || ''}
              patternValidate={REGEXP_INPUT_NUMBER}
              control={control}
              isRequired
              name="overdueJobs"
              disabled={isView}
              maxLength={9}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('overdueNonCriticalPercentageTx')}
              className={styles.disabledInput}
              maxLength={500}
              value={convertToPercent(watchOverdueJobs, watchTotalPlannedJobs)}
              disabled
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('remarks')}
              className={styles.disabledInput}
              placeholder={t('placeholder.remarks')}
              maxLength={500}
              disabled={isView}
              {...register('remarks')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')} />
          <Col className={cx('p-0 ms-3')} />
        </Row>

        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.QUALITY_ASSURANCE}
              subFeaturePage={SubFeatures.SAIL_GENERAL_REPORT}
              loading={false}
              isEdit={!loading && !isView}
              value={field.value}
              disable={isView}
              buttonName="Attach"
              onchange={field.onChange}
              scrollVerticalAttachment
              classWrapper="pb-0"
            />
          )}
        />
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className="mt-1 justify-content-end"
          handleCancel={handleCancel}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={loading}
        />
      </div>
    </>
  );

  return (
    <ModalComponent
      w={1156}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={isEdit || isCreate ? renderFooter() : null}
      headerSubPart={
        isEdit || isView ? (
          <span>
            {t('refID')}: {data?.refId}
          </span>
        ) : null
      }
    />
  );
};

export default ModalMaintenancePerformance;
