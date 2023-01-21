import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LEGNTH_DESCRIPTION,
  MAX_LENGTH_DECIMAL,
} from 'constants/common.const';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import {
  REGEXP_INPUT_DECIMAL,
  REGEXP_INPUT_NUMBER_WITHOUT_0,
} from 'constants/regExpValidate.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { useDispatch, useSelector } from 'react-redux';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/repeatedFindingCal.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { RepeateFindingCalculation } from '../utils/model';
import { checkExitCodeApi } from '../utils/api';
import { createRepeateFindingCalculationActions } from '../store/action';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  toggleEdit: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: RepeateFindingCalculation;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  timesOfRepeating: '',
  coEfficient: '',
  description: '',
  status: 'active',
};

const ModalMaster: FC<ModalProps> = (props) => {
  const {
    loading,
    toggle,
    toggleEdit,
    title,
    isOpen,
    data,
    isView,
    handleSubmitForm,
    isCreate,
    isEdit,
  } = props;

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionRepeatedFinding,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const schema = useMemo(
    () =>
      yup.object().shape({
        coEfficient: yup
          .number()
          .transform((value) => (Number.isNaN(value) ? undefined : value))
          .nullable()
          .test(
            'coEfficient',
            COMMON_DYNAMIC_FIELDS['Number should be more than 0'],
            (coEfficient) => {
              if (coEfficient === 0) {
                return false;
              }
              return true;
            },
          )
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        timesOfRepeating: yup
          .number()
          .transform((value) => (Number.isNaN(value) ? undefined : value))
          .nullable()
          .required(
            renderDynamicLabel(
              dynamicFields,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
      }),
    [dynamicFields],
  );
  const { errorList } = useSelector((state) => state.repeatedFindingCal);
  const dispatch = useDispatch();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,

    resolver: yupResolver(schema),
  });
  const resetForm = useCallback(() => {
    setValue('timesOfRepeating', '');
    setValue('coEfficient', '');
    setValue('description', '');
    setValue('status', 'active');
  }, [setValue]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
    clearErrors();
    dispatch(createRepeateFindingCalculationActions.failure(null));
  }, [clearErrors, dispatch, resetForm, toggle]);
  // eslint-disable-next-line no-plusplus
  const onSubmitForm = useCallback(
    (formData: RepeateFindingCalculation) => {
      handleSubmitForm({ ...formData, resetForm });
      toggleEdit();
    },
    [handleSubmitForm, resetForm, toggleEdit],
  );

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (field && value) {
        checkExitCodeApi({
          entity: 'repeated-finding',
          field,
          value,
        })
          .then((res) => {
            if (res.data.isExist) {
              switch (field) {
                case 'timesOfRepeating':
                  if (value !== data?.timesOfRepeating.toString()) {
                    setError(field, {
                      message: renderDynamicLabel(
                        dynamicFields,
                        REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS[
                          'Time of repeating is existed'
                        ],
                      ),
                    });
                  }
                  break;

                default:
                  setError(field, { message: '' });
                  break;
              }
            }
          })
          .catch((err) => {
            setError(field, { message: '' });
          });
      }
    },
    [data?.timesOfRepeating, dynamicFields, setError],
  );

  const handleSubmitAndNew = useCallback(
    (data: RepeateFindingCalculation) => {
      const dataNew: RepeateFindingCalculation = {
        ...data,
        isNew: true,
        resetForm,
      };
      handleSubmitForm(dataNew);
      toggleEdit();
    },
    [handleSubmitForm, resetForm, toggleEdit],
  );

  const renderForm = useMemo(
    () => (
      <div>
        <Row className="pt-2 mx-0">
          <Col md={12} xs={12} className="pb-3">
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS[
                  'Time of repeating'
                ],
              )}
              isRequired
            />
            <InputForm
              disabled={isView}
              autoFocus
              control={control}
              isRequired
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS[
                  'Enter time of repeating'
                ],
              )}
              messageRequired={errors?.timesOfRepeating?.message || ''}
              name="timesOfRepeating"
              maxLength={MAX_LENGTH_DECIMAL}
              patternValidate={REGEXP_INPUT_NUMBER_WITHOUT_0}
              onBlur={(e: any) =>
                handleCheckExit('timesOfRepeating', e.target.value)
              }
            />
          </Col>

          <Col className="pb-3" md={12} xs={12}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS[
                  'Co-efficient'
                ],
              )}
              isRequired
            />
            <InputForm
              name="coEfficient"
              isRequired
              control={control}
              disabled={isView}
              messageRequired={errors?.coEfficient?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS[
                  'Enter co-efficient when count repeated findings'
                ],
              )}
              maxLength={MAX_LENGTH_DECIMAL}
              patternValidate={REGEXP_INPUT_DECIMAL}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="pb-3" md={12} xs={12}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS.Description,
              )}
            />
            <Input
              {...register('description')}
              disabled={isView}
              maxLength={MAX_LEGNTH_DESCRIPTION}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS[
                  'Enter description'
                ],
              )}
            />
          </Col>
          <Col className="" md={12} xs={12}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS.Status,
              )}
            />
            <RadioForm
              name="status"
              disabled={isView}
              control={control}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicFields,
                    REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicFields,
                    REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS.Inactive,
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    ),
    [
      dynamicFields,
      isView,
      control,
      errors?.timesOfRepeating?.message,
      errors?.coEfficient?.message,
      register,
      handleCheckExit,
    ],
  );

  const renderFooter = useMemo(
    () => (
      <div>
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.REPEATED_FINDING,
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
              disable={loading}
              txButtonLeft={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS.Cancel,
              )}
              txButtonBetween={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS.Save,
              )}
              txButtonRight={renderDynamicLabel(
                dynamicFields,
                REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS[
                  'Save & New'
                ],
              )}
            />
          )}
        </PermissionCheck>
      </div>
    ),
    [
      dynamicFields,
      handleCancel,
      handleSubmit,
      handleSubmitAndNew,
      loading,
      onSubmitForm,
    ],
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('timesOfRepeating', data?.timesOfRepeating || '');
      setValue('coEfficient', data?.coEfficient);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
    } else {
      setValue('timesOfRepeating', '');
      setValue('coEfficient', '');
      setValue('description', '');
      setValue('status', 'active');
    }
  }, [data, setValue]);

  useEffect(() => {
    if (errorList) {
      setError('timesOfRepeating', {
        message: renderDynamicLabel(
          dynamicFields,
          REPEATED_FINDING_CALCULATION_DYNAMIC_DETAIL_FIELDS[
            'Time of repeating is existed'
          ],
        ),
      });
    } else {
      setError('timesOfRepeating', { message: '' });
    }
  }, [dynamicFields, errorList, setError]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm}
      footer={isView || !isOpen ? null : renderFooter}
    />
  );
};

export default ModalMaster;
