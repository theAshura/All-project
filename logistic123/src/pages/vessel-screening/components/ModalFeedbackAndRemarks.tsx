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
import styles from './comment.module.scss';
import { FeedbackAndRemark } from '../utils/models/summary.model';

interface ModalFeedbackProps {
  isOpen?: boolean;
  toggle?: () => void;
  data?: FeedbackAndRemark;
  handleSubmitForm?: (data) => void;
  isEdit?: boolean;
  title?: string;
  titleRemark?: string;
  placeholderRemark?: string;
}
const defaultValues = {
  remark: '',
};

export const ModalFeedbackAndRemarks: FC<ModalFeedbackProps> = ({
  isOpen,
  data,
  handleSubmitForm,
  toggle,
  isEdit,
  title,
  titleRemark,
  placeholderRemark,
}) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        remark: yup.string().trim().nullable().required(t('errors.required')),
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
      setValue('remark', data?.remark);
    }
    return () => {};
  }, [data, setValue]);

  const renderForm = useCallback(
    () => (
      <div>
        <div className={cx(styles.labelHeader)}>
          <LabelUI label={titleRemark || t('labels.remarkTitle')} isRequired />
        </div>
        <TextAreaForm
          control={control}
          autoSize={{ minRows: 3, maxRows: 4 }}
          name="remark"
          disabled={!isEdit}
          placeholder={placeholderRemark || t('placeholders.remark')}
          className={cx('w-100  mt-2')}
          id="remark"
          maxLength={2000}
          required
        />
      </div>
    ),
    [control, isEdit, placeholderRemark, t, titleRemark],
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
      title={title || t('txTitleAddFeedbackRemark')}
      content={renderForm()}
      footer={isEdit && renderFooter()}
    />
  );
};
