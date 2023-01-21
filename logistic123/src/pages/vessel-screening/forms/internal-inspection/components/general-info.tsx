import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import moment, { Moment } from 'moment';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { I18nNamespace } from 'constants/i18n.const';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { getListPortActions } from 'store/port/port.action';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { VesselScreeningInternalInspection } from 'pages/vessel-screening/utils/models/internal-inspection.model';
import { clearVesselInternalInspectionErrorsReducer } from 'pages/vessel-screening/store/vessel-internal-inspection.action';
import useEffectOnce from 'hoc/useEffectOnce';
import styles from './general-info.module.scss';

interface GeneralInformationProps {
  data: VesselScreeningInternalInspection;
}

const GeneralInformation: FC<GeneralInformationProps> = ({ data }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const dispatch = useDispatch();
  const { listVesselResponse } = useSelector((state) => state.vessel);
  const { listPort } = useSelector((state) => state.port);
  const { register, control, watch, formState, setValue } = useFormContext();
  const watchVesselId = watch('vesselId');
  const watchPortFrom = watch('portId');
  const watchFromDate: Moment = watch('inspectionDateFrom');
  const watchToDate: Moment = watch('inspectionDateTo');

  const vesselDetail = useMemo(
    () => listVesselResponse?.data?.find((item) => item.id === watchVesselId),
    [listVesselResponse?.data, watchVesselId],
  );

  const portFromDetail = useMemo(
    () => listPort?.data?.find((item) => item.id === watchPortFrom),
    [listPort?.data, watchPortFrom],
  );

  useEffectOnce(() => {
    dispatch(getListVesselActions.request({ pageSize: -1, status: 'active' }));
    dispatch(getListPortActions.request({ pageSize: -1, status: 'active' }));
  });

  useEffect(() => {
    if (data) {
      setValue('vesselId', data?.vesselId || null);
      setValue('eventType', data?.eventType?.name || null);
      setValue(
        'inspectionDateFrom',
        data?.inspectionDateFrom ? moment(data?.inspectionDateFrom) : null,
      );
      setValue(
        'inspectionDateTo',
        data?.inspectionDateTo ? moment(data?.inspectionDateTo) : null,
      );
      setValue(
        'nextInspectionDue',
        data?.nextInspectionDue ? moment(data?.nextInspectionDue) : null,
      );
      setValue('portId', data?.portId || null);
      setValue('status', data?.status || null);
    }
    return () => {
      dispatch(clearVesselInternalInspectionErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between">
          <div className={cx('fw-bold', styles.labelHeader)}>
            {t('generalInformation')}
          </div>
        </div>
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
            <Input label={t('eventType')} {...register('eventType')} disabled />
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
              maxDate={watchToDate || moment()}
              disabled
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
              maxDate={moment()}
              disabled
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
          <Col span={8} className={cx('pt-3 d-flex align-items-end')} />
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <DateTimePicker
              label={t('nextInspectionDue')}
              className="w-100"
              name="nextInspectionDue"
              disabled
              id="nextInspectionDue"
              format="DD/MM/YYYY"
              control={control}
              minDate={moment().add(1, 'days')}
              messageRequired={
                formState?.errors?.nextInspectionDue?.message || ''
              }
              isRequired
              inputReadOnly
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <RadioForm
              name="status"
              disabled
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
