import { FC, ReactNode, useCallback, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX_LENGTH_CODE, MAX_LENGTH_OPTIONAL } from 'constants/common.const';
import { FocusRequest } from 'models/api/focus-request/focus-request.model';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { AuthorityMaster } from 'models/api/authority-master/authority-master.model';
import LabelUI from 'components/ui/label/LabelUI';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: FocusRequest;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const defaultValues = {
  code: '',
  question: '',
  description: '',
  status: 'active',
};

const ModalMaster: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, data, handleSubmitForm, isView } =
    props;
  const { errorList } = useSelector((state) => state.focusRequest);
  const { t } = useTranslation([
    I18nNamespace.FOCUS_REQUEST,
    I18nNamespace.COMMON,
  ]);

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    question: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
  });

  const {
    register,
    reset,
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

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const onSubmitForm = (formData: AuthorityMaster) =>
    handleSubmitForm({ ...formData, resetForm });

  const handleSubmitAndNew = (data: AuthorityMaster) => {
    const dataNew: AuthorityMaster = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('focusRequestCodeForm')} isRequired />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              disabled={isView}
              autoFocus
              isRequired
              placeholder={t('placeholderFocusRequestCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('questionForm')} isRequired />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <TextAreaForm
              name="question"
              placeholder={t('placeholderQuestion')}
              control={control}
              minRows={2}
              disabled={isView}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('description')} />
          </Col>
          <Col className="p-0" md={8} xs={8}>
            <Input
              {...register('description')}
              disabled={isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={t('txPlaceHolderDescription')}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('status')} />
          </Col>
          <Col className="px-0 d-flex" md={8} xs={8}>
            <RadioForm
              disabled={isView}
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
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className="mt-1 justify-content-end"
          handleCancel={handleCancel}
          visibleSaveBtn={!isView}
          handleSubmit={!isView && handleSubmit(onSubmitForm)}
          handleSubmitAndNew={!isView && handleSubmit(handleSubmitAndNew)}
          disable={loading}
        />
      </div>
    </>
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data?.code || '');
      setValue('question', data?.question);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
    } else {
      resetForm();
    }
  }, [data, resetForm, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: item.message });
            break;
          case 'question':
            setError('question', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('question', { message: '' });
    }
  }, [errorList, setError, t]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalMaster;
