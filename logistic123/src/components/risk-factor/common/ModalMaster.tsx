import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_TEXT,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { RiskFactor } from 'models/api/risk-factor/risk-factor.model';
import LabelUI from 'components/ui/label/LabelUI';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { checkExitCodeApi } from 'pages/cargo/utils/api';

interface ModalMasterProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: RiskFactor;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const ModalMaster: FC<ModalMasterProps> = (props) => {
  const { loading, toggle, title, isOpen, data, handleSubmitForm, isView } =
    props;
  const { errorList } = useSelector((state) => state.riskFactor);
  const { t } = useTranslation([
    I18nNamespace.RISK_FACTOR,
    I18nNamespace.COMMON,
  ]);
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
  };

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    toggle();
    reset(defaultValues);
  };
  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (field && value) {
        checkExitCodeApi({
          entity: 'risk-factor',
          field,
          value,
        })
          .then((res) => {
            if (res.data.isExist) {
              switch (field) {
                case 'code':
                  if (value.trim() !== data?.code) {
                    setError(field, {
                      message: t('riskFactorCodeIsExisted'),
                    });
                  }
                  break;
                case 'name':
                  if (value.trim() !== data?.name) {
                    setError(field, {
                      message: t('riskFactorNameIsExisted'),
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
  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmitForm = (formData: RiskFactor) => handleSubmitForm(formData);

  const handleSubmitAndNew = (data: RiskFactor) => {
    const dataNew: RiskFactor = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = useMemo(
    () => (
      <>
        <div className={cx('wrap__Form')}>
          <Row className="pt-2 mx-0">
            <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
              <LabelUI label={t('codeForm')} isRequired />
            </Col>
            <Col className="px-0" md={8} xs={8}>
              <Input
                disabled={isView}
                autoFocus
                isRequired
                placeholder={t('placeholderCode')}
                messageRequired={errors?.code?.message || ''}
                {...register('code')}
                maxLength={MAX_LENGTH_CODE}
                onBlur={(e: any) => handleCheckExit('code', e.target.value)}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
              <LabelUI label={t('nameForm')} isRequired />
            </Col>
            <Col className="px-0" md={8} xs={8}>
              <Input
                {...register('name')}
                isRequired
                disabled={isView}
                messageRequired={errors?.name?.message || ''}
                placeholder={t('placeholderName')}
                maxLength={MAX_LENGTH_TEXT}
                onBlur={(e: any) => handleCheckExit('name', e.target.value)}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
              <LabelUI label={t('description')} />
            </Col>
            <Col className="px-0" md={8} xs={8}>
              <Input
                {...register('description')}
                disabled={isView}
                maxLength={MAX_LENGTH_OPTIONAL}
                placeholder={t('placeholderDescription')}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
              <LabelUI label={t('status')} />
            </Col>
            <Col className="ps-0 d-flex" md={8} xs={8}>
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
      register,
      t,
    ],
  );

  const renderFooter = () => (
    <>
      <div>
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.RISK_FACTOR,
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
    </>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOpen]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm}
      footer={isView || !isOpen ? null : renderFooter()}
    />
  );
};

export default ModalMaster;
