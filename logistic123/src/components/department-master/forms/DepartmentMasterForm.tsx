import cx from 'classnames';
import { useEffect, FC, useCallback, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { RADIO_OPTIONS, statusOptions } from 'constants/filter.const';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import Input from 'components/ui/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import SelectUI from 'components/ui/select/Select';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import images from 'assets/images/images';

import { DepartmentMaster } from 'models/api/department-master/department-master.model';
import { clearDepartmentMasterErrorsReducer } from 'store/department-master/department-master.action';
import { MaxLength } from 'constants/common.const';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import { getListRankMasterActions } from 'store/rank-master/rank-master.action';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import isEqual from 'lodash/isEqual';
import styles from './form.module.scss';

interface PSCFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: DepartmentMaster;
  onSubmit: (CreatePSCParams) => void;
}

const defaultValues = {
  code: '',
  name: '',
  rankIds: undefined,
  description: '',
  type: '',
  status: 'active',
};

const PSCForm: FC<PSCFormProps> = ({ isEdit, data, onSubmit, isCreate }) => {
  const { t } = useTranslation([
    I18nNamespace.DEPARTMENT_MASTER,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('errors.required')),
    name: yup.string().trim().nullable().required(t('errors.required')),
    type: yup.string().trim().nullable().required(t('errors.required')),
    rankIds: yup
      .array()
      .required(t('errors.required'))
      .min(1, t('errors.required')),
  });

  const { errorList, loading } = useSelector((state) => state.departmentMaster);
  const { listRankMaster } = useSelector((state) => state.rankMaster);
  const [isFirst, setIsFirst] = useState<boolean>(!isCreate);
  const rankOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listRankMaster?.data.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listRankMaster],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const watchType = watch('type');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetDefault = (defaultParams) => {
    reset(defaultParams);
    history.goBack();
  };

  const fillRankID = (ranks) => {
    const initRank = [];
    ranks?.forEach((element) => {
      initRank.push({ value: element?.id, label: element?.name });
    });
    return initRank;
  };

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const params = getValues();

    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      defaultParams = {
        code: data.code,
        name: data.name,
        type: data.type,
        rankIds: fillRankID(data.ranks),
        description: data.description,
        status: data.status,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.DEPARTMENT_MASTER);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.DEPARTMENT_MASTER)
            : resetDefault(defaultParams),
      });
    }
  }, [data, getValues, isCreate, resetDefault, t]);

  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmitForm = (data) => {
    const rankIds = [];
    getValues('rankIds').forEach((e) => {
      rankIds.push(e.value);
    });
    onSubmit({ ...data, rankIds });
  };

  const handleSubmitAndNew = (data: DepartmentMaster) => {
    const dataNew: DepartmentMaster = { ...data, isNew: true, resetForm };
    onSubmitForm(dataNew);
  };

  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name || '');
      setValue('type', data.type || '');
      setValue('rankIds', fillRankID(data.ranks) || '');
      setValue('description', data.description);
      setValue('status', data.status);
    }
    return () => {
      dispatch(clearDepartmentMasterErrorsReducer());
    };
  }, [data, dispatch, setValue]);

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

  useEffect(() => {
    if (watchType) {
      if (!isFirst) {
        setValue('rankIds', undefined);
      }
      dispatch(
        getListRankMasterActions.request({
          pageSize: -1,
          isRefreshLoading: false,
          status: 'active',
          type: watchType,
        }),
      );
      setIsFirst(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchType]);

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
          {t('txDMInformation')}
        </div>
        <Row className="pt-4 mx-0 pb-3">
          <Col className={cx('ps-0 ')}>
            <Input
              label={t('txDepartmentCode')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={t('placeHolder.txDepartmentCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('pe-0 ')}>
            <Input
              label={t('txDepartmentName')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={t('placeHolder.txDepartmentName')}
              messageRequired={errors?.name?.message || ''}
              {...register('name')}
              maxLength={20}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0 pb-3">
          <Col className="ps-0">
            <RadioForm
              disabled={!isEdit}
              isRequired
              label={t('txType')}
              name="type"
              control={control}
              radioOptions={RADIO_OPTIONS}
              messageRequired={errors?.type?.message || ''}
            />
          </Col>
          <Col className="pe-0">
            <AsyncSelectResultForm
              multiple
              disabled={!isEdit || loading || !watchType}
              labelSelect={t('txRank')}
              control={control}
              name="rankIds"
              titleResults="Selected"
              isRequired
              placeholder={isEdit ? t('placeHolder.txPleaseSelect') : ''}
              searchContent={t('txRank')}
              textSelectAll={t('buttons.selectAll')}
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
        <Row className="pt-4 mx-0 pb-3">
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
              disabled={!isEdit || loading}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
              placeholder={isEdit && t('placeHolder.txDescription')}
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
        />
      )}
    </div>
  );
};

export default PSCForm;
