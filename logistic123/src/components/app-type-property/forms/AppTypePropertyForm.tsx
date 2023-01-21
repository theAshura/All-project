import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import Container from 'components/common/container/Container';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { fieldsATPForm, MaxLength } from 'constants/common.const';
import { APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD } from 'constants/dynamic/appTypeProperty.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { lifeSpanOptions, NetWorkModeOptions } from 'constants/filter.const';
import { AppRouteConst } from 'constants/route.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import history from 'helpers/history.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import isEqual from 'lodash/isEqual';
import { AppTypeProperty } from 'models/api/app-type-property/app-type-property.model';
import { FC, useCallback, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { clearAppTypePropertyErrorsReducer } from 'store/app-type-property/app-type-property.action';
import * as yup from 'yup';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './form.module.scss';

interface AppTypePropertyFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: AppTypeProperty;
  onSubmit: (CreateAppTypePropertyParams) => void;
}

const defaultValues = {
  USBPath: '',
  androidVersion: '',
  appCode: '',
  appName: '',
  autoDeactive: undefined,
  autoPurge: undefined,
  dataLifeSpan: undefined,
  downloadLimit: undefined,
  eligibleSyncLocation: '',
  enableVesselFieldAudit: undefined,
  fileValidity: undefined,
  iOSVersion: '',
  isAutoFlush: undefined,
  networkMode: undefined,
  windowsVersion: '',
};

const AppTypePropertyForm: FC<AppTypePropertyFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  const dispatch = useDispatch();

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAppTypeProperty,
    modulePage: isEdit ? ModulePage.Edit : ModulePage.View,
  });
  const schema = yup.object().shape({
    appName: yup
      .string()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    autoPurge: yup
      .number()
      .nullable()
      .max(
        30000,
        renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
            'Auto purge must not be greater than 30000'
          ],
        ),
      )
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .typeError(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    fileValidity: yup
      .number()
      .nullable()
      .max(
        30000,
        renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
            'File validity must not be greater than 30000'
          ],
        ),
      )
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .typeError(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    dataLifeSpan: yup
      .number()
      .nullable()
      .max(
        30000,
        renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
            'Data life span must not be greater than 30000'
          ],
        ),
      )
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .typeError(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    autoDeactive: yup
      .number()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .max(
        30000,
        renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
            'Auto de-active must not be greater than 30000'
          ],
        ),
      )
      .typeError(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    USBPath: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    downloadLimit: yup
      .number()
      .nullable()
      .max(
        30000,
        renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
            'Download limit must not be greater than 30000'
          ],
        ),
      )
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .typeError(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const { errorList, loading } = useSelector((state) => state.appTypeProperty);

  const {
    register,
    control,
    handleSubmit,
    setError,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetDefault = useCallback(
    (defaultParams) => {
      reset(defaultParams);
      history.goBack();
    },
    [reset],
  );

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const params = getValues();
    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      fieldsATPForm.forEach((item) => {
        defaultParams = { ...defaultParams, [item]: data[item] };
      });
    }
    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.APP_TYPE_PROPERTY);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Confirmation?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
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
            ? history.push(AppRouteConst.APP_TYPE_PROPERTY)
            : resetDefault(defaultParams),
      });
    }
  }, [data, dynamicLabels, getValues, isCreate, resetDefault]);

  useEffect(() => {
    if (data) {
      fieldsATPForm.forEach((item) => {
        setValue(item, data[item]);
      });
    }
    return () => {
      dispatch(clearAppTypePropertyErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'appCode':
            setError('appCode', { message: item.message });
            break;
          case 'appName':
            setError('appName', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('appCode', { message: '' });
      setError('appName', { message: '' });
    }
  }, [errorList, setError]);

  const onSubmitForm = (dataSubmit) => {
    onSubmit({
      ...dataSubmit,
      appCode: data.appCode,
      eligibleSyncLocation: data.eligibleSyncLocation,
    });
  };

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <Container>
      <div className={cx(styles.containerForm)}>
        <div className={cx('fw-bold', styles.titleForm)}>
          {renderDynamicLabel(
            dynamicLabels,
            APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
              'App type property information'
            ],
          )}
        </div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['App code'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly
              disabledCss
              placeholder={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['App code'],
              )}
              messageRequired={errors?.appCode?.message || ''}
              {...register('appCode')}
              maxLength={20}
            />
          </Col>
          <Col>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['App name'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              disabledCss={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Enter app name'],
              )}
              messageRequired={errors?.appName?.message || ''}
              {...register('appName')}
              maxLength={MaxLength.MAX_LENGTH_TEXT}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Sync location'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly
              disabledCss
              placeholder={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Enter sync location'],
              )}
              messageRequired={errors?.eligibleSyncLocation?.message || ''}
              {...register('eligibleSyncLocation')}
              maxLength={MaxLength.MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Auto purge [day(s)]'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              disabledCss={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Enter auto purge'],
              )}
              messageRequired={errors?.autoPurge?.message || ''}
              {...register('autoPurge')}
              type="number"
              pattern="[0-9]*"
              maxLength={MaxLength.MAX_LENGTH_NUMBER}
            />
          </Col>
          <Col>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['File validity [day(s)]'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              messageRequired={errors?.fileValidity?.message || ''}
              readOnly={!isEdit}
              disabledCss={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Enter file validity'],
              )}
              {...register('fileValidity')}
              type="number"
              pattern="[0-9]*"
              maxLength={MaxLength.MAX_LENGTH_NUMBER}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
                  'Auto de-active [day(s)]'
                ],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              messageRequired={errors?.autoDeactive?.message || ''}
              readOnly={!isEdit}
              disabledCss={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Enter auto de-active'],
              )}
              {...register('autoDeactive')}
              type="number"
              pattern="[0-9]*"
              maxLength={MaxLength.MAX_LENGTH_NUMBER}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              isRequired
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
                  'Data life span [month(s)]'
                ],
              )}
              data={lifeSpanOptions}
              disabled={!isEdit}
              name="dataLifeSpan"
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isEdit },
                'w-100',
              )}
              control={control}
            />
          </Col>
          <Col>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['USB path'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              disabledCss={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Enter USB path'],
              )}
              {...register('USBPath')}
              maxLength={MaxLength.MAX_LENGTH_TEXT}
              messageRequired={errors?.USBPath?.message || ''}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Download limit [MB]'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              disabledCss={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Enter download limit'],
              )}
              {...register('downloadLimit')}
              type="number"
              pattern="[0-9]*"
              maxLength={MaxLength.MAX_LENGTH_NUMBER}
              messageRequired={errors?.downloadLimit?.message || ''}
            />
          </Col>
        </Row>

        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <ToggleSwitch
              isRequired
              disabled={!isEdit}
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Auto flush'],
              )}
              control={control}
              name="isAutoFlush"
            />
          </Col>
          <Col>
            <ToggleSwitch
              isRequired
              disabled={!isEdit}
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
                  'Enable vessel field inspection'
                ],
              )}
              control={control}
              name="enableVesselFieldAudit"
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <RadioForm
              isRequired
              disabled={!isEdit}
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD.Network,
              )}
              name="networkMode"
              control={control}
              radioOptions={NetWorkModeOptions}
              messageRequired={errors?.networkMode?.message || ''}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Android app version'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly
              disabledCss
              placeholder={
                isEdit
                  ? renderDynamicLabel(
                      dynamicLabels,
                      APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
                        'Enter android app version'
                      ],
                    )
                  : ''
              }
              {...register('androidVersion')}
              messageRequired={errors?.androidVersion?.message || ''}
            />
          </Col>
          <Col>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['IOS app version'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly
              disabledCss
              placeholder={
                isEdit
                  ? renderDynamicLabel(
                      dynamicLabels,
                      APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
                        'Enter IOS app version'
                      ],
                    )
                  : ''
              }
              {...register('iOSVersion')}
              messageRequired={errors?.iOSVersion?.message || ''}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD['Windows app version'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly
              disabledCss
              placeholder={
                isEdit
                  ? renderDynamicLabel(
                      dynamicLabels,
                      APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD[
                        'Enter windows app version'
                      ],
                    )
                  : ''
              }
              {...register('windowsVersion')}
              messageRequired={errors?.windowsVersion?.message || ''}
            />
          </Col>
        </Row>
      </div>
      {isEdit && (
        <GroupButton
          className={styles.GroupButton}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={!isEdit}
          txButtonLeft={renderDynamicLabel(
            dynamicLabels,
            APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD.Cancel,
          )}
          txButtonBetween={renderDynamicLabel(
            dynamicLabels,
            APP_TYPE_PROPERTY_DETAIL_MODULE_FIELD.Save,
          )}
        />
      )}
    </Container>
  );
};

export default AppTypePropertyForm;
