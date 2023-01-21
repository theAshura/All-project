import { FC, useEffect, useMemo, useCallback, useState } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import moment from 'moment';

import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { I18nNamespace } from 'constants/i18n.const';
import { EventType } from 'models/api/event-type/event-type.model';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import { toastError } from 'helpers/notification.helper';
import { getListEventTypesActionsApi } from 'api/event-type.api';
import { getListAuthorityMasterActionsApi } from 'api/authority-master.api';
import { handleFilterParams } from 'helpers/filterParams.helper';

import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { PortStateControlDetailResponse } from 'models/api/port-state-control/port-state-control.model';
import useEffectOnce from 'hoc/useEffectOnce';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { MODULE_TYPE } from 'constants/filter.const';
import { CommonApiParam } from 'models/common.model';
import styles from './form.module.scss';

interface GeneralInformationProps {
  isEdit: boolean;
  isCreate?: boolean;
  loading?: boolean;
  data: PortStateControlDetailResponse;
  eventTypeWatch?: any;
  methods?: UseFormReturn<FieldValues>;
  defaultValueEventType?: string;
}

const GeneralInformation: FC<GeneralInformationProps> = ({
  eventTypeWatch,
  isEdit,
  data,
  isCreate,
  methods,
  defaultValueEventType,
}) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const dispatch = useDispatch();
  const { vesselDetail } = useSelector((state) => state.vessel);
  const { loading: loadingUser } = useSelector((state) => state.user);

  const { control, watch, formState, register } = useFormContext();
  const [optionEventTypes, setOptionEventTypes] = useState([]);
  const [optionAuthority, setOptionAuthority] = useState([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [dataAuthority, setDataAuthority] = useState([]);

  const handleGetListAuthority = useCallback((params?: CommonApiParam) => {
    const newParams = handleFilterParams(params);
    getListAuthorityMasterActionsApi(newParams)
      .then((r) => {
        setDataAuthority(r?.data?.data);
      })
      .catch((e) => toastError(e));
  }, []);

  useEffectOnce(() => {
    handleGetListAuthority({ pageSize: -1, status: 'active' });
    dispatch(getListVesselActions.request({ pageSize: -1, status: 'active' }));
  });

  useEffect(() => {
    getListEventTypesActionsApi({
      pageSize: -1,
      status: 'active',
      module: MODULE_TYPE.PORT_STATE_CONTROL,
    })
      .then((r) => {
        setEventTypes(r?.data?.data || []);
      })
      .catch((e) => toastError(e));
  }, []);

  useEffect(() => {
    let paramAuthority: CommonApiParam = {
      pageSize: -1,
      status: 'active',
    };

    if (data?.eventTypeId) {
      paramAuthority = {
        ...paramAuthority,
        eventTypeId: data?.eventTypeId?.toString(),
      };
    }
    handleGetListAuthority(paramAuthority);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (eventTypeWatch?.length > 0 && (isCreate || isEdit)) {
      handleGetListAuthority({
        pageSize: -1,
        status: 'active',
        eventTypeId: eventTypeWatch[0].value?.toString(),
      });
      methods.setValue('authorityId', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTypeWatch]);

  const listOptionEventTypes = useMemo(
    () =>
      eventTypes?.map((item) => ({
        value: item.id,
        label: item.name,
      })) || [],
    [eventTypes],
  );

  const listAuthorityOption = useMemo(() => {
    const mapData = dataAuthority?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    return mapData;
  }, [dataAuthority]);

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

  useEffect(() => {
    if (
      defaultValueEventType &&
      !data &&
      listOptionEventTypes?.length &&
      isCreate
    ) {
      const defaultDataEventType = listOptionEventTypes?.find(
        (i) =>
          i?.label?.trim()?.toUpperCase() ===
          defaultValueEventType?.toUpperCase(),
      );

      if (defaultDataEventType) {
        methods.setValue('eventTypeId', [defaultDataEventType]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, listOptionEventTypes]);

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <Row gutter={[24, 0]}>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('vesselName')}</div>
            <div className={cx(styles.contentForm)}>
              {vesselDetail?.name || '-'}
            </div>
          </Col>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('imoNumber')}</div>
            <div className={cx(styles.contentForm)}>
              {vesselDetail?.imoNumber || '-'}
            </div>
          </Col>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('vesselType')}</div>
            <div className={cx(styles.contentForm)}>
              {vesselDetail?.vesselType?.name || '-'}
            </div>
          </Col>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('fleetName')}</div>
            <div className={cx(styles.contentForm)}>
              {vesselDetail?.fleetName || '-'}
            </div>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <AsyncSelectForm
              disabled={!(isCreate || isEdit)}
              messageRequired={formState?.errors?.eventType?.message}
              control={control}
              name="eventTypeId"
              labelSelect={t('eventType')}
              isRequired
              placeholder="Please select"
              searchContent={t('eventType')}
              onChangeSearch={onChangeSearchEventType}
              options={optionEventTypes}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <AsyncSelectForm
              disabled={!(isCreate || isEdit)}
              messageRequired={formState?.errors?.authorityId?.message}
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

          <Col span={8} className={cx('pt-3')}>
            <DateTimePicker
              disabled={!isEdit}
              label={t('dateOfInspection')}
              placeholder={isEdit ? 'Please select' : ''}
              className="w-100"
              isRequired
              control={control}
              messageRequired={
                formState?.errors?.dateOfInspection?.message || ''
              }
              name="dateOfInspection"
              maxDate={moment()}
              inputReadOnly
            />
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>{t('noFindings')}</div>

            <ToggleSwitch
              disabled={!isEdit}
              control={control}
              name="noFindings"
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <Input
              value={watch('portStateInspectionReports')?.length || 0}
              label={t('totalNoOfFindings')}
              disabled
            />
          </Col>

          <Col span={8} className={cx('pt-3')}>
            <RadioForm
              name="detention"
              labelClassName={styles.radioLabel}
              control={control}
              disabled
              label={t('detention')}
              radioOptions={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <Input
              {...register('inspectorName')}
              name="inspectorName"
              label={t('auditorInspectorName')}
              disabled={!isEdit || loadingUser}
              placeholder={isEdit && t('auditorPlaceHolder')}
              isRequired
              messageRequired={formState?.errors?.inspectorName?.message || ''}
              maxLength={128}
            />
          </Col>

          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>
              {t('comment')}
              <span className={cx(styles.required)}>*</span>
            </div>

            <TextAreaForm
              name="comment"
              placeholder={t('placeholder.comment')}
              control={control}
              minRows={3}
              disabled={!isEdit}
              maxLength={2000}
            />
          </Col>
          <Col span={8} className={cx('pt-3')} />
        </Row>
      </div>
    </div>
  );
};

export default GeneralInformation;
