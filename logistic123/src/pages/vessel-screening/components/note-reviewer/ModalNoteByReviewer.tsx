import { FC, useCallback, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import LabelUI from 'components/ui/label/LabelUI';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './note.module.scss';

interface Props {
  isOpen?: boolean;
  toggle?: () => void;
  data?: any;
  handleSubmitForm?: (data) => void;
  isEdit?: boolean;
}
const defaultValues = {
  comment: '',
};

export const ModalNoteByReviewer: FC<Props> = ({
  isOpen,
  data,
  handleSubmitForm,
  toggle,
  isEdit,
}) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        comment: yup.string().trim().nullable().required(t('errors.required')),
      }),
    [t],
  );

  const { control, handleSubmit, reset, setValue } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmitForm = useCallback(
    (data) => {
      handleSubmitForm(data);
      reset(defaultValues);
    },
    [handleSubmitForm, reset],
  );

  const handleCancel = useCallback(() => {
    toggle();
    reset(defaultValues);
  }, [reset, toggle]);

  useEffect(() => {
    if (data) {
      setValue('comment', data?.comment);
    }
    return () => {};
  }, [data, setValue]);

  const renderForm = useCallback(
    () => (
      <div>
        <div className={cx(styles.labelHeader)}>
          <LabelUI label={t('labels.note')} isRequired />
        </div>
        <TextAreaForm
          control={control}
          autoSize={{ minRows: 3, maxRows: 4 }}
          name="comment"
          disabled={!isEdit}
          placeholder={t('placeholders.note')}
          className={cx('w-100  mt-2')}
          id="comment"
          maxLength={2000}
          required
        />
      </div>
    ),
    [control, isEdit, t],
  );

  const renderFooter = useCallback(
    () => (
      <div>
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.PrimaryLight}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
        />
      </div>
    ),
    [handleCancel, handleSubmit, onSubmitForm],
  );

  return (
    <ModalComponent
      isOpen={isOpen}
      toggle={() => {
        toggle();
        reset(defaultValues);
      }}
      title={
        isEdit ? t('txTitleAddNoteByReviewer') : t('txTitleViewNoteByReviewer')
      }
      content={renderForm()}
      footer={isEdit && renderFooter()}
    />
  );
};
