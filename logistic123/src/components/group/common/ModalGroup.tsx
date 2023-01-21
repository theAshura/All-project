import { FC, ReactNode, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
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
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { Group } from 'models/api/group/group.model';

interface ModalGroupProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: Group;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const ModalGroup: FC<ModalGroupProps> = (props) => {
  const { loading, toggle, title, isOpen, data, handleSubmitForm } = props;
  const { messageError } = useSelector((state) => state.group);
  const { t } = useTranslation([I18nNamespace.GROUP, I18nNamespace.COMMON]);
  const defaultValues = {
    code: '',
    name: '',
    description: '',
  };

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
  };

  const handleCancel = () => {
    toggle();
    resetForm();
    setError('code', { message: '' });
    setError('name', { message: '' });
  };

  const onSubmitForm = (formData: Group) =>
    handleSubmitForm({ ...formData, resetForm });

  const handleSubmitAndNew = (data: Group) => {
    const dataNew: Group = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('groupCode')} isRequired />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              disabled={loading}
              autoFocus
              isRequired
              placeholder={t('placeHolder.enterGroupCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('groupName')} isRequired />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('name')}
              isRequired
              disabled={loading}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeHolder.enterGroupName')}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
        </Row>
        <Row className="pt-2 mb-4 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('description')} />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('description')}
              disabled={loading}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={t('placeHolder.enterDescription')}
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
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
          disable={loading}
        />
      </div>
    </>
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('description', data?.description);
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('description', '');
    }
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

export default ModalGroup;
