import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import SelectUI from 'components/ui/select/Select';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_OPTIONAL,
  MAX_LENGTH_TEXT,
} from 'constants/common.const';
import { EventType } from 'models/api/event-type/event-type.model';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { checkExitCodeApi } from 'api/event-type.api';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { MODULE_TYPES } from 'constants/filter.const';
import { createEventTypeActions } from 'store/event-type/event-type.action';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: EventType;
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
  module: null,
  status: 'active',
};

const ModalMaster: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, data, isView, handleSubmitForm } =
    props;
  const { errorList } = useSelector((state) => state.eventType);
  const { t } = useTranslation([
    I18nNamespace.EVENT_TYPE,
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
    clearErrors,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const handleCancel = useCallback(() => {
    toggle();
    reset();
    clearErrors();
    dispatch(createEventTypeActions.failure(null));
  }, [clearErrors, reset, toggle, dispatch]);

  const onSubmitForm = useCallback(
    (formData: EventType) =>
      handleSubmitForm({ ...formData, resetForm: reset }),
    [handleSubmitForm, reset],
  );

  const handleSubmitAndNew = useCallback(
    (data: EventType) => {
      const dataNew: EventType = { ...data, isNew: true, resetForm: reset };
      handleSubmitForm(dataNew);
    },
    [handleSubmitForm, reset],
  );

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (field && value) {
        checkExitCodeApi({
          entity: 'event-type',
          field,
          value,
        })
          .then((res) => {
            if (res.data.isExist) {
              switch (field) {
                case 'code':
                  if (value !== data?.code) {
                    setError(field, {
                      message: t('eventTypeCodeIsExisted'),
                    });
                  }
                  break;
                case 'name':
                  if (value !== data?.name) {
                    setError(field, {
                      message: t('eventTypeNameIsExisted'),
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
    [data?.code, data?.name, setError, t],
  );

  const renderForm = useMemo(
    () => (
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('eventTypeCodeForm')} isRequired />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              disabled={isView}
              autoFocus
              isRequired
              placeholder={t('placeholderEventTypeCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
              onBlur={(e: any) => handleCheckExit('code', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('eventTypeNameForm')} isRequired />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('name')}
              isRequired
              disabled={isView}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeholderEventTypeName')}
              maxLength={MAX_LENGTH_TEXT}
              onBlur={(e: any) => handleCheckExit('name', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI label="Module Type" />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <SelectUI
              data={MODULE_TYPES}
              disabled={isView}
              messageRequired={errors?.module?.message || ''}
              name="module"
              className="w-100"
              control={control}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('description')} />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('description')}
              disabled={isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={t('txPlaceHolderDescription')}
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
              disabled={isView}
              control={control}
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
      isView,
      errors?.code?.message,
      errors?.name?.message,
      errors?.module?.message,
      register,
      control,
      handleCheckExit,
    ],
  );

  const renderFooter = useMemo(
    () => (
      <div>
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.EVENT_TYPE,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) => (
            <GroupButton
              className="mt-1 justify-content-end"
              handleCancel={handleCancel}
              visibleSaveBtn
              handleSubmit={handleSubmit(onSubmitForm)}
              handleSubmitAndNew={
                hasPermission ? handleSubmit(handleSubmitAndNew) : undefined
              }
              disable={loading}
            />
          )}
        </PermissionCheck>
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
      setValue('module', data?.module);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: t('eventTypeCodeIsExisted') });
            break;
          case 'name':
            setError('name', { message: t('eventTypeNameIsExisted') });
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
      content={renderForm}
      footer={isView || !isOpen ? null : renderFooter}
    />
  );
};

export default ModalMaster;
