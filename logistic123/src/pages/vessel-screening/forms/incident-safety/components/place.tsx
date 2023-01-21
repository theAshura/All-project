import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import InputCoordinate from 'components/ui/input-coordinate';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListPortActions } from 'store/port/port.action';
import { IncidentInvestigationDetailResponse } from 'models/api/incident-investigation/incident-investigation.model';
import RadioCustomer from 'components/common/radio/Radio';
import { I18nNamespace } from 'constants/i18n.const';
import { CoordinateType } from 'constants/common.const';
import styles from './place.module.scss';

interface PlaceProps {
  isEdit: boolean;
  loading?: boolean;
  data: IncidentInvestigationDetailResponse;
}

const Place: FC<PlaceProps> = ({ isEdit, loading, data }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const dispatch = useDispatch();
  const { listPort } = useSelector((state) => state.port);

  const portToDetail = useMemo(
    () => listPort?.data?.find((item) => item.id === data?.portToId),
    [listPort?.data, data?.portToId],
  );

  const portFromDetail = useMemo(
    () => listPort?.data?.find((item) => item.id === data?.portId),
    [listPort?.data, data?.portId],
  );

  useEffect(() => {
    dispatch(getListPortActions.request({ pageSize: -1, status: 'active' }));
  }, [dispatch]);

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between">
          <div className={cx('fw-bold', styles.labelHeader)}>{t('place')}</div>
        </div>

        <RadioCustomer
          disabled
          radioOptions={[
            { value: true, label: 'At port' },
            { value: false, label: 'At sea' },
          ]}
          onChange={(value) => {}}
          value={data?.atPort}
        />

        {/* port to sea */}
        {!data?.atPort && (
          <Row gutter={[24, 0]}>
            <Col span={12} className={cx('pt-3')}>
              <InputCoordinate
                disabled
                isRequired
                coordinateType={CoordinateType.LATITUDE}
                onChangeValue={() => {}}
                valueCoordinate={data?.latitude}
              />
            </Col>
            <Col span={12} className={cx('pt-3')}>
              <InputCoordinate
                disabled
                isRequired
                coordinateType={CoordinateType.LONGITUDE}
                onChangeValue={() => {}}
                valueCoordinate={data?.longitude}
              />
            </Col>
          </Row>
        )}

        <Row gutter={[24, 0]}>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('portCode')}</div>
            <div className={cx(styles.contentForm)}>
              {portFromDetail?.code || '-'}
            </div>
          </Col>

          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('portName')}</div>
            <div className={cx(styles.contentForm)}>
              {portFromDetail?.name || '-'}
            </div>
          </Col>
          <Col span={6} className={cx('pt-3')}>
            <div className={cx(styles.titleForm)}>{t('country')}</div>
            <div className={cx(styles.contentForm)}>
              {portFromDetail?.country || '-'}
            </div>
          </Col>
        </Row>
        {/* port at sea */}
        {!data?.atPort && (
          <Row gutter={[24, 0]}>
            <Col span={6} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('portCode')}</div>
              <div className={cx(styles.contentForm)}>
                {portToDetail?.code || '-'}
              </div>
            </Col>
            <Col span={6} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('portName')}</div>
              <div className={cx(styles.contentForm)}>
                {portToDetail?.name || '-'}
              </div>
            </Col>
            <Col span={6} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('country')}</div>
              <div className={cx(styles.contentForm)}>
                {portToDetail?.country || '-'}
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Place;
