import { FC, useCallback, useEffect } from 'react';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import styles from './modal.module.scss';

interface ModalLevelProps {
  isOpen: boolean;
  toggle: () => void;
  handleSubmitForm?: (data, isNew?: boolean) => void;
  data: string;
  index: number;
}

const defaultValues = {
  description: '',
};

const ModalLevel: FC<ModalLevelProps> = (props) => {
  const { toggle, isOpen, index, data, handleSubmitForm } = props;

  const { t } = useTranslation([
    I18nNamespace.STANDARD_MASTER,
    I18nNamespace.COMMON,
  ]);

  const schema = yup.object().shape({
    description: yup
      .string()
      .trim()
      .nullable()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        'Level description can only contain Latin characters',
      )
      .required(t('ThisFieldIsRequired')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
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
    handleSubmitForm(formData.description);
    handleCancel();
  };

  const handleSubmitAndNew = (formData) => {
    handleSubmitForm(formData.description, true);
    resetForm();
  };

  const renderForm = () => (
    <>
      <div>
        <div className={styles.labelPopup}>
          {t('levelNoTx')}
          <span> {index + 1}</span>
        </div>
        <Input
          {...register('description')}
          isRequired
          label={t('form.levelDescription')}
          messageRequired={errors?.description?.message || ''}
          placeholder={t('placeholder.levelDescription')}
          maxLength={20}
        />
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
    if (isOpen) {
      setValue('description', data || '');
    } else {
      resetForm();
    }
  }, [data, isOpen, resetForm, setValue]);

  return (
    <ModalComponent
      w={800}
      isOpen={isOpen}
      toggle={handleCancel}
      title={t('form.levels')}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalLevel;
