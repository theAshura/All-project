import cx from 'classnames';
import { useEffect, FC, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import { statusOptions } from 'constants/filter.const';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import Input from 'components/ui/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import SelectUI from 'components/ui/select/Select';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import images from 'assets/images/images';

import { PSCDeficiency } from 'models/api/psc-deficiency/psc-deficiency.model';
import { clearPSCDeficiencyErrorsReducer } from 'store/psc-deficiency/psc-deficiency.action';
import isEqual from 'lodash/isEqual';
import styles from './form.module.scss';

interface PSCFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: PSCDeficiency;
  onSubmit: (CreatePSCParams) => void;
}

const defaultValues = {
  code: '',
  description: '',
  status: 'active',
};

const PSCForm: FC<PSCFormProps> = ({ isEdit, data, onSubmit, isCreate }) => {
  const { t } = useTranslation([
    I18nNamespace.PSC_DEFICIENCY,
    I18nNamespace.PSC_DEFICIENCY,
  ]);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('errors.required')),
    description: yup.string().trim().nullable().required(t('errors.required')),
  });

  const { errorList, loading } = useSelector((state) => state.pscDeficiency);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetDefault = (defaultParams) => {
    reset(defaultParams);
    history.goBack();
  };

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const params = getValues();

    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      defaultParams = {
        code: data.code,
        description: data.description,
        status: data.status,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.PSC_DEFICIENCY);
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
            ? history.push(AppRouteConst.PSC_DEFICIENCY)
            : resetDefault(defaultParams),
      });
    }
  }, [data, getValues, isCreate, resetDefault, t]);

  const resetForm = () => {
    // reset(data)
    setValue('code', '');
    setValue('description', '');
    setValue('status', 'active');
  };

  const handleSubmitAndNew = (data: PSCDeficiency) => {
    const dataNew: PSCDeficiency = { ...data, isNew: true, resetForm };
    onSubmit(dataNew);
  };

  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('description', data.description);
      setValue('status', data.status);
    }
    return () => {
      dispatch(clearPSCDeficiencyErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: item.message });
            break;
          case 'description':
            setError('description', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('description', { message: '' });
    }
  }, [errorList, setError]);

  const onSubmitForm = (data) => {
    onSubmit(data);
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
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className={cx('fw-bold', styles.titleForm)}>
          {t('txPSCInformation')}
        </div>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('txPSCCode')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={t('placeHolder.txPSCCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              isRequired
              label={t('txDescription')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={t('placeHolder.txDescription')}
              messageRequired={errors?.description?.message || ''}
              {...register('description')}
              maxLength={250}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              labelSelect={t('txStatus')}
              data={statusOptions}
              disabled={!isEdit}
              name="status"
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isEdit },
                'w-100',
              )}
              control={control}
            />
          </Col>
          <Col className={cx('p-0 ms-3')} />
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
          disable={!isEdit}
        />
      )}
    </div>
  );
};

export default PSCForm;
