import cx from 'classnames';
import { useEffect, FC, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import { scopeOptions } from 'constants/filter.const';
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
import isEqual from 'lodash/isEqual';
import { clearAuditTypeErrorsReducer } from '../../../store/audit-type/audit-type.action';
import {
  AuditType,
  AuditTypeDetailResponse,
} from '../../../models/api/audit-type/audit-type.model';
import styles from './form.module.scss';

interface AuditTypeFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: AuditTypeDetailResponse;
  onSubmit: (CreateAuditTypeParams) => void;
}

const defaultValues = {
  code: '',
  name: '',
  scope: 'internal',
};

const AuditTypeForm: FC<AuditTypeFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  const { t } = useTranslation(I18nNamespace.AUDIT_TYPE);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
  });

  const { errorList, loading } = useSelector((state) => state.auditType);

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    getValues,
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
      defaultParams = {
        code: data.code,
        name: data.name,
        scope: data.scope,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.AUDIT_TYPE);
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
            ? history.push(AppRouteConst.AUDIT_TYPE)
            : resetDefault(defaultParams),
      });
    }
  }, [data, getValues, isCreate, resetDefault, t]);
  const resetForm = () => {
    // reset(data)
    setValue('code', '');
    setValue('name', '');
    setValue('scope', 'internal');
  };

  const handleSubmitAndNew = (data: AuditType) => {
    const dataNew: AuditType = { ...data, isNew: true, resetForm };
    onSubmit(dataNew);
  };

  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('scope', data.scope);
    }
    return () => {
      dispatch(clearAuditTypeErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'auditCode':
            setError('code', { message: item.message });
            break;
          case 'auditName':
            setError('name', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('name', { message: '' });
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
          {t('auditTypeInformation')}
        </div>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('auditCodeForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              disabledCss={!isEdit}
              placeholder={t('placeholderAuditCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={128}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('auditNameForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              {...register('name')}
              isRequired
              disabled={!isEdit}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeholderAuditName')}
              maxLength={128}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <div
              className={cx(
                styles.labelSelect,
                'd-flex align-items-start pb-2',
              )}
            >
              <span className={styles.label}>{t('scope')} </span>
              {/* <img src={images.icons.icRequiredAsterisk} alt="required" /> */}
            </div>
            <SelectUI
              data={scopeOptions}
              disabled={!isEdit}
              name="scope"
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isEdit },
                'w-100',
              )}
              control={control}
            />
          </Col>
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

export default AuditTypeForm;
