import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_NAME,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { VesselType } from 'models/api/vessel-type/vessel-type.model';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { CharterOwner } from 'models/api/charter-owner/charter-owner.model';
import { checkExitCodeApi } from 'api/event-type.api';

interface ModalOwnerBusinessProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: VesselType;
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

const ModalOwnerBusiness: FC<ModalOwnerBusinessProps> = (props) => {
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
  const { errorList } = useSelector((state) => state.ownerBusiness);
  const { t } = useTranslation([
    I18nNamespace.OWNER_BUSINESS,
    I18nNamespace.COMMON,
  ]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        description: yup.string().trim().nullable(),
        code: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
        name: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleCancel = useCallback(() => {
    toggle();
    reset(defaultValues);
    clearErrors();
  }, [reset, toggle, clearErrors]);

  const resetForm = useCallback(() => {
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('status', 'active');
  }, [setValue]);

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (!isCreate) {
        return;
      }
      if (field && value) {
        checkExitCodeApi({
          entity: 'owner-business',
          field,
          value,
        })
          .then((res) => {
            if (res.data.isExist) {
              switch (field) {
                case 'code':
                  if (value !== data?.code) {
                    setError(field, {
                      message: t('ownerBusinessCodeIsExisted'),
                    });
                  }
                  break;
                case 'name':
                  if (value !== data?.name) {
                    setError(field, {
                      message: t('ownerBusinessNameIsExisted'),
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

  const onSubmitForm = useCallback(
    (formData: CharterOwner) => handleSubmitForm({ ...formData, resetForm }),
    [handleSubmitForm, resetForm],
  );

  const handleSubmitAndNew = useCallback(
    (data: CharterOwner) => {
      const dataNew: CharterOwner = { ...data, isNew: true, resetForm };
      handleSubmitForm(dataNew);
    },
    [handleSubmitForm, resetForm],
  );

  const renderForm = useMemo(
    () => (
      <>
        <div>
          <Row className="pt-2 mx-0">
            <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('codeForm')} isRequired />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <Input
                disabled={loading || isView}
                autoFocus
                isRequired
                placeholder={t('placeholderCode')}
                messageRequired={errors?.code?.message}
                {...register('code')}
                maxLength={MAX_LENGTH_CODE}
                onBlur={(e: any) => handleCheckExit('code', e.target.value)}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('nameForm')} isRequired />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <Input
                {...register('name')}
                isRequired
                disabled={loading || isView}
                messageRequired={errors?.name?.message}
                placeholder={t('placeholderName')}
                maxLength={MAX_LENGTH_NAME}
                onBlur={(e: any) => handleCheckExit('name', e.target.value)}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('description')} />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <Input
                {...register('description')}
                disabled={loading || isView}
                maxLength={MAX_LENGTH_OPTIONAL}
                placeholder={t('placeholderDescription')}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('status')} />
            </Col>
            <Col className="px-0 d-flex" md={9} xs={9}>
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
      </>
    ),
    [
      control,
      errors?.code?.message,
      errors?.name?.message,
      handleCheckExit,
      isView,
      loading,
      register,
      t,
    ],
  );

  const renderFooter = useMemo(
    () => (
      <div>
        <GroupButton
          className="mt-1 justify-content-end"
          handleCancel={() => {
            handleCancel();
          }}
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
    if (data && isOpen) {
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
  }, [data, isOpen, setValue]);

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

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={() => {
        toggle();
        reset(defaultValues);
      }}
      title={title}
      content={renderForm}
      footer={!isView && renderFooter}
    />
  );
};

export default ModalOwnerBusiness;
