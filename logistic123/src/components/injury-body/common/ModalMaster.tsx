import { FC, ReactNode, useCallback, useEffect } from 'react';
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
  MAX_LENGTH_OPTIONAL,
  MAX_LENGTH_TEXT,
} from 'constants/common.const';
import { InjuryBody } from 'models/api/injury-body/injury-body.model';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { checkExitCodeApi } from 'api/event-type.api';
import isEmpty from 'lodash/isEmpty';
import { createInjuryBodyActions } from 'store/injury-body/injury-body.action';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: InjuryBody;
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

const ModalMaster: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, data, handleSubmitForm, isView } =
    props;
  const { errorList } = useSelector((state) => state.injuryBody);
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.INJURY_BODY,
    I18nNamespace.COMMON,
  ]);

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    setError,
    clearErrors,
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
    clearErrors();
    dispatch(createInjuryBodyActions.failure(null));
  };

  const onSubmitForm = (formData) => {
    handleSubmitForm({ ...formData, resetForm });
  };

  const handleSubmitAndNew = (data) => {
    const dataNew = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (field && value) {
        checkExitCodeApi({
          entity: 'injury-body',
          field,
          value,
        })
          .then((res) => {
            if (res.data.isExist) {
              switch (field) {
                case 'code':
                  if (value !== data?.code) {
                    setError(field, { message: t('injuryBodyCodeIsExisted') });
                  }
                  break;
                case 'name':
                  if (value !== data?.name) {
                    setError(field, { message: t('injuryBodyNameIsExisted') });
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
    [data, setError, t],
  );

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('injuryBodyCodeForm')} isRequired />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              disabled={loading || isView}
              autoFocus
              isRequired
              placeholder={t('placeholderInjuryBodyCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
              onBlur={(e) => handleCheckExit('code', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('injuryBodyNameForm')} isRequired />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              disabled={loading || isView}
              autoFocus
              isRequired
              placeholder={t('placeholderInjuryBodyName')}
              messageRequired={errors?.name?.message || ''}
              {...register('name')}
              maxLength={MAX_LENGTH_TEXT}
              onBlur={(e) => handleCheckExit('name', e.target.value)}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('description')} />
          </Col>
          <Col className="p-0" md={8} xs={8}>
            <Input
              {...register('description')}
              disabled={loading || isView}
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
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className="mt-1 justify-content-end"
          handleCancel={handleCancel}
          visibleSaveBtn
          handleSubmit={isEmpty(errors) ? handleSubmit(onSubmitForm) : () => {}}
          handleSubmitAndNew={
            isEmpty(errors) ? handleSubmit(handleSubmitAndNew) : () => {}
          }
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
      setValue('status', data?.status || 'active');
      setValue('lti', data?.lti);
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
          case 'name':
            setError('name', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      clearErrors();
    }
  }, [clearErrors, errorList, setError, t]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={!isView && renderFooter()}
    />
  );
};

export default ModalMaster;
