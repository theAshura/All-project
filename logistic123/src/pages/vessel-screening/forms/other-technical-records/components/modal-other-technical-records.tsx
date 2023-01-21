import { FC, useCallback, useEffect, useMemo } from 'react';
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
import isNumber from 'lodash/isNumber';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { clearVesselScreeningOtherTechRecordsErrorsReducer } from 'pages/vessel-screening/store/vessel-other-tech-records.action';
import { getListIssueNoteActions } from 'store/issue-note/issue-note.action';
import moment from 'moment';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListEventTypeActions } from 'store/event-type/event-type.action';
import NewAsyncSelect, {
  NewAsyncOptions,
} from 'components/ui/async-select/NewAsyncSelect';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import styles from './modal-other-technical-records.module.scss';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  toggle?: () => void;
  onSubmit?: (data) => void;
  data?: any;
  isEdit?: boolean;
  loading?: boolean;
}

const defaultValues = {
  comments: [],
};

const ModalOtherTechnicalRecords: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, onSubmit, data, isEdit } = props;
  const { t } = useTranslation([
    I18nNamespace.MAINTENANCE_TECHNICAL,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { listVesselResponse } = useSelector((state) => state.vessel);

  const vesselInfo = useMemo(
    () =>
      listVesselResponse?.data?.filter((item) => item.id === data?.vesselId),
    [data?.vesselId, listVesselResponse?.data],
  );

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
        otherTechRecordsId: data?.id,
        comments: dataForm?.comments?.length ? dataForm?.comments : null,
      };
      onSubmit(modifiedData);
      resetForm();
    },
    [data?.id, onSubmit, resetForm],
  );

  const vesselOptions: NewAsyncOptions[] = useMemo(
    () =>
      listVesselResponse?.data?.map((item) => ({
        value: item.id,
        label: `${item.name} - ${item.imoNumber}`,
      })),
    [listVesselResponse?.data],
  );

  useEffect(() => {
    const defaultData = data?.otherTechRecordsRequests?.[0];

    if (defaultData) {
      setValue(
        'potentialRisk',
        isNumber(defaultData?.potentialRisk)
          ? defaultData?.potentialRisk
          : null,
      );
      setValue(
        'observedRisk',
        isNumber(defaultData?.observedRisk) ? defaultData?.observedRisk : null,
      );
      setValue('timeLoss', defaultData?.timeLoss !== false);
      setValue('comments', defaultData?.OTRRComments ?? []);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearVesselScreeningOtherTechRecordsErrorsReducer());
    }
  }, [dispatch, isOpen]);

  useEffectOnce(() => {
    dispatch(
      getListEventTypeActions.request({ pageSize: -1, status: 'active' }),
    );
    dispatch(
      getListIssueNoteActions.request({ pageSize: -1, status: 'active' }),
    );
  });

  const renderForm = () => (
    <FormProvider {...methods}>
      <Row className="pt-2 mx-0">
        <Col className={cx('p-0 me-3')}>
          <NewAsyncSelect
            disabled
            id="vessel"
            labelSelect={t('vesselName')}
            value={[
              {
                value: vesselInfo?.[0]?.id,
                label: vesselInfo?.[0]?.name,
              },
            ]}
            titleResults="Selected group"
            searchContent={t('vesselNameAndIMONumber')}
            textSelectAll="Select all"
            textBtnConfirm="Confirm"
            onChangeSearch={(value: string) => {}}
            options={vesselOptions}
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
            value={vesselInfo?.[0]?.imoNumber}
          />
        </Col>
        <Col className={cx('p-0 ms-3')}>
          <SelectUI
            labelSelect={t('eventTypeTx')}
            data={[
              {
                value: data?.eventType.name,
                label: data?.eventType.name,
              },
            ]}
            value={data?.eventType.name}
            disabled
            name="eventTypeId"
            id="eventTypeId"
            className={cx('w-100')}
          />
        </Col>
      </Row>

      <Row className="pt-2 mx-0">
        <Col className={cx('p-0 me-3')}>
          <DateTimePicker
            wrapperClassName={cx(styles.datePickerWrapper)}
            className="w-100"
            value={data?.recordDate ? moment(data?.recordDate) : null}
            label={t('recordDateTx')}
            disabled
            name="recordDate"
            placeholder={t('placeholder.pleaseSelect')}
            inputReadOnly
          />
        </Col>
        <Col className={cx('p-0 mx-3')}>
          <SelectUI
            labelSelect={t('anySpecialPointsToNoteTx')}
            data={[
              {
                value: data?.techIssueNote.name,
                label: data?.techIssueNote.name,
              },
            ]}
            value={data?.techIssueNote.name}
            disabled
            id="techIssueNoteId"
            className={cx('w-100')}
            messageRequired={errors?.techIssueNoteId?.message || null}
          />
        </Col>
        <Col className={cx('p-0 ms-3')}>
          <SelectUI
            labelSelect={t('pendingActionTx')}
            data={[
              {
                value: data?.pendingAction,
                label: data?.pendingAction,
              },
            ]}
            value={data?.pendingAction}
            disabled
            name="pendingAction"
            id="pendingAction"
            className={cx('w-100')}
          />
        </Col>
      </Row>

      <Row className="pt-2 mx-0">
        <Col className={cx('p-0 me-3')}>
          <Input
            label={t('actionRemarksTx')}
            className={styles.disabledInput}
            maxLength={500}
            disabled
            value={data?.actionRemarks}
          />
        </Col>
        <Col className={cx('p-0 mx-3')}>
          <DateTimePicker
            wrapperClassName={cx(styles.datePickerWrapper)}
            className="w-100"
            label={t('targetCloseDateTx')}
            disabled
            value={data?.targetCloseDate ? moment(data?.targetCloseDate) : null}
            name="targetCloseDate"
            messageRequired={errors?.targetCloseDate?.message || null}
            placeholder={t('placeholder.pleaseSelect')}
            inputReadOnly
          />
        </Col>
        <Col className={cx('p-0 ms-3')}>
          <SelectUI
            labelSelect={t('actionStatusTx')}
            data={[
              {
                value: data?.actionStatus,
                label: data?.actionStatus,
              },
            ]}
            value={data?.actionStatus}
            disabled
            name="actionStatus"
            id="actionStatus"
            className={cx('w-100')}
            messageRequired={errors?.actionStatus?.message || null}
          />
        </Col>
      </Row>

      <Row className="pt-2 mx-0">
        <Col className={cx('p-0 me-3')}>
          <DateTimePicker
            wrapperClassName={cx(styles.datePickerWrapper)}
            className="w-100"
            value={data?.actualCloseDate ? moment(data?.actualCloseDate) : null}
            label={t('actualCloseDateTx')}
            disabled
            name="actualCloseDate"
            placeholder={t('placeholder.pleaseSelect')}
            inputReadOnly
          />
        </Col>
        <Col className={cx('p-0 mx-3')}>
          <Input
            label={t('closureRemarksTx')}
            className={styles.disabledInput}
            maxLength={500}
            disabled
            value={data?.closureRemarks}
          />
        </Col>
        <Col className={cx('p-0 ms-3')} />
      </Row>

      <TableAttachment
        featurePage={Features.QUALITY_ASSURANCE}
        subFeaturePage={SubFeatures.VESSEL_SCREENING}
        loading={false}
        disable
        value={data?.initialAttachments}
        title={t('initialAttachmentsTx')}
        buttonName={t('attach')}
        onchange={() => {}}
        scrollVerticalAttachment
      />
      <TableAttachment
        featurePage={Features.QUALITY_ASSURANCE}
        subFeaturePage={SubFeatures.VESSEL_SCREENING}
        loading={false}
        disable
        value={data?.attachments}
        buttonName={t('attach')}
        onchange={() => {}}
        scrollVerticalAttachment
        classWrapper="pt-0"
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
      contentClassName={cx(styles.contentClassName)}
      bodyClassName={cx(styles.formWrapper)}
      content={renderForm()}
      footer={isEdit ? renderFooter() : null}
    />
  );
};

export default ModalOtherTechnicalRecords;
