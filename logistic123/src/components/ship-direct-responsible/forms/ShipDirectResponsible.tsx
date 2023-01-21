import cx from 'classnames';
import { useEffect, FC } from 'react';
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
import { clearShipDirectResponsibleErrorsReducer } from '../../../store/ship-direct-responsible/ship-direct-responsible.action';
import {
  ShipDirectResponsible,
  ShipDirectResponsibleDetailResponse,
} from '../../../models/api/ship-direct-responsible/ship-direct-responsible.model';
import styles from './form.module.scss';

interface ShipDirectResponsibleFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: ShipDirectResponsibleDetailResponse;
  onSubmit: (CreateShipDirectResponsibleParams) => void;
}

const defaultValues = {
  code: '',
  name: '',
  status: 'active',
};

const ShipDirectResponsibleForm: FC<ShipDirectResponsibleFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  const { t } = useTranslation(I18nNamespace.LOCATION);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
  });

  const { errorList } = useSelector((state) => state.shipDirectResponsible);

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

  const handleCancel = () => {
    if (!isEdit) {
      history.push(AppRouteConst.LOCATION);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => history.push(AppRouteConst.LOCATION),
      });
    }
  };
  const resetForm = () => {
    // reset(data)
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('status', 'active');
  };

  const handleSubmitAndNew = (data: ShipDirectResponsible) => {
    const dataNew: ShipDirectResponsible = { ...data, isNew: true, resetForm };
    onSubmit(dataNew);
  };

  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('status', data.status);
    }
    return () => {
      dispatch(clearShipDirectResponsibleErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
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
  }, [errorList, setError]);

  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <p className={cx('fw-bold', styles.titleForm)}>
          {t('generalInformation')}
        </p>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('codeForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={t('placeholderCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('nameForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              {...register('name')}
              isRequired
              readOnly={!isEdit}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeholderName')}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('description')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={t('placeholderDescription')}
              messageRequired={errors?.description?.message || ''}
              {...register('description')}
              maxLength={250}
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
      {/* <ModalConfirm
        toggle={() => setModal(!modal)}
        modal={modal}
        handleSubmit={() => history.push(AppRouteConst.SHIP-DIRECT-RESPONSIBLE)}
        title={t('cancelTitle')}
        content={t('cancelMessage')}
      /> */}
    </div>
  );
};

export default ShipDirectResponsibleForm;