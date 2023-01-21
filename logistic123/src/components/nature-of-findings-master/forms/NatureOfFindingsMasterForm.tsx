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

import { NatureOfFindingsMaster } from 'models/api/nature-of-findings-master/nature-of-findings-master.model';
import { clearNatureOfFindingsMasterErrorsReducer } from 'store/nature-of-findings-master/nature-of-findings-master.action';
import { MaxLength } from 'constants/common.const';
import isEqual from 'lodash/isEqual';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/natureOfFindings.const';
import styles from './form.module.scss';

interface NatureOfFindingsFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: NatureOfFindingsMaster;
  onSubmit: (CreateNatureOfFindingsParams) => void;
}

const defaultValues = {
  code: '',
  name: '',
  description: '',
  status: 'active',
};

const NatureOfFindingsForm: FC<NatureOfFindingsFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  const { t } = useTranslation([
    I18nNamespace.NATURE_OF_FINDINGS_MASTER,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('errors.required')),
    name: yup.string().trim().nullable().required(t('errors.required')),
  });

  const { errorList, loading } = useSelector(
    (state) => state.natureOfFindingsMaster,
  );

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionNatureOfFindings,
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
        description: data.description,
        status: data.status,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.NATURE_OF_FINDINGS_MASTER);
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
            ? history.push(AppRouteConst.NATURE_OF_FINDINGS_MASTER)
            : resetDefault(defaultParams),
      });
    }
  }, [data, getValues, isCreate, resetDefault, t]);

  const resetForm = () => {
    reset(defaultValues);
  };

  const handleSubmitAndNew = (data: NatureOfFindingsMaster) => {
    const dataNew: NatureOfFindingsMaster = { ...data, isNew: true, resetForm };
    onSubmit(dataNew);
  };

  useEffect(() => {
    if (data) {
      setValue('code', data.code || '');
      setValue('name', data.name || '');
      setValue('description', data.description);
      setValue('status', data.status);
    }
    return () => {
      dispatch(clearNatureOfFindingsMasterErrorsReducer());
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
          {renderDynamicLabel(
            dynamicFields,
            NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
              'Nature of findings information'
            ],
          )}
        </div>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
                  'Nature of findings code'
                ],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
                  'Enter nature of findings code'
                ],
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
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
                  'Nature of findings name'
                ],
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS[
                  'Nature of findings name'
                ],
              )}
              messageRequired={errors?.name?.message || ''}
              {...register('name')}
              maxLength={MaxLength.MAX_LENGTH_TEXT}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS.Status,
              )}
              data={[
                {
                  value: 'active',
                  label: renderDynamicLabel(
                    dynamicFields,
                    NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS.Active,
                  ),
                },
                {
                  value: 'inactive',
                  label: renderDynamicLabel(
                    dynamicFields,
                    NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS.Inactive,
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
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS.Description,
              )}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={renderDynamicLabel(
                dynamicFields,
                NATURE_OF_FINDINGS_DYNAMIC_DETAIL_FIELDS['Enter Description'],
              )}
              {...register('description')}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
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

export default NatureOfFindingsForm;
