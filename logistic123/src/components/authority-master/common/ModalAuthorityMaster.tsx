import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  MAX_LENGTH_NAME,
  MAX_LENGTH_OPTIONAL,
} from 'constants/common.const';
import { useSelector } from 'react-redux';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { AuthorityMaster } from 'models/api/authority-master/authority-master.model';
import LabelUI from 'components/ui/label/LabelUI';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';

import styles from './modal.module.scss';

interface ModalAuthorityMasterProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: AuthorityMaster;
  isEdit?: boolean;
  isView?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
}

const ModalAuthorityMaster: FC<ModalAuthorityMasterProps> = (props) => {
  const { loading, toggle, title, isOpen, data, isView, handleSubmitForm } =
    props;
  const { errorList } = useSelector((state) => state.authorityMaster);
  const { listEventTypes } = useSelector((state) => state.eventType);
  const { listAuditTypes } = useSelector((state) => state.auditType);

  const { t } = useTranslation([
    I18nNamespace.AUTHORITY_MASTER,
    I18nNamespace.COMMON,
  ]);
  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
    scope: 'all',
    inspectionTypes: [],
    eventTypes: [],
  };

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('txFieldRequired')),
    name: yup.string().trim().nullable().required(t('txFieldRequired')),
  });
  const [optionEventTypes, setOptionEventTypes] = useState([]);
  const [optionInspectionTypes, setOptionInspectionTypes] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const scopeWatch = watch('scope');
  const inspectionTypesWatch = watch('inspectionTypes');

  const handleCancel = () => {
    toggle();
    reset();
  };

  const onSubmitForm = useCallback(
    (formData: AuthorityMaster) => {
      const { inspectionTypes, eventTypes, ...others } = formData;
      let newData = others;

      newData = {
        ...newData,
        eventTypeIds: eventTypes?.map((i) => i?.value?.toString()),
        inspectionTypeIds: inspectionTypes?.map((i) => i?.value?.toString()),
      };

      handleSubmitForm({ ...newData, resetForm: reset });
    },
    [handleSubmitForm, reset],
  );

  const handleSubmitAndNew = (data: AuthorityMaster) => {
    const { inspectionTypes, eventTypes, ...others } = data;
    let newData = others;
    if (inspectionTypes?.length) {
      newData = {
        ...newData,
        inspectionTypeIds: inspectionTypes?.map((i) => i?.value?.toString()),
      };
    }
    if (eventTypes?.length) {
      newData = {
        ...newData,
        eventTypeIds: eventTypes?.map((i) => i?.value?.toString()),
      };
    }

    const dataParam: AuthorityMaster = {
      ...newData,
      isNew: true,
      resetForm: reset,
    };
    handleSubmitForm(dataParam);
  };

  const listOptionEventTypes = useMemo(() => {
    const dataOptions =
      listEventTypes?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })) || [];
    if (data?.eventTypes?.length) {
      data?.eventTypes.forEach((i) => {
        const hasItem = listEventTypes?.data?.some(
          (eventType) => eventType.id === i.id,
        );
        if (!hasItem) {
          dataOptions?.push({
            value: i.id,
            label: i.name,
          });
        }
      });
    }

    return dataOptions;
  }, [listEventTypes, data?.eventTypes]);

  const listOptionInspectionTypes = useMemo(
    () =>
      listAuditTypes?.data
        ?.filter((i) => {
          if (scopeWatch === 'all') return true;
          return i?.scope === scopeWatch;
        })
        ?.map((item) => ({
          value: item.id,
          label: item.name,
        })) || [],
    [listAuditTypes, scopeWatch],
  );

  useEffect(() => {
    const newDataInspectionTypes =
      inspectionTypesWatch?.filter((item) =>
        listOptionInspectionTypes?.some((i) => i.value === item?.value),
      ) || [];

    setValue('inspectionTypes', newDataInspectionTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOptionInspectionTypes]);

  const renderForm = useMemo(
    () => (
      <>
        <div className={cx(styles.containerForm, 'wrap__Form')}>
          <Row className="pt-2 mx-0">
            <Col className="ps-0">
              <Input
                label={t('txAuthorityMasterCodeForm')}
                disabled={isView}
                autoFocus
                isRequired
                placeholder={t('txPlaceHolderAuthorityMasterCode')}
                messageRequired={errors?.code?.message || ''}
                {...register('code')}
                maxLength={MAX_LENGTH_CODE}
              />
            </Col>
            <Col className="pe-0">
              <Input
                label={t('txAuthorityMasterNameForm')}
                {...register('name')}
                isRequired
                disabled={isView}
                messageRequired={errors?.name?.message || ''}
                placeholder={t('txPlaceHolderAuthorityMasterName')}
                maxLength={MAX_LENGTH_NAME}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0">
              <Row className="pt-2 mx-0">
                <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
                  <LabelUI label="Status:" />
                </Col>
                <Col className="ps-0 d-flex" md={9} xs={9}>
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
            </Col>
            <Col className="pe-0">
              <Row className="pt-2 mx-0">
                <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
                  <LabelUI label="Scope:" />
                </Col>
                <Col className="ps-0 d-flex" md={9} xs={9}>
                  <RadioForm
                    name="scope"
                    disabled={isView}
                    control={control}
                    radioOptions={[
                      { value: 'all', label: 'All' },
                      { value: 'external', label: 'External' },
                      { value: 'internal', label: 'Internal' },
                    ]}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0">
              <AsyncSelectResultForm
                multiple
                disabled={isView}
                labelSelect="Event type"
                control={control}
                name="eventTypes"
                id="eventTypes"
                titleResults="Selected"
                placeholder="Please select"
                searchContent="Event type"
                textSelectAll="Select All"
                messageRequired={errors?.eventTypes?.message || ''}
                onChangeSearch={(value: string) => {
                  const newData = filterContentSelect(
                    value,
                    listOptionEventTypes || [],
                  );
                  setOptionEventTypes(newData);
                }}
                options={optionEventTypes}
              />
            </Col>

            <Col className="pe-0">
              <AsyncSelectResultForm
                multiple
                disabled={isView}
                labelSelect="Inspection type"
                control={control}
                name="inspectionTypes"
                id="inspectionTypes"
                titleResults="Selected"
                placeholder="Please select"
                searchContent="Inspection type"
                textSelectAll="Select All"
                messageRequired={errors?.inspectionTypes?.message || ''}
                onChangeSearch={(value: string) => {
                  const newData = filterContentSelect(
                    value,
                    listOptionInspectionTypes || [],
                  );
                  setOptionInspectionTypes(newData);
                }}
                options={optionInspectionTypes}
              />
            </Col>
          </Row>

          <div className="pt-2">
            <Input
              label={t('txDescription')}
              {...register('description')}
              disabled={isView}
              maxLength={MAX_LENGTH_OPTIONAL}
              placeholder={t('txPlaceHolderDescription')}
            />
          </div>
        </div>
      </>
    ),
    [
      control,
      errors?.code?.message,
      errors?.eventTypes?.message,
      errors?.inspectionTypes?.message,
      errors?.name?.message,
      isView,
      listOptionEventTypes,
      listOptionInspectionTypes,
      optionEventTypes,
      optionInspectionTypes,
      register,
      t,
    ],
  );

  const renderFooter = () => (
    <>
      <PermissionCheck
        options={{
          feature: Features.CONFIGURATION,
          subFeature: SubFeatures.AUTHORITY_MASTER,
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
    </>
  );

  // effect
  useEffect(() => {
    if (data) {
      const dataInspectionTypes =
        data?.inspectionTypes?.map((i) => ({
          value: i.id,
          label: i.name,
        })) || [];

      const dataEventTypes =
        data?.eventTypes?.map((i) => ({
          value: i.id,
          label: i.name,
        })) || [];
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
      setValue('inspectionTypes', dataInspectionTypes);
      setValue('eventTypes', dataEventTypes);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: t('txAuthorityMasterCodeExist') });
            break;
          case 'name':
            setError('name', { message: t('txAuthorityMasterNameExist') });
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
      w={1000}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm}
      footer={isView || !isOpen ? null : renderFooter()}
    />
  );
};

export default ModalAuthorityMaster;
