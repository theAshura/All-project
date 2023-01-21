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
import { InjuryMaster } from 'models/api/injury-master/injury-master.model';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { checkExitCodeApi } from 'api/event-type.api';
import { useDispatch, useSelector } from 'react-redux';
import { createInjuryMasterActions } from 'store/injury-master/injury-master.action';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: InjuryMaster;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  errorList?: any;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  lti: true,
  status: 'active',
};

const ModalMaster: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, data, handleSubmitForm, isView } =
    props;
  const { t } = useTranslation([
    I18nNamespace.INJURY_MASTER,
    I18nNamespace.COMMON,
  ]);
  const { errorList } = useSelector((state) => state.injuryMaster);

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    clearErrors,
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
  const dispatch = useDispatch();

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
    clearErrors();
    dispatch(createInjuryMasterActions.failure(null));
  }, [toggle, resetForm, clearErrors, dispatch]);

  const onSubmitForm = (formData) =>
    handleSubmitForm({ ...formData, resetForm });

  const handleSubmitAndNew = (data) => {
    const dataNew = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (field && value) {
        if (isView) {
          return;
        }
        checkExitCodeApi({
          entity: 'injury-master',
          field,
          value,
        })
          .then((res) => {
            if (res?.data?.isExist) {
              switch (field) {
                case 'code':
                  if (value !== data?.code) {
                    setError(field, {
                      message: t('injuryMasterCodeIsExisted'),
                    });
                  }
                  break;
                case 'name':
                  if (value !== data?.name) {
                    setError(field, {
                      message: t('injuryMasterNameIsExisted'),
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
    [data?.code, data?.name, isView, setError, t],
  );

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('injuryMasterCodeForm')} isRequired />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              disabled={loading || isView}
              autoFocus
              isRequired
              placeholder={t('placeholderInjuryMasterCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
              onBlur={(e) => handleCheckExit('code', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('injuryMasterNameForm')} isRequired />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              disabled={loading || isView}
              autoFocus
              isRequired
              placeholder={t('placeholderInjuryMasterName')}
              messageRequired={errors?.name?.message || ''}
              {...register('name')}
              maxLength={MAX_LENGTH_TEXT}
              onBlur={(e) => handleCheckExit('name', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('lti')} />
          </Col>
          <Col className="px-0 d-flex" md={8} xs={8}>
            <RadioForm
              name="lti"
              control={control}
              disabled={isView}
              radioOptions={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ]}
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
            setError('code', { message: t('injuryMasterCodeIsExisted') });
            break;
          case 'name':
            setError('name', { message: t('injuryMasterNameIsExisted') });
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
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={!isView && renderFooter()}
    />
  );
};

export default ModalMaster;
