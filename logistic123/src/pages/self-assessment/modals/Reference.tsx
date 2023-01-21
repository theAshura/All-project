import { useCallback, useEffect, useMemo } from 'react';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX_LENGTH_NAME } from 'constants/common.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import SelectUI from 'components/ui/select/Select';
import cx from 'classnames';
import TableAttachment from '../tables/Attachment';

const mockOptions = [
  { label: 'test1', value: 'test1' },
  { label: 'test2', value: 'test2' },
];

interface ModalReferenceProps {
  isOpen: boolean;
  toggle: () => void;
  handleSubmitForm?: (reference, index: number, isNew?: boolean) => void;
  setIsEdit: (value) => void;
  reference: any;
  index: number;
  isEdit: boolean;
}

const defaultValues = {
  referenceModule: '',
};

const ModalReference = ({
  toggle,
  isOpen,
  index,
  reference,
  handleSubmitForm,
}: ModalReferenceProps) => {
  const { t } = useTranslation([
    I18nNamespace.SELF_ASSESSMENT,
    I18nNamespace.COMMON,
  ]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        referenceModule: yup
          .string()
          .trim()
          .nullable()
          .required(t('ThisFieldIsRequired')),
      }),
    [t],
  );

  const { handleSubmit, setValue, reset, clearErrors, control } =
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
          <LabelUI label={`${t('generalInformation')}`} className="mb-3" />
          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 me-3')}>
              <Input
                value={index + 1}
                isRequired
                label={t('form.reference')}
                maxLength={MAX_LENGTH_NAME}
              />
            </Col>
            <Col className={cx('p-0 me-3')}>
              <SelectUI
                labelSelect={t('form.referenceModule')}
                data={mockOptions}
                isRequired
                placeholder={t('placeholder.pleaseSelect')}
                name="referenceModule"
                id="referenceModule"
                className={cx('w-100')}
                control={control}
                onChange={(value) => {
                  setValue('referenceModule', value);
                }}
              />
            </Col>
            <Col className={cx('p-0 me-3')} />
          </Row>

          <Controller
            control={control}
            name="attachments"
            render={({ field }) => (
              <TableAttachment
                loading={false}
                value={field.value}
                onchange={field.onChange}
              />
            )}
          />
        </div>
      </>
    ),
    [control, index, setValue, t],
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
      setValue('referenceModule', reference?.referenceModule || '');
    } else {
      resetForm();
    }
  }, [isOpen, reference?.referenceModule, resetForm, setValue]);

  return (
    <ModalComponent
      w={800}
      isOpen={isOpen}
      toggle={handleCancel}
      title={t('otherReferenceModules')}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalReference;
