import { ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { PARAMS_DEFAULT } from 'constants/filter.const';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { CommonApiParam } from 'models/common.model';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { getListFileActions } from 'store/dms/dms.action';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { Injury } from 'models/api/injury/injury.model';
import useEffectOnce from 'hoc/useEffectOnce';
import moment from 'moment';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';

import {
  getListInjuryMasterActions,
  getListInjuryBodyActions,
} from 'store/injury/injury.action';
import { getListLocationActions } from 'store/location/location.action';
import { getListDepartmentMasterActions } from 'store/department-master/department-master.action';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
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
  data?: Injury;
  isEdit?: boolean;
  isView?: boolean;
  loading?: boolean;
}

const defaultValues = {
  eventType: null,
  lti: 'Yes',
  eventTitle: null,
  dateOfInjuries: '',
  deptOfInjuredPerson: null,
  locationOfIncident: null,
  injuriesBodyPart: null,
  causes: '',
  countermeasures: '',
  attachments: [],
};

const ModalInjuries = ({
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
  const { injuryDetail, listInjuryMaster, listInjuryBody } = useSelector(
    (state) => state.injury,
  );
  const { listDepartmentMaster } = useSelector(
    (state) => state.departmentMaster,
  );
  const { listLocations } = useSelector((state) => state.location);
  const { vesselDetail } = useSelector((state) => state.vessel);

  const listInjuryBodyOption: Array<NewAsyncOptions> = useMemo(
    () =>
      listInjuryBody?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listInjuryBody?.data],
  );

  const listLocationsOption: Array<NewAsyncOptions> = useMemo(
    () =>
      listLocations?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listLocations?.data],
  );

  const listDepartmentMasterOption: Array<NewAsyncOptions> = useMemo(
    () =>
      listDepartmentMaster?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listDepartmentMaster?.data],
  );

  const listInjuryMasterOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listInjuryMaster?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listInjuryMaster?.data],
  );
  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(getListInjuryMasterActions.request(newParams));
      dispatch(getListInjuryBodyActions.request(newParams));
      dispatch(getListLocationActions.request(newParams));
      dispatch(getListDepartmentMasterActions.request(newParams));
    },
    [dispatch],
  );

  useEffect(() => {
    handleGetList({
      ...PARAMS_DEFAULT,
      pageSize: -1,
      status: 'active',
    });
  }, [handleGetList]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        eventType: yup.array().nullable().required(t('ThisFieldIsRequired')),
        eventTitle: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        dateOfInjuries: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        deptOfInjuredPerson: yup
          .array()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        locationOfIncident: yup
          .array()
          .nullable()
          .required(t('ThisFieldIsRequired')),
        injuriesBodyPart: yup
          .array()
          .nullable()
          .required(t('ThisFieldIsRequired')),
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
    defaultValues,
    resolver: yupResolver(schema),
  });

  const ltiWatch = watch('lti');
  const eventTypeWatch = watch('eventType');

  useEffect(() => {
    if (eventTypeWatch) {
      const eventChecked = listInjuryMaster?.data?.find(
        (e) => e.id === eventTypeWatch?.[0]?.value,
      );
      if (eventChecked) {
        setValue('lti', eventChecked?.lti ? 'Yes' : 'No');
      }
    } else {
      setValue('lti', null);
    }
  }, [eventTypeWatch, listInjuryMaster?.data, setValue]);

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);
  const onSubmitForm = useCallback(
    (data) => {
      const {
        eventType,
        deptOfInjuredPerson,
        locationOfIncident,
        injuriesBodyPart,
        ...other
      } = data;
      const dataCreate = {
        ...other,
        lostTime: data.lti,
        injuryMasterId: eventType?.[0].value,
        departmentId: deptOfInjuredPerson?.[0].value,
        locationId: locationOfIncident?.[0].value,
        injuredBodyPartId: injuriesBodyPart?.[0].value,
        injuryDate:
          data?.dateOfInjuries &&
          moment(data?.dateOfInjuries)?.startOf('day').toISOString(),
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
      setValue('lti', '');
      setValue('eventTitle', '');
      setValue('dateOfInjuries', '');
      setValue('deptOfInjuredPerson', null);
      setValue('locationOfIncident', null);
      setValue('injuriesBodyPart', null);
      setValue('causes', '');
      setValue('countermeasures', '');
      setValue('attachments', []);
    }
  }, [isCreate, setValue]);

  useEffect(() => {
    if (isEdit || isView) {
      setValue('eventType', [
        {
          label: injuryDetail?.injuryMaster?.name,
          value: injuryDetail?.injuryMaster?.id,
        },
      ]);
      setValue('lti', injuryDetail?.injuryMaster?.lti === true ? 'Yes' : 'No');
      setValue('eventTitle', injuryDetail?.eventTitle);
      setValue(
        'dateOfInjuries',
        injuryDetail?.injuryDate && moment(injuryDetail?.injuryDate),
      );
      setValue('deptOfInjuredPerson', [
        {
          label: injuryDetail?.department?.name,
          value: injuryDetail?.department?.id,
        },
      ]);
      setValue('locationOfIncident', [
        {
          label: injuryDetail?.location?.name,
          value: injuryDetail?.location?.id,
        },
      ]);
      setValue('injuriesBodyPart', [
        {
          label: injuryDetail?.injuredBodyPart?.name,
          value: injuryDetail?.injuredBodyPart?.id,
        },
      ]);
      setValue('causes', injuryDetail?.causes);
      setValue('countermeasures', injuryDetail?.countermeasures);
      setValue(
        'attachments',
        injuryDetail?.attachments?.length ? [...injuryDetail?.attachments] : [],
      );
    }
  }, [
    injuryDetail?.attachments,
    injuryDetail?.causes,
    injuryDetail?.countermeasures,
    injuryDetail?.department?.id,
    injuryDetail?.department?.name,
    injuryDetail?.eventTitle,
    injuryDetail?.injuredBodyPart?.id,
    injuryDetail?.injuredBodyPart?.name,
    injuryDetail?.injuryDate,
    injuryDetail?.injuryMaster?.id,
    injuryDetail?.injuryMaster?.lti,
    injuryDetail?.injuryMaster?.name,
    injuryDetail?.location?.id,
    injuryDetail?.location?.name,
    isEdit,
    isView,
    setValue,
  ]);

  useEffect(() => {
    setValue('vesselName', vesselDetail?.name);
    setValue('imoNumber', vesselDetail?.imoNumber);
  }, [setValue, vesselDetail?.imoNumber, vesselDetail?.name]);

  useEffect(() => {
    if (data) {
      if (injuryDetail?.attachments?.length > 0) {
        dispatch(
          getListFileActions.request({
            ids: injuryDetail?.attachments || [],
          }),
        );
      } else {
        dispatch(getListFileActions.success([]));
      }
    }
  }, [data, dispatch, injuryDetail?.attachments]);

  useEffectOnce(() => {
    dispatch(getListVesselActions.request({ pageSize: -1, status: 'active' }));
  });

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
              disabled
              id="imoNumber"
              name="imoNumber"
              {...register('imoNumber')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <AsyncSelectForm
              isRequired
              disabled={isView}
              labelSelect={t('eventType')}
              control={control}
              name="eventType"
              id="eventType"
              titleResults="Selected"
              placeholder="Please select"
              textSelectAll="Select all"
              messageRequired={errors?.eventType?.message || null}
              onChangeSearch={(value: string) => {
                dispatch(
                  getListInjuryMasterActions.request({
                    pageSize: -1,
                    isLeftMenu: false,
                    content: value || '',
                    status: 'active',
                  }),
                );
              }}
              options={listInjuryMasterOptions}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('injuries.lti')}
              className={styles.disabledInput}
              maxLength={20}
              disabled
              name="lti"
              value={ltiWatch}
              // {...register('lti')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('injuries.eventTitle')}
              className={styles.disabledInput}
              placeholder={t('placeholderInjuries.eventTitle')}
              maxLength={100}
              disabled={isView}
              messageRequired={errors?.eventTitle?.message || null}
              isRequired
              {...register('eventTitle')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Date of injury"
              name="dateOfInjuries"
              isRequired
              disabled={isView}
              control={control}
              messageRequired={errors?.dateOfInjuries?.message || null}
              placeholder={t('placeholder.pleaseSelect')}
              inputReadOnly
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <AsyncSelectForm
              isRequired
              disabled={isView}
              labelSelect={t('injuries.deptOfInjuredPerson')}
              control={control}
              name="deptOfInjuredPerson"
              id="deptOfInjuredPerson"
              titleResults="Selected"
              placeholder="Please select"
              textSelectAll="Select all"
              messageRequired={errors?.deptOfInjuredPerson?.message || null}
              onChangeSearch={(value: string) => {
                dispatch(
                  getListDepartmentMasterActions.request({
                    pageSize: -1,
                    isLeftMenu: false,
                    content: value || '',
                    status: 'active',
                  }),
                );
              }}
              options={listDepartmentMasterOption}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <AsyncSelectForm
              isRequired
              disabled={isView}
              labelSelect={t('injuries.locationOfInjury')}
              control={control}
              name="locationOfIncident"
              id="locationOfIncident"
              titleResults="Selected"
              placeholder="Please select"
              textSelectAll="Select all"
              messageRequired={errors?.locationOfIncident?.message || null}
              onChangeSearch={(value: string) => {
                dispatch(
                  getListLocationActions.request({
                    pageSize: -1,
                    isLeftMenu: false,
                    content: value || '',
                    status: 'active',
                  }),
                );
              }}
              options={listLocationsOption}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <AsyncSelectForm
              isRequired
              disabled={isView}
              labelSelect={t('injuries.injuriesBodyPart')}
              control={control}
              name="injuriesBodyPart"
              id="injuriesBodyPart"
              titleResults="Selected"
              placeholder="Please select"
              textSelectAll="Select all"
              messageRequired={errors?.injuriesBodyPart?.message || null}
              onChangeSearch={(value: string) => {
                dispatch(
                  getListInjuryBodyActions.request({
                    pageSize: -1,
                    isLeftMenu: false,
                    content: value || '',
                    status: 'active',
                  }),
                );
              }}
              options={listInjuryBodyOption}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')} id="name">
            <Input
              label={t('injuries.causes')}
              className={styles.disabledInput}
              placeholder={t('placeholderInjuries.causes')}
              maxLength={300}
              disabled={isView}
              {...register('causes')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('injuries.countermeasures')}
              className={styles.disabledInput}
              placeholder={t('placeholderInjuries.countermeasures')}
              maxLength={300}
              disabled={isView}
              {...register('countermeasures')}
            />
          </Col>
          <Col />
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

export default ModalInjuries;
