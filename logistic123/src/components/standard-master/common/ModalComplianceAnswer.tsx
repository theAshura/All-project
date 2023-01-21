import { FC, useCallback, useEffect, useState } from 'react';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { SketchPicker } from 'react-color';
import { ComplianceAnswer } from 'models/api/standard-master/standard-master.model';
import images from 'assets/images/images';
import { Col, Row } from 'antd/lib/grid';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import { REGEXP_NUMERIC_VALUE } from 'constants/regExpValidate.const';

import styles from './modal.module.scss';

interface ModalComplianceAnswerProps {
  isOpen: boolean;
  toggle: () => void;
  handleSubmitForm?: (data, isNew?: boolean) => void;
  data: ComplianceAnswer;
  index: number;
}

const defaultValues = {
  answer: '',
  compliance: null,
};

const ModalComplianceAnswer: FC<ModalComplianceAnswerProps> = (props) => {
  const { toggle, isOpen, index, data, handleSubmitForm } = props;
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const { t } = useTranslation([
    I18nNamespace.STANDARD_MASTER,
    I18nNamespace.COMMON,
  ]);

  const schema = yup.object().shape({
    answer: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    colour: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    compliance: yup
      .number()
      .transform((v, o) => {
        if (o === '') {
          return null;
        }
        if (Number.isNaN(v)) {
          return null;
        }
        return v;
      })
      .nullable(true)
      .min(0, t('errors.smallerThan100'))
      .max(100, t('errors.smallerThan100'))
      .required(t('ThisFieldIsRequired')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetForm = useCallback(() => {
    reset(defaultValues);
    clearErrors();
  }, [clearErrors, reset]);

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const onSubmitForm = (formData) => {
    const params = { ...formData };
    handleSubmitForm(params);
    handleCancel();
  };

  const handleSubmitAndNew = (formData) => {
    const params = { ...formData };
    handleSubmitForm(params, true);
    resetForm();
  };

  const renderColorPicker = useCallback(
    () => (
      <Controller
        control={control}
        name="colour"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <div
              className={styles.swatch}
              onClick={() => setDisplayColorPicker(true)}
            >
              <div className={styles.label}>
                {t('form.colour')}
                <img src={images.icons.icRequiredAsterisk} alt="required" />
              </div>
              {value ? (
                <div
                  className={styles.color}
                  style={{
                    backgroundColor: value,
                  }}
                />
              ) : (
                <div className={styles.selectColor}>
                  {t('form.selectAColor')}
                </div>
              )}
              {isSubmitted && !value && (
                <div className="message-required mt-2 ms-0">
                  {error?.message || ''}
                </div>
              )}
            </div>
            {displayColorPicker ? (
              <div className={styles.popover}>
                <div
                  className={styles.cover}
                  onClick={() => setDisplayColorPicker(false)}
                />
                <SketchPicker
                  width={250}
                  color={value}
                  onChange={(colorValue) => {
                    onChange(colorValue.hex);
                  }}
                />
              </div>
            ) : null}
          </div>
        )}
      />
    ),
    [control, displayColorPicker, isSubmitted, t],
  );

  const renderForm = () => (
    <>
      <div>
        <div className={styles.labelPopup}>
          {t('answerNoTx')}
          <span> {index + 1}</span>
        </div>
        <div className="mt-2">
          <Input
            {...register('answer')}
            isRequired
            label={t('form.answer')}
            messageRequired={errors?.answer?.message || ''}
            placeholder={t('placeholder.answer')}
            maxLength={20}
          />
        </div>

        <Row className="pt-2">
          <Col span={16}>
            <InputForm
              isRequired
              label={t('form.compliance')}
              messageRequired={errors?.compliance?.message || ''}
              placeholder={t('placeholder.compliance')}
              maxLength={3}
              patternValidate={REGEXP_NUMERIC_VALUE}
              control={control}
              name="compliance"
            />
          </Col>
          <Col span={8}>{renderColorPicker()}</Col>
        </Row>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className="mt-4 justify-content-end"
          handleCancel={handleCancel}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
        />
      </div>
    </>
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('answer', data.answer || '');
      setValue('compliance', data.compliance || null);
      setValue('colour', data?.colour || null);
    } else {
      resetForm();
    }
  }, [data, isOpen, resetForm, setValue]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={t('form.complianceAnswer')}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalComplianceAnswer;
