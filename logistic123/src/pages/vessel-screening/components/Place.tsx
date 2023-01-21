import { FC, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';

import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListPortActions } from 'store/port/port.action';
import { getListTerminalActions } from 'store/terminal/terminal.action';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { I18nNamespace } from 'constants/i18n.const';
import styles from './form.module.scss';

interface PlaceProps {
  loading?: boolean;
}

const Place: FC<PlaceProps> = ({ loading }) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const dispatch = useDispatch();
  const { listPort } = useSelector((state) => state.port);
  const { listTerminal } = useSelector((state) => state.terminal);
  const { control, watch, setValue } = useFormContext();
  const watchPortFrom = watch('portId');
  const watchTerminalId = watch('terminalId');
  const watchAtPort = watch('isPort');

  const portFromDetail = useMemo(
    () => listPort?.data?.find((item) => item.id === watchPortFrom),
    [listPort?.data, watchPortFrom],
  );

  const terminalDetail = useMemo(
    () => listTerminal?.data?.find((item) => item.id === watchTerminalId),
    [listTerminal?.data, watchTerminalId],
  );

  useEffect(() => {
    dispatch(getListPortActions.request({ pageSize: -1, status: 'active' }));
    dispatch(
      getListTerminalActions.request({ pageSize: -1, status: 'active' }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (watchAtPort) {
      setValue('terminalId', null);
    } else {
      setValue('portId', null);
    }
  }, [setValue, watchAtPort]);

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between">
          <div className={cx('fw-bold', styles.labelHeader)}>{t('place')}</div>
        </div>
        <RadioForm
          name="isPort"
          control={control}
          disabled
          radioOptions={[
            { value: true, label: 'Port' },
            { value: false, label: 'Terminal' },
          ]}
          onChange={() => {
            setValue('terminalId', null);
            setValue('portId', null);
          }}
        />

        {watchAtPort ? (
          <Row gutter={[24, 0]}>
            <Col span={6} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('portName')}</div>
              <div className={cx(styles.contentForm)}>
                {portFromDetail?.name || '-'}
              </div>
            </Col>
            <Col span={12} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('country')}</div>
              <div className={cx(styles.contentForm)}>
                {portFromDetail?.country || '-'}
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
