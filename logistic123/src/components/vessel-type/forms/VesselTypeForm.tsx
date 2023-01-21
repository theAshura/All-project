import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import { MAX_LENGTH_TEXT } from 'constants/common.const';
import { statusOptions, vettingOptions } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import isEqual from 'lodash/isEqual';
import { VesselType } from 'models/api/vessel-type/vessel-type.model';
import { FC, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import styles from './form.module.scss';

interface VesselTypeFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: VesselType;
  onSubmit: (CreateVesselTypeParams: VesselType) => void;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  vettingRiskScore: null,
  status: 'active',
};

const VesselTypeForm: FC<VesselTypeFormProps> = ({
  isEdit,
  isCreate,
  data,
  onSubmit,
}) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_TYPE,
    I18nNamespace.COMMON,
  ]);
  const { loading, errorList } = useSelector((state) => state.vesselType);

  const schema = yup.object().shape({
    code: yup.string().nullable().trim().required(t('txFieldRequired')),
    name: yup.string().nullable().trim().required(t('txFieldRequired')),
    vettingRiskScore: yup
      .string()
      .nullable()
      .trim()
      .required(t('txFieldRequired')),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',

    defaultValues,
    resolver: yupResolver(schema),
  });

  // function
  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('vettingRiskScore', null);
    setValue('status', 'active');
  };

  const onSubmitForm = (data: VesselType) => {
    onSubmit(data);
  };

  const handleSubmitAndNew = (data: VesselType) => {
    const dataNew: VesselType = { ...data, isNew: true, resetForm };
    onSubmit(dataNew);
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
        description: data.description,
        vettingRiskScore: data.vettingRiskScore,
        status: data.status,
      };
    }
    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.VESSEL_TYPE);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.VESSEL_TYPE)
            : resetDefault(defaultParams),
      });
    }
  };

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('vettingRiskScore', data.vettingRiskScore);
      setValue('status', data.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: t('txVesselTypeCodeExist') });
            break;
          case 'name':
            setError('name', { message: t('txVesselTypeNameExist') });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('name', { message: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  // render
  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <p className={cx('fw-bold', styles.titleForm)}>{t('txVesselInfo')}</p>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <Input
              label={t('txVesselTypeCodeForm')}
              readOnly={!isEdit || loading}
              disabledCss={!isEdit || loading}
              isRequired
              placeholder={t('txPlaceHolderVesselCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={t('txVesselTypeNameForm')}
              {...register('name')}
              isRequired
              readOnly={!isEdit || loading}
              disabledCss={!isEdit || loading}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('txPlaceHolderVesselName')}
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <SelectUI
              labelSelect={t('txVettingManagementRiskForm')}
              isRequired
              data={vettingOptions}
              disabled={!isEdit || loading}
              name="vettingRiskScore"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.vettingRiskScore?.message || ''}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={t('txDescription')}
              {...register('description')}
              disabled={!isEdit || loading}
              placeholder={isEdit && t('txPlaceHolderDescription')}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <SelectUI
              labelSelect={t('txStatusFilter')}
              data={statusOptions}
              disabled={!isEdit || loading}
              name="status"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
            />
          </Col>
          <Col className="pe-0" />
        </Row>
      </div>
      {isEdit && (
        <GroupButton
          className={styles.GroupButton}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={
            isCreate ? handleSubmit(handleSubmitAndNew) : undefined
          }
          disable={!isEdit || loading}
        />
      )}
    </div>
  );
};

export default VesselTypeForm;
