import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListTerminalActions } from 'store/terminal/terminal.action';
import { PortStateControlDetailResponse } from 'models/api/port-state-control/port-state-control.model';
import RadioCustomer from 'components/common/radio/Radio';
import { I18nNamespace } from 'constants/i18n.const';
import styles from './place.module.scss';

interface PlaceProps {
  isEdit: boolean;
  loading?: boolean;
  data: PortStateControlDetailResponse;
}

const Place: FC<PlaceProps> = ({ data, isEdit, loading }) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const dispatch = useDispatch();
  const { listTerminal } = useSelector((state) => state.terminal);

  const terminalDetail = useMemo(
    () => listTerminal?.data?.find((item) => item.id === data?.terminalId),
    [listTerminal?.data, data?.terminalId],
  );

  useEffect(() => {
    dispatch(
      getListTerminalActions.request({ pageSize: -1, status: 'active' }),
    );
  }, [dispatch]);

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between">
          <div className={cx('fw-bold', styles.labelHeader)}>{t('place')}</div>
        </div>
        <RadioCustomer
          value={data?.isPort}
          disabled
          radioOptions={[
            { value: true, label: 'Port' },
            { value: false, label: 'Terminal' },
          ]}
        />

        {data?.isPort ? (
          <Row gutter={[24, 0]}>
            <Col span={6} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('portName')}</div>
              <div className={cx(styles.contentForm)}>
                {data?.port?.name || '-'}
              </div>
            </Col>
            <Col span={12} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('country')}</div>
              <div className={cx(styles.contentForm)}>
                {data?.port?.country || '-'}
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={[24, 0]}>
            <Col span={6} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('terminalName')}</div>
              <div className={cx(styles.contentForm)}>
                {terminalDetail?.name || '-'}
              </div>
            </Col>
            <Col span={6} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('portName')}</div>
              <div className={cx(styles.contentForm)}>
                {terminalDetail?.portMaster?.name || '-'}
              </div>
            </Col>
            <Col span={6} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('countryName')}</div>
              <div className={cx(styles.contentForm)}>
                {terminalDetail?.portMaster?.country || '-'}
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Place;
