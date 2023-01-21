import cx from 'classnames';
import { useEffect, FC, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import { statusOptions } from 'constants/filter.const';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import Input from 'components/ui/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import SelectUI from 'components/ui/select/Select';
import images from 'assets/images/images';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { getListShipDepartmentActions } from 'store/ship-department/ship-department.action';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { MaxLength } from 'constants/common.const';
import useEffectOnce from 'hoc/useEffectOnce';
import styles from './form.module.scss';
import { clearShipRankErrorsReducer } from '../../../store/ship-rank/ship-rank.action';
import { ShipRankDetailResponse } from '../../../models/api/ship-rank/ship-rank.model';

interface ShipRankFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: ShipRankDetailResponse;
  onSubmit: (CreateShipRankParams) => void;
}

const defaultValues = {
  code: '',
  name: '',
  shipDepartmentIds: [],
  status: 'active',
};

const ShipRankForm: FC<ShipRankFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  const { t } = useTranslation([I18nNamespace.SHIP_RANK, I18nNamespace.COMMON]);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    shipDepartmentIds: yup
      .array()
      .required(t('errors.required'))
      .min(1, t('errors.required')),
  });

  const { errorList, loading } = useSelector((state) => state.shipRank);
  const { listShipDepartments } = useSelector((state) => state.shipDepartment);

  const {
    register,
    control,
    handleSubmit,
    setError,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    if (!isEdit) {
      history.push(AppRouteConst.SHIP_RANK);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => history.push(AppRouteConst.SHIP_RANK),
      });
    }
  };
  const resetForm = () => {
    // reset(data)
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('shipDepartmentIds', []);

    setValue('status', 'active');
  };

  const filterShipDepartmentIds = (shipDepartmentIds) => {
    const initShipDepartmentIds = [];
    shipDepartmentIds?.forEach((element) => {
      initShipDepartmentIds.push({ value: element?.id, label: element?.name });
    });
    return initShipDepartmentIds;
  };

  const shipDepartmentIdsOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listShipDepartments?.data
        .filter((item) => item.status === 'active')
        .map((item) => ({
          value: item?.id,
          label: item?.name,
        })),
    [listShipDepartments],
  );

  const handleSubmitAndNew = (data) => {
    const shipDepartmentIds = [];
    getValues('shipDepartmentIds').forEach((element) => {
      shipDepartmentIds.push(element.value);
    });
    const dataNew = {
      ...data,
      shipDepartmentIds,
      isNew: true,
      resetForm,
    };
    onSubmit(dataNew);
  };
  const onSubmitForm = (data) => {
    const shipDepartmentIds = [];
    getValues('shipDepartmentIds').forEach((element) => {
      shipDepartmentIds.push(element.value);
    });
    const dataNew = {
      ...data,
      shipDepartmentIds,
    };
    onSubmit(dataNew);
  };
  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('status', data.status);
      setValue(
        'shipDepartmentIds',
        filterShipDepartmentIds(data.shipDepartments) || [],
      );
    }
    return () => {
      dispatch(clearShipRankErrorsReducer());
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  useEffectOnce(() => {
    dispatch(
      getListShipDepartmentActions.request({
        pageSize: -1,
        isRefreshLoading: false,
      }),
    );
  });

  if (loading && !isCreate) {
    return (
      <div className="d-flex justify-content-center">
        <img
          src={images.common.loading}
          className={styles.loading}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className={cx('fw-bold', styles.titleForm)}>
          {t('generalInformation')}
        </div>
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
              maxLength={MaxLength.MAX_LENGTH_CODE}
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
              maxLength={MaxLength.MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <div
              className={cx(
                styles.labelSelect,
                'd-flex align-items-start pb-2',
              )}
            >
              <span className={styles.label}>{t('status')} </span>
            </div>
            <SelectUI
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
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('description')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={t('placeholderDescription')}
              messageRequired={errors?.description?.message || ''}
              {...register('description')}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <AsyncSelectResultForm
              multiple
              disabled={!isEdit || loading}
              labelSelect={t('shipDepartment')}
              control={control}
              name="shipDepartmentIds"
              titleResults="Selected"
              isRequired
              placeholder={isEdit ? t('placeHolder.txPleaseSelect') : ''}
              searchContent={t('shipDepartment')}
              textSelectAll={t('buttons.selectAll')}
              messageRequired={errors?.shipDepartmentIds?.message || ''}
              onChangeSearch={(value: string) =>
                dispatch(
                  getListShipDepartmentActions.request({
                    pageSize: -1,
                    isRefreshLoading: false,
                    content: value,
                  }),
                )
              }
              options={shipDepartmentIdsOptions || []}
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

export default ShipRankForm;
