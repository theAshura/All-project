import { FC, ReactNode, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_TEXT,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { getListPortActions } from 'store/port/port.action';
import { Terminal } from 'models/api/terminal/terminal.model';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { createTerminalActions } from 'store/terminal/terminal.action';

interface ModalMasterProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: Terminal;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const ModalMaster: FC<ModalMasterProps> = (props) => {
  const { loading, toggle, title, isOpen, data, handleSubmitForm, isView } =
    props;
  const { errorList } = useSelector((state) => state.terminal);
  const { listPort } = useSelector((state) => state.port);
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.SECOND_CATEGORY,
    I18nNamespace.COMMON,
  ]);
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
    portMasterId: [],
  };

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    portMasterId: yup
      .array()
      .required('This field is required')
      .min(1, 'This field is required'),
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
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    toggle();
    reset(defaultValues);
    dispatch(createTerminalActions.failure(null));
  };
  const resetForm = () => {
    reset(defaultValues);
  };

  const dataTableChooseLocation = useMemo(
    () =>
      listPort?.data
        ?.filter((item) => item?.status === 'active')
        ?.map((item) => ({
          value: item?.id,
          label: item?.name,
        })),
    [listPort?.data],
  );

  const onSubmitForm = (data) => {
    const dataSubmit: Terminal = {
      ...data,
      portMasterId: data.portMasterId[0].value,
    };
    handleSubmitForm(dataSubmit);
  };

  const handleSubmitAndNew = (data) => {
    const dataNew: Terminal = {
      ...data,
      portMasterId: data.portMasterId[0].value,
      isNew: true,
      resetForm,
    };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div className={cx('wrap__Form')}>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI label="Port" isRequired />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <AsyncSelectForm
              control={control}
              name="portMasterId"
              id="portMasterId"
              disabled={isView}
              isRequired
              titleResults="Selected group"
              placeholder="Please select"
              searchContent="Port"
              textSelectAll="Select all"
              textBtnConfirm="Confirm"
              messageRequired={errors?.portMasterId?.message || ''}
              onChangeSearch={(value: string) => {
                dispatch(
                  getListPortActions.request({
                    content: value,
                  }),
                );
              }}
              options={dataTableChooseLocation || []}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI label="Terminal code" isRequired />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              disabled={isView}
              isRequired
              placeholder="Enter terminal code"
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label="Terminal name" isRequired />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              {...register('name')}
              isRequired
              disabled={isView}
              messageRequired={errors?.name?.message || ''}
              placeholder="Enter terminal name"
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('description')} />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              {...register('description')}
              disabled={isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={t('placeholderDescription')}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI label={t('status')} />
          </Col>
          <Col className="ps-0 d-flex" md={8} xs={8}>
            <RadioForm
              name="status"
              disabled={isView}
              control={control}
              radioOptions={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
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
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.TERMINAL,
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
            />
          )}
        </PermissionCheck>
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
      setValue('portMasterId', [
        {
          value: data?.portMasterId,
          label: data?.portMasterId,
        },
      ]);
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('description', '');
      setValue('status', 'active');
      setValue('portMasterId', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOpen]);

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
      title={title}
      content={renderForm()}
      footer={isView || !isOpen ? null : renderFooter()}
    />
  );
};

export default ModalMaster;
