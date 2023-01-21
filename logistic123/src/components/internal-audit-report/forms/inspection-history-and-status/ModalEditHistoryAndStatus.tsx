import { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getDetailStaticFindingItemActionsApi,
  createStaticFindingItemManualActionsApi,
  updateStaticFindingItemManualActionsApi,
} from 'api/internal-audit-report.api';
import DetectEsc from 'components/common/modal/DetectEsc';
import images from 'assets/images/images';
import { useSelector } from 'react-redux';
import { formatDateIso } from 'helpers/date.helper';
import cx from 'classnames';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import Input from 'components/ui/input/Input';
import moment from 'moment';
import SelectUI from 'components/ui/select/Select';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { FieldValues, useForm } from 'react-hook-form';
import { Col, Modal, ModalProps, Row } from 'reactstrap';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import * as yup from 'yup';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './inspection-history-and-status.module.scss';
import { HISTORY_TABS } from './index';

const schema = yup.object().shape({
  inspectionDate: yup
    .string()
    .nullable()
    .trim()
    .required('This field is required'),
  inspectionType: yup
    .string()
    .nullable()
    .trim()
    .required('This field is required'),
  // remark: yup.string().nullable().trim().required('This field is required'),
  totalFinding: yup
    .string()
    .nullable()
    .trim()
    .required('This field is required'),
  openFinding: yup
    .string()
    .nullable()
    .trim()
    .required('This field is required'),
  closeFinding: yup
    .string()
    .nullable()
    .trim()
    .required('This field is required'),
});
interface HistoryAndStatusValues {
  inspectionDate: string;
  inspectionType: string;
  remark: string;
  totalFinding: string;
  openFinding: string;
  closeFinding: string;
}

const defaultValues: HistoryAndStatusValues = {
  inspectionDate: '',
  inspectionType: undefined,
  remark: '',
  totalFinding: '',
  openFinding: '',
  closeFinding: '',
};

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  classesName?: string;
  findingItemChecked?: any;
  isCreate?: boolean;
  isEdit?: boolean;
  inspectionId?: string;
  currentTab?: string;
  handleUpdateSuccess: () => void;
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ModalEditHistoryAndStatus: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  modalClassName,
  contentClassName,
  classesName,
  findingItemChecked,
  isCreate,
  isEdit,
  inspectionId,
  currentTab,
  handleUpdateSuccess,
  disabled,
  dynamicLabels,
  ...other
}) => {
  const { listAuditTypes } = useSelector((state) => state.auditType);
  const [isEditForm, setIsEditForm] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if ((isEdit || isCreate) && isOpen) {
      setIsEditForm(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isCreate]);

  const totalFindingWatch = watch('totalFinding');
  const openFindingWatch = watch('openFinding');
  const closeFindingWatch = watch('closeFinding');

  useEffect(() => {
    if (openFindingWatch || closeFindingWatch) {
      setError('totalFinding', null);
      setValue(
        'totalFinding',
        Number(openFindingWatch || 0) + Number(closeFindingWatch || 0),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFindingWatch, closeFindingWatch]);

  useEffect(() => {
    if (
      isOpen &&
      findingItemChecked?.id &&
      currentTab === HISTORY_TABS.MANUAL
    ) {
      getDetailStaticFindingItemActionsApi(findingItemChecked?.id)
        .then((res) => {
          setValue(
            'inspectionDate',
            res?.data?.inspectionDate ? moment(res?.data?.inspectionDate) : '',
          );
          setValue('inspectionType', res?.data?.auditType?.id || undefined);
          setValue('remark', res?.data?.remark || '');
          setValue('totalFinding', res?.data?.totalFinding || '');
          setValue('openFinding', res?.data?.openFinding || '');
          setValue('closeFinding', res?.data?.closeFinding || '');
        })
        .catch((err) => toastError(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findingItemChecked?.id, isOpen]);

  useEffect(() => {
    if (isOpen && findingItemChecked && currentTab === HISTORY_TABS.AUTO) {
      setValue(
        'inspectionDate',
        findingItemChecked?.inspectionDate
          ? moment(findingItemChecked?.inspectionDate)
          : '',
      );
      setValue('inspectionType', findingItemChecked?.auditTypeId || undefined);
      setValue('remark', findingItemChecked?.remark || '');
      setValue('totalFinding', findingItemChecked.totalOfFinding || '');
      setValue('openFinding', findingItemChecked.openFinding || '');
      setValue('closeFinding', findingItemChecked.closeFinding || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findingItemChecked, isOpen]);

  const closeAndClear = useCallback(() => {
    setIsEditForm(false);
    onClose();
    reset({
      inspectionDate: '',
      inspectionType: '',
      remark: '',
      totalFinding: '',
      openFinding: '',
      closeFinding: '',
    });
  }, [onClose, reset]);

  const onSubmitForm = useCallback(
    (data: HistoryAndStatusValues) => {
      const bodyParams: any = {
        inspectionDate: formatDateIso(data?.inspectionDate),
        auditTypeId: data?.inspectionType,
        internalAuditReportId:
          currentTab === HISTORY_TABS.AUTO
            ? findingItemChecked?.id
            : inspectionId,
        remark: data?.remark || '',
        totalFinding: data?.totalFinding,
        openFinding: data?.openFinding,
        closeFinding: data?.closeFinding,
        type: currentTab,
      };

      const autoTabCreate =
        !findingItemChecked?.statisticItemsId &&
        currentTab === HISTORY_TABS.AUTO;
      if (currentTab === HISTORY_TABS.MANUAL) {
        bodyParams.id = findingItemChecked?.id;
      }
      if (currentTab === HISTORY_TABS.AUTO) {
        bodyParams.id = findingItemChecked?.statisticItemsId;
      }
      if (isCreate || autoTabCreate) {
        createStaticFindingItemManualActionsApi(bodyParams)
          .then((res) => {
            toastSuccess('Create item successfully');
            handleUpdateSuccess();
            closeAndClear();
          })
          .catch((err) => toastError(err?.message));
        return;
      }
      if (isEdit) {
        updateStaticFindingItemManualActionsApi(bodyParams)
          .then((res) => {
            toastSuccess('Update item successfully');
            handleUpdateSuccess();
            closeAndClear();
          })
          .catch((err) => toastError(err?.message));
      }
    },
    [
      closeAndClear,
      currentTab,
      findingItemChecked?.id,
      findingItemChecked?.statisticItemsId,
      handleUpdateSuccess,
      inspectionId,
      isCreate,
      isEdit,
    ],
  );

  const optionDataAuditTypes = useMemo(() => {
    const additionAuditType = {
      value: findingItemChecked?.auditTypeId,
      label: findingItemChecked?.auditType,
    };

    const listOptions = listAuditTypes?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    if (listOptions?.some((i) => i.value === additionAuditType.value)) {
      return listOptions;
    }
    return additionAuditType?.value
      ? listOptions?.concat(additionAuditType)
      : listOptions;
  }, [findingItemChecked, listAuditTypes?.data]);

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div>
        <div className={styles.header}>
          <div>
            {renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Inspection history and status'],
            )}
          </div>
          <div className={styles.closeBtn} onClick={closeAndClear}>
            <img src={images.icons.icClose} alt="ic-close-modal" />
          </div>
          <DetectEsc close={closeAndClear} />
        </div>
        <div className={styles.content}>
          <Row className={styles.rowWrap}>
            <Col xs={6} className="mb-3">
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Inspection date'],
                )}{' '}
                <span className={styles.dotRequired}>*</span>
              </div>
              <DateTimePicker
                wrapperClassName="w-100"
                className="w-100"
                control={control}
                name="inspectionDate"
                disabled={
                  !isEditForm || currentTab === HISTORY_TABS.AUTO || disabled
                }
                maxDate={undefined}
                messageRequired={errors?.inspectionDate?.message || ''}
                isRequired
                inputReadOnly
              />
            </Col>
            <Col xs={6} className="mb-3">
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
                )}{' '}
                <span className={styles.dotRequired}>*</span>
              </div>
              <SelectUI
                data={optionDataAuditTypes}
                name="inspectionType"
                id="inspectionType"
                messageRequired={errors?.inspectionType?.message || ''}
                className={cx(
                  styles.inputSelect,
                  { [styles.disabledSelect]: false },
                  'w-100',
                )}
                control={control}
                disabled={
                  !isEditForm || currentTab === HISTORY_TABS.AUTO || disabled
                }
                isRequired
              />
            </Col>
            <Col xs={12} className="mb-3">
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS.Remark,
                )}
              </div>
              <TextAreaForm
                control={control}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Enter remark'],
                )}
                autoSize={{ minRows: 1 }}
                disabled={!isEditForm || disabled}
                name="remark"
                maxLength={1000}
              />
            </Col>
          </Row>
          <div className={styles.separateLine} />
          <Row>
            <Col xs={12} className={styles.title}>
              {renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS.Findings,
              )}
            </Col>
            <Col xs={6} className="mb-3">
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Total number of findings'],
                )}{' '}
                <span className={styles.dotRequired}>*</span>
              </div>

              <Input
                className={cx({ [styles.disabledInput]: false })}
                value={totalFindingWatch}
                // onChange={(e) => {
                //   if (Number(e.target.value) <= 9999) {
                //     setError('totalFinding', null);
                //     setValue('totalFinding', e.target.value);
                //   }
                // }}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Enter total number'],
                )}
                isRequired
                disabled
                // ={
                //   !isEditForm || currentTab === HISTORY_TABS.AUTO || disabled
                // }
                messageRequired={errors?.totalFinding?.message || ''}
              />
            </Col>
            <Col xs={6} className="mb-3">
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Number of open findings'],
                )}{' '}
                <span className={styles.dotRequired}>*</span>
              </div>

              <Input
                className={cx({ [styles.disabledInput]: false })}
                onChange={(e) => {
                  if (Number(e.target.value) <= 9999) {
                    setError('openFinding', null);
                    setValue('openFinding', e.target.value);
                  }
                }}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Enter open number'],
                )}
                isRequired
                disabled={
                  !isEditForm || currentTab === HISTORY_TABS.AUTO || disabled
                }
                value={openFindingWatch}
                messageRequired={errors?.openFinding?.message || ''}
              />
            </Col>
            <Col xs={6} className="mb-3">
              <div className={styles.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Number of close findings'],
                )}{' '}
                <span className={styles.dotRequired}>*</span>
              </div>

              <Input
                className={cx({ [styles.disabledInput]: false })}
                onChange={(e) => {
                  if (Number(e.target.value) <= 9999) {
                    setError('closeFinding', null);
                    setValue('closeFinding', e.target.value);
                  }
                }}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Enter close number'],
                )}
                value={closeFindingWatch}
                isRequired
                disabled={
                  !isEditForm || currentTab === HISTORY_TABS.AUTO || disabled
                }
                messageRequired={errors?.closeFinding?.message || ''}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.footer}>
          <Button
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.CancelOutline}
            onClick={closeAndClear}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>

          <Button
            className={styles.send}
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            disabled={disabled}
            disabledCss={disabled}
            onClick={
              !isEditForm
                ? () => setIsEditForm(true)
                : handleSubmit(onSubmitForm)
            }
          >
            {!isEditForm
              ? renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Edit)
              : renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditHistoryAndStatus;
