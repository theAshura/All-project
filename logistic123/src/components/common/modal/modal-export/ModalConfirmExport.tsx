import { FC, useEffect, useCallback } from 'react';
import { Modal, ModalProps } from 'reactstrap';
import { useForm, FieldValues } from 'react-hook-form';
import cx from 'classnames';
import Input from 'components/ui/input/Input';
import SelectUI from 'components/ui/select/Select';
import { useSelector } from 'react-redux';
import { MaxLength, printOptions } from 'constants/common.const';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import styles from './modal-export.module.scss';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: (values: { name: string; printOption: string }) => void;
  initialValues?: {
    name?: string;
    printOption?: string;
  };
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  name: '',
  printOption: null,
  inspectionTypeId: null,
};

const ModalConfirmExport: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialValues,
  dynamicLabels,
  ...other
}) => {
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const closeAndClearData = useCallback(() => {
    onClose();
  }, [onClose]);

  const schema = Yup.object().shape({
    name: Yup.string().required('File name is required.'),
    printOption: Yup.string().nullable().required('Print option is required.'),
    // inspectionTypeId: Yup.string()
    //   .nullable()
    //   .required('Print option is required.'),
  });

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const handleSubmitValue = (formValues) => {
    onConfirm(formValues);
    reset();
    onClose();
  };

  useEffect(() => {
    setValue('name', initialValues?.name || '');
    setValue('printOption', initialValues.printOption || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const listAuditTypes =
    internalAuditReportDetail?.iarAuditTypes?.map((i) => ({
      label: i?.auditTypeName,
      value: i.auditTypeId,
    })) || [];

  return (
    <Modal
      isOpen={isOpen}
      className={cx(styles.wrapModal)}
      contentClassName={cx(styles.contentClassName)}
      {...other}
    >
      <div className={styles.header}>
        {renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Export PDF'],
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.form}>
          <div className={styles.wrapInput}>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['File name'],
              )}
              className={styles.inputClassName}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Enter name'],
              )}
              messageRequired={errors?.name?.message}
              autoFocus
              maxLength={MaxLength.MAX_LENGTH_COMMENTS}
              {...register('name')}
            />
          </div>
          <div className={styles.wrapInput}>
            <SelectUI
              isRequired
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Print option'],
              )}
              data={printOptions}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Please select'],
              )}
              name="printOption"
              className="w-100"
              messageRequired={errors?.printOption?.message}
            />
          </div>
          <div className={styles.wrapInput}>
            <SelectUI
              isRequired
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
              )}
              data={[
                {
                  label: 'All',
                  value: null,
                },
                ...listAuditTypes,
              ]}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Please select'],
              )}
              name="inspectionTypeId"
              className="w-100"
              messageRequired={errors?.inspectionTypeId?.message}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end align-items-center">
          <Button
            buttonType={ButtonType.OutlineGray}
            buttonSize={ButtonSize.Medium}
            className={cx(styles.buttonCancel)}
            onClick={closeAndClearData}
            disabled={false}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            buttonType={ButtonType.Primary}
            buttonSize={ButtonSize.Medium}
            className={cx(styles.buttonConfirm, 'mr-3')}
            onClick={handleSubmit(handleSubmitValue)}
            disabled={false}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Confirm)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmExport;
