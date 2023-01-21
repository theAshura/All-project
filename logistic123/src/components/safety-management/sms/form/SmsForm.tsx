import { ReactNode, useEffect, useCallback, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import SelectUI from 'components/ui/select/Select';
import {
  PENDING_ACTION_OPTION,
  CONDITION_STATUS_OPTIONS,
  MODULE_TYPE,
} from 'constants/filter.const';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { CommonApiParam } from 'models/common.model';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { getListFileActions } from 'store/dms/dms.action';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { Sms } from 'models/api/sms/sms.model';
import moment from 'moment';
import { getListEventTypeActions } from 'store/event-type/event-type.action';
import { getListIssueNoteActions } from 'store/issue-note/issue-note.action';
import useEffectOnce from 'hoc/useEffectOnce';
import { clearSmsDetailReducer } from 'store/sms/sms.action';
import { formatDateIso } from 'helpers/date.helper';
import styles from './form.module.scss';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (CreateInjuryParams) => void;
  setIsCreate?: (value: boolean) => void;
  data?: Sms;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  eventType: null,
  recordDate: '',
  techIssueNoteId: null,
  pendingAction: 'Yes',
  actionRemarks: '',
  targetCloseDate: '',
  actionStatus: 'Open',
  actualCloseDate: '',
  closureRemarks: '',
  initialAttachments: [],
  attachments: [],
};

const ModalSms = ({
  loading,
  toggle,
  title,
  isOpen,
  onSubmit,
  isCreate,
  isEdit,
  isView,
  data,
}: ModalProps) => {
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const [optionEventTypes, setOptionEventTypes] = useState([]);
  const [optionIssueNoted, setOptionIssueNoted] = useState([]);
  const { smsDetail } = useSelector((state) => state.smsRecord);
  const { listEventTypes } = useSelector((state) => state.eventType);
  const { listIssues } = useSelector((state) => state.issueNote);
  const { vesselDetail } = useSelector((state) => state.vessel);
  const [pendingActionValue, setPendingActionValue] = useState('Yes');
  const [isRequiredDate, setIsRequiredDate] = useState<boolean>(true);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListEventTypeActions.request({
          ...newParams,
          status: 'active',
          module: MODULE_TYPE.OTHER_SMS_RECORDS,
        }),
      );
      dispatch(
        getListIssueNoteActions.request({
          ...newParams,
          module: MODULE_TYPE.OTHER_SMS_RECORDS,
          status: 'active',
        }),
      );
    },
    [dispatch],
  );

  useEffectOnce(() => {
    handleGetList({ page: 1, pageSize: -1 });
  });

  const schema = useMemo(
    () =>
      yup.object().shape({
        eventType: yup
          .array()
          .nullable()
          .required(t('ThisFieldIsRequired'))
          .min(1, t('ThisFieldIsRequired')),
        recordDate: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        techIssueNoteId: yup
          .array()
          .nullable()
          .required(t('ThisFieldIsRequired'))
          .min(1, t('ThisFieldIsRequired')),
        targetCloseDate: yup
          .string()
          .trim()
          .nullable()
          .when('pendingAction', {
            is: (value) => value === 'Yes',
            then: yup.string().required('ThisFieldIsRequired'),
          }),
        actualCloseDate: yup
          .string()
          .trim()
          .nullable()
          .when('pendingAction', {
            is: (value) => value === 'Yes',
            then: yup.string().required('ThisFieldIsRequired'),
          }),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchRecordDate = watch('recordDate');

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (data) => {
      const dataCreate = {
        ...data,
        eventTypeId: data?.eventType?.[0]?.value,
        techIssueNoteId: data?.techIssueNoteId?.[0]?.value,
        recordDate: data?.recordDate && formatDateIso(data?.recordDate),
        targetCloseDate:
          data?.recordDate && data?.targetCloseDate
            ? formatDateIso(data?.targetCloseDate)
            : undefined,
        actualCloseDate:
          data?.recordDate && data?.actualCloseDate
            ? formatDateIso(data?.actualCloseDate)
            : undefined,
        vesselId: vesselDetail?.id,
      };
      onSubmit(dataCreate);
      resetForm();
      toggle();
    },
    [onSubmit, resetForm, toggle, vesselDetail?.id],
  );

  useEffect(() => {
    if (isCreate) {
      setValue('eventType', null);
      setValue('recordDate', '');
      setValue('techIssueNoteId', null);
      setValue('pendingAction', 'Yes');
      setValue('actionRemarks', '');
      setValue('targetCloseDate', '');
      setValue('actionStatus', 'Open');
      setValue('actualCloseDate', '');
      setValue('closureRemarks', '');
      setValue('initialAttachments', []);
      setValue('attachments', []);
      setIsRequiredDate(true);
    }
  }, [isCreate, setValue]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearSmsDetailReducer());
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (smsDetail) {
      setValue(
        'eventType',
        smsDetail?.eventTypeId
          ? [
              {
                value: smsDetail?.eventTypeId,
                label: smsDetail?.eventType?.name,
              },
            ]
          : [],
      );
      setValue(
        'techIssueNoteId',
        smsDetail?.techIssueNoteId
          ? [
              {
                value: smsDetail?.techIssueNoteId,
                label: smsDetail?.techIssueNote?.name,
              },
            ]
          : [],
      );
      setValue('recordDate', moment(smsDetail?.recordDate));
      setValue('pendingAction', smsDetail?.pendingAction);
      setValue('actionRemarks', smsDetail?.actionRemarks);
      setValue(
        'targetCloseDate',
        smsDetail?.targetCloseDate !== null
          ? moment(smsDetail?.targetCloseDate)
          : '',
      );
      setValue('actionStatus', smsDetail?.actionStatus);
      setValue(
        'actualCloseDate',
        smsDetail?.actualCloseDate !== null
          ? moment(smsDetail?.actualCloseDate)
          : '',
      );
      setValue('closureRemarks', smsDetail?.closureRemarks);
      setValue('initialAttachments', smsDetail?.initialAttachments || []);
      setValue(
        'attachments',
        smsDetail?.attachments?.length ? [...smsDetail?.attachments] : [],
      );
      setIsRequiredDate(smsDetail?.pendingAction === 'Yes');
    }
  }, [setValue, smsDetail]);

  useEffect(() => {
    setValue('vesselName', vesselDetail?.name);
    setValue('imoNumber', vesselDetail?.imoNumber);
  }, [setValue, vesselDetail?.imoNumber, vesselDetail?.name]);

  useEffect(() => {
    if (data) {
      if (smsDetail?.initialAttachments?.length > 0) {
        dispatch(
          getListFileActions.request({
            ids: smsDetail?.initialAttachments || [],
          }),
        );
      } else {
        dispatch(getListFileActions.success([]));
      }
      if (smsDetail?.attachments?.length > 0) {
        dispatch(
          getListFileActions.request({
            ids: smsDetail?.attachments || [],
          }),
        );
      } else {
        dispatch(getListFileActions.success([]));
      }
    }
  }, [data, dispatch, smsDetail?.attachments, smsDetail?.initialAttachments]);

  const listOptionEventTypes = useMemo(
    () =>
      listEventTypes?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listEventTypes],
  );

  const listOptionIssueNotes = useMemo(
    () =>
      listIssues?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listIssues?.data],
  );

  const onChangeSearchEventType = useCallback(
    (value: string) => {
      const newData = filterContentSelect(value, listOptionEventTypes || []);
      setOptionEventTypes(newData);
    },
    [listOptionEventTypes],
  );

  const onChangeSearchIssueNote = useCallback(
    (value: string) => {
      const newData = filterContentSelect(value, listOptionIssueNotes || []);
      setOptionIssueNoted(newData);
    },
    [listOptionIssueNotes],
  );

  useEffect(
    () => setIsRequiredDate(pendingActionValue === 'Yes'),
    [pendingActionValue],
  );

  const renderForm = useMemo(
    () => (
      <>
        <div>
          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 me-3')}>
              <Input
                label={t('vesselName')}
                className={styles.disabledInput}
                disabled
                id="vesselName"
                name="vesselName"
                {...register('vesselName')}
              />
            </Col>
            <Col className={cx('p-0 mx-3')}>
              <Input
                label={t('imoNumber')}
                className={styles.disabledInput}
                disabled
                id="imoNumber"
                name="imoNumber"
                {...register('imoNumber')}
              />
            </Col>
            <Col className={cx('p-0 ms-3')}>
              <AsyncSelectForm
                disabled={isView}
                messageRequired={errors?.eventType?.message || null}
                control={control}
                name="eventType"
                labelSelect={t('eventType')}
                isRequired
                placeholder="Please select"
                searchContent={t('eventType')}
                onChangeSearch={onChangeSearchEventType}
                options={optionEventTypes}
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
                isRequired
                disabled={isView}
                control={control}
                onChange={(e) => {
                  setValue('recordDate', e);
                  setValue('targetCloseDate', null);
                  setValue('actualCloseDate', null);
                }}
                messageRequired={errors?.recordDate?.message || null}
                placeholder={t('placeholder.pleaseSelect')}
                inputReadOnly
              />
            </Col>
            <Col className={cx('p-0 mx-3')}>
              <AsyncSelectForm
                disabled={isView}
                messageRequired={errors?.techIssueNoteId?.message || null}
                control={control}
                name="techIssueNoteId"
                labelSelect={t('sms.anySpecialPointsToNote')}
                isRequired
                placeholder="Please select"
                searchContent={t('sms.anySpecialPointsToNote')}
                onChangeSearch={onChangeSearchIssueNote}
                options={optionIssueNoted}
              />
            </Col>
            <Col className={cx('p-0 ms-3')}>
              <SelectUI
                labelSelect={t('sms.pendingAction')}
                data={PENDING_ACTION_OPTION}
                disabled={isView}
                placeholder={t('placeholder.pleaseSelect')}
                id="pendingAction"
                name="pendingAction"
                className={cx('w-100')}
                control={control}
                onChange={(e) => {
                  setPendingActionValue(String(e));
                  setIsRequiredDate(e === 'Yes');
                }}
              />
            </Col>
          </Row>

          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 me-3')}>
              <Input
                label={t('sms.actionRemarks')}
                className={styles.disabledInput}
                placeholder={t('placeholderInjuries.actionRemarks')}
                maxLength={500}
                disabled={isView}
                {...register('actionRemarks')}
              />
            </Col>
            <Col className={cx('p-0 mx-3')}>
              <DateTimePicker
                wrapperClassName={cx(styles.datePickerWrapper)}
                className="w-100 "
                label="Target close date"
                name="targetCloseDate"
                isRequired={isRequiredDate}
                maxDate={watchRecordDate || null}
                disabled={isView}
                control={control}
                messageRequired={
                  isRequiredDate && (errors?.targetCloseDate?.message || null)
                }
                placeholder={t('placeholder.pleaseSelect')}
                inputReadOnly
              />
            </Col>
            <Col className={cx('p-0 ms-3')}>
              <SelectUI
                labelSelect={t('sms.actionStatus')}
                data={CONDITION_STATUS_OPTIONS}
                disabled={isView}
                placeholder={t('placeholder.pleaseSelect')}
                id="entity"
                name="actionStatus"
                className={cx('w-100')}
                control={control}
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
                isRequired={isRequiredDate}
                maxDate={watchRecordDate || null}
                disabled={isView}
                control={control}
                messageRequired={
                  isRequiredDate && (errors?.actualCloseDate?.message || null)
                }
                placeholder={t('placeholder.pleaseSelect')}
                inputReadOnly
              />
            </Col>
            <Col className={cx('p-0 mx-3')}>
              <Input
                label={t('sms.closureRemarks')}
                className={styles.disabledInput}
                placeholder={t('placeholderInjuries.closureRemarks')}
                maxLength={500}
                disabled={isView}
                {...register('closureRemarks')}
              />
            </Col>
            <Col />
          </Row>

          <Controller
            control={control}
            name="initialAttachments"
            render={({ field }) => (
              <TableAttachment
                featurePage={Features.QUALITY_ASSURANCE}
                subFeaturePage={SubFeatures.SAIL_GENERAL_REPORT}
                scrollVerticalAttachment
                title="Initial attachments"
                loading={false}
                isEdit={!loading && !isView}
                isCreate={isCreate}
                value={field.value}
                buttonName="Attach"
                onchange={field.onChange}
                classWrapper="pb-0"
                disableDelete
              />
            )}
          />

          <Controller
            control={control}
            name="attachments"
            render={({ field }) => (
              <TableAttachment
                featurePage={Features.QUALITY_ASSURANCE}
                subFeaturePage={SubFeatures.SAIL_GENERAL_REPORT}
                scrollVerticalAttachment
                loading={false}
                isEdit={!loading && !isView}
                isCreate={isCreate}
                value={field.value}
                buttonName="Attach"
                onchange={field.onChange}
              />
            )}
          />
        </div>
      </>
    ),
    [
      control,
      errors?.actualCloseDate?.message,
      errors?.eventType?.message,
      errors?.recordDate?.message,
      errors?.targetCloseDate?.message,
      errors?.techIssueNoteId?.message,
      isCreate,
      isRequiredDate,
      isView,
      loading,
      onChangeSearchEventType,
      onChangeSearchIssueNote,
      optionEventTypes,
      optionIssueNoted,
      register,
      setValue,
      t,
      watchRecordDate,
    ],
  );

  const renderFooter = useMemo(
    () => (
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
    ),
    [handleCancel, handleSubmit, loading, onSubmitForm],
  );

  return (
    <ModalComponent
      w={1156}
      isOpen={isOpen}
      toggle={handleCancel}
      bodyClassName={cx(styles.formWrapper)}
      title={title}
      content={renderForm}
      footer={isEdit || isCreate || !isView ? renderFooter : null}
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

export default ModalSms;
