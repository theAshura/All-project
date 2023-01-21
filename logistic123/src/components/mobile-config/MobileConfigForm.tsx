import { yupResolver } from '@hookform/resolvers/yup';
import { updateMobileConfigActionsApi } from 'api/mobile-config.api';
import images from 'assets/images/images';
import cx from 'classnames';
import Container from 'components/common/container/Container';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { MOBILE_CONFIG_DYNAMIC_FIELDS } from 'constants/dynamic/mobileConfig.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { toastError } from 'helpers/notification.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { MobileConfig } from 'models/api/mobile-config/mobile-config';
import { FC, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import styles from './mobile-config-form.module.scss';

interface MobileConfigFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: MobileConfig;
  loading?: boolean;
  setEdit?: (isEdit) => void;
}

const defaultValues = {
  code: '',
  name: '',
  status: 'active',
};

const MobileConfigForm: FC<MobileConfigFormProps> = ({
  isEdit,
  data,
  loading,
  isCreate,
  setEdit,
}) => {
  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionMobileconfig,
    modulePage: getCurrentModulePageByStatus(false, false),
  });

  const schema = yup.object().shape({
    shoreUrlIP: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    shoreUrlActual: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const [QR, setQR] = useState<string>('');
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const onSubmitForm = (data) => {
    updateMobileConfigActionsApi(data)
      .then((res) => {
        setEdit(false);
      })
      .catch((error) => toastError(error));
  };

  const handleCancel = () => {
    setEdit(false);
  };

  useEffect(() => {
    if (data) {
      setValue('shoreUrlIP', data.shoreUrlIP || '');
      setValue('shoreUrlActual', data.shoreUrlActual);
      setValue('companyName', data.companyName);
      setValue('companyCode', data.companyCode);
      setQR(
        `${data.shoreUrlIP}##${data.shoreUrlActual}##${data.companyCode}##${data.companyName}##${data.type}##${data.groupCode}##${data.groupName}##${data.serverTime}`,
      );
    }
  }, [data, setValue]);

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
            dynamicFields,
            MOBILE_CONFIG_DYNAMIC_FIELDS['Mobile config information'],
          )}
        </div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                MOBILE_CONFIG_DYNAMIC_FIELDS['Shore URL (IP)'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              disabled={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                MOBILE_CONFIG_DYNAMIC_FIELDS['Enter Shore URL (IP)'],
              )}
              messageRequired={errors?.shoreUrlIP?.message || ''}
              {...register('shoreUrlIP')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                MOBILE_CONFIG_DYNAMIC_FIELDS['Shore URL (Actual)'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              {...register('shoreUrlActual')}
              disabled={!isEdit}
              messageRequired={errors?.shoreUrlActual?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicFields,
                MOBILE_CONFIG_DYNAMIC_FIELDS['Enter Shore URL (Actual)'],
              )}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                MOBILE_CONFIG_DYNAMIC_FIELDS['Company code'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              disabled={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                MOBILE_CONFIG_DYNAMIC_FIELDS['Enter company code'],
              )}
              messageRequired={errors?.companyCode?.message || ''}
              {...register('companyCode')}
              maxLength={250}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                MOBILE_CONFIG_DYNAMIC_FIELDS['Company name'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              disabled={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                MOBILE_CONFIG_DYNAMIC_FIELDS['Enter company name'],
              )}
              messageRequired={errors?.companyName?.message || ''}
              {...register('companyName')}
              maxLength={250}
            />
          </Col>
        </Row>
        <div className={cx('d-flex justify-content-center', styles.QRCode)}>
          <QRCode value={QR} size={200} />
        </div>
        {isEdit && (
          <GroupButton
            className={cx(styles.GroupButton, 'mt-4')}
            handleCancel={handleCancel}
            handleSubmit={handleSubmit(onSubmitForm)}
            txButtonRight={renderDynamicLabel(
              dynamicFields,
              MOBILE_CONFIG_DYNAMIC_FIELDS.Save,
            )}
            disable={!isEdit}
            txButtonLeft={renderDynamicLabel(
              dynamicFields,
              MOBILE_CONFIG_DYNAMIC_FIELDS.Cancel,
            )}
          />
        )}
      </div>
    </Container>
  );
};

export default MobileConfigForm;
