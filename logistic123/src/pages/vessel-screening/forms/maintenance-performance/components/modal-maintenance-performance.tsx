import { FC, useCallback, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import {
  FieldValues,
  useForm,
  FormProvider,
  Controller,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import SelectUI from 'components/ui/select/Select';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import moment from 'moment';
import { UpdateVesselScreeningParams } from 'pages/vessel-screening/utils/models/common.model';
import { clearVesselScreeningMaintenanceErrorsReducer } from 'pages/vessel-screening/store/vessel-maintenance-performance.action';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import { convertToPercent } from 'helpers/utils.helper';
import { VesselScreeningMaintenanceExtend } from '../list-maintenance-performance';
import styles from './modal-maintenance-performance.module.scss';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  toggle?: () => void;
  onSubmit?: (data: UpdateVesselScreeningParams) => void;
  data?: VesselScreeningMaintenanceExtend;
  isEdit?: boolean;
  loading?: boolean;
}

const defaultValues = {
  comments: [],
};

const ModalMaintenancePerformance: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, onSubmit, data, isEdit } = props;
  const { t } = useTranslation([
    I18nNamespace.MAINTENANCE_TECHNICAL,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();
  const { vesselDetail } = useSelector((state) => state.vessel);

  const schema = yup.object().shape({});

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (dataForm) => {
      const modifiedData = {
        ...dataForm,
        maintenancePerformanceId: data?.id,
        comments: dataForm?.comments?.length ? dataForm?.comments : null,
      };
      onSubmit(modifiedData);
      resetForm();
    },
    [data?.id, onSubmit, resetForm],
  );

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      dispatch(clearVesselScreeningMaintenanceErrorsReducer());
    }
  }, [dispatch, isOpen, resetForm]);

  useEffect(() => {
    const defaultData = data?.maintenancePerformanceRequests?.[0];
    if (defaultData) {
      setValue('comments', defaultData?.MPRComments ?? []);
    }
  }, [data, setValue]);

  const renderForm = () => (
    <>
      <FormProvider {...methods}>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('vesselName')}
              className={styles.disabledInput}
              maxLength={200}
              disabled
              name="vessel"
              value={vesselDetail?.name}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('imoNumber')}
              className={styles.disabledInput}
              maxLength={200}
              disabled
              name="imoNumber"
              value={vesselDetail?.imoNumber}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <SelectUI
              showArrow={false}
              labelSelect={t('eventTypeTx')}
              data={[
                { value: 'Overdue Maintenance', label: 'Overdue Maintenance' },
              ]}
              disabled
              name="eventType"
              id="eventType"
              className={cx('w-100')}
              value="Overdue Maintenance"
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100"
              label={t('recordDateTx')}
              value={moment(data?.recordDate)}
              disabled
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
                  label={t('periodFromTx')}
                  value={moment(data?.periodFrom)}
                  disabled
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
                  label={t('periodToTx')}
                  value={moment(data?.periodTo)}
                  disabled
                  name="periodTo"
                  placeholder={t('placeholder.pleaseSelect')}
                  inputReadOnly
                />
              </Col>
            </Row>
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              maxLength={4}
              label={t('totalPlannedJobsTx')}
              value={data?.totalPlannedJobs}
              name="totalPlannedJobs"
              disabled
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('overdueCriticalJobsTx')}
              className={styles.disabledInput}
              value={data?.overdueCriticalJobs}
              name="overdueCriticalJobs"
              disabled
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('overdueNonCriticalJobsTx')}
              className={styles.disabledInput}
              value={data?.overdueJobs}
              disabled
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('overdueNonCriticalPercentageTx')}
              className={styles.disabledInput}
              maxLength={500}
              value={convertToPercent(
                data?.overdueJobs,
                data?.totalPlannedJobs,
              )}
              disabled
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('remarks')}
              className={styles.disabledInput}
              maxLength={500}
              disabled
              value={data?.remarks}
            />
          </Col>
          <Col className={cx('p-0 mx-3')} />
          <Col className={cx('p-0 ms-3')} />
        </Row>

        <TableAttachment
          featurePage={Features.QUALITY_ASSURANCE}
          subFeaturePage={SubFeatures.VESSEL_SCREENING}
          loading={false}
          value={data?.attachments}
          disable
          buttonName="Attach"
          onchange={() => {}}
          scrollVerticalAttachment
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
              className="p-0"
            />
          )}
        />
      </FormProvider>
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
      contentClassName={cx(styles.contentClassName)}
      bodyClassName={cx(styles.formWrapper)}
      footer={isEdit ? renderFooter() : null}
    />
  );
};

export default ModalMaintenancePerformance;
