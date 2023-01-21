import {
  FC,
  ReactNode,
  useEffect,
  useCallback,
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
import { CONDITION_STATUS_OPTIONS } from 'constants/filter.const';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { EventType } from 'models/api/event-type/event-type.model';
import { GroupButton } from 'components/ui/button/GroupButton';
import { handleFilterParams } from 'helpers/filterParams.helper';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { CommonApiParam } from 'models/common.model';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { AuthorityMaster } from 'models/api/authority-master/authority-master.model';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { toastError } from 'helpers/notification.helper';
import moment from 'moment';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import { getListAuthorityMasterActionsApi } from 'api/authority-master.api';
import useEffectOnce from 'hoc/useEffectOnce';
import { ConditionOfClass } from 'models/api/condition-of-class/condition-of-class.model';
import styles from './forms.module.scss';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (CreateConditionClassParams) => void;
  setIsCreate?: (value: boolean) => void;
  data?: ConditionOfClass;
  isEdit?: boolean;
  eventTypes?: EventType[];
  isView?: boolean;
  loading?: boolean;
}

const ModalConditionOfClass: FC<ModalProps> = (props) => {
  const {
    loading,
    toggle,
    title,
    isOpen,
    onSubmit,
    eventTypes,
    isCreate,
    isEdit,
    isView,
    data,
  } = props;
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const [optionEventTypes, setOptionEventTypes] = useState([]);
  const [optionAuthority, setOptionAuthority] = useState([]);
  const [dataAuthority, setDataAuthority] = useState([]);

  const { errorList, conditionOfClassDetail } = useSelector(
    (state) => state.conditionOfClass,
  );

  const { vesselDetail } = useSelector((state) => state.vessel);

  const handleGetList = useCallback((params?: CommonApiParam) => {
    const newParams = handleFilterParams(params);
    getListAuthorityMasterActionsApi({ ...newParams, pageSize: -1 })
      .then((r) => {
        setDataAuthority(r?.data?.data);
      })
      .catch((e) => toastError(e));
  }, []);

  const defaultValues = useMemo(
    () => ({
      eventType: [],
      issueDate: null,
      authorityId: [],
      expiryDate: null,
      remarks: '',
      status: 'Open',
      closedDate: null,
      closureRemarks: '',
      attachments: [],
    }),
    [],
  );

  useEffect(() => {
    let paramAuthority: CommonApiParam = {
      pageSize: -1,
      status: 'active',
    };
    if (data?.eventTypeId && isOpen) {
      paramAuthority = { ...paramAuthority, eventTypeId: data?.eventTypeId };
    }
    if (isOpen) handleGetList(paramAuthority);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOpen]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        status: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        eventType: yup.array().nullable().min(1, t('ThisFieldIsRequired')),
        authorityId: yup.array().nullable().min(1, t('ThisFieldIsRequired')),
        issueDate: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        closedDate: yup
          .string()
          .trim()
          .nullable()
          .when('status', {
            is: (value) => value === 'Closed',
            then: yup.string().nullable().required(t('ThisFieldIsRequired')),
          }),
        expiryDate: yup
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
    setError,
    setValue,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const eventTypeWatch = watch('eventType');
  const statusWatch = watch('status');
  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (data) => {
      const dataCreate = {
        ...data,
        authorityId: data?.authorityId[0].value,
        eventTypeId: data?.eventType[0].value,
        closedDate: moment(data?.closedDate)?.startOf('day').toISOString(),
        issueDate: moment(data?.issueDate)?.startOf('day').toISOString(),
        expiryDate: moment(data?.expiryDate)?.startOf('day').toISOString(),
        vesselId: vesselDetail?.id,
      };
      onSubmit(dataCreate);
      resetForm();
      toggle();
    },
    [onSubmit, resetForm, toggle, vesselDetail?.id],
  );

  useEffectOnce(() => {
    if (isCreate) {
      setValue('eventType', null);
      setValue('issueDate', null);
      setValue('authorityId', null);
      setValue('expiryDate', null);
      setValue('remarks', '');
      setValue('status', null);
      setValue('closedDate', null);
      setValue('closureRemarks', '');
      setValue('attachments', []);
    }
  });

  useEffect(() => {
    setValue('vesselName', vesselDetail?.name);
    setValue('imoNumber', vesselDetail?.imoNumber);
  }, [setValue, vesselDetail?.imoNumber, vesselDetail?.name]);

  useEffect(() => {
    if (eventTypeWatch?.length > 0 && (isCreate || isEdit)) {
      handleGetList({
        pageSize: -1,
        status: 'active',
        eventTypeId: eventTypeWatch[0].value,
      });
      setValue('authorityId', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTypeWatch]);

  useEffect(() => {
    if ((isEdit || isView) && data) {
      setValue(
        'eventType',
        conditionOfClassDetail?.eventTypeId
          ? [
              {
                value: conditionOfClassDetail?.eventTypeId,
                label: conditionOfClassDetail?.eventType?.name,
              },
            ]
          : [],
      );
      setValue(
        'issueDate',
        conditionOfClassDetail?.issueDate &&
          moment(conditionOfClassDetail?.issueDate),
      );
      setTimeout(() => {
        setValue(
          'authorityId',
          conditionOfClassDetail?.authorityId
            ? [
                {
                  value: conditionOfClassDetail?.authorityId,
                  label: conditionOfClassDetail?.authority?.name,
                },
              ]
            : [],
        );
      }, 100);

      setValue(
        'expiryDate',
        conditionOfClassDetail?.expiryDate &&
          moment(conditionOfClassDetail?.expiryDate),
      );
      setValue('remarks', conditionOfClassDetail?.remarks);
      setValue('status', conditionOfClassDetail?.status || 'Open');
      setValue(
        'closedDate',
        conditionOfClassDetail?.closedDate &&
          moment(conditionOfClassDetail?.closedDate),
      );
      setValue('closureRemarks', conditionOfClassDetail?.closureRemarks);
      setValue(
        'attachments',
        conditionOfClassDetail?.attachments
          ? [...conditionOfClassDetail?.attachments]
          : [],
      );
    }
  }, [
    conditionOfClassDetail?.attachments,
    conditionOfClassDetail?.authority?.name,
    conditionOfClassDetail?.authorityId,
    conditionOfClassDetail?.closedDate,
    conditionOfClassDetail?.closureRemarks,
    conditionOfClassDetail?.eventType,
    conditionOfClassDetail?.eventTypeId,
    conditionOfClassDetail?.expiryDate,
    conditionOfClassDetail?.issueDate,
    conditionOfClassDetail?.remarks,
    conditionOfClassDetail?.status,
    data,
    isEdit,
    isView,
    setValue,
  ]);

  const listOptionEventTypes = useMemo(
    () =>
      eventTypes?.map((item) => ({
        value: item.id,
        label: item.name,
      })) || [],
    [eventTypes],
  );

  const listAuthorityOption = useMemo(
    () =>
      dataAuthority?.map((item: AuthorityMaster) => ({
        value: item.id,
        label: item.name,
      })),
    [dataAuthority],
  );

  const onChangeSearchEventType = useCallback(
    (value: string) => {
      const newData = filterContentSelect(value, listOptionEventTypes || []);
      setOptionEventTypes(newData);
    },
    [listOptionEventTypes],
  );

  const onChangeSearchAuthority = useCallback(
    (value: string) => {
      const newData = filterContentSelect(value, listAuthorityOption || []);
      setOptionAuthority(newData);
    },
    [listAuthorityOption],
  );

  const renderForm = () => (
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
              maxLength={20}
              disabled
              id="imoNumber"
              name="imoNumber"
              {...register('imoNumber')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <AsyncSelectForm
              disabled={isView}
              messageRequired={errors?.eventType?.message}
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
              label="Issue date"
              isRequired
              name="issueDate"
              disabled={isView}
              control={control}
              messageRequired={errors?.issueDate?.message || null}
              placeholder={t('placeholder.pleaseSelect')}
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <AsyncSelectForm
              disabled={isView}
              messageRequired={errors?.authorityId?.message}
              control={control}
              name="authorityId"
              labelSelect={t('authority')}
              isRequired
              placeholder="Please select"
              searchContent={t('authority')}
              onChangeSearch={onChangeSearchAuthority}
              options={optionAuthority}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <SelectUI
              labelSelect={t('status')}
              data={CONDITION_STATUS_OPTIONS}
              onChange={(value) => {
                if (value !== 'Closed') {
                  setError('closedDate', null);
                }
              }}
              isRequired
              disabled={isView}
              placeholder={t('placeholder.pleaseSelect')}
              id="entity"
              name="status"
              className={cx('w-100')}
              messageRequired={errors?.status?.message || null}
              control={control}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Expiry date"
              name="expiryDate"
              isRequired
              disabled={isView}
              control={control}
              messageRequired={errors?.expiryDate?.message || null}
              placeholder={t('placeholder.pleaseSelect')}
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('remarks')}
              className={styles.disabledInput}
              placeholder={t('placeholder.remarks')}
              maxLength={500}
              disabled={isView}
              {...register('remarks')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Closed date"
              isRequired={statusWatch === 'Closed'}
              disabled={isView}
              name="closedDate"
              maxDate={moment()}
              control={control}
              messageRequired={errors?.closedDate?.message || null}
              placeholder={t('placeholder.pleaseSelect')}
              inputReadOnly
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')} id="name">
            <Input
              label={t('closureRemarks')}
              className={styles.disabledInput}
              placeholder={t('placeholder.closureRemarks')}
              maxLength={500}
              disabled={isView}
              {...register('closureRemarks')}
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
              scrollVerticalAttachment
              loading={false}
              disable={isView}
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

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'no':
            setError('no', { message: t('incidentTypeCodeIsExisted') });
            break;
          default:
            break;
        }
      });
    } else {
      setError('no', { message: '' });
    }
  }, [errorList, setError, t]);

  return (
    <ModalComponent
      w={1156}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={isEdit || isCreate || !isView ? renderFooter() : null}
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

export default ModalConditionOfClass;
