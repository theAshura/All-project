import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row } from 'antd/lib/grid';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import LabelUI from 'components/ui/label/LabelUI';
import ModalComponent from 'components/ui/modal/Modal';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { MAX_LENGTH_NAME, MAX_LENGTH_OPTIONAL } from 'constants/common.const';
import { dataTypeOptions, fieldTypeOptions } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import { REGEXP_NUMERIC_VALUE } from 'constants/regExpValidate.const';
import { FeatureConfig } from 'models/api/feature-config/feature-config.model';
import { FC, ReactNode, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import styles from './modal.module.scss';

interface ModalFeatureConfigProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: FeatureConfig;
  isEdit?: boolean;
  loading?: boolean;
}
const defaultValues = {
  moduleName: null,
  companyCode: null,
  fieldType: null,
  fieldId: null,
  fieldLabel: '',
  description: '',
  dataType: null,
  maxLength: '',
  minLength: '',
  enumValues: '',
  status: 'active',
  fieldRequired: 'no',
  invisible: false,
};

const ModalFeatureConfig: FC<ModalFeatureConfigProps> = (props) => {
  const { loading, toggle, title, isOpen, data, handleSubmitForm } = props;
  const { errorList } = useSelector((state) => state.featureConfig);
  const { t } = useTranslation([
    I18nNamespace.FEATURE_CONFIG,
    I18nNamespace.COMMON,
  ]);

  const schema = yup.object().shape({
    moduleName: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
    companyCode: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
    fieldType: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
    fieldId: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    fieldLabel: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
    dataType: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    enumValues: yup
      .number()
      .transform((v, o) => (o === '' ? null : v))
      .nullable()
      .required(t('ThisFieldIsRequired')),
    minLength: yup
      .number()
      .transform((v, o) => (o === '' ? null : v))
      .min(1, 'Min length must be greater than 0')
      .max(yup.ref('maxLength'), 'Min length must be smaller than max length')
      .nullable()
      .required(t('ThisFieldIsRequired')),
    maxLength: yup
      .number()
      .transform((v, o) => (o === '' ? null : v))
      .min(1, 'Max length must be greater than 0')
      .min(yup.ref('minLength'), 'Max length must be greater than min length')
      .nullable()
      .required(t('ThisFieldIsRequired')),

    status: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    reset(defaultValues);
  };

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const onSubmitForm = (formData: FeatureConfig) =>
    handleSubmitForm({ ...formData, resetForm });

  const handleSubmitAndNew = (data: FeatureConfig) => {
    const dataNew: FeatureConfig = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div>
        <Row gutter={[21, 0]} className="pb-4">
          <Col span={12} className="pt-2 ">
            <SelectUI
              placeholder={t('placeholder.select')}
              data={[]}
              labelSelect={t('moduleName')}
              name="moduleName"
              isRequired
              messageRequired={errors?.moduleName?.message || ''}
              className="w-100"
              control={control}
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <SelectUI
              placeholder={t('placeholder.select')}
              data={[]}
              labelSelect={t('companyCode')}
              name="companyCode"
              isRequired
              messageRequired={errors?.companyCode?.message || ''}
              className="w-100"
              control={control}
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <SelectUI
              placeholder={t('placeholder.select')}
              data={fieldTypeOptions}
              name="fieldType"
              labelSelect={t('fieldType')}
              isRequired
              messageRequired={errors?.fieldType?.message || ''}
              className="w-100"
              control={control}
              notAllowSortData
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <Input
              {...register('fieldId')}
              disabled={loading}
              isRequired
              messageRequired={errors?.fieldId?.message || null}
              label={t('fieldId')}
              maxLength={MAX_LENGTH_NAME}
              placeholder={t('placeholder.fieldId')}
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <Input
              {...register('fieldLabel')}
              disabled={loading}
              isRequired
              messageRequired={errors?.fieldLabel?.message || null}
              label={t('fieldLabel')}
              maxLength={MAX_LENGTH_NAME}
              placeholder={t('placeholder.fieldLabel')}
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <Input
              {...register('description')}
              disabled={loading}
              isRequired
              messageRequired={errors?.description?.message || null}
              label={t('fieldDescription')}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={t('placeholder.description')}
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <SelectUI
              placeholder={t('placeholder.select')}
              data={dataTypeOptions}
              labelSelect={t('dataType')}
              name="dataType"
              isRequired
              messageRequired={errors?.dataType?.message || ''}
              className="w-100"
              control={control}
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <InputForm
              messageRequired={errors?.maxLength?.message || ''}
              maxLength={3}
              isRequired
              placeholder={t('placeholder.maxLength')}
              label={t('maxLength')}
              patternValidate={REGEXP_NUMERIC_VALUE}
              control={control}
              name="maxLength"
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <RadioForm
              label={t('fieldRequired')}
              name="fieldRequired"
              labelClassName={styles.radioLabel}
              className={styles.radioForm}
              control={control}
              messageRequired={errors?.fieldRequired?.message || ''}
              isRequired
              radioOptions={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <InputForm
              messageRequired={errors?.minLength?.message || ''}
              isRequired
              maxLength={3}
              placeholder={t('placeholder.minLength')}
              label={t('minLength')}
              patternValidate={REGEXP_NUMERIC_VALUE}
              control={control}
              name="minLength"
            />
          </Col>
          <Col span={12} className="pt-2  d-flex">
            <div className="pe-4">
              <LabelUI label={t('invisible')} />
              <ToggleSwitch
                control={control}
                wrapperClassName="pt-1"
                name="invisible"
              />
            </div>
            <RadioForm
              label={t('status')}
              labelClassName={styles.radioLabel}
              className={styles.radioForm}
              messageRequired={errors?.status?.message || ''}
              isRequired
              name="status"
              control={control}
              radioOptions={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Col>
          <Col span={12} className="pt-2 ">
            <InputForm
              isRequired
              messageRequired={errors?.enumValues?.message || ''}
              maxLength={3}
              placeholder={t('placeholder.enumValues')}
              label={t('enumValues')}
              patternValidate={REGEXP_NUMERIC_VALUE}
              control={control}
              name="enumValues"
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
      setValue('moduleName', data.moduleName);
      setValue('companyCode', data.companyCode);
      setValue('fieldType', data.fieldType);
      setValue('fieldId', data.fieldId);
      setValue('fieldLabel', data.fieldLabel);
      setValue('description', data.description);
      setValue('dataType', data.dataType);
      setValue('maxLength', data.maxLength);
      setValue('minLength', data.minLength);
      setValue('enumValues', data.enumValues);
      setValue('status', data.status);
      setValue('fieldRequired', data.fieldRequired);
      setValue('invisible', data.invisible);
    } else {
      reset(defaultValues);
    }
  }, [data, reset, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'moduleName':
            setError('moduleName', { message: item.message });
            break;
          case 'companyCode':
            setError('companyCode', { message: item.message });
            break;
          case 'fieldType':
            setError('fieldType', { message: item.message });
            break;
          case 'fieldId':
            setError('fieldId', { message: item.message });
            break;
          case 'fieldLabel':
            setError('fieldLabel', { message: item.message });
            break;
          case 'description':
            setError('description', { message: item.message });
            break;
          case 'dataType':
            setError('dataType', { message: item.message });
            break;
          case 'maxLength':
            setError('maxLength', { message: item.message });
            break;
          case 'minLength':
            setError('minLength', { message: item.message });
            break;
          case 'enumValues':
            setError('enumValues', { message: item.message });
            break;
          case 'status':
            setError('status', { message: item.message });
            break;
          case 'fieldRequired':
            setError('fieldRequired', { message: item.message });
            break;
          case 'invisible':
            setError('invisible', { message: item.message });
            break;

          default:
            break;
        }
      });
    } else {
      clearErrors();
    }
  }, [clearErrors, errorList, setError]);

  return (
    <ModalComponent
      w={580}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalFeatureConfig;
