import { useCallback, useEffect, useMemo } from 'react';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX_LENGTH_NAME } from 'constants/common.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';

interface ModalDocumentProps {
  isOpen: boolean;
  toggle: () => void;
  handleSubmitForm?: (document, index: number, isNew?: boolean) => void;
  setIsEdit: (value) => void;
  document: any;
  index: number;
  isEdit: boolean;
}

const defaultValues = {
  documentTitle: '',
};

const ModalDocument = ({
  toggle,
  isOpen,
  index,
  document,
  handleSubmitForm,
}: ModalDocumentProps) => {
  const { t } = useTranslation([
    I18nNamespace.SELF_ASSESSMENT,
    I18nNamespace.COMMON,
  ]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        documentTitle: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
      }),
    [t],
  );

  const { register, handleSubmit, setValue, reset, clearErrors } =
    useForm<FieldValues>({
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(schema),
    });

  const resetForm = useCallback(() => {
    reset(defaultValues);
    clearErrors();
  }, [clearErrors, reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (formData) => {
      handleSubmitForm(formData, index);
      handleCancel();
    },
    [handleCancel, handleSubmitForm, index],
  );

  const handleSubmitAndNew = useCallback(
    (formData) => {
      handleSubmitForm(formData, index, true);
      resetForm();
    },
    [handleSubmitForm, index, resetForm],
  );

  const renderForm = useCallback(
    () => (
      <>
        <div>
          <LabelUI label={`${t('document')} ${index + 1}`} className="mb-3" />
          <Input
            {...register('documentTitle')}
            isRequired
            label={t('form.documentTitle')}
            placeholder={t('placeholder.documentTitle')}
            maxLength={MAX_LENGTH_NAME}
          />
        </div>
      </>
    ),
    [index, register, t],
  );

  const renderFooter = useCallback(
    () => (
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
    ),
    [handleCancel, handleSubmit, handleSubmitAndNew, onSubmitForm],
  );

  useEffect(() => {
    if (isOpen) {
      setValue('documentTitle', document?.documentTitle || '');
    } else {
      resetForm();
    }
  }, [document?.documentTitle, isOpen, resetForm, setValue]);

  return (
    <ModalComponent
      w={800}
      isOpen={isOpen}
      toggle={handleCancel}
      title={t('document')}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalDocument;
