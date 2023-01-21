import { FC, useCallback, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { Row, Col } from 'antd/lib/grid';
import Input from 'components/ui/input/Input';
import moment from 'moment';
import LabelUI from 'components/ui/label/LabelUI';

import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SelectAsyncForm from 'components/react-hook-form/async-select/SelectAsyncForm';
import { I18nNamespace } from 'constants/i18n.const';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { CommonApiParam } from 'models/common.model';

import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import SelectUI from 'components/ui/select/Select';
import { getListTerminalActions } from 'store/terminal/terminal.action';
import { getListPortActions } from 'store/port/port.action';
import { getCountryActions } from 'store/user/user.action';
import styles from './form.module.scss';
import { FEEDBACK_TYPE } from './contants';

interface GeneralInformationPilotTerminalFeedbackProps {
  isEdit: boolean;
  loading?: boolean;
}

const defaultParams = {
  pageSize: -1,
  status: 'active',
  isRefreshLoading: true,
};

const feedBackTypeOption = [
  {
    value: FEEDBACK_TYPE.SHIP_MANAGEMENT,
    label: FEEDBACK_TYPE.SHIP_MANAGEMENT,
  },
  {
    value: FEEDBACK_TYPE.SHIP_OWNER,
    label: FEEDBACK_TYPE.SHIP_OWNER,
  },
  {
    value: FEEDBACK_TYPE.CHARTERER,
    label: FEEDBACK_TYPE.CHARTERER,
  },
  {
    value: FEEDBACK_TYPE.PILOT_SERVICES,
    label: FEEDBACK_TYPE.PILOT_SERVICES,
  },
  {
    value: FEEDBACK_TYPE.TERMINAL,
    label: FEEDBACK_TYPE.TERMINAL,
  },
  {
    value: FEEDBACK_TYPE.INSPECTION_SERVICES,
    label: FEEDBACK_TYPE.INSPECTION_SERVICES,
  },
  {
    value: FEEDBACK_TYPE.SERVICES_PROVIDER,
    label: FEEDBACK_TYPE.SERVICES_PROVIDER,
  },
  {
    value: FEEDBACK_TYPE.OTHERS,
    label: FEEDBACK_TYPE.OTHERS,
  },
];

const GeneralInformationPilotTerminalFeedback: FC<GeneralInformationPilotTerminalFeedbackProps> =
  ({ isEdit, loading }) => {
    const { t } = useTranslation(I18nNamespace.PILOT_TERMINAL_FEEDBACK);
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.authenticate);
    const { pilotTerminalFeedbackDetail } = useSelector(
      (state) => state.pilotTerminalFeedback,
    );
    // const { listTerminal } = useSelector((state) => state.terminal);
    const { listPort, loading: loadingPort } = useSelector(
      (state) => state.port,
    );
    const { listCountry, disable: loadingCountry } = useSelector(
      (state) => state.user,
    );

    const {
      register,
      control,
      watch,
      setValue,
      clearErrors,
      formState: { errors },
    } = useFormContext();
    const watchFeedbackType = watch('feedbackType');
    const watchTerminalId = watch('terminalId');
    const watchPortId = watch('portId');
    const watchCountry = watch('country');

    // const terminalOptions = useMemo(
    //   () =>
    //     listTerminal?.data?.map((item) => ({
    //       value: item.id,
    //       label: item.name,
    //     })),
    //   [listTerminal?.data],
    // );

    const portOptions = useMemo(
      () =>
        listPort?.data?.map((item) => ({
          value: item.id,
          label: item.name,
        })),
      [listPort?.data],
    );

    const countryOptions = useMemo(
      () =>
        listCountry?.map((item) => ({
          value: item.name,
          label: item.name,
        })),
      [listCountry],
    );

    const clearField = useCallback(
      (nameField: string, valueClear) => {
        setValue(nameField, valueClear);
        clearErrors(nameField);
      },
      [clearErrors, setValue],
    );

    // const handleSearchTerminal = useCallback(
    //   (value: string) => {
    //     const country = watchCountry?.[0] || '';
    //     const portMasterId = watchPortId?.[0] || '';
    //     const terminalId = watchTerminalId?.[0] || '';
    //     let param: CommonApiParam = {
    //       pageSize: -1,
    //       content: value,
    //       status: 'active',
    //       isRefreshLoading: true,
    //     };

    //     if (portMasterId && (!country || !terminalId)) {
    //       param = { ...param, portMasterId };
    //     } else if (portMasterId && country && terminalId) {
    //       param = {
    //         pageSize: -1,
    //         content: value,
    //         status: 'active',
    //         isRefreshLoading: true,
    //       };
    //     }

    //     dispatch(getListTerminalActions.request(param));
    //   },
    //   [dispatch, watchCountry, watchPortId, watchTerminalId],
    // );

    const handleSearchPort = useCallback(
      (value: string) => {
        const country = watchCountry?.[0] || '';
        const portMasterId = watchPortId?.[0] || '';
        const terminalId = watchTerminalId?.[0] || '';

        let param: CommonApiParam = {
          pageSize: -1,
          content: value,
          isRefreshLoading: true,
          status: 'active',
        };
        if (country && (!portMasterId || !terminalId)) {
          param = {
            ...param,
            country: {
              value: country,
              label: country,
            },
          };
        } else if (portMasterId && country && terminalId) {
          param = {
            pageSize: -1,
            isRefreshLoading: true,
            content: value,
            status: 'active',
          };
        }

        dispatch(getListPortActions.request(param));
      },
      [dispatch, watchCountry, watchPortId, watchTerminalId],
    );

    const handleSearchCountry = useCallback(
      (value: string) => {
        dispatch(
          getCountryActions.request({
            pageSize: -1,
            content: value,
            isRefreshLoading: true,
            status: 'active',
          }),
        );
      },
      [dispatch],
    );

    // onChange

    // const handleChangeTerminal = useCallback(
    //   (value: string[]) => {
    //     const valueData = listTerminal?.data?.find(
    //       (item) => item?.id === value?.[0],
    //     );

    //     // TODO: map data port, country follow terminal
    //     if (valueData) {
    //       if (valueData?.portMasterId) {
    //         clearField('portId', [valueData?.portMasterId]);
    //       } else {
    //         clearField('portId', []);
    //       }

    //       if (valueData?.portMaster?.country) {
    //         clearField('country', [valueData?.portMaster?.country]);
    //       } else {
    //         clearField('country', []);
    //       }
    //       // TODO: if change option !== current option , clear data field after
    //     } else if (!valueData && value?.[0]) {
    //       clearField('portId', []);
    //       clearField('country', []);
    //     }
    //   },
    //   [clearField, listTerminal?.data],
    // );

    const handleChangePort = useCallback(
      (value: string[]) => {
        const valueData = listPort?.data?.find(
          (item) => item?.id === value?.[0],
        );

        const portMasterId = watchPortId?.[0] || '';
        // TODO: map data country follow port
        if (valueData) {
          if (valueData?.country) {
            clearField('country', [valueData?.country]);
          } else {
            clearField('country', []);
          }
        }
        // TODO: if change option !== current option , clear data field before

        if (portMasterId !== value?.[0]) {
          clearField('terminalId', []);
        }
      },
      [clearField, listPort?.data, watchPortId],
    );

    const handleChangeCountry = useCallback(
      (value: string[]) => {
        const country = watchCountry?.[0] || '';
        // TODO: if change option !== current option , clear data field before

        if (country !== value?.[0]) {
          clearField('terminalId', []);
          clearField('portId', []);
        }
        // TODO: call api get in store redux after
        // close because fn onChangeSearch dependent watch country
        // if not will have bug when choose terminal
        dispatch(getListPortActions.request(defaultParams));
      },
      [clearField, dispatch, watchCountry],
    );

    useEffect(() => {
      dispatch(
        getListTerminalActions.request({ pageSize: -1, status: 'active' }),
      );
      dispatch(getListPortActions.request({ pageSize: -1, status: 'active' }));
      dispatch(getCountryActions.request({ pageSize: -1, status: 'active' }));
    }, [dispatch]);

    useEffect(() => {
      if (watchFeedbackType === FEEDBACK_TYPE.TERMINAL) {
        setValue('pilotAgeArea', '');
        clearErrors('pilotAgeArea');
      }
      if (watchFeedbackType === FEEDBACK_TYPE.PILOT_SERVICES) {
        setValue('terminalId', []);
        clearErrors('terminalId');
      }
    }, [clearErrors, dispatch, setValue, watchFeedbackType]);

    return (
      <div className={cx(styles.wrapperContainer, 'pb-4')}>
        <div className={cx(styles.containerForm)}>
          <div className="d-flex justify-content-between">
            <div className={cx('fw-bold pb-2', styles.labelHeader)}>
              {t('generalInformation')}
            </div>
          </div>
          <Row gutter={[24, 10]}>
            <Col span={8}>
              <LabelUI
                className={cx(styles.labelForm)}
                label={t('labels.feedbackByUser')}
              />
              <div className={cx(styles.contentForm)}>
                {pilotTerminalFeedbackDetail?.createdUser?.username ||
                  userInfo?.username}
              </div>
            </Col>
            <Col xs={8}>
              <SelectUI
                isRequired
                labelSelect={t('labels.feedbackType')}
                data={feedBackTypeOption}
                disabled={
                  !isEdit ||
                  watchFeedbackType === FEEDBACK_TYPE.TERMINAL ||
                  watchFeedbackType === FEEDBACK_TYPE.PILOT_SERVICES
                }
                name="feedbackType"
                messageRequired={errors?.feedbackType?.message || ''}
                className={cx('w-100')}
                control={control}
              />
            </Col>
            <Col span={8}>
              <DateTimePicker
                disabled={!isEdit}
                messageRequired={errors?.dateOfInteraction?.message || ''}
                label={t('labels.dateOfInteraction')}
                isRequired
                className="w-100"
                maxDate={moment()}
                id="dateOfInteraction"
                control={control}
                name="dateOfInteraction"
              />
            </Col>
            <Col span={16}>
              <Row gutter={[24, 10]}>
                {/* <Col span={8}>
                  <SelectAsyncForm
                    labelSelect={t('labels.terminal')}
                    searchContent={t('labels.terminal')}
                    control={control}
                    disabled={
                      !isEdit ||
                      loadingTerminal ||
                      watchFeedbackType === FEEDBACK_TYPE.PILOT_SERVICES
                    }
                    name="terminalId"
                    id="terminalId"
                    placeholder="Please select"
                    onChange={handleChangeTerminal}
                    onClose={() =>
                      dispatch(getListTerminalActions.request(defaultParams))
                    }
                    messageRequired={errors?.terminalId?.message || ''}
                    onChangeSearch={handleSearchTerminal}
                    options={terminalOptions}
                  />
                </Col> */}
                <Col span={12}>
                  <SelectAsyncForm
                    labelSelect={t('labels.country')}
                    searchContent={t('labels.country')}
                    control={control}
                    disabled={!isEdit || loadingCountry}
                    name="country"
                    isRequired
                    id="country"
                    placeholder="Please select"
                    onChange={handleChangeCountry}
                    messageRequired={errors?.country?.message || ''}
                    onChangeSearch={handleSearchCountry}
                    onClose={() =>
                      dispatch(getCountryActions.request(defaultParams))
                    }
                    options={countryOptions}
                  />
                </Col>
                <Col span={12}>
                  <SelectAsyncForm
                    labelSelect={t('labels.port')}
                    searchContent={t('labels.port')}
                    control={control}
                    disabled={!isEdit || loadingPort}
                    name="portId"
                    isRequired
                    id="portId"
                    onChange={handleChangePort}
                    onClose={() =>
                      dispatch(getListPortActions.request(defaultParams))
                    }
                    placeholder="Please select"
                    messageRequired={errors?.portId?.message || ''}
                    onChangeSearch={handleSearchPort}
                    options={portOptions}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Input
                label={t('labels.pilotageArea')}
                disabled={
                  !isEdit || watchFeedbackType === FEEDBACK_TYPE.TERMINAL
                }
                placeholder={t('placeholders.pilotageArea')}
                messageRequired={errors?.pilotAgeArea?.message || ''}
                {...register('pilotAgeArea')}
                maxLength={32}
              />
            </Col>
          </Row>

          <LabelUI
            className={cx(styles.labelForm, 'pt-2')}
            label={t('labels.feedback')}
          />
          <TextAreaForm
            disabled={!isEdit}
            control={control}
            autoSize={{ minRows: 3, maxRows: 4 }}
            name="feedBack"
            maxLength={2000}
            placeholder={t('placeholders.feedback')}
          />
        </div>
      </div>
    );
  };

export default GeneralInformationPilotTerminalFeedback;
