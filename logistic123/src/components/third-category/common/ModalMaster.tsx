import { FC, ReactNode, useEffect, useMemo } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { GroupButton } from 'components/ui/button/GroupButton';
import { ThirdCategory } from 'models/api/third-category/third-category.model';
import LabelUI from 'components/ui/label/LabelUI';
import { createThirdCategoryActions } from 'store/third-category/third-category.action';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL } from 'constants/dynamic/third-category.const';

interface ModalMasterProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: ThirdCategory;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const ModalMaster: FC<ModalMasterProps> = (props) => {
  const {
    loading,
    toggle,
    isOpen,
    data,
    handleSubmitForm,
    isView,
    isEdit,
    isCreate,
  } = props;
  const { errorList } = useSelector((state) => state.thirdCategory);
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
  };

  const modulePage = useMemo((): ModulePage => {
    if (isCreate) {
      return ModulePage.Create;
    }
    if (isEdit) {
      return ModulePage.Edit;
    }
    return ModulePage.View;
  }, [isCreate, isEdit]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionThirdCategory,
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
          THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL['This field is required'],
        ),
      ),
    name: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL['This field is required'],
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

  const dispatch = useDispatch();

  const handleCancel = () => {
    toggle();
    reset(defaultValues);
    dispatch(createThirdCategoryActions.failure(null));
  };
  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmitForm = (formData: ThirdCategory) => handleSubmitForm(formData);

  const handleSubmitAndNew = (data: ThirdCategory) => {
    const dataNew: ThirdCategory = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL['Third category code'],
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
                dynamicLabels,
                THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL[
                  'Enter third category code'
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
                dynamicLabels,
                THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL['Third category name'],
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
                dynamicLabels,
                THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL[
                  'Enter third category name'
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
                dynamicLabels,
                THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL.Description,
              )}
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              {...register('description')}
              disabled={loading || isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL['Enter description'],
              )}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL.Status,
              )}
            />
          </Col>
          <Col className="ps-0 d-flex" md={8} xs={8}>
            <RadioForm
              name="status"
              control={control}
              disabled={isView}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL.Inactive,
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
          className={cx('mt-1 justify-content-end')}
          handleCancel={() => {
            handleCancel();
          }}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
          disable={loading || isView}
          dynamicLabels={dynamicLabels}
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
        THIRD_CATEGORY_DYNAMIC_FIELDS_DETAIL['Third category information'],
      )}
      content={renderForm()}
      footer={!isView && renderFooter()}
    />
  );
};

export default ModalMaster;
