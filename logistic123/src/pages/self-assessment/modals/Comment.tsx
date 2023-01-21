import { useCallback, useEffect, useMemo } from 'react';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX_LENGTH_NAME } from 'constants/common.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import cx from 'classnames';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';

interface ModalCommentProps {
  isOpen: boolean;
  toggle: () => void;
  handleSubmitForm?: (comment, index: number, isNew?: boolean) => void;
  comment: any;
  index: number;
  disabled?: boolean;
}

const defaultValues = {
  topic: '',
  description: '',
  attachments: [],
};

const ModalComment = ({
  toggle,
  isOpen,
  index,
  comment,
  disabled,
  handleSubmitForm,
}: ModalCommentProps) => {
  const { t } = useTranslation([
    I18nNamespace.SELF_ASSESSMENT,
    I18nNamespace.COMMON,
  ]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        topic: yup.string().trim().nullable().required(t('errors.required')),
        description: yup
          .string()
          .trim()
          .nullable()
          .required(t('errors.required')),
      }),
    [t],
  );

  const {
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
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
      <div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              value={index + 1}
              disabled
              isRequired
              label={t('form.sno')}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
          <Col className={cx('p-0')}>
            <InputForm
              control={control}
              patternValidate={/^[a-z\d\-_\s]+$/i}
              name="topic"
              isRequired
              disabled={disabled}
              label={t('form.topic')}
              placeholder={t('placeholder.pleaseTopic')}
              messageRequired={errors?.topic?.message || ''}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
          <Col className={cx('p-0')} />
        </Row>
        <Row className="pt-3 mx-0">
          <Col className={cx('p-0')}>
            <InputForm
              patternValidate={/^[a-z\d\-_\s]+$/i}
              control={control}
              name="description"
              isRequired
              disabled={disabled}
              label={t('form.descriptionComment')}
              placeholder={t('placeholder.enterDescriptionComments')}
              messageRequired={errors?.description?.message || ''}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
        </Row>
        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              scrollVerticalAttachment
              loading={false}
              disable={disabled}
              value={field.value}
              buttonName="Attach"
              onchange={field.onChange}
              isEdit={!disabled}
              featurePage={Features.QUALITY_ASSURANCE}
              subFeaturePage={SubFeatures.SELF_ASSESSMENT}
            />
          )}
        />
      </div>
    ),
    [
      index,
      t,
      control,
      errors?.topic?.message,
      errors?.description?.message,
      disabled,
    ],
  );

  const renderFooter = useCallback(
    () => (
      <>
        {!disabled && (
          <div>
            <GroupButton
              className="mt-4 justify-content-end"
              handleCancel={handleCancel}
              visibleSaveBtn
              handleSubmit={handleSubmit(onSubmitForm)}
              handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
            />
          </div>
        )}
      </>
    ),
    [handleCancel, handleSubmit, handleSubmitAndNew, disabled, onSubmitForm],
  );

  useEffect(() => {
    if (isOpen && comment) {
      setValue('topic', comment?.topic || '');
      setValue('description', comment?.description || '');
      setValue(
        'attachments',
        comment?.attachments?.length ? [...comment?.attachments] : [],
      );
    } else {
      resetForm();
    }
  }, [comment, isOpen, resetForm, setValue]);

  return (
    <ModalComponent
      w={800}
      isOpen={isOpen}
      toggle={handleCancel}
      title={t('comment')}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalComment;
