import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import moment, { Moment } from 'moment';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  getListVesselActions,
  getVesselDetailActions,
} from 'store/vessel/vessel.action';
import { I18nNamespace } from 'constants/i18n.const';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { getListPortActions } from 'store/port/port.action';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { SailReportInspectionInternal } from 'models/api/sail-report-inspection-internal/sail-report-inspection-internal.model';
import { clearSailReportInspectionInternalErrorsReducer } from 'store/sail-report-inspection-internal/sail-report-inspection-internal.action';
import useEffectOnce from 'hoc/useEffectOnce';
import { useParams } from 'react-router';
import ChoosePortModal from 'pages/incidents/form/ChoostPortModal.tsx/ChoosePortModal';
import styles from './form.module.scss';

interface GeneralInformationProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: SailReportInspectionInternal;
}

const GeneralInformation: FC<GeneralInformationProps> = ({ isEdit, data }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const dispatch = useDispatch();
  const { vesselDetail } = useSelector((state) => state.vessel);
  const { listPort, loading: loadingPort } = useSelector((state) => state.port);
  const { listAuditTypes } = useSelector((state) => state.auditType);
  const { register, control, watch, formState, setValue } = useFormContext();
  const watchPortFrom = watch('portId');
  const watchFromDate: Moment = watch('inspectionDateFrom');
  const watchToDate: Moment = watch('inspectionDateTo');
  const { id: vesselRequestId } = useParams<{ id: string }>();

  const optionDataEventTypes: Array<NewAsyncOptions> = useMemo(
    () =>
      listAuditTypes?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listAuditTypes],
  );

  const listToViewPort = useMemo(
    () =>
      listPort?.data?.map((item) => ({
        id: item.id,
        portCode: item.code,
        portName: item.name,
        country: item.country,
      })),
    [listPort],
  );

  const portFromDetail = useMemo(
    () => listPort?.data?.find((item) => item.id === watchPortFrom),
    [listPort?.data, watchPortFrom],
  );

  useEffect(() => {
    dispatch(getListVesselActions.request({ pageSize: -1, status: 'active' }));
    dispatch(
      getListAuditTypeActions.request({ pageSize: -1, scope: 'internal' }),
    );
    dispatch(getListPortActions.request({ pageSize: -1, status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const selectedEventType = listAuditTypes?.data
        ?.filter((i) => i.id === data?.eventTypeId)
        ?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      setValue('eventTypeId', selectedEventType || null);
      setValue('inspectionDateFrom', moment(data?.inspectionDateFrom) || null);
      setValue('inspectionDateTo', moment(data?.inspectionDateTo) || null);
      setValue(
        'nextInspectionDue',
        data?.nextInspectionDue ? moment(data?.nextInspectionDue) : null,
      );
      setValue('portId', data?.portId || null);
      setValue('status', data?.status || null);
    }
    return () => {
      dispatch(clearSailReportInspectionInternalErrorsReducer());
    };
  }, [data, dispatch, listAuditTypes?.data, setValue]);

  useEffectOnce(() => {
    dispatch(getVesselDetailActions.request(vesselRequestId));
  });

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
              disabled={!isEdit}
              isRequired
              labelSelect={t('eventType')}
              searchContent={t('internalInspectionType')}
              control={control}
              name="eventTypeId"
              id="eventTypeId"
              placeholder={isEdit ? 'Please select' : ''}
              messageRequired={formState?.errors?.eventTypeId?.message || ''}
              onChangeSearch={(value: string) =>
                dispatch(
                  getListAuditTypeActions.request({
                    pageSize: -1,
                    isRefreshLoading: false,
                    content: value,
                    scope: 'internal',
                  }),
                )
              }
              options={optionDataEventTypes}
            />
          </Col>

          <Col span={8} className={cx('pt-3')}>
            <DateTimePicker
              label={t('inspectionDateFrom')}
              name="inspectionDateFrom"
              id="inspectionDateFrom"
              className="w-100"
              format="DD/MM/YYYY"
              control={control}
              isRequired
              maxDate={watchToDate}
              disabled={!isEdit}
              messageRequired={
                formState?.errors?.inspectionDateFrom?.message || ''
              }
              inputReadOnly
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <DateTimePicker
              label={t('inspectionDateTo')}
              name="inspectionDateTo"
              id="inspectionDateTo"
              className="w-100"
              format="DD/MM/YYYY"
              isRequired
              control={control}
              disabled={!isEdit}
              inputReadOnly
              minDate={watchFromDate}
              messageRequired={
                formState?.errors?.inspectionDateTo?.message || ''
              }
            />
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <Input
              label={t('portName')}
              {...register('portName')}
              disabled
              value={portFromDetail?.name}
              maxLength={128}
            />
          </Col>

          <Col span={8} className={cx('pt-3')}>
            <Input
              label={t('country')}
              {...register('country')}
              disabled
              maxLength={128}
              value={portFromDetail?.country}
            />
          </Col>
          <Col span={8} className={cx('pt-3 d-flex align-items-end')}>
            <ChoosePortModal
              buttonClassName={cx('w-100')}
              disable={!isEdit || loadingPort}
              buttonName={t('choosePort')}
              title={t('choosePort')}
              data={listToViewPort}
              template="choosePortIncident"
              value={watchPortFrom}
              setValue={setValue}
              name="portId"
            />
          </Col>
          {formState?.errors?.portId?.message && (
            <Col span={24} className={cx('pt-3')}>
              <div className="message-required mt-2">
                {formState?.errors?.portId?.message}{' '}
              </div>
            </Col>
          )}
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <DateTimePicker
              label={t('nextInspectionDue')}
              className="w-100"
              name="nextInspectionDue"
              disabled={!isEdit}
              id="nextInspectionDue"
              format="DD/MM/YYYY"
              control={control}
              minDate={moment().add(1, 'days')}
              messageRequired={
                formState?.errors?.nextInspectionDue?.message || ''
              }
              inputReadOnly
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <RadioForm
              name="status"
              disabled={!isEdit}
              labelClassName={styles.radioLabel}
              control={control}
              label={t('status')}
              radioOptions={[
                { value: 'Open', label: 'Open' },
                { value: 'Close', label: 'Close' },
              ]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GeneralInformation;
