import { useCallback, useEffect, useState, FC, useMemo } from 'react';
import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import {
  createDivisionApiRequest,
  getDivisionDetailActionsApi,
  updateDivisionActionsApi,
} from 'pages/division/utils/api';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
// import Checkbox from 'components/ui/checkbox/Checkbox';
import DetectEsc from 'components/common/modal/DetectEsc';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, ModalProps, Col, Row } from 'reactstrap';
import cx from 'classnames';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DIVISION_FIELDS_DETAILS } from 'constants/dynamic/division.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import styles from './modal-form-division.module.scss';

export enum ServiceEnum {
  INSPECTION = 'Inspection',
  QUALITY_ASSURANCE = 'Quality assurance',
}

const defaultValues = {
  code: '',
  name: '',
  status: 'active',
  description: '',
  // services: [],
};

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleGetList: () => void;
  divisionSelected?: any;
  viewMode?: boolean;
  clearData: () => void;
}

const ModalFormDivision: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  classesName,
  modalClassName,
  contentClassName,
  divisionSelected,
  viewMode,
  handleGetList,
  clearData,
  isCreate,
  ...other
}) => {
  const modulePage = useMemo((): ModulePage => {
    if (isCreate) {
      return ModulePage.Create;
    }

    if (viewMode && !divisionSelected) {
      return ModulePage.View;
    }

    return ModulePage.Edit;
  }, [divisionSelected, isCreate, viewMode]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonDivision,
    modulePage,
  });

  const schema = yup.object().shape({
    code: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    name: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    status: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    // services: yup.array().min(1, 'This field is required'),
    // description: yup
    //   .string()
    //   .nullable()
    //   .trim()
    //   .required('This field is required'),
  });

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  // const watchService = watch('services');

  const onCloseAndClearData = useCallback(() => {
    onClose();
    reset(defaultValues);
  }, [onClose, reset]);

  useEffect(() => {
    if (divisionSelected) {
      getDivisionDetailActionsApi(divisionSelected)
        .then((res) => {
          const { data } = res;
          setValue('code', data.code || '');
          setValue('name', data.name || '');
          setValue('status', data.status || null);
          setValue('description', data.description || '');
          // setValue('services', data.services || []);
        })
        .catch((err) => toastError(err));
    }
  }, [divisionSelected, setValue]);

  const handleErrors = useCallback(
    (errorList) => {
      if (errorList?.length) {
        errorList?.forEach((e) => {
          setError(e?.fieldName || e?.field, {
            message:
              typeof e?.message === 'object' ? e?.message?.[0] : e?.message,
          });
        });
      }
    },
    [setError],
  );

  const onSubmitForm = useCallback(
    (values) => {
      // if (values?.services?.length === 0 || !values?.services) {
      //   setError('services', { message: 'This field is required' });
      //   return;
      // }
      setLoading(true);
      if (divisionSelected) {
        updateDivisionActionsApi({
          ...values,
          id: divisionSelected,
        })
          .then((res) => {
            toastSuccess(
              renderDynamicLabel(
                dynamicLabels,
                DIVISION_FIELDS_DETAILS['Update division successfully'],
              ),
            );
            handleGetList();
            setLoading(false);
            if (values?.mode === 'SaveAndNew') {
              reset(defaultValues);
              clearData();
            } else {
              onCloseAndClearData();
            }
          })
          .catch((err) => {
            handleErrors(err?.errorList || err?.message || []);
            setLoading(false);
          });
        return;
      }
      createDivisionApiRequest(values)
        .then((res) => {
          toastSuccess(
            renderDynamicLabel(
              dynamicLabels,
              DIVISION_FIELDS_DETAILS['Create division successfully'],
            ),
          );
          handleGetList();
          if (values?.mode === 'SaveAndNew') {
            reset(defaultValues);
            clearData();
          } else {
            onCloseAndClearData();
          }
          setLoading(false);
        })
        .catch((err) => {
          handleErrors(err?.errorList || err?.message || []);
          setLoading(false);
        });
    },
    [
      clearData,
      divisionSelected,
      dynamicLabels,
      handleErrors,
      handleGetList,
      onCloseAndClearData,
      reset,
    ],
  );

  // const onChangeService = useCallback(
  //   (value: string) => {
  //     if (watchService?.some((i) => i === value)) {
  //       setValue(
  //         'services',
  //         watchService?.filter((i) => i !== value),
  //       );
  //     } else {
  //       setValue('services', watchService?.concat(value));
  //     }
  //   },
  //   [setValue, watchService],
  // );

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div className={styles.header}>
        <div>
          {renderDynamicLabel(dynamicLabels, DIVISION_FIELDS_DETAILS.Division)}
        </div>
        <div className={styles.closeBtn} onClick={onCloseAndClearData}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <DetectEsc close={onCloseAndClearData} />
      <div className={styles.content}>
        <Row>
          <Col xs={12} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                DIVISION_FIELDS_DETAILS['Division code'],
              )}{' '}
              <span className={styles.dotRequired}>*</span>
            </div>

            <Input
              className={cx({ [styles.disabledInput]: false })}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DIVISION_FIELDS_DETAILS['Enter division code'],
              )}
              isRequired
              disabled={viewMode || loading}
              {...register('code')}
              maxLength={20}
              autoFocus
              messageRequired={errors?.code?.message || ''}
            />
          </Col>
          <Col xs={12} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                DIVISION_FIELDS_DETAILS['Division name'],
              )}
              <span className={styles.dotRequired}>*</span>
            </div>

            <Input
              className={cx({ [styles.disabledInput]: false })}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DIVISION_FIELDS_DETAILS['Enter division name'],
              )}
              isRequired
              disabled={viewMode || loading}
              maxLength={128}
              {...register('name')}
              messageRequired={errors?.name?.message || ''}
            />
          </Col>
        </Row>
        {/* <Row>
          <Col xs={12} className={styles.label}>
            Service<span className={styles.dotRequired}>*</span>
          </Col>
          <Col xs={4} xl={3} className="mb-3">
            <div className={styles.wrapCheckbox}>
              <Checkbox
                checked={watchService?.some(
                  (i) => i === ServiceEnum.INSPECTION,
                )}
                onChange={(e) => {
                  onChangeService(ServiceEnum.INSPECTION);
                  setError('services', null);
                }}
                disabled={viewMode || loading}
              />
              <div className={styles.name}>Inspection</div>
            </div>
          </Col>

          <Col xs={4} xl={3} className="mb-3">
            <div className={styles.wrapCheckbox}>
              <Checkbox
                checked={watchService?.some(
                  (i) => i === ServiceEnum.QUALITY_ASSURANCE,
                )}
                onChange={(e) => {
                  onChangeService(ServiceEnum.QUALITY_ASSURANCE);
                  setError('services', null);
                }}
                disabled={viewMode || loading}
              />
              <div className={styles.name}>Quality Assurance</div>
            </div>
          </Col>

          <Col xs={12} className={styles.serviceError}>
            <div className={styles.messageError}>
              {errors?.services?.message || ''}
            </div>
          </Col>
        </Row> */}
        <Row>
          <Col xs={12} className="mb-3">
            <div className={styles.label}>
              {renderDynamicLabel(
                dynamicLabels,
                DIVISION_FIELDS_DETAILS.Description,
              )}
            </div>

            <Input
              className={cx({ [styles.disabledInput]: false })}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DIVISION_FIELDS_DETAILS['Enter description'],
              )}
              isRequired
              disabled={viewMode || loading}
              {...register('description')}
              maxLength={250}
              messageRequired={errors?.description?.message || ''}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} className={styles.label}>
            {renderDynamicLabel(dynamicLabels, DIVISION_FIELDS_DETAILS.Status)}
          </Col>
          <Col xs={12}>
            <RadioForm
              name="status"
              control={control}
              disabled={viewMode || loading}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    DIVISION_FIELDS_DETAILS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    DIVISION_FIELDS_DETAILS.Inactive,
                  ),
                },
              ]}
            />
            <div className={styles.messageError}>
              {errors?.status?.message || ''}
            </div>
          </Col>
        </Row>
      </div>
      <div
        className={cx(
          'd-flex align-items-center justify-content-end',
          styles.footer,
        )}
      >
        <Button
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.CancelOutline}
          onClick={onCloseAndClearData}
        >
          {renderDynamicLabel(dynamicLabels, DIVISION_FIELDS_DETAILS.Cancel)}
        </Button>
        <Button
          className={styles.btnSubmit}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          onClick={handleSubmit(onSubmitForm, (err) => {
            // if (watchService?.length === 0 || !watchService) {
            //   setError('services', { message: 'This field is required' });
            // }
          })}
          disabledCss={viewMode || loading}
          disabled={viewMode || loading}
        >
          {renderDynamicLabel(dynamicLabels, DIVISION_FIELDS_DETAILS.Save)}
        </Button>

        <Button
          className={styles.btnSubmit}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          onClick={handleSubmit(
            (data) => onSubmitForm({ ...data, mode: 'SaveAndNew' }),
            (err) => {
              // if (watchService?.length === 0 || !watchService) {
              //   setError('services', { message: 'This field is required' });
              // }
            },
          )}
          disabledCss={viewMode || loading}
          disabled={viewMode || loading}
        >
          {renderDynamicLabel(
            dynamicLabels,
            DIVISION_FIELDS_DETAILS['Save & New'],
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalFormDivision;
