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
import { CDI } from 'models/api/cdi/cdi.model';

interface ModalModuleProps {
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
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const ModalModule: FC<ModalModuleProps> = (props) => {
  const { loading, toggle, title, isOpen, data, handleSubmitForm } = props;
  const { errorList } = useSelector((state) => state.cdi);
  const { t } = useTranslation([
    I18nNamespace.MODULE_MANAGEMENT,
    I18nNamespace.COMMON,
  ]);
  const defaultValues = useMemo(
    () => ({
      code: '',
      name: '',
      description: '',
      status: 'active',
    }),
    [],
  );

  const schema = useMemo(
    () =>
      yup.object().shape({
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
  }, [defaultValues, toggle, reset]);

  const onSubmitForm = useCallback(
    (formData: CDI) => {
      handleSubmitForm({ ...formData });
    },
    [handleSubmitForm],
  );

  const renderForm = useMemo(
    () => (
      <>
        <div>
          <Row className="pt-2 mx-0">
            <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('moduleNameForm')} isRequired />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <Input
                disabled={loading}
                autoFocus
                isRequired
                placeholder={t('placeholderModuleName')}
                messageRequired={errors?.code?.message || ''}
                {...register('name')}
                maxLength={MAX_LENGTH_CODE}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('moduleTypeForm')} isRequired />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <Input
                {...register('type')}
                isRequired
                disabled={loading}
                messageRequired={errors?.name?.message || ''}
                placeholder={t('placeholderModuleType')}
                maxLength={MAX_LENGTH_NAME}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
              <LabelUI label={t('moduleDesriptionForm')} />
            </Col>
            <Col className="px-0" md={9} xs={9}>
              <Input
                {...register('description')}
                disabled={loading}
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
    [errors, t, control, loading, register],
  );

  const renderFooter = useMemo(
    () => (
      <>
        <div>
          <GroupButton
            className="mt-1 justify-content-end"
            handleCancel={() => {
              handleCancel();
            }}
            visibleSaveBtn
            handleSubmit={handleSubmit(onSubmitForm)}
            disable={loading}
          />
        </div>
      </>
    ),
    [handleCancel, onSubmitForm, handleSubmit, loading],
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
            setError('code', { message: t('CDICodeIsExisted') });
            break;
          case 'name':
            setError('name', { message: t('CDINameIsExisted') });
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
      w={560}
      isOpen={isOpen}
      toggle={() => {
        toggle();
        reset(defaultValues);
      }}
      title={title}
      content={renderForm}
      footer={renderFooter}
    />
  );
};

export default ModalModule;
