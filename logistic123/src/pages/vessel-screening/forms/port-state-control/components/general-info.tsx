import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { I18nNamespace } from 'constants/i18n.const';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { getListAuthorityMasterActions } from 'store/authority-master/authority-master.action';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import { PortStateControlDetailResponse } from 'models/api/port-state-control/port-state-control.model';
import NewAsyncSelect, {
  NewAsyncOptions,
} from 'components/ui/async-select/NewAsyncSelect';
import RadioCustomer from 'components/common/radio/Radio';
import styles from './general-info.module.scss';

interface GeneralInformationProps {
  isEdit: boolean;
  loading?: boolean;
  data: PortStateControlDetailResponse;
}

const GeneralInformation: FC<GeneralInformationProps> = ({
  isEdit,
  loading,
  data,
}) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const dispatch = useDispatch();
  const { listVesselResponse } = useSelector((state) => state.vessel);
  const { listAuthorityMasters } = useSelector(
    (state) => state.authorityMaster,
  );

  const { listAuditTypes } = useSelector((state) => state.auditType);

  const listAuthorityOption = useMemo(() => {
    const mapData = listAuthorityMasters?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    return mapData;
  }, [listAuthorityMasters]);

  const listEventTypeOption: Array<NewAsyncOptions> = useMemo(() => {
    const mapData = listAuditTypes?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    return mapData;
  }, [listAuditTypes]);

  const vesselDetail = useMemo(
    () => listVesselResponse?.data?.find((item) => item.id === data?.vesselId),
    [listVesselResponse?.data, data?.vesselId],
  );

  useEffect(() => {
    dispatch(
      getListAuthorityMasterActions.request({ pageSize: -1, status: 'active' }),
    );
    dispatch(
      getListAuditTypeActions.request({ pageSize: -1, status: 'active' }),
    );
    dispatch(getListVesselActions.request({ pageSize: -1, status: 'active' }));
  }, [dispatch]);

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
            <NewAsyncSelect
              disabled
              isRequired
              labelSelect={t('eventTypeTx')}
              value={[
                { value: data?.eventType?.code, label: data?.eventType?.name },
              ]}
              searchContent={t('externalInspectionType')}
              id="eventTypeId"
              placeholder=""
              handleConfirm={() => {}}
              onChangeSearch={(value: string) => {}}
              options={listEventTypeOption}
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <NewAsyncSelect
              disabled
              isRequired
              labelSelect={t('authority')}
              value={listAuthorityOption?.filter(
                (item) => item.value === data?.authorityId,
              )}
              searchContent={t('authority')}
              id="authorityId"
              placeholder=""
              handleConfirm={() => {}}
              onChangeSearch={(value: string) => {}}
              options={listAuthorityOption}
            />
          </Col>

          <Col span={8} className={cx('pt-3')}>
            <DateTimePicker
              disabled
              label={t('dateOfInspection')}
              placeholder=""
              className="w-100"
              value={moment(data?.dateOfInspection)}
              isRequired
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
              disabled
              checked={data?.noFindings}
              name="noFindings"
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <Input
              value={data?.portStateInspectionReports?.length || 0}
              label={t('totalNoOfFindings')}
              disabled
            />
          </Col>
          <Col span={8} className={cx('pt-3')}>
            <div className="d-flex justify-content-between">
              <div className={cx(styles.labelForm)}>{t('detention')}</div>
            </div>
            <RadioCustomer
              value={data?.detention}
              disabled
              radioOptions={[
                { value: 'No', label: 'No' },
                { value: 'Yes', label: 'Yes' },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8} className={cx('pt-3')}>
            <Input
              name="inspectorName"
              label={t('auditorInspectorName')}
              disabled
              placeholder={isEdit && t('auditorPlaceHolder')}
              isRequired
              value={data?.inspectorName}
            />
          </Col>

          <Col span={8} className={cx('pt-3')}>
            <div className={cx(styles.labelForm)}>
              {t('comment')}
              <span className={cx(styles.required)}>*</span>
            </div>

            <TextAreaForm
              name="comment"
              value={data?.comment}
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
