import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
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
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import LabelUI from 'components/ui/label/LabelUI';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import { getListRankMasterActions } from 'store/rank-master/rank-master.action';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { DepartmentMaster } from 'models/api/department-master/department-master.model';
import { createDepartmentMasterActions } from 'store/department-master/department-master.action';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DEPARTMENT_FIELDS_DETAILS } from 'constants/dynamic/department.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

interface ModalDepartmentProps {
  isOpen?: boolean;
  isCreate?: boolean;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  handleSubmitForm?: (data) => void;
  setIsCreate?: (value) => void;
  data?: DepartmentMaster;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  isView?: boolean;
}

const ModalDepartment: FC<ModalDepartmentProps> = (props) => {
  const { loading, toggle, isOpen, data, handleSubmitForm, isView, isCreate } =
    props;
  const { errorList } = useSelector((state) => state.departmentMaster);
  const [isFirstFocus, setIsLastFocus] = useState(true);
  const dispatch = useDispatch();

  const { t } = useTranslation([
    I18nNamespace.DEPARTMENT_MASTER,
    I18nNamespace.COMMON,
  ]);

  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
    type: 'shore',
    rankIds: undefined,
  };

  const modulePage = useMemo((): ModulePage => {
    if (isCreate) {
      return ModulePage.Create;
    }

    return ModulePage.View;
  }, [isCreate]);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonDepartment,
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
    type: yup
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    toggle();
    reset(defaultValues);
    dispatch(createDepartmentMasterActions.failure(null));
  };
  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('status', 'active');
    setValue('type', 'shore');
    setValue('rankIds', undefined);
  };

  const watchType = watch('type');

  useEffect(() => {
    setIsLastFocus(isOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (data) {
      if (!isFirstFocus) {
        setValue('rankIds', undefined);
      }
      if (
        isFirstFocus &&
        watchType !== data?.type &&
        data?.type === 'ship' &&
        isOpen
      ) {
        setIsLastFocus(false);
        setValue('rankIds', undefined);
      }
      if (isFirstFocus && data?.type === 'shore' && isOpen) {
        setIsLastFocus(false);
        setValue('rankIds', undefined);
      }
    } else {
      setValue('rankIds', undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchType]);

  const onSubmitForm = (formData: any) => {
    let rankList = formData.rankIds;
    rankList = rankList?.map((e) => e.value);
    let newForm = formData;
    if (rankList?.length > 0) {
      newForm = { ...formData, rankIds: rankList };
    }
    handleSubmitForm({ ...newForm, resetForm });
  };

  const handleSubmitAndNew = (formData: any) => {
    let rankList = formData.rankIds;
    rankList = rankList?.map((e) => e.value);
    let newForm = formData;
    if (rankList?.length > 0) {
      newForm = { ...formData, rankIds: rankList };
    }
    const dataNew: DepartmentMaster = { ...newForm, isNew: true, resetForm };
    handleSubmitForm(dataNew);
  };
  const { listRankMaster } = useSelector((state) => state.rankMaster);
  const rankOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listRankMaster?.data.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listRankMaster],
  );

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0 mb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                DEPARTMENT_FIELDS_DETAILS.Type,
              )}
            />
          </Col>
          <Col className="px-0 d-flex" md={9} xs={9}>
            <RadioForm
              disabled={isView}
              name="type"
              control={control}
              radioOptions={[
                {
                  value: 'shore',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    DEPARTMENT_FIELDS_DETAILS.Shore,
                  ),
                },
                {
                  value: 'ship',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    DEPARTMENT_FIELDS_DETAILS.Ship,
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 mb-3">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                DEPARTMENT_FIELDS_DETAILS['Department code'],
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
                DEPARTMENT_FIELDS_DETAILS['Enter department code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MAX_LENGTH_CODE}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 mb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                DEPARTMENT_FIELDS_DETAILS['Department name'],
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
                DEPARTMENT_FIELDS_DETAILS['Enter department name'],
              )}
              maxLength={MAX_LENGTH_NAME}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 mb-3">
          <Col className="ps-0  d-flex align-items-start" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                DEPARTMENT_FIELDS_DETAILS.Rank,
              )}
            />
          </Col>
          <Col className="px-0 " md={9} xs={9}>
            <AsyncSelectResultForm
              multiple
              disabled={isView}
              control={control}
              className="w-100"
              name="rankIds"
              titleResults={renderDynamicLabel(
                dynamicLabels,
                DEPARTMENT_FIELDS_DETAILS.Selected,
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              searchContent={renderDynamicLabel(
                dynamicLabels,
                DEPARTMENT_FIELDS_DETAILS.Rank,
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                DEPARTMENT_FIELDS_DETAILS['Select all'],
              )}
              dynamicLabels={dynamicLabels}
              messageRequired={errors?.rankIds?.message || ''}
              onChangeSearch={(value: string) =>
                dispatch(
                  getListRankMasterActions.request({
                    pageSize: -1,
                    isRefreshLoading: false,
                    content: value,
                    status: 'active',
                    type: watchType,
                  }),
                )
              }
              options={rankOptions || []}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0 mb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                DEPARTMENT_FIELDS_DETAILS.Description,
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
                DEPARTMENT_FIELDS_DETAILS['Enter description'],
              )}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0 mb-3">
          <Col className="ps-0  d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                DEPARTMENT_FIELDS_DETAILS.Status,
              )}
            />
          </Col>
          <Col className="px-0 d-flex" md={9} xs={9}>
            <RadioForm
              disabled={isView}
              name="status"
              control={control}
              radioOptions={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    DEPARTMENT_FIELDS_DETAILS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    DEPARTMENT_FIELDS_DETAILS.Inactive,
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
          className="mt-2 justify-content-end"
          handleCancel={() => {
            handleCancel();
          }}
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
  const fillRankID = (ranks) => {
    const initRank = [];

    ranks?.forEach((element) => {
      initRank.push({ value: element?.id, label: element?.name });
    });
    return initRank;
  };

  useEffect(() => {
    if (data) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('description', data?.description);
      setValue('status', data?.status || 'active');
      setValue('type', data?.type);
      setValue('rankIds', fillRankID(data.ranks) || []);
    } else {
      setValue('code', '');
      setValue('name', '');
      setValue('description', '');
      setValue('status', 'active');
      setValue('type', 'shore');
      setValue('rankIds', undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: t('departmentCodeIsExisted') });
            break;
          case 'name':
            setError('name', { message: t('departmentNameIsExisted') });
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
        DEPARTMENT_FIELDS_DETAILS['Department information'],
      )}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalDepartment;
