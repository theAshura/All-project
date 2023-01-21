import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import { FC, useCallback, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import styles from './modal.module.scss';

export interface RemarkType {
  remark: string;
}

interface ModalRemarkProps {
  isOpen: boolean;
  toggle: () => void;
  handleSubmitForm?: (data, index?: number) => void;
  data: RemarkType;
  index: number;
  disabled: boolean;
}

const defaultValues = {
  remark: '',
};

const ModalRemark: FC<ModalRemarkProps> = (props) => {
  const { toggle, isOpen, index, data, disabled, handleSubmitForm } = props;

  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);

  const schema = yup.object().shape({
    remark: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
  });

  const { handleSubmit, setValue, reset, control, clearErrors } =
    useForm<FieldValues>({
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
    handleSubmitForm(params, index);
    handleCancel();
  };

  const renderForm = () => (
    <>
      <div>
        <div className={cx(styles.labelForm)}>
          {t('additionalRemarks')}
          <span className={cx(styles.required)}>*</span>
        </div>
        <TextAreaForm
          name="remark"
          placeholder={t('placeholderIncident.additionalRemarks')}
          control={control}
          disabled={disabled}
          rows={3}
          maxLength={2000}
        />
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      {!disabled && (
        <div>
          <GroupButton
            className="mt-4 justify-content-end"
            handleCancel={handleCancel}
            visibleSaveBtn
            handleSubmit={handleSubmit(onSubmitForm)}
          />
        </div>
      )}
    </>
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('remark', data.remark || '');
    } else {
      resetForm();
    }
  }, [data, isOpen, resetForm, setValue]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={t('remarksTitle')}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalRemark;
