import { FC, ReactNode, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_NAME,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import { VesselType } from 'models/api/vessel-type/vessel-type.model';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { CDI } from 'models/api/cdi/cdi.model';
import { createCDIActions } from 'store/cdi/cdi.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { CDI_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/cdi.const';

interface ModalCDIProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: VesselType;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const ModalCDI: FC<ModalCDIProps> = (props) => {
  const {
    loading,
    toggle,
    title,
    isOpen,
    data,
    handleSubmitForm,
    isView,
    isCreate,
  } = props;
  const { errorList } = useSelector((state) => state.cdi);
  const dispatch = useDispatch();
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
  };

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionChemicalDistributionInstitute,
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
          CDI_DYNAMIC_DETAIL_FIELDS['This field is required'],
        ),
      ),
    name: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          CDI_DYNAMIC_DETAIL_FIELDS['This field is required'],
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
    dispatch(createCDIActions.failure(null));
  };
  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('status', 'active');
  };

  const onSubmitForm = (formData: CDI) => handleSubmitForm({ ...formData });

  const handleSubmitAndNew = (data: CDI) => {
    const dataNew: CDI = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['CDI code'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              disabled={isView}
              autoFocus
              isRequired
              placeholder={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['Enter CDI code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['CDI name'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('name')}
              isRequired
              disabled={isView}
              messageRequired={errors?.name?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['Enter CDI name'],
              )}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS.Description,
              )}
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('description')}
              disabled={isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['Enter description'],
              )}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS.Status,
              )}
            />
          </Col>
          <Col className="px-0 d-flex" md={9} xs={9}>
            <RadioForm
              disabled={isView}
              name="status"
              control={control}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicFields,
                    CDI_DYNAMIC_DETAIL_FIELDS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicFields,
                    CDI_DYNAMIC_DETAIL_FIELDS.Inactive,
                  ),
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
          className="mt-1 justify-content-end"
          handleCancel={() => {
            handleCancel();
          }}
          visibleSaveBtn={!isView}
          handleSubmit={!isView && handleSubmit(onSubmitForm)}
          handleSubmitAndNew={!isView && handleSubmit(handleSubmitAndNew)}
          disable={loading}
          txButtonLeft={renderDynamicLabel(
            dynamicFields,
            CDI_DYNAMIC_DETAIL_FIELDS.Cancel,
          )}
          txButtonBetween={renderDynamicLabel(
            dynamicFields,
            CDI_DYNAMIC_DETAIL_FIELDS.Save,
          )}
          txButtonRight={renderDynamicLabel(
            dynamicFields,
            CDI_DYNAMIC_DETAIL_FIELDS['Save & New'],
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
              message: renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['The CDI code is existed'],
              ),
            });
            break;
          case 'name':
            setError('name', {
              message: renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['The CDI name is existed'],
              ),
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
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalCDI;
