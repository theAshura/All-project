import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import ModalComponent from 'components/ui/modal/Modal';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { CategoryMappingDetailResponse } from 'models/api/category-mapping/category-mapping.model';
import { GroupButton } from 'components/ui/button/GroupButton';
import SelectUI from 'components/ui/select/Select';
import TableCheckbox from 'components/common/table-antd/TableAntdCheckbox';
import LabelUI from 'components/ui/label/LabelUI';
import { getListCategoryMappingsActionsApi } from 'api/category-mapping.api';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/categoryMapping';
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
  dataDetail?: CategoryMappingDetailResponse;
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
    dataDetail,
    isCreate,
    handleSubmitForm,
    isView,
  } = props;
  const { errorList } = useSelector((state) => state.categoryMapping);
  const [usedMainIds, setUsedMainIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionCategoryMapping,
    modulePage: getCurrentModulePageByStatus(!isView, isCreate),
  });

  const defaultValues = {
    mainCategoryId: null,
  };

  const columnSecondCategory = [
    {
      title: renderDynamicLabel(
        dynamicFields,
        CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Second category code'],
      ),
      dataIndex: 'code',
      width: 210,
    },
    {
      title: renderDynamicLabel(
        dynamicFields,
        CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Second category name'],
      ),
      dataIndex: 'name',
      width: 210,
      isHightLight: true,
    },
  ];

  const { listSecondCategories } = useSelector((state) => state.secondCategory);

  const { listMainCategories } = useSelector((state) => state.mainCategory);

  const schema = yup.object().shape({
    mainCategoryId: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchMainCategory = watch('mainCategoryId');

  const dataMainCategory = useMemo(() => {
    const filterData = isCreate
      ? listMainCategories?.data?.filter(
          (item) =>
            !usedMainIds?.includes(item.id) && item?.status === 'active',
        )
      : listMainCategories?.data;
    return filterData?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [listMainCategories?.data, usedMainIds, isCreate]);

  const dataSecondCategory = useMemo(
    () =>
      listSecondCategories?.data
        ?.filter((i) => i?.status === 'active')
        ?.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          key: item.id,
        })),
    [listSecondCategories?.data],
  );

  const handleCancel = () => {
    toggle();
    reset(defaultValues);
  };

  const resetForm = () => {
    reset(defaultValues);
    setSelectedIds([]);
    setErrorMessage('');
  };

  const onSubmitForm = (formData) => {
    if (!selectedIds?.length) {
      return setErrorMessage(
        renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['This field is required'],
        ),
      );
    }
    if (dataDetail && !isCreate) {
      handleSubmitForm({
        ...formData,
        id: dataDetail?.id,
        secondCategoryIds: selectedIds,
      });
    } else {
      handleSubmitForm({
        ...formData,
        secondCategoryIds: selectedIds,
      });
    }
    return null;
  };

  const handleSubmitAndNew = (data) => {
    if (!selectedIds?.length) {
      return setErrorMessage(
        renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['This field is required'],
        ),
      );
    }

    if (dataDetail && !isCreate) {
      handleSubmitForm({
        ...data,
        id: dataDetail?.id,
        secondCategoryIds: selectedIds,
        isNew: true,
        resetForm,
      });
    } else {
      handleSubmitForm({
        ...data,
        secondCategoryIds: selectedIds,
        isNew: true,
        resetForm,
      });
    }
    return null;
  };

  const renderForm = () => (
    <>
      <div className={cx('wrap__Form')}>
        <Row className="pt-2 mx-0">
          <Col className="ps-0 d-flex align-items-center" md={3} xs={3}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicFields,
                CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Main category'],
              )}
              isRequired
            />
          </Col>
          <Col className="px-0" md={9} xs={9}>
            <SelectUI
              data={dataMainCategory || []}
              disabled={!isCreate}
              name="mainCategoryId"
              isRequired
              messageRequired={errors?.mainCategoryId?.message || ''}
              className={cx('w-100')}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicFields,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
          </Col>
        </Row>
        {!!watchMainCategory && (
          <Row className="pt-2 mx-0">
            <LabelUI
              className="px-0 pb-3"
              label={renderDynamicLabel(
                dynamicFields,
                CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Second category'],
              )}
              isRequired
            />
            <TableCheckbox
              columns={columnSecondCategory}
              dataSource={dataSecondCategory}
              value={selectedIds}
              scroll={{ y: 185, x: 500 }}
              onChangeValues={(value) => setSelectedIds(value)}
              messageError={errorMessage}
              canChecked={!isView}
            />
          </Row>
        )}
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className={cx('mt-4 justify-content-end')}
          handleCancel={() => {
            handleCancel();
          }}
          visibleSaveBtn={!isView}
          handleSubmit={!isView && handleSubmit(onSubmitForm)}
          handleSubmitAndNew={!isView && handleSubmit(handleSubmitAndNew)}
          disable={loading}
          txButtonLeft={renderDynamicLabel(
            dynamicFields,
            CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS.Cancel,
          )}
          txButtonBetween={renderDynamicLabel(
            dynamicFields,
            CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS.Save,
          )}
          txButtonRight={renderDynamicLabel(
            dynamicFields,
            CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Save & New'],
          )}
        />
      </div>
    </>
  );

  // effect

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'mainCategoryId':
            setError('mainCategoryId', {
              message: item.message,
            });
            break;
          case 'secondCategoryIds':
            setErrorMessage(item.message);
            break;
          default:
            break;
        }
      });
    } else {
      setError('mainCategoryId', { message: '' });
      setErrorMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  useEffect(() => {
    if (dataDetail && isOpen) {
      const defaultSecondCategoryIds = dataDetail?.secondCategories?.map(
        (item) => item.id,
      );
      setValue('mainCategoryId', dataDetail.mainCategoryId || '');
      setSelectedIds(defaultSecondCategoryIds);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDetail, setValue, isOpen]);

  useEffect(() => {
    if (isSubmitted && !selectedIds?.length) {
      setErrorMessage(
        renderDynamicLabel(
          dynamicFields,
          CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['This field is required'],
        ),
      );
    } else {
      setErrorMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, selectedIds, isOpen]);

  useEffect(() => {
    if (!isSubmitted && isOpen) {
      getListCategoryMappingsActionsApi({ pageSize: -1 })
        .then((res) => {
          setUsedMainIds(res?.data?.data.map((item) => item.mainCategoryId));
        })
        .catch((e) => {
          setUsedMainIds([]);
        });
    }
  }, [isOpen, isSubmitted]);

  return (
    <ModalComponent
      w={560}
      isOpen={isOpen}
      toggle={() => {
        toggle();
        resetForm();
      }}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalMaster;
