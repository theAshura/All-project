import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
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
import { Location } from 'models/api/location/location.model';
import LabelUI from 'components/ui/label/LabelUI';
import { createLocationActions } from 'store/location/location.action';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { LOCATION_FIELDS_DETAILS } from 'constants/dynamic/location.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface ModalLocationProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: Location;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const defaultValues = {
  code: '',
  name: '',
  acronym: '',
  description: '',
  status: 'active',
};

const ModalLocation: FC<ModalLocationProps> = (props, ref) => {
  const {
    loading,
    toggle,
    title,
    isOpen,
    data,
    isCreate,
    handleSubmitForm,
    isView,
  } = props;
  const { errorList } = useSelector((state) => state.location);
  const dispatch = useDispatch();

  const modulePage = useMemo((): ModulePage => {
    if (isView) {
      return ModulePage.View;
    }
    return ModulePage.Create;
  }, [isView]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonLocationmaster,
    modulePage,
  });

  const schema = yup.object().shape({
    description: yup.string().trim().nullable(),
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
    reset,
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
    setValue('acronym', '');
  };

  const handleCancel = useCallback(() => {
    clearErrors();
    reset(defaultValues);
    toggle();
    dispatch(createLocationActions.failure(null));
  }, [clearErrors, dispatch, reset, toggle]);

  const onSubmitForm = (formData: Location) => {
    const newData: Location = { ...formData, resetForm };
    handleSubmitForm(newData);
  };

  const handleSubmitAndNew = (data: Location) => {
    const dataNew: Location = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div className={cx('wrap__Form')}>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                LOCATION_FIELDS_DETAILS['Location code'],
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
                dynamicLabels,
                LOCATION_FIELDS_DETAILS['Enter location code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                LOCATION_FIELDS_DETAILS['Location name'],
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
                dynamicLabels,
                LOCATION_FIELDS_DETAILS['Enter location name'],
              )}
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                LOCATION_FIELDS_DETAILS.LocAcronym,
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('acronym')}
              isRequired
              disabled={isView}
              messageRequired={errors?.acronym?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                LOCATION_FIELDS_DETAILS['Enter locAcronym'],
              )}
              maxLength={3}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                LOCATION_FIELDS_DETAILS.Description,
              )}
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <Input
              {...register('description')}
              disabled={isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                LOCATION_FIELDS_DETAILS['Enter description'],
              )}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                LOCATION_FIELDS_DETAILS.Status,
              )}
            />
          </Col>
          <Col className="ps-0 d-flex" md={9} xs={9}>
            <RadioForm
              disabled={isView}
              name="status"
              control={control}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    LOCATION_FIELDS_DETAILS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    LOCATION_FIELDS_DETAILS.Inactive,
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
    if (data && !isCreate) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
      setValue('acronym', data?.acronym);
    } else {
      reset(defaultValues);
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
      setError('code', { message: '' });
      setError('name', { message: '' });
      setError('acronym', { message: '' });
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
        LOCATION_FIELDS_DETAILS[title || 'Location information'],
      )}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalLocation;
