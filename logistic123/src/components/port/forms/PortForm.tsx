import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import Container from 'components/common/container/Container';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import InputCoordinateForm from 'components/react-hook-form/input-form/inputCoordinateForm';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { CoordinateType, MaxLength } from 'constants/common.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { PORT_FIELDS_DETAILS } from 'constants/dynamic/port.const';
import { Option } from 'constants/filter.const';
import { AppRouteConst } from 'constants/route.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import history from 'helpers/history.helper';
import { checkLatitudeDMS, checkLongitudeDMS } from 'helpers/utils.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import isEqual from 'lodash/isEqual';
import { Port } from 'models/api/port/port.model';
import { FC, useEffect, useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { getGMTActions } from 'store/port/port.action';
import { getCountryActions } from 'store/user/user.action';
import * as yup from 'yup';
import styles from './form.module.scss';

interface PortManagementFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: Port;
  onSubmit: (CreatePortParams: Port) => void;
}

const PortManagementForm: FC<PortManagementFormProps> = ({
  isEdit,
  isCreate,
  data,
  onSubmit,
}) => {
  // state
  const dispatch = useDispatch();
  const { loading, errorList, GMTs } = useSelector((state) => state.port);
  const { listCountry } = useSelector((state) => state.user);

  const countryOptionProps: Array<NewAsyncOptions> = useMemo(
    () =>
      listCountry.map((item) => ({
        value: item?.id,
        label: item?.name,
        image: item?.flagImg || '',
      })),
    [listCountry],
  );

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonPortmaster,
    modulePage: ModulePage.Create,
  });

  const statusOptions = [
    {
      value: 'active',
      label: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Active),
    },
    {
      value: 'inactive',
      label: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Inactive),
    },
  ];

  const portTypeOptions = [
    {
      value: 'Inland',
      label: renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.Inland),
    },
    {
      value: 'Seaport',
      label: renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.Seaport),
    },
    {
      value: 'Dry port',
      label: renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS['Dry port']),
    },
    {
      value: 'Warm-water port',
      label: renderDynamicLabel(
        dynamicLabels,
        PORT_FIELDS_DETAILS['Warm-water port'],
      ),
    },
  ];

  const filterCountry = (country: string) =>
    countryOptionProps.filter((e) => e.label === country);

  const GMTOptionProps: Array<Option> = useMemo(() => {
    const newGMTs = [];
    GMTs.map((item) =>
      newGMTs.push({
        value: item?.name,
        label: item?.name,
      }),
    );
    return newGMTs;
  }, [GMTs]);

  const schema = yup.object().shape({
    code: yup
      .string()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .min(
        2,
        renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_DETAILS['Port code must be between 2 and 20 characters.'],
        ),
      ),
    name: yup
      .string()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .min(
        2,
        renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_DETAILS['Port name must be between 2 and 20 characters.'],
        ),
      ),
    country: yup
      .array()
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    latitude: yup
      .string()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .test(
        'latitude',
        renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_DETAILS['Latitude is not valid'],
        ),
        (value, context) => (value ? checkLatitudeDMS(value) : true),
      ),
    longitude: yup
      .string()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .test(
        'longitude',
        renderDynamicLabel(
          dynamicLabels,
          PORT_FIELDS_DETAILS['Longitude is not valid'],
        ),
        (value, context) => (value ? checkLongitudeDMS(value) : true),
      ),
  });

  const defaultValues = {
    code: '',
    country: [],
    gmtOffset: undefined,
    isBunkerPort: undefined,
    isEuroFlag: undefined,
    latitude: undefined,
    longitude: undefined,
    name: '',
    portType: undefined,
    status: 'active',
  };

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  // function
  const onSubmitForm = (data: Port) => {
    const country = getValues('country')[0].label;
    onSubmit({ ...data, country });
  };

  const resetDefault = (defaultParams) => {
    reset(defaultParams);
    history.goBack();
  };

  const handleCancel = () => {
    let defaultParams = {};
    const params = getValues();
    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      defaultParams = {
        code: data.code,
        name: data.name,
        status: data.status,
        country: filterCountry(data.country),
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        gmtOffset: data.gmtOffset || undefined,
        isEuroFlag: data?.isEuroFlag,
        isBunkerPort: data?.isBunkerPort,
        portType: data.portType,
      };
    }
    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.PORT);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Confirmation?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.PORT)
            : resetDefault(defaultParams),
      });
    }
  };

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('status', data.status);
      setValue('name', data.name);
      setValue('country', filterCountry(data.country));
      setValue('latitude', data.latitude || undefined);
      setValue('longitude', data.longitude || undefined);
      setValue('gmtOffset', data.gmtOffset || undefined);
      setValue('isEuroFlag', data?.isEuroFlag);
      setValue('isBunkerPort', data?.isBunkerPort);
      setValue('portType', data.portType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', {
              message: renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['The port code is existed'],
              ),
            });
            break;
          case 'name':
            setError('name', {
              message: renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['The port name is existed'],
              ),
            });
            break;

          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('name', { message: '' });
    }
  }, [dynamicLabels, errorList, setError]);

  useEffect(() => {
    dispatch(getGMTActions.request());
    dispatch(getCountryActions.request({ content: '' }));
  }, [dispatch]);

  // render
  return loading && !data && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <Container>
      <div className="pb-4">
        <div className="container__subtitle">
          {renderDynamicLabel(
            dynamicLabels,
            PORT_FIELDS_DETAILS['Port information'],
          )}
        </div>
        <Row className="mx-0">
          <Col className="p-0 me-3">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['Port code'],
              )}
              readOnly={!isEdit || loading}
              disabledCss={!isEdit || loading}
              isRequired
              placeholder={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['Enter port code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MaxLength.MAX_LENGTH_CODE}
            />
          </Col>
          <Col className="p-0 mx-3">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['Port name'],
              )}
              {...register('name')}
              isRequired
              disabledCss={loading || !isEdit}
              readOnly={loading || !isEdit}
              messageRequired={errors?.name?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['Enter port name'],
              )}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
            />
          </Col>
          <Col className="p-0 ms-3">
            <AsyncSelectForm
              disabled={!isEdit || loading}
              isRequired
              className="w-100"
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS.Country,
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['Please select'],
              )}
              searchContent={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS.Search,
              )}
              name="country"
              messageRequired={errors?.country?.message || ''}
              control={control}
              onChangeSearch={(value: string) =>
                dispatch(getCountryActions.request({ content: value }))
              }
              options={countryOptionProps}
              dynamicLabels={dynamicLabels}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="p-0 me-3 modal__list-form">
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['Port type'],
              )}
              data={portTypeOptions}
              disabled={!isEdit || loading}
              name="portType"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['Please select'],
              )}
              dynamicLabels={dynamicLabels}
            />
          </Col>
          <Col className="p-0 mx-3">
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['GMT offset'],
              )}
              data={GMTOptionProps}
              disabled={!isEdit || loading}
              name="gmtOffset"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              notAllowSortData
              placeholder={renderDynamicLabel(
                dynamicLabels,
                PORT_FIELDS_DETAILS['Please select'],
              )}
              dynamicLabels={dynamicLabels}
            />
          </Col>
          <Col className="p-0 ms-3">
            <div
              className={cx(
                styles.labelSelect,
                'd-flex align-items-start pb-2',
              )}
            >
              <span className={styles.label}>
                {renderDynamicLabel(dynamicLabels, PORT_FIELDS_DETAILS.Status)}{' '}
              </span>
            </div>
            <SelectUI
              data={statusOptions}
              disabled={!isEdit || loading}
              name="status"
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isEdit },
                'w-100',
              )}
              control={control}
            />
          </Col>
        </Row>

        <Row className="pt-3 mx-0">
          <Col className="ps-0">
            <Row>
              <Col>
                <ToggleSwitch
                  disabled={!isEdit || loading}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    PORT_FIELDS_DETAILS['Bunkering port'],
                  )}
                  control={control}
                  name="isBunkerPort"
                />
              </Col>
              <Col>
                <ToggleSwitch
                  disabled={!isEdit || loading}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    PORT_FIELDS_DETAILS['Europe flag'],
                  )}
                  control={control}
                  name="isEuroFlag"
                />
              </Col>
            </Row>
          </Col>
          <Col className="pe-0" />
        </Row>

        <Row className="pt-3 mx-0">
          <Col className="ps-0">
            <InputCoordinateForm
              disabled={!isEdit || loading}
              name="latitude"
              isRequired
              coordinateType={CoordinateType.LATITUDE}
              control={control}
              messageRequired={errors?.latitude?.message}
              dynamicLabels={dynamicLabels}
            />
          </Col>
          <Col className="pe-0">
            <InputCoordinateForm
              disabled={!isEdit || loading}
              name="longitude"
              isRequired
              coordinateType={CoordinateType.LONGITUDE}
              control={control}
              messageRequired={errors?.longitude?.message}
              dynamicLabels={dynamicLabels}
            />
          </Col>
        </Row>
      </div>
      {isEdit && (
        <GroupButton
          className={styles.GroupButton}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={!isEdit || loading}
          dynamicLabels={dynamicLabels}
        />
      )}
    </Container>
  );
};

export default PortManagementForm;
