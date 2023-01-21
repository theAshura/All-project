import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import { MaxLength } from 'constants/common.const';
import { statusOptions } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { ShoreRank } from 'models/api/shore-rank/shore-rank.model';
import useEffectOnce from 'hoc/useEffectOnce';
import { FC, useEffect, useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { getListShoreDepartmentAction } from 'store/shore-department/shore-department.action';
import * as yup from 'yup';
import styles from './form.module.scss';

interface ShoreRankFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: ShoreRank;
  onSubmit: (CreateShoreRankParams: ShoreRank) => void;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  shoreDepartmentIds: [],
  status: 'active',
};

const ShoreRankForm: FC<ShoreRankFormProps> = ({
  isEdit,
  isCreate,
  data,
  onSubmit,
}) => {
  // state
  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.SHORE_RANK,
    I18nNamespace.COMMON,
  ]);
  const { loading, errorList } = useSelector((state) => state.shoreRank);
  const { listShore } = useSelector((state) => state.shoreDepartment);
  const shoreDepartmentOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listShore?.data
        .filter((item) => item.status === 'active')
        .map((item) => ({
          value: item?.id,
          label: item?.name,
        })),
    [listShore],
  );

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('errors.required')),
    name: yup.string().trim().nullable().required(t('errors.required')),
    shoreDepartmentIds: yup
      .array()
      .required(t('errors.required'))
      .min(1, t('errors.required')),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  // function
  const resetForm = () => {
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('shoreDepartmentIds', []);
    setValue('status', 'active');
  };

  const filterShoreDepartment = (shoreDepartment) => {
    const initShoreDepartment = [];
    shoreDepartment?.forEach((element) => {
      initShoreDepartment.push({ value: element?.id, label: element?.name });
    });
    return initShoreDepartment;
  };

  const onSubmitForm = (data: ShoreRank) => {
    const shoreDepartmentIds = [];
    getValues('shoreDepartmentIds').forEach((element) => {
      shoreDepartmentIds.push(element.value);
    });
    onSubmit({ ...data, shoreDepartmentIds });
  };

  const handleSubmitAndNew = (data: ShoreRank) => {
    const dataNew: ShoreRank = { ...data, isNew: true, resetForm };
    onSubmitForm(dataNew);
  };

  const handleCancel = () => {
    if (!isEdit) {
      history.push(AppRouteConst.SHORE_RANK);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => history.push(AppRouteConst.SHORE_RANK),
      });
    }
  };

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('status', data.status);
      setValue(
        'shoreDepartmentIds',
        filterShoreDepartment(data.shoreDepartments) || [],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: t('txShoreRankCodeExist') });
            break;
          case 'name':
            setError('name', { message: t('txShoreRankNameExist') });
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

  useEffectOnce(() => {
    dispatch(
      getListShoreDepartmentAction.request({
        pageSize: -1,
        isRefreshLoading: false,
      }),
    );
  });

  // render
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
        <p className={cx('fw-bold', styles.titleForm)}>
          {t('txShoreRankInfo')}
        </p>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <Input
              label={t('txShoreRankCodeForm')}
              readOnly={!isEdit || loading}
              disabledCss={!isEdit || loading}
              isRequired
              placeholder={t('placeHolder.txShoreRankCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={MaxLength.MAX_LENGTH_CODE}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={t('txShoreRankNameForm')}
              {...register('name')}
              isRequired
              readOnly={!isEdit || loading}
              disabledCss={!isEdit || loading}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeHolder.txShoreRankName')}
              maxLength={MaxLength.MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <SelectUI
              labelSelect={t('txStatus')}
              data={statusOptions}
              disabled={!isEdit || loading}
              name="status"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label={t('txDescription')}
              {...register('description')}
              disabledCss={!isEdit || loading}
              readOnly={!isEdit || loading}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
              placeholder={isEdit && t('placeHolder.txDescription')}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <AsyncSelectResultForm
              multiple
              disabled={!isEdit || loading}
              labelSelect={t('txShoreDepartmentForm')}
              control={control}
              name="shoreDepartmentIds"
              titleResults="Selected"
              isRequired
              placeholder={isEdit ? t('placeHolder.txPleaseSelect') : ''}
              searchContent={t('txShoreDepartment')}
              textSelectAll={t('buttons.selectAll')}
              messageRequired={errors?.shoreDepartmentIds?.message || ''}
              onChangeSearch={(value: string) =>
                dispatch(
                  getListShoreDepartmentAction.request({
                    pageSize: -1,
                    isRefreshLoading: false,
                    content: value,
                  }),
                )
              }
              options={shoreDepartmentOptions || []}
            />
          </Col>
          <Col className="pe-0" />
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
          disable={!isEdit || loading}
        />
      )}
    </div>
  );
};

export default ShoreRankForm;
