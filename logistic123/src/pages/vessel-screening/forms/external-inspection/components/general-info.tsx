import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import moment from 'moment';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { I18nNamespace } from 'constants/i18n.const';
import { getListAuthorityMasterActions } from 'store/authority-master/authority-master.action';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { VesselScreeningExternalInspection } from 'pages/vessel-screening/utils/models/external-inspection.model';
import { clearVesselInternalInspectionErrorsReducer } from 'pages/vessel-screening/store/vessel-internal-inspection.action';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import styles from './general-info.module.scss';

interface GeneralInformationProps {
  loading?: boolean;
  data: VesselScreeningExternalInspection;
}

const GeneralInformation: FC<GeneralInformationProps> = ({ loading, data }) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const dispatch = useDispatch();
  const { listVesselResponse } = useSelector((state) => state.vessel);
  const { listAuthorityMasters } = useSelector(
    (state) => state.authorityMaster,
  );

  const { listAuditTypes } = useSelector((state) => state.auditType);
  const { control, watch, formState, setValue, register } = useFormContext();
  const watchVesselId = watch('vesselId');

  const vesselDetail = useMemo(
    () => listVesselResponse?.data?.find((item) => item.id === watchVesselId),
    [listVesselResponse?.data, watchVesselId],
  );

  useEffect(() => {
    dispatch(
      getListAuthorityMasterActions.request({ pageSize: -1, status: 'active' }),
    );
    dispatch(getListVesselActions.request({ pageSize: -1, status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const findings = data?.externalInspectionReports?.map((item) => ({
        ...item,
        pscDeficiencyId: item?.pscDeficiency?.id,
        pscActionId: item?.pscAction?.id,
        viqId: item?.viq?.id,
      }));
      const authoritySelected = listAuthorityMasters?.data?.find(
        (i) => i.id === data?.authorityId,
      );
      setValue('eventType', data?.eventType?.name || null);
      setValue('vesselId', data?.vesselId || null);
      setValue('authorityId', authoritySelected?.name || null);
      setValue('isPort', Boolean(data?.isPort));
      setValue('portId', data?.portId || null);
      setValue('terminalId', data?.terminalId || null);
      setValue('dateOfInspection', moment(data?.dateOfInspection) || null);
      setValue('inspectorName', data?.inspectorName || null);
      setValue('comment', data?.comment || null);
      setValue('externalInspectionReports', findings || []);
    }
    return () => {
      dispatch(clearVesselInternalInspectionErrorsReducer());
    };
  }, [
    data,
    dispatch,
    listAuditTypes?.data,
    listAuthorityMasters?.data,
    setValue,
  ]);

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
            <Input
              label={t('authority')}
              {...register('authorityId')}
              disabled
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <DateTimePicker
              disabled
              label={t('dateOfInspection')}
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
            <ToggleSwitch disabled control={control} name="noFindings" />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <Input
              value={watch('externalInspectionReports')?.length || 0}
              label={t('totalNoOfFindings')}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <Input
              {...register('inspectorName')}
              name="inspectorName"
              label={t('auditorInspectorName')}
              disabled
              isRequired
            />
          </Col>

          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>
              {t('comment')}
              <span className={cx(styles.required)}>*</span>
            </div>

            <TextAreaForm
              name="comment"
              control={control}
              minRows={3}
              disabled
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
