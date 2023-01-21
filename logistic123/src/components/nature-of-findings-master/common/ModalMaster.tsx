import { FC, ReactNode, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_TEXT,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { useSelector } from 'react-redux';
import { NatureOfFindingsMaster } from 'models/api/nature-of-findings-master/nature-of-findings-master.model';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/natureOfFindings.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface ModalNatureOfFindingProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: NatureOfFindingsMaster;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const ModalNatureOfFinding: FC<ModalNatureOfFindingProps> = (props) => {
  const {
    loading,
    toggle,
    title,
    isOpen,
    data,
    handleSubmitForm,
    isView,
    isCreate = false,
  } = props;
  const { errorList } = useSelector((state) => state.natureOfFindingsMaster);
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
  };

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionNatureOfFindings,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const schema = yup.object().shape({
    code: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    name: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    toggle();
    reset(defaultValues);
  };
  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmitForm = (formData: NatureOfFindingsMaster) =>
    handleSubmitForm(formData);

  const handleSubmitAndNew = (data: NatureOfFindingsMaster) => {
    const dataNew: NatureOfFindingsMaster = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
                  'Nature of findings code'
                ],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              disabled={loading || isView}
              autoFocus
              isRequired
              placeholder={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
                  'Enter nature of findings code'
                ],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
                  'Nature of findings name'
                ],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              {...register('name')}
              isRequired
              disabled={loading || isView}
              messageRequired={errors?.name?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
                  'Enter nature of findings name'
                ],
              )}
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS.Description,
              )}
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              {...register('description')}
              disabled={loading || isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS['Enter description'],
              )}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS.Status,
              )}
            />
          </Col>
          <Col className="ps-0 d-flex" md={8} xs={8}>
            <RadioForm
              name="status"
              disabled={isView}
              control={control}
              radioOptions={[
                {
                  value: 'active',
                  label: 'Active',
                },
                {
                  value: 'inactive',
                  label: 'Inactive',
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className={cx('mt-1 justify-content-end')}
          handleCancel={() => {
            handleCancel();
          }}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
          disable={loading || isView}
          txButtonLeft={renderDynamicLabel(
            dynamicFields,
            NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS.Cancel,
          )}
          txButtonRight={renderDynamicLabel(
            dynamicFields,
            NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS['Save & New'],
          )}
          txButtonBetween={renderDynamicLabel(
            dynamicFields,
            NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS.Save,
          )}
        />
      </div>
    </>
  );

  // effect
  useEffect(() => {
    if (data && isOpen) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('description', '');
      setValue('status', 'active');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOpen]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', {
              message: item.message,
            });
            break;
          case 'name':
            setError('name', {
              message: item.message,
            });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('name', { message: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={() => {
        toggle();
        reset(defaultValues);
      }}
      title={title}
      content={renderForm()}
      footer={!isView && renderFooter()}
    />
  );
};

export default ModalNatureOfFinding;
