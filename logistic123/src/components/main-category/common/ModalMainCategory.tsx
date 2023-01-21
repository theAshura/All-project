import { yupResolver } from '@hookform/resolvers/yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import LabelUI from 'components/ui/label/LabelUI';
import ModalComponent from 'components/ui/modal/Modal';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_NAME,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { MAIN_CATEGORY_FIELDS_DETAILS } from 'constants/dynamic/main-category.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { MainCategory } from 'models/api/main-category/main-category.model';
import { FC, ReactNode, useEffect, useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { createMainCategoryActions } from 'store/main-category/main-category.action';
import * as yup from 'yup';

interface ModalMainCategoryProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: MainCategory;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const ModalMainCategory: FC<ModalMainCategoryProps> = (props) => {
  const { loading, toggle, isOpen, data, handleSubmitForm, isView } = props;
  const { errorList } = useSelector((state) => state.mainCategory);
  const dispatch = useDispatch();
  const modulePage = useMemo((): ModulePage => {
    if (isView) {
      return ModulePage.View;
    }
    return ModulePage.Create;
  }, [isView]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonMaincategory,
    modulePage,
  });
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    acronym: '',
    status: 'active',
  };

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
    acronym: yup
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
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('status', 'active');
    setValue('acronym', '');
  };

  const handleCancel = () => {
    toggle();
    resetForm();
    setError('code', { message: '' });
    setError('name', { message: '' });
    setError('acronym', { message: '' });
    dispatch(createMainCategoryActions.failure(null));
  };

  const onSubmitForm = (formData: MainCategory) =>
    handleSubmitForm({ ...formData, resetForm });

  const handleSubmitAndNew = (data: MainCategory) => {
    const dataNew: MainCategory = { ...data, isNew: true, resetForm };
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
                MAIN_CATEGORY_FIELDS_DETAILS['Main category code'],
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
                MAIN_CATEGORY_FIELDS_DETAILS['Enter main category code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                MAIN_CATEGORY_FIELDS_DETAILS['Main category name'],
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
                MAIN_CATEGORY_FIELDS_DETAILS['Enter main category name'],
              )}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                MAIN_CATEGORY_FIELDS_DETAILS.MainAcronym,
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <Input
              {...register('acronym')}
              isRequired
              disabled={loading || isView}
              messageRequired={errors?.acronym?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                MAIN_CATEGORY_FIELDS_DETAILS['Enter mainAcronym'],
              )}
              maxLength={3}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                MAIN_CATEGORY_FIELDS_DETAILS.Description,
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
                MAIN_CATEGORY_FIELDS_DETAILS['Enter description'],
              )}
            />
          </Col>
        </Row>
        <Row className="mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                MAIN_CATEGORY_FIELDS_DETAILS.Status,
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
                    MAIN_CATEGORY_FIELDS_DETAILS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    MAIN_CATEGORY_FIELDS_DETAILS.Inactive,
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
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
          disable={loading}
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
      setValue('acronym', data?.acronym);
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('description', '');
      setValue('status', 'active');
      setValue('acronym', '');
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
          case 'acronym':
            setError('acronym', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      clearErrors();
    }
  }, [clearErrors, errorList, setError]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={handleCancel}
      title={renderDynamicLabel(
        dynamicLabels,
        MAIN_CATEGORY_FIELDS_DETAILS['Main category information'],
      )}
      content={renderForm()}
      footer={!isView && renderFooter()}
    />
  );
};

export default ModalMainCategory;
