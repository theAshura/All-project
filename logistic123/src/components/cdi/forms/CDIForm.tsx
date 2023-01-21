import cx from 'classnames';
import { useEffect, FC } from 'react';
import { Col, Row } from 'reactstrap';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import { clearCDIErrorsReducer } from 'store/cdi/cdi.action';
import { AppRouteConst } from 'constants/route.const';
import Input from 'components/ui/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import SelectUI from 'components/ui/select/Select';
import { CDI, CDIDetailResponse } from 'models/api/cdi/cdi.model';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import images from 'assets/images/images';
import isEqual from 'lodash/isEqual';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { CDI_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/cdi.const';

import styles from './form.module.scss';

interface CDIFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: CDIDetailResponse;
  onSubmit: (CreateCDIParams) => void;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  status: 'active',
};

const CDIForm: FC<CDIFormProps> = ({ isEdit, data, onSubmit, isCreate }) => {
  const { t } = useTranslation(I18nNamespace.CDI);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
  });

  const { errorList, loading } = useSelector((state) => state.cdi);

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionChemicalDistributionInstitute,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const resetDefault = (defaultParams) => {
    reset(defaultParams);
    history.goBack();
  };
  const handleCancel = () => {
    let defaultParams = {};
    const params = getValues();
    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      defaultParams = {
        code: data.code,
        name: data.name,
        description: data.description,
        status: data.status,
      };
    }
    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.CDI);
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
            ? history.push(AppRouteConst.CDI)
            : resetDefault(defaultParams),
      });
    }
  };
  const resetForm = () => {
    // reset(data)
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('status', 'active');
  };

  const handleSubmitAndNew = (data: CDI) => {
    const dataNew: CDI = { ...data, isNew: true, resetForm };
    onSubmit(dataNew);
  };

  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('status', data.status);
    }
    return () => {
      dispatch(clearCDIErrorsReducer());
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
          {t('CDIInformation')}
        </div>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['CDI Code'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              disabled={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['Enter CDI code'],
              )}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['CDI Name'],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              {...register('name')}
              isRequired
              readOnly={!isEdit}
              messageRequired={errors?.name?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['Enter CDI name'],
              )}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS.Description,
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                CDI_DYNAMIC_DETAIL_FIELDS['Enter description'],
              )}
              messageRequired={errors?.description?.message || ''}
              {...register('description')}
              maxLength={250}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <div
              className={cx(
                styles.labelSelect,
                'd-flex align-items-start pb-2',
              )}
            >
              <span className={styles.label}>
                {renderDynamicLabel(
                  dynamicFields,
                  CDI_DYNAMIC_DETAIL_FIELDS.Status,
                )}{' '}
              </span>
              {/* <img src={images.icons.icRequiredAsterisk} alt="required" /> */}
            </div>
            <SelectUI
              data={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicFields,
                    CDI_DYNAMIC_DETAIL_FIELDS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicFields,
                    CDI_DYNAMIC_DETAIL_FIELDS.Inactive,
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

export default CDIForm;
