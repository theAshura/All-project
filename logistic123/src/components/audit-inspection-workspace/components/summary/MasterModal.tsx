import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import Input from 'components/ui/input/Input';
import ModalComponent from 'components/ui/modal/Modal';
import { FC, useCallback, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { GroupButton } from 'components/ui/button/GroupButton';
import { MasterChiefInspection } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { useSelector } from 'react-redux';

interface ModalMasterProps {
  title: string;
  isOpen: boolean;
  data: string;
  toggle: () => void;
  handleSubmitForm: (data: MasterChiefInspection) => void;
  loading: boolean;
  dynamicLabels?: IDynamicLabel;
  placeholder?: string;
  disabled?: boolean;
}

enum typeModal {
  MASTER = 'master',
  CHIEF = 'chiefOfEngineer',
}

const MasterModal: FC<ModalMasterProps> = (props) => {
  const {
    loading,
    toggle,
    title,
    isOpen,
    data,
    handleSubmitForm,
    placeholder,
    disabled,
    dynamicLabels,
  } = props;
  const { auditInspectionWorkspaceDetail } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );

  const schema = yup.object().shape({
    value: yup.string().trim(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmitForm = useCallback(
    (formData) => {
      handleSubmitForm({
        id: auditInspectionWorkspaceDetail.id,
        type:
          title.toLowerCase() === typeModal.MASTER
            ? typeModal.MASTER
            : typeModal.CHIEF,
        ...formData,
      });
    },
    [auditInspectionWorkspaceDetail?.id, handleSubmitForm, title],
  );

  useEffect(() => {
    if (isOpen) {
      setValue('value', data || '');
    }
  }, [data, isOpen, setValue]);

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2">
          <Col className="pb-4" md={12} xs={12}>
            <Input
              autoFocus
              label={title}
              placeholder={placeholder}
              {...register('value')}
              messageRequired={errors?.value?.message || ''}
              maxLength={128}
              disabled={disabled}
              disabledCss={disabled}
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
            toggle();
          }}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={loading || disabled}
          dynamicLabels={dynamicLabels}
        />
      </div>
    </>
  );

  // effect

  return (
    <ModalComponent
      isOpen={isOpen}
      toggle={() => {
        toggle();
      }}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default MasterModal;
