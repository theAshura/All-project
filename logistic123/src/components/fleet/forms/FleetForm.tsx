import cx from 'classnames';
import { useEffect, FC } from 'react';
import { Col, Row } from 'reactstrap';
import { statusOptions } from 'constants/filter.const';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import Input from 'components/ui/input/Input';
import { useSelector, useDispatch } from 'react-redux';
import SelectUI from 'components/ui/select/Select';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import images from 'assets/images/images';
import isEqual from 'lodash/isEqual';
import { clearFleetErrorsReducer } from '../../../store/fleet/fleet.action';
import {
  FleetDetailResponse,
  Fleet,
} from '../../../models/api/fleet/fleet.model';
import styles from './form.module.scss';

interface FleetFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: FleetDetailResponse;
  onSubmit: (CreateFleetParams) => void;
  loading?: boolean;
}

const defaultValues = {
  code: '',
  name: '',
  status: 'active',
};

const FleetForm: FC<FleetFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
  loading,
}) => {
  const { t } = useTranslation(I18nNamespace.FLEET);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
  });

  const { errorList } = useSelector((state) => state.fleet);

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
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('status', data.status);
    }
    return () => {
      dispatch(clearFleetErrorsReducer());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: t('fleetCodeIsExisted') });
            break;
          case 'name':
            setError('name', { message: t('fleetNameIsExisted') });
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

  const onSubmitForm = (data) => {
    const formData = {
      name: data.name,
      code: data.code,
      status: data.status,
    };

    onSubmit(formData);
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
      };
    }
    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.FLEET);
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
            ? history.push(AppRouteConst.FLEET)
            : resetDefault(defaultParams),
      });
    }
  };

  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('status', 'active');
  };

  const handleSubmitAndNew = (data: Fleet) => {
    const dataNew: Fleet = { ...data, isNew: true, resetForm };
    onSubmit(dataNew);
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
          {t('fleetInformation')}
        </div>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('fleetCodeForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={t('placeholderFleetCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={128}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('fleetNameForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              {...register('name')}
              isRequired
              readOnly={!isEdit}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeholderFleetName')}
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
              <span className={styles.label}>{t('status')} </span>
              {/* <img src={images.icons.icRequiredAsterisk} alt="required" /> */}
            </div>
            <SelectUI
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

export default FleetForm;
