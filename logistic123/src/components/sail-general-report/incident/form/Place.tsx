import { FC, useCallback, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';

import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListPortActions } from 'store/port/port.action';
import ModalListTableForm from 'components/react-hook-form/modal-list-form/ModalListTableForm';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { I18nNamespace } from 'constants/i18n.const';
import { CoordinateType } from 'constants/common.const';
import InputCoordinateForm from 'components/react-hook-form/input-form/inputCoordinateForm';
import { IncidentInvestigationDetailResponse } from 'models/api/incident-investigation/incident-investigation.model';
import ChoosePortModal from 'pages/incidents/form/ChoostPortModal.tsx/ChoosePortModal';
import styles from './form.module.scss';

interface PlaceProps {
  isEdit: boolean;
  loading?: boolean;
  data: IncidentInvestigationDetailResponse;
}

const Place: FC<PlaceProps> = ({ data, isEdit, loading }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const dispatch = useDispatch();
  const { listPort, loading: loadingPort } = useSelector((state) => state.port);
  const { control, formState, watch, setValue } = useFormContext();
  const watchPortFrom = watch('portId');
  const watchPortTo = watch('portToId');
  const watchAtPort = watch('atPort');

  const rowLabels = useMemo(
    () => [
      {
        title: t('portCode'),
        width: 150,
        dataIndex: 'portCode',
        tooltip: false,
      },
      {
        title: t('portName'),
        dataIndex: 'portName',
        width: 200,
        tooltip: false,
      },
      {
        title: t('country'),
        dataIndex: 'country',
        width: 200,
        tooltip: false,
      },
    ],
    [t],
  );

  const listToView = useMemo(
    () =>
      listPort?.data?.map((item) => ({
        id: item.id,
        portCode: item.code,
        portName: item.name,
        country: item.country,
      })),
    [listPort],
  );

  const portToDetail = useMemo(
    () => listPort?.data?.find((item) => item.id === watchPortTo),
    [listPort?.data, watchPortTo],
  );

  const portFromDetail = useMemo(
    () => listPort?.data?.find((item) => item.id === watchPortFrom),
    [listPort?.data, watchPortFrom],
  );

  useEffect(() => {
    dispatch(getListPortActions.request({ pageSize: -1, status: 'active' }));
  }, [dispatch]);

  const handleChangeAtPort = useCallback(
    (value) => {
      if (data && isEdit) {
        if (value) {
          setValue('portId', data?.atPort ? data?.portId : null);
        } else {
          setValue('portId', !data?.atPort ? data?.portId : null);
          setValue('portToId', !data?.atPort ? data?.portToId : null);
          setValue('latitude', !data?.atPort ? data?.latitude : '');
          setValue('longitude', !data?.atPort ? data?.longitude : '');
        }
      } else {
        setValue('portId', null);
        setValue('portToId', null);
        setValue('latitude', '');
        setValue('longitude', '');
      }
    },
    [data, isEdit, setValue],
  );

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between">
          <div className={cx('fw-bold', styles.labelHeader)}>{t('place')}</div>
        </div>
        <RadioForm
          name="atPort"
          control={control}
          disabled={!isEdit || loading}
          radioOptions={[
            { value: true, label: 'At port' },
            { value: false, label: 'At sea' },
          ]}
          onChange={handleChangeAtPort}
        />

        {/* port to sea */}
        {!watchAtPort && (
          <Row gutter={[24, 0]}>
            <Col span={12} className={cx('pt-3')}>
              <InputCoordinateForm
                disabled={!isEdit || loading}
                name="latitude"
                isRequired
                coordinateType={CoordinateType.LATITUDE}
                control={control}
                messageRequired={formState?.errors?.latitude?.message}
              />
            </Col>
            <Col span={12} className={cx('pt-3')}>
              <InputCoordinateForm
                disabled={!isEdit || loading}
                name="longitude"
                isRequired
                coordinateType={CoordinateType.LONGITUDE}
                control={control}
                messageRequired={formState?.errors?.longitude?.message}
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
          <Col span={6} className={cx('pt-3')}>
            <ChoosePortModal
              buttonClassName={cx('w-100')}
              disable={!isEdit || loadingPort}
              buttonName={!watchAtPort ? t('chooseFromPort') : t('choosePort')}
              title={!watchAtPort ? t('chooseFromPort') : t('choosePort')}
              data={listToView}
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
        {/* port at sea */}
        {!watchAtPort && (
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
            <Col span={6} className={cx('pt-3')}>
              <ModalListTableForm
                data={listToView}
                buttonClassName={cx('w-100')}
                disable={!isEdit || loadingPort}
                rowLabels={rowLabels}
                buttonName={t('chooseToPort')}
                title={t('chooseToPort')}
                control={control}
                scroll={{ x: 'auto', y: 290 }}
                name="portToId"
              />
            </Col>
            {formState?.errors?.portToId?.message && (
              <div className="message-required mt-2">
                {formState?.errors?.portToId?.message}{' '}
              </div>
            )}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Place;
