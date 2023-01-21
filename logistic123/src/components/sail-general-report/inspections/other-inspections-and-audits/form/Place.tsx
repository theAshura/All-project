import { FC, useCallback, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';

import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListPortActions } from 'store/port/port.action';
import ModalListTableForm from 'components/react-hook-form/modal-list-form/ModalListTableForm';
import { getListTerminalActions } from 'store/terminal/terminal.action';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { I18nNamespace } from 'constants/i18n.const';
import { GetDetailExternal } from 'models/api/external/external.model';
import ChoosePortModal from 'pages/incidents/form/ChoostPortModal.tsx/ChoosePortModal';
import styles from './form.module.scss';

interface PlaceProps {
  isEdit: boolean;
  isCreate: boolean;
  loading?: boolean;
  data: GetDetailExternal;
}

const Place: FC<PlaceProps> = ({ data, isEdit, isCreate, loading }) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const dispatch = useDispatch();
  const { listPort, loading: loadingPort } = useSelector((state) => state.port);
  const { listTerminal, loading: loadingTerminal } = useSelector(
    (state) => state.terminal,
  );
  const { control, formState, watch, setValue } = useFormContext();
  const watchPortFrom = watch('portId');
  const watchTerminalId = watch('terminalId');
  const watchAtPort = watch('isPort');

  const rowLabelTerminal = useMemo(
    () => [
      {
        title: t('terminalCode'),
        width: 150,
        dataIndex: 'terminalCode',
        tooltip: false,
      },
      {
        title: t('terminalName'),
        dataIndex: 'terminalName',
        width: 200,
        tooltip: false,
      },
      {
        title: t('portName'),
        dataIndex: 'portName',
        width: 200,
        tooltip: false,
      },
      {
        title: t('countryName'),
        dataIndex: 'countryName',
        width: 200,
        tooltip: false,
      },
    ],
    [t],
  );

  const listPortOption = useMemo(
    () =>
      listPort?.data?.map((item) => ({
        id: item.id,
        portCode: item.code,
        portName: item.name,
        country: item.country,
      })),
    [listPort],
  );
  const listTerminalOption = useMemo(
    () =>
      listTerminal?.data?.map((item) => ({
        id: item.id,
        terminalCode: item.code,
        terminalName: item.name,
        portName: item?.portMaster?.name,
        countryName: item?.portMaster?.country,
      })),
    [listTerminal],
  );

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

  useEffect(() => {
    if (!isCreate) {
      if (data?.isPort) {
        setValue('portId', data?.portId || null);
      } else {
        setValue('terminalId', data?.terminalId || null);
      }
      setValue('isPort', data?.isPort);
    }
  }, [data?.isPort, data?.portId, data?.terminalId, isCreate, setValue]);

  const handleChangeAtPort = useCallback(
    (value) => {
      if (data && !isCreate) {
        if (value) {
          setValue('portId', data?.isPort ? data?.portId : null);
        } else {
          setValue('terminalId', !data?.isPort ? data?.terminalId : null);
        }
      } else {
        setValue('portId', null);
        setValue('terminalId', null);
      }
    },
    [data, isCreate, setValue],
  );

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between">
          <div className={cx('fw-bold', styles.labelHeader)}>{t('place')}</div>
        </div>
        <RadioForm
          name="isPort"
          control={control}
          disabled={!isEdit || loading}
          radioOptions={[
            { value: true, label: 'Port' },
            { value: false, label: 'Terminal' },
          ]}
          onChange={handleChangeAtPort}
        />

        {watchAtPort ? (
          <Row gutter={[24, 0]}>
            {/* <Col span={6} className={cx('pt-3')}>
              <div className={cx(styles.titleForm)}>{t('portCode')}</div>
              <div className={cx(styles.contentForm)}>
                {portFromDetail?.code || '-'}
              </div>
            </Col> */}

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
            <Col span={6} className={cx('pt-3')}>
              <ChoosePortModal
                buttonClassName={cx('w-100')}
                disable={!isEdit || loadingPort}
                buttonName={
                  !watchAtPort ? t('chooseFromPort') : t('choosePort')
                }
                title={!watchAtPort ? t('chooseFromPort') : t('choosePort')}
                data={listPortOption}
                template="choosePortIncident"
                value={watchPortFrom}
                setValue={setValue}
                name="portId"
              />
            </Col>
            {formState?.errors?.portId?.message && (
              <div className="message-required mt-2">
                {formState?.errors?.portId?.message}{' '}
              </div>
            )}
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
            <Col span={6} className={cx('pt-3')}>
              <ModalListTableForm
                data={listTerminalOption}
                buttonClassName={cx('w-100')}
                disable={!isEdit || loadingTerminal}
                rowLabels={rowLabelTerminal}
                buttonName={t('chooseTerminal')}
                title={t('chooseTerminal')}
                control={control}
                scroll={{ x: 'auto', y: 290 }}
                name="terminalId"
              />
            </Col>
            {formState?.errors?.terminalId?.message && (
              <div className="message-required mt-2">
                {formState?.errors?.terminalId?.message}{' '}
              </div>
            )}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Place;
