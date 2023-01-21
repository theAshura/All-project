import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import moment from 'moment';
import { Col, Row } from 'antd/lib/grid';
import SelectAsyncForm from 'components/react-hook-form/async-select/SelectAsyncForm';

import Input from 'components/ui/input/Input';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { MaxLength } from 'constants/common.const';
import { PortType } from 'pages/vessel-screening/utils/models/common.model';

import { Port } from 'models/api/port/port.model';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListPortActionsApi } from 'api/port.api';
import { getListTerminalActionsApi } from 'api/terminal.api';
import { Terminal } from 'models/api/terminal/terminal.model';
import styles from './modal-port.module.scss';

const defaultParams = { pageSize: -1, status: 'active' };

interface ModalPortProps {
  isOpen: boolean;
  toggle: () => void;
  handleSubmitForm?: (data, index?: number) => void;
  data: PortType;
  index: number;
  disabled?: boolean;
  dateRequest?: moment.Moment;
}

const defaultValues = {
  portId: null,
  terminalId: null,
  berth: null,
  layCanDate: null,
};

const ModalPort: FC<ModalPortProps> = (props) => {
  const {
    toggle,
    isOpen,
    index,
    data,
    disabled,
    handleSubmitForm,
    dateRequest,
  } = props;

  const [dataPorts, setDataPort] = useState<Port[]>([]);
  const [loadingPorts, setLoadingPort] = useState<boolean>(false);
  const [dataTerminals, setDataTerminal] = useState<Terminal[]>([]);
  const [loadingTerminals, setLoadingTerminal] = useState<boolean>(false);
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);

  const schema = yup.object().shape({
    portId: yup
      .array()
      .nullable()
      .min(1, t('errors.required'))
      .required(t('errors.required')),

    berth: yup.string().trim().nullable().required(t('errors.required')),
    layCanDate: yup.string().trim().nullable().required(t('errors.required')),
  });

  const {
    handleSubmit,
    setValue,
    reset,
    register,
    control,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchPortId: string[] = watch('portId');

  const resetForm = useCallback(() => {
    reset(defaultValues);
    clearErrors();
  }, [clearErrors, reset]);

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const onSubmitForm = (formData) => {
    const findingPort = dataPorts?.find(
      (item) => item?.id === formData?.portId?.[0],
    );
    const findingTerminal = dataTerminals?.find(
      (item) => item?.id === formData?.terminalId?.[0],
    );
    const params = {
      ...data,
      ...formData,
      portId: formData?.portId?.[0],
      port: {
        code: findingPort?.code,
        name: findingPort?.name,
        country: findingPort?.country,
      },
      terminalId: formData?.terminalId?.[0],
      terminal: {
        code: findingTerminal?.code,
        name: findingTerminal?.name,
        portMaster: {
          code: findingTerminal?.portMaster?.code,
          name: findingTerminal?.portMaster?.name,
          country: findingTerminal?.portMaster?.country,
        },
      },
      layCanDate: moment(formData?.layCanDate)?.toISOString(),
    };
    handleSubmitForm(params, index);
    handleCancel();
  };

  const selectedPort = useMemo(
    () => dataPorts?.find((item) => item?.id === watchPortId?.[0]),
    [dataPorts, watchPortId],
  );

  const optionPort = useMemo(
    () =>
      dataPorts?.map((item) => ({
        value: item.id,
        label: `${item?.code}-${item?.name}`,
      })),
    [dataPorts],
  );

  const optionTerminal = useMemo(
    () =>
      dataTerminals?.map((item) => ({
        value: item.id,
        label: `${item?.name}`,
      })),
    [dataTerminals],
  );

  const renderForm = () => (
    <>
      <Row gutter={[24, 10]}>
        <Col span={12}>
          <SelectAsyncForm
            isRequired
            disabled={disabled || loadingPorts}
            className="w-100"
            labelSelect={t('labels.portName')}
            placeholder="Please select"
            searchContent={t('labels.portName')}
            name="portId"
            messageRequired={errors?.portId?.message || ''}
            control={control}
            onChange={(value) => {
              setValue('terminalId', []);
              clearErrors(['terminalId']);
            }}
            onChangeSearch={(value: string) => {
              setLoadingPort(true);

              getListPortActionsApi({
                ...defaultParams,
                content: value,
              })
                .then((res) => {
                  setLoadingPort(false);
                  setDataPort(res?.data?.data || []);
                })
                .catch(() => {
                  setLoadingPort(false);
                  setDataPort([]);
                });
            }}
            options={optionPort}
          />
        </Col>
        <Col span={12}>
          <Input
            label={t('labels.portCountry')}
            value={selectedPort?.country || ''}
            disabled
          />
        </Col>

        <Col span={12}>
          <SelectAsyncForm
            disabled={disabled || loadingTerminals}
            className="w-100"
            labelSelect={t('labels.portTerminal')}
            placeholder="Please select"
            searchContent={t('labels.portTerminal')}
            name="terminalId"
            messageRequired={errors?.terminalId?.message || ''}
            control={control}
            onChange={(value) => {
              const findingTerminal = dataTerminals?.find(
                (item) => item?.id === value?.[0],
              );
              if (!watchPortId || watchPortId?.length === 0) {
                setValue(
                  'portId',
                  findingTerminal?.portMasterId
                    ? [findingTerminal?.portMasterId]
                    : [],
                );
                if (findingTerminal?.portMasterId) {
                  clearErrors(['portId']);
                }
              }
            }}
            onChangeSearch={(value: string) => {
              const defaultParams = {
                pageSize: -1,
                isRefreshLoading: false,
                content: value,
                status: 'active',
              };
              const withFilteredPortParams = watchPortId?.[0]
                ? {
                    ...defaultParams,
                    portMasterId: watchPortId?.[0],
                  }
                : defaultParams;
              setLoadingTerminal(true);
              getListTerminalActionsApi({
                ...withFilteredPortParams,
              })
                .then((res) => {
                  setDataTerminal(res?.data?.data || []);
                  setLoadingTerminal(false);
                })
                .catch(() => {
                  setDataTerminal([]);
                  setLoadingTerminal(false);
                });
            }}
            options={optionTerminal}
          />
        </Col>
        <Col span={12}>
          <Input
            label={t('labels.portBerth')}
            className={cx({
              [styles.disabledInput]: disabled,
            })}
            placeholder={t('placeholders.portBerth')}
            {...register('berth')}
            maxLength={MaxLength.MAX_LENGTH_TEXT}
            messageRequired={errors?.berth?.message || ''}
            isRequired
            disabled={disabled}
          />
        </Col>
        <Col span={12}>
          <DateTimePicker
            messageRequired={errors?.layCanDate?.message || ''}
            label={t('labels.portLayCanDate')}
            control={control}
            minDate={dateRequest || null}
            className={cx('w-100')}
            name="layCanDate"
            id="layCanDate"
            isRequired
            inputReadOnly
          />
        </Col>
      </Row>
    </>
  );

  const renderFooter = () => (
    <>
      {!disabled && (
        <div>
          <GroupButton
            className="mt-4 justify-content-end"
            handleCancel={handleCancel}
            visibleSaveBtn
            handleSubmit={handleSubmit(onSubmitForm)}
          />
        </div>
      )}
    </>
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('portId', [data?.portId] || null);
      setValue('terminalId', [data?.terminalId] || null);
      setValue('layCanDate', moment(data?.layCanDate) || null);
      setValue('berth', data?.berth || null);
    } else {
      resetForm();
    }
  }, [data, isOpen, resetForm, setValue]);

  useEffectOnce(() => {
    getListPortActionsApi(defaultParams).then((res) => {
      const { data } = res;
      setDataPort(data.data);
    });
  });

  useEffectOnce(() => {
    getListTerminalActionsApi(defaultParams).then((res) => {
      const { data } = res;
      setDataTerminal(data.data);
    });
  });

  return (
    <ModalComponent
      isOpen={isOpen}
      toggle={handleCancel}
      title={disabled ? t('labels.viewPortName') : t('labels.addPortName')}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalPort;
