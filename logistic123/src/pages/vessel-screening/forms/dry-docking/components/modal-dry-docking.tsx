import { FC, useEffect, useCallback } from 'react';
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
import { DRY_DOCKING_STATUS } from 'constants/filter.const';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import isNumber from 'lodash/isNumber';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import moment from 'moment';
import { getListPortActions } from 'store/port/port.action';
import { CreateDryDockingParams } from 'models/api/dry-docking/dry-docking.model';
import { clearDryDockingAction } from 'store/dry-docking/dry-docking.action';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import styles from './modal-dry-docking.module.scss';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  toggle?: () => void;
  onSubmit?: (data: CreateDryDockingParams) => void;
  setIsCreate?: (value: boolean) => void;
  data?: any;
  isEdit?: boolean;
  loading?: boolean;
}

const defaultValues = {
  potentialRisk: null,
  observedRisk: null,
  timeLoss: true,
  comments: [],
};

const ModalDryDocking: FC<ModalProps> = (props) => {
  const { toggle, title, isOpen, onSubmit, data, isEdit } = props;
  const { t } = useTranslation([
    I18nNamespace.DRY_DOCKING,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();

  const handleGetList = useCallback(() => {
    dispatch(
      getListPortActions.request({
        pageSize: -1,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    handleGetList();
  }, [dispatch, handleGetList]);

  const schema = yup.object().shape({});

  const methods = useForm<FieldValues>({
    mode: 'all',
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
        dryDockingId: data?.id,
        comments: dataForm?.comments?.length ? dataForm?.comments : null,
      };
      onSubmit(modifiedData);
      resetForm();
    },
    [data?.id, onSubmit, resetForm],
  );

  useEffect(() => {
    const defaultData = data?.dryDockingRequests?.[0];

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
      setValue('comments', defaultData?.DDRComments ?? []);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearDryDockingAction());
    } else {
      dispatch(
        getListVesselActions.request({ pageSize: -1, status: 'active' }),
      );
    }
  }, [dispatch, isOpen]);

  const renderForm = () => (
    <FormProvider {...methods}>
      <div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label="Event type"
              className={styles.disabledInput}
              maxLength={20}
              disabled
              value={data?.eventType}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <SelectUI
              labelSelect="Status"
              data={DRY_DOCKING_STATUS}
              disabled
              value={data?.status}
              name="status"
              placeholder="Please select"
              id="status"
              className={cx('w-100')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Planned date"
              disabled
              value={data?.plannedDate ? moment(data?.plannedDate) : null}
              placeholder=""
              inputReadOnly
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Row className="pt-2 mx-0">
              <Col className={cx('p-0 me-3')}>
                <DateTimePicker
                  wrapperClassName={cx(styles.datePickerWrapper)}
                  className="w-100 "
                  label="Actual date from"
                  value={
                    data?.actualDateFrom ? moment(data?.actualDateFrom) : null
                  }
                  disabled
                  name="actualDateFrom"
                  placeholder=""
                  inputReadOnly
                />
              </Col>
              <Col className={cx('p-0')}>
                <DateTimePicker
                  wrapperClassName={cx(styles.datePickerWrapper)}
                  className="w-100 "
                  label="Actual date to"
                  disabled
                  value={data?.actualDateTo ? moment(data?.actualDateTo) : null}
                  name="actualDateTo"
                  messageRequired={errors?.actualDateTo?.message || null}
                  placeholder=""
                  inputReadOnly
                />
              </Col>
            </Row>
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label="Location"
              className={styles.disabledInput}
              disabled
              value={
                data?.portMaster?.name && data?.portMaster?.country
                  ? `${data.portMaster.name} - ${data.portMaster.country}`
                  : null
              }
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('remarks')}
              className={styles.disabledInput}
              placeholder=""
              maxLength={500}
              disabled
              value={data?.remarks}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Completed date"
              disabled
              value={data?.completedDate ? moment(data?.completedDate) : null}
              name="completedDate"
              placeholder=""
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label="Completion remarks"
              disabled
              className={styles.disabledInput}
              placeholder=""
              maxLength={500}
              value={data?.completionRemarks}
            />
          </Col>
          <Col className={cx('p-0 ms-3')} />
        </Row>

        <TableAttachment
          featurePage={Features.QUALITY_ASSURANCE}
          subFeaturePage={SubFeatures.SAIL_GENERAL_REPORT}
          loading={false}
          disable
          scrollVerticalAttachment
          value={data?.attachments}
          buttonName="Attach"
          onchange={() => {}}
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
      </div>
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

export default ModalDryDocking;
