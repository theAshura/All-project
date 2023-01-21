import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_OPTIONAL,
  MAX_LENGTH_TEXT,
} from 'constants/common.const';
import { useDispatch, useSelector } from 'react-redux';
import SelectAsyncForm from 'components/react-hook-form/async-select/SelectAsyncForm';
import { getListVesselTypeActions } from 'store/vessel-type/vessel-type.action';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';

import { PlanDrawing } from '../utils/model';
import { checkExitCodeApi } from '../utils/api';
import { createPlanDrawingActions } from '../store/action';

const defaultParams = { pageSize: -1, status: 'active' };
const OPTION_STATUS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: PlanDrawing;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  vesselTypeIds: [],
  status: 'active',
};

const ModalMaster: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, data, isView, handleSubmitForm } =
    props;
  const { errorList } = useSelector((state) => state.planDrawing);
  const { listVesselTypes, loading: loadingVesselTypes } = useSelector(
    (state) => state.vesselType,
  );

  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.PLAN_DRAWING,
    I18nNamespace.COMMON,
  ]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        code: yup.string().trim().nullable().required(t('errors.required')),
        name: yup.string().trim().nullable().required(t('errors.required')),
        vesselTypeIds: yup
          .array()
          .nullable()
          .min(1, t('errors.required'))
          .required(t('errors.required')),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const optionVesselTypes = useMemo(
    () =>
      listVesselTypes?.data?.map((item) => ({
        value: item.id,
        label: item?.name,
      })),
    [listVesselTypes?.data],
  );

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
    clearErrors();
    dispatch(createPlanDrawingActions.failure(null));
  }, [clearErrors, resetForm, toggle, dispatch]);

  const onSubmitForm = useCallback(
    (formData: PlanDrawing) =>
      handleSubmitForm({
        ...formData,
        vesselTypeIds: formData?.vesselTypeIds?.length
          ? formData?.vesselTypeIds
          : null,
        resetForm,
      }),
    [handleSubmitForm, resetForm],
  );

  const handleSubmitAndNew = useCallback(
    (formData: PlanDrawing) => {
      const dataNew: PlanDrawing = {
        ...formData,
        vesselTypeIds: formData?.vesselTypeIds?.length
          ? formData?.vesselTypeIds
          : null,
        isNew: true,
        resetForm,
      };
      handleSubmitForm(dataNew);
    },
    [handleSubmitForm, resetForm],
  );

  const handleCheckExit = useCallback(
    (field: string, value: string) => {
      if (field && value) {
        checkExitCodeApi({
          entity: 'plans-drawings-master',
          field,
          value,
        })
          .then((res) => {
            if (res.data.isExist) {
              switch (field) {
                case 'code':
                  if (value.trim() !== data?.code) {
                    setError(field, {
                      message: t('planDrawingCodeIsExisted'),
                    });
                  }
                  break;
                case 'name':
                  if (value.trim() !== data?.name) {
                    setError(field, {
                      message: t('planDrawingNameIsExisted'),
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
    [data?.code, data?.name, setError, t],
  );

  const renderForm = useMemo(
    () => (
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('planDrawingCodeForm')} isRequired />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              disabled={isView}
              autoFocus
              isRequired
              placeholder={t('placeholderPlanDrawingCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
              onBlur={(e: any) => handleCheckExit('code', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('planDrawingNameForm')} isRequired />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('name')}
              isRequired
              disabledCss={isView}
              readOnly={isView}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeholderPlanDrawingName')}
              maxLength={MAX_LENGTH_TEXT}
              onBlur={(e: any) => handleCheckExit('name', e.target.value)}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 pt-2 " md={3} xs={3}>
            <LabelUI label={t('vesselTypeForm')} isRequired />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <SelectAsyncForm
              disabled={isView || loadingVesselTypes}
              className="w-100"
              placeholder="Please select"
              searchContent={t('vesselType')}
              name="vesselTypeIds"
              multiple
              showResult
              textSelectAll="Select all"
              messageRequired={errors?.vesselTypeIds?.message || ''}
              control={control}
              onChangeSearch={(value: string) =>
                dispatch(
                  getListVesselTypeActions.request({
                    ...defaultParams,
                    content: value,
                  }),
                )
              }
              options={optionVesselTypes}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('description')} />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              disabled={isView}
              placeholder={t('txPlaceHolderDescription')}
              messageRequired={errors?.description?.message || ''}
              {...register('description')}
              maxLength={MAX_LENGTH_OPTIONAL}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI label={t('status')} />
          </Col>
          <Col className="px-0 d-flex" md={9} xs={9}>
            <RadioForm
              name="status"
              control={control}
              disabled={isView}
              radioOptions={OPTION_STATUS}
            />
          </Col>
        </Row>
      </div>
    ),
    [
      t,
      isView,
      errors?.code?.message,
      errors?.name?.message,
      errors?.vesselTypeIds?.message,
      errors?.description?.message,
      register,
      loadingVesselTypes,
      control,
      optionVesselTypes,
      handleCheckExit,
      dispatch,
    ],
  );

  const renderFooter = useMemo(
    () => (
      <div>
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.PLAN_DRAWING,
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
    ),
    [handleCancel, handleSubmit, handleSubmitAndNew, loading, onSubmitForm],
  );

  // effect
  useEffect(() => {
    if (data) {
      const vesselTypeIds = data?.vesselTypes?.map((item) => item?.id) || [];

      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('status', data?.status || 'active');
      setValue('description', data?.description || '');
      setValue('vesselTypeIds', vesselTypeIds);
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('status', 'active');
      setValue('description', '');
      setValue('vesselTypeIds', []);
    }
  }, [data, setValue]);

  useEffect(() => {
    dispatch(
      getListVesselTypeActions.request({
        ...defaultParams,
      }),
    );
  }, [data, dispatch]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: t('planDrawingCodeIsExisted') });
            break;
          case 'name':
            setError('name', { message: t('planDrawingNameIsExisted') });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('name', { message: '' });
    }
  }, [errorList, setError, t]);

  return (
    <ModalComponent
      w={800}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm}
      footer={isView || !isOpen ? null : renderFooter}
    />
  );
};

export default ModalMaster;
