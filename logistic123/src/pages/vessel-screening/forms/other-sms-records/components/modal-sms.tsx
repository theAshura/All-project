import { FC, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import {
  FieldValues,
  useForm,
  Controller,
  FormProvider,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import moment from 'moment';
import isNumber from 'lodash/isNumber';
import { DATA_SPACE } from 'constants/components/ag-grid.const';
import { useParams } from 'react-router-dom';
import {
  OtherSMSRequests,
  UpdateOtherSMSRequestParams,
} from 'pages/vessel-screening/utils/models/other-sms.model';
import { getOtherSMSRequestDetailActions } from 'pages/vessel-screening/store/vessel-other-sms.action';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import styles from './modal-sms.module.scss';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (UpdateOtherSMSRequestParams) => void;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  no?: number;
}

const defaultValues = {
  eventType: null,
  recordDate: '',
  anySpecialPointsToNote: null,
  pendingAction: 'Yes',
  actionRemarks: '',
  targetCloseDate: '',
  actionStatus: 'Open',
  actualCloseDate: '',
  closureRemarks: '',
  attachments: [],

  comments: [],
};

const ModalSms: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, onSubmit, isEdit } = props;
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { smsDetail } = useSelector((state) => state.smsRecord);
  const { otherSMSRequestDetail } = useSelector(
    (state) => state.vesselOtherSMS,
  );
  const { id: vesselScreeningId } = useParams<{ id: string }>();

  const schema = useMemo(() => yup.object().shape({}), []);

  const method = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    watch,
    formState: { errors },
  } = method;

  const watchRecordDate = watch('recordDate');

  const resetForm = useCallback(() => {
    reset(defaultValues);
    dispatch(getOtherSMSRequestDetailActions.success(null));
  }, [dispatch, reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (formData: OtherSMSRequests) => {
      const params: UpdateOtherSMSRequestParams = {
        id: vesselScreeningId,
        data: {
          vesselScreeningId,
          otherSmsRecordsId: smsDetail?.id,
          comments: formData?.comments?.length ? formData?.comments : null,
        },
      };
      onSubmit({ ...params });
      resetForm();
    },
    [onSubmit, resetForm, smsDetail?.id, vesselScreeningId],
  );

  useEffect(() => {
    setValue('eventType', smsDetail?.eventType?.name);
    setValue('recordDate', moment(smsDetail?.recordDate));
    setValue('anySpecialPointsToNote', smsDetail?.techIssueNote?.name);
    setValue('pendingAction', smsDetail?.pendingAction);
    setValue('actionRemarks', smsDetail?.actionRemarks);
    setValue('targetCloseDate', moment(smsDetail?.targetCloseDate));
    setValue('actionStatus', smsDetail?.actionStatus);
    setValue('actualCloseDate', moment(smsDetail?.actualCloseDate));
    setValue('closureRemarks', smsDetail?.closureRemarks);
    setValue(
      'initialAttachments',
      smsDetail?.initialAttachments?.length
        ? [...smsDetail?.initialAttachments]
        : [],
    );
    setValue(
      'attachments',
      smsDetail?.attachments?.length ? [...smsDetail?.attachments] : [],
    );
    setValue('vessel', smsDetail?.vessel?.name);
    setValue('imoNumber', smsDetail?.vessel?.imoNumber || DATA_SPACE);
  }, [
    setValue,
    smsDetail?.actionRemarks,
    smsDetail?.actionStatus,
    smsDetail?.actualCloseDate,
    smsDetail?.attachments,
    smsDetail?.closureRemarks,
    smsDetail?.eventType?.name,
    smsDetail?.initialAttachments,
    smsDetail?.pendingAction,
    smsDetail?.recordDate,
    smsDetail?.targetCloseDate,
    smsDetail?.techIssueNote?.name,
    smsDetail?.vessel?.imoNumber,
    smsDetail?.vessel?.name,
  ]);

  useEffect(() => {
    setValue(
      'potentialRisk',
      isNumber(otherSMSRequestDetail?.potentialRisk)
        ? otherSMSRequestDetail?.potentialRisk
        : null,
    );
    setValue(
      'observedRisk',
      isNumber(otherSMSRequestDetail?.observedRisk)
        ? otherSMSRequestDetail?.observedRisk
        : null,
    );
    setValue('timeLoss', otherSMSRequestDetail?.timeLoss !== false);
    setValue('comments', otherSMSRequestDetail?.OSRRComments ?? []);
  }, [
    otherSMSRequestDetail,
    otherSMSRequestDetail?.OSRRComments,
    otherSMSRequestDetail?.observedRisk,
    otherSMSRequestDetail?.potentialRisk,
    otherSMSRequestDetail?.timeLoss,
    setValue,
  ]);

  const renderForm = () => (
    <>
      <FormProvider {...method}>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('sms.vesselName')}
              className={styles.disabledInput}
              maxLength={200}
              disabled
              name="vessel"
              {...register('vessel')}
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
              label={t('eventType')}
              className={styles.disabledInput}
              maxLength={20}
              disabled
              id="eventType"
              name="eventType"
              {...register('eventType')}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Record date"
              name="recordDate"
              disabled
              control={control}
              messageRequired={errors?.recordDate?.message || null}
              placeholder={t('placeholder.pleaseSelect')}
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('sms.anySpecialPointsToNote')}
              className={styles.disabledInput}
              maxLength={200}
              disabled
              id="anySpecialPointsToNote"
              name="anySpecialPointsToNote"
              {...register('anySpecialPointsToNote')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('sms.pendingAction')}
              className={styles.disabledInput}
              maxLength={500}
              disabled
              {...register('pendingAction')}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('sms.actionRemarks')}
              className={styles.disabledInput}
              maxLength={500}
              disabled
              {...register('actionRemarks')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Target close date"
              name="targetCloseDate"
              disabled
              minDate={watchRecordDate || null}
              control={control}
              messageRequired={errors?.targetCloseDate?.message || null}
              placeholder={t('placeholder.pleaseSelect')}
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('sms.actionStatus')}
              className={styles.disabledInput}
              maxLength={500}
              disabled
              {...register('actionStatus')}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')} id="name">
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Actual close date"
              name="actualCloseDate"
              minDate={watchRecordDate || null}
              disabled
              control={control}
              messageRequired={errors?.actualCloseDate?.message || null}
              placeholder={t('placeholder.pleaseSelect')}
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('sms.closureRemarks')}
              className={styles.disabledInput}
              maxLength={500}
              disabled
              {...register('closureRemarks')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')} />
        </Row>
        <Controller
          control={control}
          name="initialAttachments"
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.QUALITY_ASSURANCE}
              subFeaturePage={SubFeatures.VESSEL_SCREENING}
              scrollVerticalAttachment
              title="Initial attachments"
              loading={false}
              isEdit={false}
              isCreate={false}
              disable
              value={field.value}
              buttonName="Attach"
              onchange={field.onChange}
              classWrapper="pb-0"
            />
          )}
        />
        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.QUALITY_ASSURANCE}
              subFeaturePage={SubFeatures.VESSEL_SCREENING}
              scrollVerticalAttachment
              loading={false}
              isEdit={false}
              isCreate={false}
              disable
              value={field.value}
              buttonName="Attach"
              onchange={field.onChange}
              classWrapper="pt-1 pb-0"
            />
          )}
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
              className="p-0 mt-0"
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
      bodyClassName={cx(styles.formWrapper)}
      title={title}
      content={renderForm()}
      footer={isEdit ? renderFooter() : null}
    />
  );
};

export default ModalSms;
