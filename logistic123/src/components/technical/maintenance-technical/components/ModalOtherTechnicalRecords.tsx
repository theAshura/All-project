import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { CreateOtherTechnicalRecordsParams } from 'models/api/other-technical-records/other-technical-records.model';
import { clearOtherTechnicalRecords } from 'store/other-technical-records/other-technical-records.action';
import { getListIssueNoteActions } from 'store/issue-note/issue-note.action';
import moment from 'moment';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListEventTypeActions } from 'store/event-type/event-type.action';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import { MODULE_TYPE } from 'constants/filter.const';
import styles from './modal.module.scss';
import { OtherTechnicalRecordsExtend } from '../other-record';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (
    data: CreateOtherTechnicalRecordsParams,
    isCreate: boolean,
  ) => void;
  setIsCreate?: (value: boolean) => void;
  data?: OtherTechnicalRecordsExtend;
  isEdit?: boolean;
  w?: string | number;
  isView?: boolean;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  eventTypeId: null,
  recordDate: null,
  techIssueNoteId: null,
  pendingAction: null,
  actionRemarks: null,
  targetCloseDate: null,
  actionStatus: null,
  actualCloseDate: null,
  closureRemarks: null,
  attachments: null,
  initialAttachments: null,
};

export const pendingActionOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

export const actionStatusOptions = [
  { value: 'Closed', label: 'Closed' },
  { value: 'Open', label: 'Open' },
];

const ModalOtherTechnicalRecords: FC<ModalProps> = ({
  loading,
  toggle,
  title,
  isOpen,
  onSubmit,
  data,
  isCreate,
  isView,
  isEdit,
}) => {
  const { t } = useTranslation([
    I18nNamespace.MAINTENANCE_TECHNICAL,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { loading: loadingEventType, listEventTypes } = useSelector(
    (state) => state.eventType,
  );
  const [optionEventTypes, setOptionEventTypes] = useState([]);
  const [optionIssueNoted, setOptionIssueNoted] = useState([]);
  const { listIssues } = useSelector((state) => state.issueNote);
  const { vesselDetail } = useSelector((state) => state.vessel);

  const schema = useMemo(
    () =>
      yup.object().shape({
        eventTypeId: yup
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
        pendingAction: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        targetCloseDate: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        actionStatus: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        actualCloseDate: yup
          .string()
          .trim()
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

  const onSubmitForm = useCallback(
    (data) => {
      const dataSubmit: CreateOtherTechnicalRecordsParams = {
        ...data,
        eventTypeId: data?.eventTypeId[0].value,
        techIssueNoteId: data?.techIssueNoteId[0].value,
        targetCloseDate: moment(data?.targetCloseDate).toISOString(),
        actualCloseDate: moment(data?.actualCloseDate).toISOString(),
        recordDate: moment(data?.recordDate).toISOString(),
        attachments: data?.attachments || [],
        initialAttachments: data?.initialAttachments || [],
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
      dispatch(clearOtherTechnicalRecords());
    }
  }, [dispatch, isOpen]);

  useEffectOnce(() => {
    dispatch(
      getListEventTypeActions.request({
        pageSize: -1,
        status: 'active',
        module: MODULE_TYPE.OTHER_TECHNICAL_RECORDS,
      }),
    );
    dispatch(
      getListIssueNoteActions.request({
        pageSize: -1,
        status: 'active',
        module: MODULE_TYPE.OTHER_TECHNICAL_RECORDS,
      }),
    );
  });

  useEffect(() => {
    setValue('vesselName', vesselDetail?.name);
    setValue('imoNumber', vesselDetail?.imoNumber);
  }, [setValue, vesselDetail?.imoNumber, vesselDetail?.name]);

  useEffect(() => {
    if (data) {
      setValue(
        'eventTypeId',
        data?.eventTypeId
          ? [
              {
                value: data?.eventTypeId,
                label: data?.eventType?.name,
              },
            ]
          : null,
      );
      setValue(
        'techIssueNoteId',
        data?.techIssueNoteId
          ? [
              {
                value: data?.techIssueNoteId,
                label: data?.techIssueNote?.name,
              },
            ]
          : null,
      );
      setValue('recordDate', moment(data?.recordDate));
      setValue('pendingAction', data?.pendingAction);
      setValue('actionRemarks', data?.actionRemarks);
      setValue('targetCloseDate', moment(data?.targetCloseDate));
      setValue('closureRemarks', data?.closureRemarks);
      setValue('actualCloseDate', moment(data?.actualCloseDate));
      setValue('no', data?.index + 1);
      setValue('actionStatus', data?.actionStatus);
      setValue(
        'attachments',
        data?.attachments?.length ? [...data?.attachments] : [],
      );
      setValue('initialAttachments', data?.initialAttachments || []);
    }
  }, [data, setValue]);

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

  const renderForm = () => (
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
            disabled={loadingEventType || isView}
            messageRequired={errors?.eventTypeId?.message || null}
            control={control}
            name="eventTypeId"
            labelSelect={t('eventTypeTx')}
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
            className="w-100"
            isRequired
            label={t('recordDateTx')}
            control={control}
            disabled={isView}
            onChange={(e) => {
              setValue('recordDate', e);
              setValue('targetCloseDate', null);
              setValue('actualCloseDate', null);
            }}
            name="recordDate"
            messageRequired={errors?.recordDate?.message || null}
            placeholder={t('placeholder.pleaseSelect')}
            inputReadOnly
          />
        </Col>
        <Col className={cx('p-0 mx-3')}>
          <AsyncSelectForm
            disabled={loadingEventType || isView}
            messageRequired={errors?.techIssueNoteId?.message || null}
            control={control}
            name="techIssueNoteId"
            labelSelect={t('anySpecialPointsToNoteTx')}
            isRequired
            placeholder="Please select"
            searchContent={t('anySpecialPointsToNoteTx')}
            onChangeSearch={onChangeSearchIssueNote}
            options={optionIssueNoted}
          />
        </Col>
        <Col className={cx('p-0 ms-3')}>
          <SelectUI
            labelSelect={t('pendingActionTx')}
            data={pendingActionOptions}
            disabled={isView}
            name="pendingAction"
            id="pendingAction"
            className={cx('w-100')}
            isRequired
            messageRequired={errors?.pendingAction?.message || null}
            control={control}
          />
        </Col>
      </Row>

      <Row className="pt-2 mx-0">
        <Col className={cx('p-0 me-3')}>
          <Input
            label={t('actionRemarksTx')}
            className={styles.disabledInput}
            placeholder={t('placeholder.actionRemarks')}
            messageRequired={errors?.actionRemarks?.message || ''}
            maxLength={500}
            disabled={isView}
            {...register('actionRemarks')}
          />
        </Col>
        <Col className={cx('p-0 mx-3')}>
          <DateTimePicker
            wrapperClassName={cx(styles.datePickerWrapper)}
            className="w-100"
            isRequired
            label={t('targetCloseDateTx')}
            control={control}
            disabled={isView}
            name="targetCloseDate"
            maxDate={watchRecordDate || null}
            messageRequired={errors?.targetCloseDate?.message || null}
            placeholder={t('placeholder.pleaseSelect')}
            inputReadOnly
          />
        </Col>
        <Col className={cx('p-0 ms-3')}>
          <SelectUI
            labelSelect={t('actionStatusTx')}
            data={actionStatusOptions}
            disabled={isView}
            name="actionStatus"
            isRequired
            id="actionStatus"
            className={cx('w-100')}
            messageRequired={errors?.actionStatus?.message || null}
            control={control}
          />
        </Col>
      </Row>

      <Row className="pt-2 mx-0">
        <Col className={cx('p-0 me-3')}>
          <DateTimePicker
            wrapperClassName={cx(styles.datePickerWrapper)}
            className="w-100"
            isRequired
            label={t('actualCloseDateTx')}
            control={control}
            disabled={isView}
            maxDate={watchRecordDate || null}
            name="actualCloseDate"
            messageRequired={errors?.actualCloseDate?.message || null}
            placeholder={t('placeholder.pleaseSelect')}
            inputReadOnly
          />
        </Col>
        <Col className={cx('p-0 mx-3')}>
          <Input
            label={t('closureRemarksTx')}
            className={styles.disabledInput}
            placeholder={t('placeholder.closureRemarks')}
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
            loading={false}
            isEdit={isCreate}
            disable={!isCreate}
            value={field.value}
            title={t('initialAttachmentsTx')}
            buttonName={t('attach')}
            classWrapper="pb-0"
            onchange={field.onChange}
            scrollVerticalAttachment
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
            loading={false}
            disable={isView}
            isEdit={!isView}
            value={field.value}
            buttonName={t('attach')}
            onchange={field.onChange}
            classWrapper="pt-0"
            scrollVerticalAttachment
          />
        )}
      />
    </div>
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
      bodyClassName={cx(styles.formWrapper)}
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

export default ModalOtherTechnicalRecords;
