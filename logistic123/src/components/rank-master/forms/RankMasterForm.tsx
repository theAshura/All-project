import cx from 'classnames';
import { useEffect, FC, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
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

import { RankMaster } from 'models/api/rank-master/rank-master.model';
import { clearRankMasterErrorsReducer } from 'store/rank-master/rank-master.action';
import { MaxLength } from 'constants/common.const';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import isEqual from 'lodash/isEqual';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { RANK_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/rank.const';
import styles from './form.module.scss';

interface PSCFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: RankMaster;
  onSubmit: (CreatePSCParams) => void;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  type: '',
  status: 'active',
};

const PSCForm: FC<PSCFormProps> = ({ isEdit, data, onSubmit, isCreate }) => {
  const { t } = useTranslation([
    I18nNamespace.RANK_MASTER,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('errors.required')),
    name: yup.string().trim().nullable().required(t('errors.required')),
    type: yup.string().trim().nullable().required(t('errors.required')),
  });

  const { errorList, loading } = useSelector((state) => state.rankMaster);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionRank,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetDefault = (defaultParams) => {
    reset(defaultParams);
    history.goBack();
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
        description: data.description,
        status: data.status,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.RANK_MASTER);
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
            ? history.push(AppRouteConst.RANK_MASTER)
            : resetDefault(defaultParams),
      });
    }
  }, [data, getValues, isCreate, resetDefault, t]);

  const resetForm = () => {
    reset(defaultValues);
  };

  const handleSubmitAndNew = (data: RankMaster) => {
    const dataNew: RankMaster = { ...data, isNew: true, resetForm };
    onSubmit(dataNew);
  };

  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name || '');
      setValue('type', data.type || '');
      setValue('description', data.description);
      setValue('status', data.status);
    }
    return () => {
      dispatch(clearRankMasterErrorsReducer());
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
          {t('txRMInformation')}
        </div>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Rank code'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Enter rank code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Rank name'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Enter rank name'],
              )}
              messageRequired={errors?.name?.message || ''}
              {...register('name')}
              maxLength={MaxLength.MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <RadioForm
              isRequired
              disabled={!isEdit}
              label={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS.Type,
              )}
              name="type"
              control={control}
              radioOptions={[
                {
                  value: 'shore',
                  label: renderDynamicLabel(
                    dynamicFields,
                    RANK_DYNAMIC_DETAIL_FIELDS.Shore,
                  ),
                },
                {
                  value: 'ship',
                  label: renderDynamicLabel(
                    dynamicFields,
                    RANK_DYNAMIC_DETAIL_FIELDS.Ship,
                  ),
                },
              ]}
              messageRequired={errors?.type?.message || ''}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS.Status,
              )}
              data={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicFields,
                    RANK_DYNAMIC_DETAIL_FIELDS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicFields,
                    RANK_DYNAMIC_DETAIL_FIELDS.Inactive,
                  ),
                },
              ]}
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
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS.Description,
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                RANK_DYNAMIC_DETAIL_FIELDS['Enter description'],
              )}
              {...register('description')}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
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

export default PSCForm;
