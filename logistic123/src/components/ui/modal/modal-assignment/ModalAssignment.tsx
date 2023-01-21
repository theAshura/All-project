import { FC, useMemo, useCallback, useEffect } from 'react';
import { Modal, ModalProps } from 'reactstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import DetectEsc from 'components/common/modal/DetectEsc';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import Input from 'components/ui/input/Input';
import { DataObj } from 'models/common.model';
import { FieldValues, useForm } from 'react-hook-form';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import * as yup from 'yup';
import styles from './modal-assignment.module.scss';
import SelectTableProps from './SelectTableProps';

export interface DataTable {
  dataRows: DataObj[];
  isRequired: boolean;
  autoSelectData?: DataObj[];
  title: string;
  name: string;
}

export interface ValueSelect {
  dataRows: string[];
  name: string;
}

export interface DataInput {
  isRequired: boolean;
  title: string;
  maxLength?: number;
  minLength?: number;
}

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  classesName?: string;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  title?: string;
  content?: string;
  onConfirm: (data: any) => void;
  data: DataTable[];
  dataInput?: DataInput;
  initialData?: any;
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ModalAssignment: FC<ModalComponentProps> = ({
  isOpen,
  classesName,
  modalClassName,
  contentClassName,
  title,
  onClose,
  valueSelect,
  data,
  dataInput,
  content,
  onConfirm,
  type,
  initialData,
  loading,
  dynamicLabels,
  ...other
}) => {
  const dataRequest = useMemo(
    () => data?.filter((item) => item.isRequired),
    [data],
  );

  const defaultValues = useMemo(() => {
    let dataDefaultModal = {};
    data?.forEach((i) => {
      dataDefaultModal[i.name] = [];
    });
    if (dataInput?.isRequired) {
      dataDefaultModal = { ...dataDefaultModal, dataInput: '' };
    }
    return dataDefaultModal;
  }, [data, dataInput?.isRequired]);

  const schema = useMemo(() => {
    let schemaShape = {};
    dataRequest?.forEach((i) => {
      schemaShape[i?.name] = yup
        .array()
        .min(
          1,
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['This field is required'],
          ),
        );
    });
    if (dataInput?.isRequired) {
      schemaShape = {
        ...schemaShape,
        dataInput: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      };
    }

    return yup.object().shape(schemaShape);
  }, [dataRequest, dataInput?.isRequired, dynamicLabels]);

  const {
    handleSubmit,
    reset,
    register,
    control,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleFillInitialData = useCallback(() => {
    if (initialData?.length && data?.length) {
      initialData?.forEach((item) => {
        const dataPermission = data?.find((i) => i?.name === item?.permission);
        const selectedData =
          dataPermission?.dataRows?.filter((i) =>
            item?.userIds?.some((id) => id === i?.id),
          ) || null;
        setValue(item?.permission, selectedData);
      });
    }
    if (!initialData?.length && data?.length) {
      data?.forEach((item) => {
        if (item?.autoSelectData?.length) {
          setValue(item?.name, item?.autoSelectData);
        }
      });
    }
  }, [data, initialData, setValue]);

  const closeAndClearData = async () => {
    onClose();
    await reset();
    handleFillInitialData();
  };

  const renderForm = useMemo(
    () => (
      <div className={styles.wrapInput}>
        <Input
          label={dataInput?.title}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Enter comment'],
          )}
          disabled={false}
          {...register('dataInput')}
          messageRequired={errors?.dataInput?.message || ''}
          isRequired={dataInput?.isRequired}
          maxLength={dataInput?.maxLength || 128}
          minLength={dataInput?.minLength || 0}
        />
      </div>
    ),
    [
      dataInput?.isRequired,
      dataInput?.maxLength,
      dataInput?.minLength,
      dataInput?.title,
      dynamicLabels,
      errors?.dataInput?.message,
      register,
    ],
  );

  const onSubmitForm = useCallback(
    (values: any) => {
      let isError = false;
      dataRequest?.forEach((item) => {
        if (!values?.[item?.name]?.length) {
          setError(item?.name, {
            message: renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          });
          isError = true;
        }
      });
      if (isError) {
        return;
      }
      onConfirm(values);
    },
    [dataRequest, dynamicLabels, onConfirm, setError],
  );

  useEffect(() => {
    handleFillInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, data, setValue]);

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div className={styles.header}>
        <div className={styles.title}>
          {title ||
            renderDynamicLabel(
              dynamicLabels,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'User assignment'
              ],
            )}
        </div>
        <div className={styles.closeBtn} onClick={closeAndClearData}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <DetectEsc close={closeAndClearData} />
      <div className={styles.wrapContent}>
        <div className={styles.content}>
          {dataInput?.title && renderForm}
          {data?.map((item) => (
            <div key={item?.name} className={styles.wrapInput}>
              <SelectTableProps
                control={control}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                {...item}
                messageRequired={errors[item?.name]?.message}
              />
            </div>
          ))}
        </div>

        <div
          className={cx(
            'd-flex justify-content-end align-items-center',
            styles.footer,
          )}
        >
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
            onClick={handleSubmit(onSubmitForm)}
            disabled={false}
            loading={loading}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Confirm)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAssignment;
