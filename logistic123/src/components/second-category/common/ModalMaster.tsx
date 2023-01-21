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
import { useDispatch, useSelector } from 'react-redux';
import { GroupButton } from 'components/ui/button/GroupButton';
import { SecondCategory } from 'models/api/second-category/second-category.model';
import LabelUI from 'components/ui/label/LabelUI';
import { createSecondCategoryActions } from 'store/second-category/second-category.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD } from 'constants/dynamic/secondCategory.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface ModalMasterProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: SecondCategory;
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
    title,
    isOpen,
    data,
    handleSubmitForm,
    isView,
    isCreate,
  } = props;
  const { errorList } = useSelector((state) => state.secondCategory);
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    acronym: '',
    status: 'active',
  };

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionSecondCategory,
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
    acronym: yup
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
  const dispatch = useDispatch();

  const handleCancel = () => {
    toggle();
    reset(defaultValues);
    dispatch(createSecondCategoryActions.failure(null));
  };
  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmitForm = (formData: SecondCategory) => handleSubmitForm(formData);

  const handleSubmitAndNew = (data: SecondCategory) => {
    const dataNew: SecondCategory = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div className={cx('wrap__Form')}>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD['Second category code'],
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
                SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD[
                  'Enter second category code'
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
                SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD['Second category name'],
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
                SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD[
                  'Enter second category name'
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
                SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD.SecAcronym,
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
                dynamicFields,
                SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD['Enter SecAcronym'],
              )}
              maxLength={3}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD.Description,
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
                SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD['Enter description'],
              )}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD.Status,
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
                    dynamicFields,
                    COMMON_DYNAMIC_FIELDS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicFields,
                    COMMON_DYNAMIC_FIELDS.Inactive,
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
          handleCancel={handleCancel}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
          disable={loading || isView}
          txButtonLeft={renderDynamicLabel(
            dynamicFields,
            SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD.Cancel,
          )}
          txButtonBetween={renderDynamicLabel(
            dynamicFields,
            SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD.Save,
          )}
          txButtonRight={renderDynamicLabel(
            dynamicFields,
            SECOND_CATEGORY_DYNAMIC_DETAIL_FIELD['Save & New'],
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
      setValue('acronym', data?.acronym);
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('description', '');
      setValue('status', 'active');
      setValue('acronym', '');
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
          case 'acronym':
            setError('acronym', { message: item.message });
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
      footer={!isView && renderFooter()}
    />
  );
};

export default ModalMaster;
