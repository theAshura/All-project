import { FC, ReactNode, useState, useEffect, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { FieldValues, useForm } from 'react-hook-form';
import CustomSelect from 'components/common/custom-select/CustomSelect';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MAX_LENGTH_CODE,
  MAX_LENGTH_NAME,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
// import cx from 'classnames';
import { useSelector } from 'react-redux';
import { VESSEL_ICONS } from 'constants/components/vessel.const';
import { VesselType } from 'models/api/vessel-type/vessel-type.model';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import { CharterOwner } from 'models/api/charter-owner/charter-owner.model';
import SelectUI from 'components/ui/select/Select';
import { vettingOptions } from 'constants/filter.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { VESSEL_TYPE_FIELDS_DETAILS } from 'constants/dynamic/vessel-type.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import classes from './modal-vessel-type.module.scss';
import PREFIX_API from '../../../constants/api.const';

interface ModalVesselTypeProps {
  isOpen?: boolean;
  isCreate?: boolean;
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

const ModalVesselType: FC<ModalVesselTypeProps> = (props) => {
  const {
    loading,
    toggle,
    isOpen,
    data,
    handleSubmitForm,
    isEdit,
    isCreate,
    isView,
  } = props;
  const [iconSelectVisible, setIconSelectVisible] = useState(false);

  const { errorList } = useSelector((state) => state.vesselType);

  const modulePage = useMemo((): ModulePage => {
    if (isView) {
      return ModulePage.View;
    }
    return ModulePage.Create;
  }, [isView]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonVesseltype,
    modulePage,
  });
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
    vettingRiskScore: undefined,
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
    icon: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    vettingRiskScore: yup
      .string()
      .nullable()
      .trim()
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
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const watchIcon = watch('icon');

  const handleCancel = () => {
    toggle();
    reset(defaultValues);
  };
  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('icon', '');
    setValue('description', '');
    setValue('status', 'active');
    setValue('vettingRiskScore', null);
  };

  const onSubmitForm = (formData: CharterOwner) =>
    handleSubmitForm({ ...formData, resetForm });

  const handleSubmitAndNew = (data: CharterOwner) => {
    const dataNew: CharterOwner = { ...data, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0 d-flex align-self-start" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_TYPE_FIELDS_DETAILS['Vessel type code'],
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
                VESSEL_TYPE_FIELDS_DETAILS['Enter vessel type code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-self-start" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_TYPE_FIELDS_DETAILS['Vessel type name'],
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
                VESSEL_TYPE_FIELDS_DETAILS['Enter vessel type name'],
              )}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-self-start" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_TYPE_FIELDS_DETAILS.Icon,
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={8} xs={8}>
            <CustomSelect
              isOpen={iconSelectVisible}
              toggle={(isOpen) => setIconSelectVisible(isOpen)}
              value={
                watchIcon ? (
                  <img
                    src={`${PREFIX_API.VESSEL_IMG}${watchIcon}`}
                    className={classes.iconSelected}
                    alt="img"
                  />
                ) : null
              }
              messageRequired={errors?.icon?.message || ''}
              customSelect={
                <div>
                  <div className={classes.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      VESSEL_TYPE_FIELDS_DETAILS.Icon,
                    )}
                  </div>

                  <div className={classes.wrapIcons}>
                    {VESSEL_ICONS?.filter(
                      (item) => item.path !== watchIcon,
                    )?.map((item) => (
                      <div
                        key={item?.name}
                        onClick={() => {
                          setValue('icon', item?.path);
                          setIconSelectVisible(false);
                          setError('icon', null);
                        }}
                      >
                        <img
                          src={`${PREFIX_API.VESSEL_IMG}${item?.path}`}
                          alt="img"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              }
              isView={isView}
              dynamicLabels={dynamicLabels}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-self-start" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_TYPE_FIELDS_DETAILS['Vetting management risk'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0 " md={8} xs={8}>
            <SelectUI
              // labelSelect={t('txVettingManagementRiskForm')}
              isRequired
              data={vettingOptions}
              notAllowSortData
              disabled={!isEdit && !isCreate && isView}
              name="vettingRiskScore"
              className="w-100"
              control={control}
              messageRequired={errors?.vettingRiskScore?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0 pb-3">
          <Col className="ps-0  d-flex align-self-start" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_TYPE_FIELDS_DETAILS.Description,
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
                VESSEL_TYPE_FIELDS_DETAILS['Enter description'],
              )}
            />
          </Col>
        </Row>

        <Row className="mx-0">
          <Col className="ps-0  d-flex align-self-start" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                VESSEL_TYPE_FIELDS_DETAILS.Status,
              )}
            />
          </Col>
          <Col className="px-0 d-flex" md={8} xs={8}>
            <RadioForm
              name="status"
              control={control}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    VESSEL_TYPE_FIELDS_DETAILS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    VESSEL_TYPE_FIELDS_DETAILS.Inactive,
                  ),
                },
              ]}
              disabled={isView}
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
    if (data) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('icon', data?.icon);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
      setValue('vettingRiskScore', data?.vettingRiskScore);
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('icon', '');
      setValue('description', '');
      setValue('status', 'active');
      setValue('vettingRiskScore', null);
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
      toggle={() => {
        toggle();
        reset(defaultValues);
      }}
      title={renderDynamicLabel(
        dynamicLabels,
        VESSEL_TYPE_FIELDS_DETAILS['Vessel type information'],
      )}
      content={renderForm()}
      footer={!isView && renderFooter()}
    />
  );
};

export default ModalVesselType;
