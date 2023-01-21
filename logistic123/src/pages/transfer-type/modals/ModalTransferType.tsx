import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { I18nNamespace } from 'constants/i18n.const';
import cx from 'classnames';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_OPTIONAL,
  MAX_LENGTH_TEXT,
} from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { checkExitCodeApi } from 'api/event-type.api';
import { TransferType } from '../utils/model';
import styles from './modal-transfer.module.scss';
import { createTransferTypeActions } from '../store/action';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: TransferType;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  status: 'active',
};

const ModalTransferType: FC<ModalProps> = (props) => {
  const {
    loading,
    isCreate,
    toggle,
    title,
    isOpen,
    data,
    handleSubmitForm,
    isView,
  } = props;
  const { errorList } = useSelector((state) => state.transferType);
  const { t } = useTranslation([
    I18nNamespace.TRANSFER_TYPE,
    I18nNamespace.COMMON,
  ]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        code: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
        name: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const resetForm = useCallback(() => {
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('status', 'active');
  }, [setValue]);

  const dispatch = useDispatch();

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
    clearErrors();
    dispatch(createTransferTypeActions.failure(null));
  }, [clearErrors, resetForm, toggle, dispatch]);

  const onSubmitForm = useCallback(
    (formData: TransferType) => handleSubmitForm({ ...formData, resetForm }),
    [handleSubmitForm, resetForm],
  );

  const handleSubmitAndNew = useCallback(
    (data: TransferType) => {
      const dataNew: TransferType = { ...data, isNew: true, resetForm };
      handleSubmitForm(dataNew);
    },
    [handleSubmitForm, resetForm],
  );

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (!isCreate) {
        return;
      }
      if (field && value) {
        checkExitCodeApi({
          entity: 'transfer-type',
          field,
          value,
        })
          .then((res) => {
            if (res.data.isExist) {
              switch (field) {
                case 'code':
                  if (value !== data?.code) {
                    setError(field, {
                      message: t('transferTypeCodeIsExisted'),
                    });
                  }
                  break;
                case 'name':
                  if (value !== data?.name) {
                    setError(field, {
                      message: t('transferTypeNameIsExisted'),
                    });
                  }
                  break;
                default:
                  setError(field, { message: '' });
                  break;
              }
            }
          })
          .catch((err) => {
            setError(field, { message: '' });
          });
      }
    },
    [data?.code, data?.name, isCreate, setError, t],
  );

  const renderForm = useMemo(
    () => (
      <div>
        <Row className="pt-2 pb-3">
          <Col
            className={cx(styles.wrapLabel, 'd-flex align-items-center')}
            md={3}
            xs={3}
          >
            <LabelUI label={t('transferTypeCodeForm')} isRequired />
          </Col>
          <Col className="" md={9} xs={9}>
            <Input
              disabled={loading || isView}
              autoFocus
              isRequired
              placeholder={t('placeholderTransferTypeCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
              onBlur={(e: any) => handleCheckExit('code', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 pb-3">
          <Col
            className={cx(styles.wrapLabel, 'd-flex align-items-center')}
            md={3}
            xs={3}
          >
            <LabelUI label={t('transferTypeNameForm')} isRequired />
          </Col>
          <Col className="" md={9} xs={9}>
            <Input
              {...register('name')}
              isRequired
              disabled={loading || isView}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeholderTransferTypeName')}
              maxLength={MAX_LENGTH_TEXT}
              onBlur={(e: any) => handleCheckExit('name', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 pb-3">
          <Col
            className={cx(styles.wrapLabel, 'd-flex align-items-center')}
            md={3}
            xs={3}
          >
            <LabelUI label={t('description')} />
          </Col>
          <Col className="" md={9} xs={9}>
            <Input
              {...register('description')}
              disabled={loading || isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={t('txPlaceHolderDescription')}
            />
          </Col>
        </Row>
        <Row className="pt-2">
          <Col
            className={cx(styles.wrapLabel, 'd-flex align-items-center')}
            md={3}
            xs={3}
          >
            <LabelUI label={t('status')} />
          </Col>
          <Col className=" d-flex" md={9} xs={9}>
            <RadioForm
              name="status"
              control={control}
              disabled={isView}
              radioOptions={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Col>
        </Row>
      </div>
    ),
    [
      t,
      loading,
      isView,
      errors?.code?.message,
      errors?.name?.message,
      register,
      control,
      handleCheckExit,
    ],
  );

  const renderFooter = useMemo(
    () => (
      <div>
        <GroupButton
          className="mt-1 justify-content-end"
          handleCancel={handleCancel}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
          disable={loading}
        />
      </div>
    ),
    [handleCancel, handleSubmit, handleSubmitAndNew, loading, onSubmitForm],
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('description', '');
      setValue('status', 'active');
    }
  }, [data, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: t('transferTypeCodeIsExisted') });
            break;
          case 'name':
            setError('name', { message: t('transferTypeNameIsExisted') });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('name', { message: '' });
    }
  }, [errorList, setError, t]);

  return (
    <ModalComponent
      w={600}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm}
      footer={!isView && renderFooter}
    />
  );
};

export default ModalTransferType;
