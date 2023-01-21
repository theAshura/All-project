import cx from 'classnames';
import { useEffect, FC, useCallback, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { useDispatch, useSelector } from 'react-redux';
import SelectUI from 'components/ui/select/Select';
import * as yup from 'yup';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import images from 'assets/images/images';
import isEqual from 'lodash/isEqual';
import {
  clearMainCategoryReducer,
  getListMainCategoryActions,
} from 'store/main-category/main-category.action';
import {
  clearSecondCategoryReducer,
  getListSecondCategoryActions,
} from 'store/second-category/second-category.action';
import { clearCategoryMappingErrorsReducer } from 'store/category-mapping/category-mapping.action';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';
import { getListCategoryMappingsActionsApi } from 'api/category-mapping.api';
import {
  CategoryMapping,
  CategoryMappingDetailResponse,
} from 'models/api/category-mapping/category-mapping.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/categoryMapping';
import styles from './form.module.scss';

interface CategoryMappingFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: CategoryMappingDetailResponse;
  onSubmit: (CreateCategoryMappingParams) => void;
}

const defaultValues = {
  mainCategoryId: null,
  secondCategoryIds: [],
};

const CategoryMappingForm: FC<CategoryMappingFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  const dispatch = useDispatch();

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionCategoryMapping,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const schema = yup.object().shape({
    mainCategoryId: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    secondCategoryIds: yup
      .array()
      .nullable()
      .min(
        1,
        renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const { errorList, loading } = useSelector((state) => state.categoryMapping);
  const { listSecondCategories } = useSelector((state) => state.secondCategory);
  const { listMainCategories } = useSelector((state) => state.mainCategory);

  const [usedMainIds, setUsedMainIds] = useState<string[]>([]);
  const {
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchMain = watch('mainCategoryId');

  const rowLabelsSecondCategory = [
    {
      label: 'checkbox',
      id: 'checkbox',
      width: 80,
    },
    {
      label: renderDynamicLabel(
        dynamicFields,
        CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Second category code'],
      ),
      id: 'code',
      width: 350,
    },
    {
      label: renderDynamicLabel(
        dynamicFields,
        CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Second category name'],
      ),
      id: 'name',
      width: 360,
    },
  ];

  const dataMainCategory = useMemo(() => {
    const filterData = isCreate
      ? listMainCategories?.data?.filter(
          (item) => !usedMainIds?.includes(item.id),
        )
      : listMainCategories?.data;
    return filterData?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [listMainCategories?.data, usedMainIds, isCreate]);

  const dataSecondCategory = useMemo(
    () =>
      listSecondCategories?.data?.map((item) => ({
        id: item.id,
        label: item.name,
        code: item.code,
        name: item.name,
      })),
    [listSecondCategories?.data],
  );

  const resetDefault = useCallback(
    (defaultParams) => {
      reset(defaultParams);
      history.goBack();
    },
    [reset],
  );

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const params = getValues();
    const defaultSecondCategoryIds = data?.secondCategories?.map(
      (item) => item.id,
    );
    if (isCreate) {
      defaultParams = {
        mainCategoryId: null,
        secondCategoryIds: [],
      };
    } else {
      defaultParams = {
        mainCategoryId: data.mainCategoryId || '',
        secondCategoryIds: defaultSecondCategoryIds,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.CATEGORY_MAPPING);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS['Confirmation?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicFields,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.CATEGORY_MAPPING)
            : resetDefault(defaultParams),
      });
    }
  }, [
    data.mainCategoryId,
    data?.secondCategories,
    dynamicFields,
    getValues,
    isCreate,
    resetDefault,
  ]);
  const resetForm = () => {
    reset(defaultValues);
  };

  const handleSubmitAndNew = (data: CategoryMapping) => {
    const dataNew: CategoryMapping = { ...data, isNew: true, resetForm };
    onSubmit(dataNew);
  };

  useEffect(() => {
    if (data) {
      const defaultSecondCategoryIds = data?.secondCategories?.map(
        (item) => item.id,
      );
      setValue('mainCategoryId', data.mainCategoryId || '');
      setValue('secondCategoryIds', defaultSecondCategoryIds);
    }
    return () => {
      dispatch(clearCategoryMappingErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'mainCategoryId':
            setError('mainCategoryId', { message: item.message });
            break;
          case 'secondCategoryIds':
            setError('secondCategoryIds', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('mainCategoryId', { message: '' });
      setError('secondCategoryIds', { message: '' });
    }
  }, [errorList, setError]);

  useEffect(() => {
    dispatch(getListSecondCategoryActions.request({ pageSize: -1 }));
    dispatch(getListMainCategoryActions.request({ pageSize: -1 }));

    return () => {
      dispatch(clearMainCategoryReducer());
      dispatch(clearSecondCategoryReducer());
    };
  }, [dispatch]);

  useEffect(() => {
    getListCategoryMappingsActionsApi({ pageSize: -1 })
      .then((res) => {
        setUsedMainIds(res?.data?.data.map((item) => item.mainCategoryId));
      })
      .catch((e) => {
        setUsedMainIds([]);
      });
  }, []);

  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className={cx('fw-bold', styles.titleForm)}>
          {renderDynamicLabel(
            dynamicFields,
            CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS[
              'Category Mapping information'
            ],
          )}
        </div>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              placeholder={renderDynamicLabel(
                dynamicFields,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              labelSelect={renderDynamicLabel(
                dynamicFields,
                CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Main Category'],
              )}
              data={dataMainCategory || []}
              disabled={!isCreate}
              name="mainCategoryId"
              isRequired
              messageRequired={errors?.mainCategoryId?.message || ''}
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isCreate },
                'w-100',
              )}
              control={control}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <ModalListForm
              name="secondCategoryIds"
              labelSelect={renderDynamicLabel(
                dynamicFields,
                CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Second Category'],
              )}
              title={renderDynamicLabel(
                dynamicFields,
                CATEGORY_MAPPING_DYNAMIC_DETAIL_FIELDS['Second Category'],
              )}
              disable={!isEdit || !watchMain}
              isRequired
              control={control}
              data={dataSecondCategory}
              rowLabels={rowLabelsSecondCategory}
              error={errors?.secondCategoryIds?.message || ''}
              verticalResultClassName={styles.resultBox}
            />
          </Col>
        </Row>
      </div>
      {isEdit && (
        <GroupButton
          className={styles.GroupButton}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={
            isCreate ? handleSubmit(handleSubmitAndNew) : undefined
          }
          disable={!isEdit}
          txButtonLeft={renderDynamicLabel(
            dynamicFields,
            COMMON_DYNAMIC_FIELDS.Cancel,
          )}
          txButtonBetween={renderDynamicLabel(
            dynamicFields,
            COMMON_DYNAMIC_FIELDS.Save,
          )}
          txButtonRight={renderDynamicLabel(
            dynamicFields,
            COMMON_DYNAMIC_FIELDS['Save & New'],
          )}
        />
      )}
    </div>
  );
};

export default CategoryMappingForm;
