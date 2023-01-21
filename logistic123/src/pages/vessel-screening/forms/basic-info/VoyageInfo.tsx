import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';
import { SCREEN_STATUS } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { ReactNode, useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import LabelUI from 'components/ui/label/LabelUI';
import { Col, Row } from 'antd/lib/grid';
import SelectAsyncForm from 'components/react-hook-form/async-select/SelectAsyncForm';
import {
  clearTransferTypeReducer,
  getListTransferTypeActions,
} from 'pages/transfer-type/store/action';
import { REGEXP_INPUT_PHONE_NUMBER } from 'constants/regExpValidate.const';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import SelectUI from 'components/ui/select/Select';
import {
  getListCargoTypeActions,
  clearCargoTypeReducer,
} from 'pages/cargo-type/store/action';
import {
  clearCargoReducer,
  getListCargoActions,
} from 'pages/cargo/store/action';
import VoyageInfoContainer from 'pages/vessel-screening/components/voyage-info/VoyageInfoList';
import styles from './basic-info.module.scss';
import AddPort from './common/AddPort';

const defaultParams = { pageSize: -1, status: 'active' };

interface Props {
  screen?: SCREEN_STATUS;
  isEdit?: boolean;
  btnGroup?: ReactNode;
}

const OPTION_UNITS = [
  {
    value: 'Metric tonne',
    label: 'Metric tonne',
  },
  {
    value: 'Kilogram',
    label: 'Kilogram',
  },
];

const VoyageInfo = ({ screen, isEdit, btnGroup }: Props) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);
  const { listTransferTypes, loading: loadingTransferTypes } = useSelector(
    (state) => state.transferType,
  );
  const { listCargoTypes, loading: loadingCargoTypes } = useSelector(
    (state) => state.cargoType,
  );
  const { listCargos, loading: loadingCargos } = useSelector(
    (state) => state.cargo,
  );

  const dispatch = useDispatch();

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const optionTransferTypes = useMemo(
    () =>
      listTransferTypes?.data?.map((item) => ({
        value: item.id,
        label: item?.name,
      })),
    [listTransferTypes?.data],
  );

  const optionCargoTypes = useMemo(
    () =>
      listCargoTypes?.data?.map((item) => ({
        value: item.id,
        label: item?.name,
      })),
    [listCargoTypes?.data],
  );

  const optionCargos = useMemo(
    () =>
      listCargos?.data?.map((item) => ({
        value: item.id,
        label: item?.name,
      })),
    [listCargos?.data],
  );

  useEffect(() => {
    dispatch(getListTransferTypeActions.request(defaultParams));
    dispatch(getListCargoTypeActions.request(defaultParams));
    dispatch(getListCargoActions.request(defaultParams));
    return () => {
      dispatch(clearCargoTypeReducer());
      dispatch(clearTransferTypeReducer());
      dispatch(clearCargoReducer());
    };
  }, [dispatch]);

  return (
    <div className={cx(styles.wrapperContainer)}>
      <Container className={styles.container}>
        <div className={cx(styles.part)}>
          <div className={cx('fw-bold', styles.titleForm)}>
            {t('basicInfo.requestInfo')}
          </div>
          <Row gutter={[16, 16]}>
            <Col xxl={6} lg={12} xl={8}>
              <SelectAsyncForm
                isRequired
                disabled={!isEdit || loadingTransferTypes}
                className="w-100"
                labelSelect={t('labels.transferType')}
                placeholder="Please select"
                searchContent={t('labels.transferType')}
                name="transferTypeId"
                messageRequired={errors?.transferTypeId?.message || ''}
                control={control}
                onChangeSearch={(value: string) =>
                  dispatch(
                    getListTransferTypeActions.request({
                      ...defaultParams,
                      content: value,
                    }),
                  )
                }
                options={optionTransferTypes}
              />
            </Col>
            <Col xxl={6} lg={12} xl={8}>
              <SelectAsyncForm
                isRequired
                disabled={!isEdit || loadingCargoTypes}
                className="w-100"
                labelSelect={t('labels.cargoType')}
                placeholder="Please select"
                searchContent={t('labels.cargoType')}
                name="cargoTypeId"
                messageRequired={errors?.cargoTypeId?.message || ''}
                control={control}
                onChangeSearch={(value: string) =>
                  dispatch(
                    getListCargoTypeActions.request({
                      ...defaultParams,
                      content: value,
                    }),
                  )
                }
                options={optionCargoTypes}
              />
            </Col>
            <Col lg={12} xl={8} xxl={6}>
              <SelectAsyncForm
                disabled={!isEdit || loadingCargos}
                className="w-100"
                labelSelect="&nbsp;"
                placeholder="Please select"
                searchContent="Cargo name"
                name="cargoId"
                messageRequired={errors?.cargoId?.message || ''}
                control={control}
                onChangeSearch={(value: string) =>
                  dispatch(
                    getListCargoActions.request({
                      ...defaultParams,
                      content: value,
                    }),
                  )
                }
                options={optionCargos}
              />
            </Col>
            <Col xxl={6} lg={12} xl={8}>
              <LabelUI label={t('labels.totalQuantity')} isRequired />
              <Row gutter={[10, 0]}>
                <Col span={10}>
                  <InputForm
                    patternValidate={REGEXP_INPUT_PHONE_NUMBER}
                    control={control}
                    isRequired
                    name="totalQuantity"
                    maxLength={10}
                    disabled={!isEdit}
                  />
                </Col>
                <Col span={14}>
                  <SelectUI
                    data={OPTION_UNITS}
                    disabled={!isEdit}
                    id="units"
                    name="units"
                    className={cx('w-100')}
                    messageRequired={errors?.units?.message || null}
                    control={control}
                  />
                </Col>
              </Row>
              {errors?.totalQuantity?.message && (
                <div className="message-required mt-2">
                  {errors?.totalQuantity?.message}
                </div>
              )}
            </Col>
          </Row>
          <div className="pt-4">
            <Controller
              control={control}
              name="ports"
              render={({ field: { onChange, value }, fieldState }) => (
                <>
                  <AddPort
                    setValues={onChange}
                    values={value}
                    className="p-0"
                    disable={!isEdit}
                  />
                  {fieldState?.error?.message ? (
                    <div className={cx(styles.message, 'message-required')}>
                      {fieldState?.error?.message}
                    </div>
                  ) : null}
                </>
              )}
            />
          </div>
        </div>
        <div className="pt-3 mx-0 pb-3">
          <div className={cx('d-flex pb-1 ps-0 ', styles.wrapLabel)}>
            <LabelUI label={t('labels.portRemarks')} />
          </div>
          <TextAreaForm
            name="remark"
            placeholder={t('placeholders.portRemarks')}
            maxLength={2000}
            control={control}
            rows={3}
            disabled={!isEdit}
          />
        </div>
        {btnGroup}
        <VoyageInfoContainer />
      </Container>
    </div>
  );
};

export default VoyageInfo;
