import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import { statusOptions } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import {
  CreateShoreBody,
  ShoreDepartment,
} from 'models/api/shore-department/shore-department.model';
import { FC, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { clearErrorMessages } from 'store/shore-department/shore-department.action';
import * as yup from 'yup';
import styles from './form.module.scss';

interface ShoreDepartmentFormProps {
  isEdit?: boolean;
  isDetail?: boolean;
  data?: ShoreDepartment;
  onSubmit: (body: CreateShoreBody) => void;
  isCreate?: boolean;
  loadingDetail?: boolean;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  status: 'active',
};

const ShoreDepartmentForm: FC<ShoreDepartmentFormProps> = ({
  isEdit,
  isDetail,
  data,
  onSubmit,
  isCreate,
  loadingDetail,
}) => {
  const { t } = useTranslation([
    I18nNamespace.SHORE_DEPARTMENT,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { messageError } = useSelector((store) => store.shoreDepartment);

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('errors.required')),
    name: yup.string().trim().nullable().required(t('errors.required')),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name || '');
      setValue('description', data.description || '');
      setValue('status', data.status || 'active');
    }
    return () => {
      dispatch(clearErrorMessages());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (messageError?.length) {
      messageError.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: item.message });
            break;
          case 'name':
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageError]);

  const onSubmitForm = (data) => {
    const formData = {
      name: data.name,
      code: data.code,
      description: data.description,
      status: data.status,
    };

    onSubmit(formData);
  };

  const handleCancel = () => {
    showConfirmBase({
      isDelete: false,
      txTitle: t('modal.cancelTitle'),
      txMsg: t('modal.cancelMessage'),
      onPressButtonRight: () => history.push(AppRouteConst.SHORE_DEPARTMENT),
    });
  };

  return loadingDetail && !isCreate ? (
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
        <p className={cx('fw-bold', styles.titleForm)}>
          {t('txShoreDepartment')}
        </p>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('shoreDepartmentCodeForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={isDetail}
              placeholder={t('codePlaceholder')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('shoreDepartmentNameForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              {...register('name')}
              isRequired
              readOnly={isDetail}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('namePlaceholder')}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('description')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={isDetail}
              placeholder={t('descriptionPlaceholder')}
              {...register('description')}
              maxLength={250}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <div
              className={cx(
                styles.labelSelect,
                'd-flex align-items-start pb-2',
              )}
            >
              <span className={styles.label}>{t('status')} </span>
            </div>
            <SelectUI
              data={statusOptions}
              disabled={isDetail}
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
      </div>
      {!isDetail && (
        <GroupButton
          className={styles.GroupButton}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={isDetail}
        />
      )}
    </div>
  );
};

ShoreDepartmentForm.defaultProps = {
  isEdit: false,
  isDetail: false,
  data: undefined,
};

export default ShoreDepartmentForm;
