import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { GroupButton } from 'components/ui/button/GroupButton';
import ModalComponent from 'components/ui/modal/Modal';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { RemarkParam } from 'models/api/home-page/home-page.model';
import { FC, useCallback, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { RemarkType } from '../utils/models/common.model';
import styles from './modal.module.scss';

interface ModalRemarkProps {
  isOpen: boolean;
  toggle: () => void;
  handleSubmitForm?: (data, index?: number) => void;
  data: RemarkType | RemarkParam;
  index: number;
  disabled?: boolean;
  title?: string;
  dynamicLabels?: IDynamicLabel;
}

interface FormRemark {
  remark: string;
}

const defaultValues: FormRemark = {
  remark: '',
};

const ModalRemark: FC<ModalRemarkProps> = (props) => {
  const {
    toggle,
    isOpen,
    index,
    data,
    disabled,
    handleSubmitForm,
    title,
    dynamicLabels,
  } = props;

  const schema = yup.object().shape({
    remark: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
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

  const onSubmitForm = (formData: FormRemark) => {
    const params = { ...data, ...formData };
    handleSubmitForm(params, index);
    handleCancel();
  };

  const renderForm = () => (
    <>
      <div>
        <div className={cx(styles.labelForm)}>
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Remarks)}
          <span className={cx(styles.required)}>*</span>
        </div>
        <TextAreaForm
          name="remark"
          placeholder={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Enter remarks'],
          )}
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
            dynamicLabels={dynamicLabels}
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
      isOpen={isOpen}
      toggle={handleCancel}
      title={
        title ||
        renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS['Add remarks'])
      }
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalRemark;
