import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX_LENGTH_CODE, MAX_LENGTH_TEXT2 } from 'constants/common.const';
import { useSelector, useDispatch } from 'react-redux';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { VALUE_MANAGEMENT_FIELDS_DETAILS } from 'constants/dynamic/value-management.const';
import { CreateValueManagementParams } from '../utils/model';
import { createValueManagementActions } from '../store/action';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: CreateValueManagementParams;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const defaultValues = {
  code: '',
  number: '',
  description: '',
  status: 'active',
};

const ModalMaster: FC<ModalProps> = (props) => {
  const { loading, toggle, isOpen, data, handleSubmitForm, isView, isCreate } =
    props;
  const { errorList } = useSelector((state) => state.valueManagement);
  const dispatch = useDispatch();
  const modulePage = useMemo((): ModulePage => {
    if (isCreate) {
      return ModulePage.Create;
    }

    return ModulePage.View;
  }, [isCreate]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAnswerValue,
    modulePage,
  });
  const schema = useMemo(
    () =>
      yup.object().shape({
        code: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              VALUE_MANAGEMENT_FIELDS_DETAILS['This field is required'],
            ),
          ),
        number: yup
          .string()
          .trim()
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicLabels,
              VALUE_MANAGEMENT_FIELDS_DETAILS['This field is required'],
            ),
          )
          .test(
            'number',
            (params) => {
              if (params.value === '-')
                return renderDynamicLabel(
                  dynamicLabels,
                  VALUE_MANAGEMENT_FIELDS_DETAILS['This field is required'],
                );
              if (Number(params.value) > 100) {
                return renderDynamicLabel(
                  dynamicLabels,
                  VALUE_MANAGEMENT_FIELDS_DETAILS[
                    'Value number must be smaller than 100'
                  ],
                );
              }

              if (Number(params.value) < -100) {
                return renderDynamicLabel(
                  dynamicLabels,
                  VALUE_MANAGEMENT_FIELDS_DETAILS[
                    'Value number must be greater than -100'
                  ],
                );
              }
              return '';
            },
            (value, context) => {
              if (value === '-') return false;
              return !(Number(value) > 100 || Number(value) < -100);
            },
          ),
      }),
    [dynamicLabels],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchNumber = watch('number');
  const resetForm = useCallback(() => {
    setValue('code', '');
    setValue('number', '');
    setValue('description', '');
    setValue('status', 'active');
  }, [setValue]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
    clearErrors();
  }, [clearErrors, resetForm, toggle]);

  const onSubmitForm = useCallback(
    (formData: CreateValueManagementParams) => {
      let dataConvert = formData;
      if (!formData?.description) {
        const { description, ...other } = formData;
        dataConvert = other;
      }
      handleSubmitForm({ ...dataConvert, handleSuccess: () => resetForm() });
    },
    [handleSubmitForm, resetForm],
  );

  const handleSubmitAndNew = useCallback(
    (data: CreateValueManagementParams) => {
      let dataConvert = data;
      if (!data?.description) {
        const { description, ...other } = data;
        dataConvert = other;
      }
      const dataNew: CreateValueManagementParams = {
        ...dataConvert,
        isNew: true,
        handleSuccess: () => resetForm(),
      };
      handleSubmitForm(dataNew);
    },
    [handleSubmitForm, resetForm],
  );

  const handleKeyPress = useCallback(
    (event) => {
      const valueNumber = Number(watchNumber?.trim() + event.key);
      if (
        watchNumber?.trim()?.length === 0 &&
        (event.which === 48 || event.which === 45)
      ) {
        return null;
      }

      if (
        event.which < 48 ||
        event.which > 57 ||
        (event.which === 48 &&
          (watchNumber?.trim()?.length === 0 || watchNumber?.trim() === '-')) ||
        (valueNumber > 0 && watchNumber?.trim()?.length > 2)
      ) {
        event.preventDefault();
      }
      return null;
    },
    [watchNumber],
  );

  const handlePaste = useCallback(
    (event) => {
      const dataText = event.clipboardData.getData('Text');
      const valueInput = Number(watchNumber?.trim() + dataText);
      if (valueInput < -100 || valueInput > 100 || !valueInput) {
        event.preventDefault();
      }
      return null;
    },
    [watchNumber],
  );

  const renderForm = useMemo(
    () => (
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VALUE_MANAGEMENT_FIELDS_DETAILS['Value code'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              autoFocus
              isRequired
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VALUE_MANAGEMENT_FIELDS_DETAILS['Enter value code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
              onBlur={(e) => {}}
              disabled={isView}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VALUE_MANAGEMENT_FIELDS_DETAILS['Value number'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              maxLength={4}
              {...register('number')}
              onKeyPress={handleKeyPress}
              onPaste={handlePaste}
              isRequired
              messageRequired={errors?.number?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VALUE_MANAGEMENT_FIELDS_DETAILS['Enter value number'],
              )}
              disabled={isView}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VALUE_MANAGEMENT_FIELDS_DETAILS.Description,
              )}
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('description')}
              maxLength={MAX_LENGTH_TEXT2}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VALUE_MANAGEMENT_FIELDS_DETAILS['Enter description'],
              )}
              disabled={isView}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VALUE_MANAGEMENT_FIELDS_DETAILS.Status,
              )}
            />
          </Col>
          <Col className="px-0 d-flex" md={9} xs={9}>
            <RadioForm
              name="status"
              control={control}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    VALUE_MANAGEMENT_FIELDS_DETAILS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    VALUE_MANAGEMENT_FIELDS_DETAILS.Inactive,
                  ),
                },
              ]}
              disabled={isView}
            />
          </Col>
        </Row>
      </div>
    ),
    [
      dynamicLabels,
      errors?.code?.message,
      errors?.number?.message,
      register,
      isView,
      handleKeyPress,
      handlePaste,
      control,
    ],
  );

  const renderFooter = useMemo(
    () => (
      <div>
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.CARGO,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) => (
            <GroupButton
              className="mt-1 justify-content-end"
              handleCancel={handleCancel}
              visibleSaveBtn
              handleSubmit={handleSubmit(onSubmitForm)}
              handleSubmitAndNew={
                hasPermission ? handleSubmit(handleSubmitAndNew) : undefined
              }
              disable={loading || isView}
              dynamicLabels={dynamicLabels}
            />
          )}
        </PermissionCheck>
      </div>
    ),
    [
      dynamicLabels,
      handleCancel,
      handleSubmit,
      handleSubmitAndNew,
      isView,
      loading,
      onSubmitForm,
    ],
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data?.code || '');
      setValue('number', data?.number);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
    } else {
      setValue('code', '');
      setValue('number', '');
      setValue('description', '');
      setValue('status', 'active');
    }
  }, [data, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', {
              message: renderDynamicLabel(
                dynamicLabels,
                VALUE_MANAGEMENT_FIELDS_DETAILS['This field is required'],
              ),
            });
            break;
          case 'number':
            setError('number', {
              message: renderDynamicLabel(
                dynamicLabels,
                VALUE_MANAGEMENT_FIELDS_DETAILS['This field is required'],
              ),
            });
            break;
          default:
            break;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  useEffect(() => {
    if (!isOpen) {
      clearErrors();
      dispatch(createValueManagementActions.failure(null));
    }
  }, [clearErrors, dispatch, isOpen]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={renderDynamicLabel(
        dynamicLabels,
        VALUE_MANAGEMENT_FIELDS_DETAILS['Value information'],
      )}
      content={renderForm}
      footer={!isOpen ? null : !isView && renderFooter}
    />
  );
};

export default ModalMaster;
