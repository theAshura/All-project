import { FC, ReactNode, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX_LENGTH_CODE, MAX_LENGTH_NAME } from 'constants/common.const';
import { useSelector } from 'react-redux';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { AuditType } from 'models/api/audit-type/audit-type.model';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { AUDIT_TYPE_FIELDS_DETAILS } from 'constants/dynamic/audit-type-management.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface ModalAuditTypeProps {
  isOpen?: boolean;
  isCreate?: boolean;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: AuditType;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const ModalAuditType: FC<ModalAuditTypeProps> = (props) => {
  const { loading, toggle, isOpen, data, handleSubmitForm, isView, isCreate } =
    props;
  const { errorList } = useSelector((state) => state.auditType);
  const defaultValues = {
    code: '',
    name: '',
    scope: 'internal',
  };

  const modulePage = useMemo((): ModulePage => {
    if (isCreate) {
      return ModulePage.Create;
    }
    return ModulePage.View;
  }, [isCreate]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonAudittype,
    modulePage,
  });

  const schema = yup.object().shape({
    code: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    name: yup
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

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('scope', 'internal');
  };

  const handleCancel = () => {
    toggle();
    resetForm();
    setError('code', { message: '' });
    setError('name', { message: '' });
  };

  const onSubmitForm = (formData: AuditType) =>
    handleSubmitForm({ ...formData, resetForm });

  const handleSubmitAndNew = (data: AuditType) => {
    const dataNew: AuditType = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={5} xs={5}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                AUDIT_TYPE_FIELDS_DETAILS['Inspection type code'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={7} xs={7}>
            <Input
              disabled={isView}
              autoFocus
              isRequired
              placeholder={renderDynamicLabel(
                dynamicLabels,
                AUDIT_TYPE_FIELDS_DETAILS['Enter inspection type code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={5} xs={5}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                AUDIT_TYPE_FIELDS_DETAILS['Inspection type name'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={7} xs={7}>
            <Input
              {...register('name')}
              isRequired
              disabled={isView}
              messageRequired={errors?.name?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                AUDIT_TYPE_FIELDS_DETAILS['Enter inspection type name'],
              )}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={5} xs={5}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                AUDIT_TYPE_FIELDS_DETAILS.Scope,
              )}
            />
          </Col>
          <Col className="px-0 d-flex" md={7} xs={7}>
            <RadioForm
              disabled={isView}
              name="scope"
              control={control}
              radioOptions={[
                {
                  value: 'internal',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    AUDIT_TYPE_FIELDS_DETAILS.Internal,
                  ),
                },
                {
                  value: 'external',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    AUDIT_TYPE_FIELDS_DETAILS.External,
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
          handleCancel={handleCancel}
          visibleSaveBtn={!isView}
          handleSubmit={!isView && handleSubmit(onSubmitForm)}
          handleSubmitAndNew={!isView && handleSubmit(handleSubmitAndNew)}
          disable={loading}
          dynamicLabels={dynamicLabels}
        />
      </div>
    </>
  );

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('scope', data?.scope || 'internal');
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('scope', 'internal');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: item.message });
            break;
          case 'name':
            setError('name', { message: item.message });
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
      title={renderDynamicLabel(
        dynamicLabels,
        AUDIT_TYPE_FIELDS_DETAILS['Inspection type information'],
      )}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalAuditType;
