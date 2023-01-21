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
  PARAMS_DEFAULT,
  CONDITION_EVENT_TYPE_OPTIONS,
  DRY_DOCKING_STATUS,
} from 'constants/filter.const';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { CommonApiParam } from 'models/common.model';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import moment from 'moment';
import { getListFileActions } from 'store/dms/dms.action';
import { getListPortActions } from 'store/port/port.action';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { CreateDryDockingParams } from 'models/api/dry-docking/dry-docking.model';
import { clearDryDockingAction } from 'store/dry-docking/dry-docking.action';
import styles from './dry-docking.module.scss';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (data: CreateDryDockingParams) => void;
  setIsCreate?: (value: boolean) => void;
  data?: any;
  isEdit?: boolean;
  w?: string | number;
  isView?: boolean;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  eventType: 'Dry docking',
  plannedDate: '',
  completedDate: '',
  actualDateFrom: '',
  actualDateTo: '',
  status: null,
  remarks: '',
  completionRemarks: '',
  attachments: [],
  portMasterId: [],
  vesselId: [],
  imoNumber: '',
};

const ModalDryDocking = ({
  toggle,
  title,
  isOpen,
  onSubmit,
  data,
  isCreate,
  isEdit,
  isView,
}: ModalProps) => {
  const { t } = useTranslation([
    I18nNamespace.DRY_DOCKING,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { errorList } = useSelector((state) => state.incidentType);
  const { detailDryDocking } = useSelector((state) => state.dryDocking);
  const { listPort } = useSelector((state) => state.port);
  const { vesselDetail } = useSelector((state) => state.vessel);
  const [watchStatus, setWatchStatus] = useState<string>(null);

  const isDisableActualDateFrom = useMemo(
    () =>
      !!watchStatus &&
      (watchStatus === DRY_DOCKING_STATUS[0].value ||
        watchStatus === DRY_DOCKING_STATUS[3].value),
    [watchStatus],
  );

  const isDisableActualDateTo = useMemo(
    () => !!watchStatus && watchStatus !== DRY_DOCKING_STATUS[2].value,
    [watchStatus],
  );

  const isDisableCompletedDate = useMemo(
    () => !!watchStatus && watchStatus !== DRY_DOCKING_STATUS[2].value,
    [watchStatus],
  );

  const isDisableLocation = useMemo(
    () =>
      !!watchStatus &&
      (watchStatus === DRY_DOCKING_STATUS[0].value ||
        watchStatus === DRY_DOCKING_STATUS[3].value),
    [watchStatus],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      dispatch(
        getListPortActions.request({
          pageSize: -1,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    handleGetList(PARAMS_DEFAULT);
  }, [dispatch, handleGetList]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        plannedDate: yup
          .string()
          .trim()
          .nullable()
          .required('This field is required'),
        completedDate:
          !isDisableCompletedDate &&
          yup.string().trim().nullable().required('This field is required'),
        actualDateFrom:
          !isDisableActualDateFrom &&
          yup.string().trim().nullable().required('This field is required'),
        actualDateTo:
          !isDisableActualDateTo &&
          yup.string().trim().nullable().required('This field is required'),
        portMasterId:
          !isDisableLocation &&
          yup
            .array()
            .nullable()
            .required('This field is required')
            .min(1, 'This field is required'),
        status: yup
          .string()
          .trim()
          .nullable()
          .required('This field is required'),
      }),
    [
      isDisableActualDateFrom,
      isDisableActualDateTo,
      isDisableCompletedDate,
      isDisableLocation,
    ],
  );

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const watchActualDateFrom = watch('actualDateFrom');

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
    setWatchStatus(null);
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (data) => {
      const dataSubmit: CreateDryDockingParams = {
        ...data,
        plannedDate: moment(data.plannedDate).startOf('day').toISOString(),
        actualDateFrom: moment(data.actualDateFrom)
          .startOf('day')
          .toISOString(),
        actualDateTo: moment(data.actualDateTo).startOf('day').toISOString(),
        portMasterId:
          (data.portMasterId && data.portMasterId[0]?.value) || null,
        remarks: data.remarks ? data.remarks.trim() : undefined,
        completedDate: moment(data.completedDate).startOf('day').toISOString(),
        completionRemarks: data.completionRemarks
          ? data.completionRemarks.trim()
          : undefined,
        attachments: data.attachments.length > 0 ? data.attachments : undefined,
        vesselId: vesselDetail?.id,
      };
      onSubmit(dataSubmit);
      resetForm();
      toggle();
    },
    [onSubmit, resetForm, toggle, vesselDetail?.id],
  );
  const handleChangeStatus = useCallback((value: string) => {
    if (value) {
      setWatchStatus(value);
    }
  }, []);

  const dataTableChooseLocation = useMemo(
    () =>
      listPort?.data
        ?.filter((item) => item?.status === 'active')
        ?.map((item) => ({
          value: item?.id,
          label: `${item?.name} - ${item?.country}`,
        })),
    [listPort?.data],
  );

  useEffect(() => {
    setValue('vesselName', vesselDetail?.name);
    setValue('imoNumber', vesselDetail?.imoNumber);
  }, [setValue, vesselDetail?.imoNumber, vesselDetail?.name]);

  useEffect(() => {
    if (isDisableActualDateFrom) {
      setValue('actualDateFrom', '');
    }
  }, [isDisableActualDateFrom, setValue]);

  useEffect(() => {
    if (isDisableActualDateTo) {
      setValue('actualDateTo', '');
    }
  }, [isDisableActualDateTo, setValue]);

  useEffect(() => {
    if (isDisableCompletedDate) {
      setValue('completedDate', '');
    }
  }, [isDisableCompletedDate, setValue]);

  useEffect(() => {
    if (isDisableLocation) {
      setValue('portMasterId', []);
    }
  }, [isDisableLocation, setValue]);

  useEffect(() => {
    if (isCreate) {
      setValue('actualDateFrom', '');
      setValue('actualDateTo', '');
      setValue('completedDate', '');
      setValue('plannedDate', '');
      setValue('portMasterId', []);
      setValue('remarks', '');
      setValue('status', null);
      setValue('completionRemarks', '');
      setValue('attachments', []);
    }
  }, [isCreate, setValue]);

  useEffect(() => {
    if (detailDryDocking) {
      setValue(
        'plannedDate',
        detailDryDocking?.plannedDate
          ? moment(detailDryDocking?.plannedDate)
          : '',
      );
      setValue(
        'actualDateFrom',
        detailDryDocking?.actualDateFrom
          ? moment(detailDryDocking?.actualDateFrom)
          : '',
      );
      setValue(
        'actualDateTo',
        detailDryDocking?.actualDateTo
          ? moment(detailDryDocking?.actualDateTo)
          : '',
      );
      setValue(
        'portMasterId',
        detailDryDocking?.portMasterId && [
          {
            value: detailDryDocking?.portMasterId,
            label: `${detailDryDocking?.portMaster?.name} - ${detailDryDocking?.portMaster?.country}`,
          },
        ],
      );
      setValue('remarks', detailDryDocking?.remarks);
      setValue('status', detailDryDocking?.status);
      setValue(
        'completedDate',
        detailDryDocking?.completedDate
          ? moment(detailDryDocking?.completedDate)
          : '',
      );
      setValue('completionRemarks', detailDryDocking?.completionRemarks);
      setValue(
        'attachments',
        detailDryDocking?.attachments?.length
          ? [...detailDryDocking?.attachments]
          : [],
      );
      setWatchStatus(detailDryDocking?.status);
    }
  }, [detailDryDocking, setValue]);

  useEffect(() => {
    if (detailDryDocking) {
      if (detailDryDocking?.attachments?.length > 0) {
        dispatch(
          getListFileActions.request({
            ids: detailDryDocking?.attachments || [],
          }),
        );
      } else {
        dispatch(getListFileActions.success([]));
      }
    }
  }, [detailDryDocking, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearDryDockingAction());
    }
  }, [dispatch, isOpen]);

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              showArrow={false}
              labelSelect="Event type"
              data={CONDITION_EVENT_TYPE_OPTIONS}
              disabled
              name="eventType"
              id="eventType"
              className={cx('w-100')}
              messageRequired={errors?.eventType?.message || null}
              control={control}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('vesselName')}
              className={styles.disabledInput}
              disabled
              id="vesselName"
              name="vesselName"
              {...register('vesselName')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('imoNumber')}
              className={styles.disabledInput}
              disabled
              id="imoNumber"
              name="imoNumber"
              {...register('imoNumber')}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              labelSelect="Status"
              data={DRY_DOCKING_STATUS}
              isRequired={isEdit || isCreate}
              disabled={!!detailDryDocking && !isEdit}
              name="status"
              placeholder="Please select"
              id="status"
              className={cx('w-100')}
              messageRequired={errors?.status?.message || null}
              control={control}
              onChange={handleChangeStatus}
              notAllowSortData
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Planned date"
              isRequired={isEdit || isCreate}
              control={control}
              disabled={!!detailDryDocking && !isEdit}
              name="plannedDate"
              messageRequired={errors?.plannedDate?.message || null}
              placeholder={
                detailDryDocking && !isEdit ? '' : t('placeholder.pleaseSelect')
              }
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Row className="mx-0">
              <Col className={cx('p-0 me-3')}>
                <DateTimePicker
                  wrapperClassName={cx(styles.datePickerWrapper)}
                  className="w-100 "
                  label="Actual date from"
                  isRequired={(isCreate || isEdit) && !isDisableActualDateFrom}
                  control={control}
                  disabled={
                    (!!detailDryDocking && !isEdit) || isDisableActualDateFrom
                  }
                  name="actualDateFrom"
                  messageRequired={
                    !isDisableActualDateFrom && errors?.actualDateFrom?.message
                      ? errors?.actualDateFrom?.message
                      : null
                  }
                  placeholder={
                    detailDryDocking && !isEdit
                      ? ''
                      : t('placeholder.pleaseSelect')
                  }
                  inputReadOnly
                />
              </Col>
              <Col className={cx('p-0')}>
                <DateTimePicker
                  wrapperClassName={cx(styles.datePickerWrapper)}
                  className="w-100 "
                  label="Actual date to"
                  isRequired={!isDisableActualDateTo}
                  control={control}
                  disabled={
                    (!!detailDryDocking && !isEdit) || isDisableActualDateTo
                  }
                  minDate={
                    watchActualDateFrom
                      ? moment(watchActualDateFrom)
                      : undefined
                  }
                  name="actualDateTo"
                  messageRequired={
                    !isDisableActualDateTo && errors?.actualDateTo?.message
                      ? errors?.actualDateTo?.message
                      : null
                  }
                  placeholder={
                    detailDryDocking && !isEdit
                      ? ''
                      : t('placeholder.pleaseSelect')
                  }
                  inputReadOnly
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <AsyncSelectForm
              control={control}
              name="portMasterId"
              id="portMasterId"
              labelSelect="Location"
              isRequired={(isCreate || isEdit) && !isDisableLocation}
              titleResults="Selected group"
              placeholder={isCreate ? 'Please select' : ''}
              searchContent="Location"
              textSelectAll="Select all"
              textBtnConfirm="Confirm"
              disabled={(!!detailDryDocking && !isEdit) || isDisableLocation}
              messageRequired={
                !isDisableLocation && errors?.portMasterId?.message
                  ? errors?.portMasterId?.message
                  : ''
              }
              onChangeSearch={(value: string) => {
                dispatch(
                  getListPortActions.request({
                    content: value,
                  }),
                );
              }}
              options={dataTableChooseLocation || []}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('remarks')}
              className={styles.disabledInput}
              placeholder={
                detailDryDocking && !isEdit ? '' : t('placeholder.remarks')
              }
              maxLength={500}
              disabled={!!detailDryDocking && !isEdit}
              {...register('remarks')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Completed date"
              isRequired={(isCreate || isEdit) && !isDisableCompletedDate}
              control={control}
              disabled={
                (!!detailDryDocking && !isEdit) || isDisableCompletedDate
              }
              name="completedDate"
              messageRequired={
                !isDisableCompletedDate && errors?.completedDate?.message
                  ? errors?.completedDate?.message
                  : null
              }
              placeholder={
                detailDryDocking && !isEdit ? '' : t('placeholder.pleaseSelect')
              }
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label="Completion remarks"
              disabled={!!detailDryDocking && !isEdit}
              className={styles.disabledInput}
              placeholder={
                detailDryDocking && !isEdit ? '' : 'Enter completion remarks'
              }
              maxLength={500}
              {...register('completionRemarks')}
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
              disable={!!detailDryDocking && !isEdit && !isCreate}
              isEdit={isCreate || isEdit}
              scrollVerticalAttachment
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
      footer={(detailDryDocking && isEdit) || isCreate ? renderFooter() : null}
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

export default ModalDryDocking;
