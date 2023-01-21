import cx from 'classnames';
import { useState, useEffect, FC, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import { statusOptions } from 'constants/filter.const';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import Input from 'components/ui/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import SelectUI from 'components/ui/select/Select';
import {
  NewAsyncOptions,
  SelectType,
} from 'components/ui/async-select/NewAsyncSelect';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  clearCategoryErrorsReducer,
  createCategoryActions,
  getListCategoryActions,
} from '../../../store/category/category.action';
import {
  CategoryExtend1,
  CategoryExtend,
  CategoryDetailResponse,
} from '../../../models/api/category/category.model';
import styles from './form.module.scss';

interface CategoryFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: CategoryDetailResponse;
  onSubmit: (CreateCategoryParams) => void;
}

interface CategoryExtendsProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name?: string;
  status?: string;
  description?: string;
  companyId?: string;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  createdUserId?: string;
  updatedUserId?: string;
  numChildren?: number;
  level?: number;
  numDependents?: number;
  isNew?: boolean;

  resetForm?: () => void;
  parentId: NewAsyncOptions[];
}

const defaultValues = {
  code: '',
  name: '',
  status: 'active',
};

const CategoryForm: FC<CategoryFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  // const [isFirstLoad, setIsFirstLoad] = useState(true);

  const { t } = useTranslation(I18nNamespace.CATEGORY);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
  });

  const [listDataTable, setListDataTable] = useState<CategoryExtend[]>([]);

  const { errorList, listCategorys, loading } = useSelector(
    (state) => state.category,
  );

  const optionListCategory: NewAsyncOptions[] = useMemo(
    () =>
      listDataTable?.map((item) => ({
        value: item.id.toString(),
        label: item.name,
        isParent: !item.parentId && item.numChildren !== 0,
        isHidden: false,
        parentId: item.parentId,
        upIcon: false,
      })),
    [listDataTable],
  );

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

  const addItem = (data: CategoryExtend1[], result: CategoryExtend1) => {
    const dataFilter = data.filter((item) => item.parentId === result.id) || [];
    // eslint-disable-next-line no-param-reassign
    result.children = dataFilter;

    if (dataFilter.length > 0) {
      result.children.forEach((item) => addItem(data, item));
    }

    return result;
  };

  const treeToList = (
    rootId: string,
    list1: CategoryExtend[],
    dataTree: CategoryExtend1[],
    x: string[],
  ) => {
    const y: string[] = rootId === null ? [] : [...x, rootId];
    dataTree.forEach((item) => {
      list1.push({
        ...item,
        parents: y,
        isShow: rootId === null,
        showIcon: false,
      });

      treeToList(item.id, list1, item.children, y);
    });
  };

  useEffect(() => {
    const data2: CategoryExtend1[] =
      listCategorys?.map((item) => ({
        ...item,
        children: [],
      })) || [];
    const result: CategoryExtend1 = { id: null, children: [] };
    addItem(data2, result);

    const list1: CategoryExtend[] = [];
    treeToList(null, list1, result.children, []);
    setListDataTable(list1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCategorys]);

  const handleCancel = () => {
    if (!isEdit) {
      history.push(AppRouteConst.CATEGORY);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => history.push(AppRouteConst.CATEGORY),
      });
    }
    clearErrors();
    dispatch(createCategoryActions.failure(null));
  };
  const resetForm = () => {
    // reset(data)
    setValue('code', '');
    setValue('name', '');
    setValue('name', '');
    setValue('parentId', []);
    setValue('description', '');
    setValue('status', 'active');
  };
  const handleSubmitAndNew = (data: CategoryExtendsProps) => {
    const dataNew: CategoryExtendsProps = { ...data, isNew: true, resetForm };
    if (data?.parentId) {
      onSubmit({ ...dataNew, parentId: data.parentId[0]?.value?.toString() });
    } else {
      onSubmit(dataNew);
    }
  };

  useEffect(() => {
    if (data) {
      if (data?.parentId) {
        const categoryDetail = listCategorys.filter(
          (item) => item.id === data?.parentId,
        );
        if (categoryDetail) {
          setValue('parentId', [
            {
              value: categoryDetail[0]?.id,
              label: categoryDetail[0]?.name,
            },
          ]);
        }
        // setIsFirstLoad(false);
      } else {
        setValue('parentId', []);
      }
      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('status', data.status);
    }
    return () => {
      dispatch(clearCategoryErrorsReducer());
    };
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
  }, [errorList, setError]);

  const onSubmitForm = (data) => {
    if (data?.parentId) {
      onSubmit({ ...data, parentId: data.parentId[0]?.value });
    } else onSubmit(data);
  };

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <p className={cx('fw-bold', styles.titleForm)}>
          {t('generalInformation')}
        </p>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('codeForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={t('placeholderCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('nameForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              {...register('name')}
              isRequired
              readOnly={!isEdit}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeholderName')}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <AsyncSelectForm
              disabled={loading || !isEdit}
              isShowClearValue
              selectType={SelectType.INFO}
              message="To create main category, please leave this blank"
              labelSelect={t('parentCategoryForm')}
              control={control}
              name="parentId"
              placeholder="Please select"
              hasPatentSelect
              handleClearValue={() => setValue('parentId', [])}
              onChangeSearch={(value: string) =>
                isEdit && data?.id
                  ? dispatch(
                      getListCategoryActions.request({
                        page: 1,
                        pageSize: -1,
                        levels: '1,2',
                        content: value.trim(),
                        isRefreshLoading: true,
                        isUpdate: true,
                        id: data?.id,
                      }),
                    )
                  : dispatch(
                      getListCategoryActions.request({
                        page: 1,
                        pageSize: -1,
                        levels: '1,2',
                        content: value.trim(),
                        isRefreshLoading: true,
                      }),
                    )
              }
              options={optionListCategory}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('description')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={t('placeholderDescription')}
              messageRequired={errors?.description?.message || ''}
              {...register('description')}
              maxLength={250}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              labelSelect={t('status')}
              data={statusOptions}
              disabled={!isEdit}
              name="status"
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isEdit },
                'w-100',
              )}
              control={control}
            />
          </Col>
          <Col className={cx('p-0 ms-3')} />
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
        />
      )}
    </div>
  );
};

export default CategoryForm;
