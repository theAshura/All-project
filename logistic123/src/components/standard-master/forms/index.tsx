import cx from 'classnames';
import { useEffect, FC, useCallback, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { Col as ColAnt, Row as RowAnt } from 'antd/lib/grid';

import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import Input from 'components/ui/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import images from 'assets/images/images';
import isEqual from 'lodash/isEqual';
import { clearStandardMasterErrorsReducer } from 'store/standard-master/standard-master.action';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import {
  ComplianceAnswer,
  StandardMasterDetailResponse,
} from 'models/api/standard-master/standard-master.model';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { statusOptions } from 'constants/filter.const';
import styles from './form.module.scss';
import TableLevels from '../common/TableLevels';
import TableComplianceAnswer from '../common/TableComplianceAnswer';

interface StandardMasterFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: StandardMasterDetailResponse;
  onSubmit: (params) => void;
}

const defaultValues = {
  code: '',
  name: '',
  fieldName: '',
  scoreApplicable: false,
  status: 'active',
};

const StandardMasterForm: FC<StandardMasterFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  const { t } = useTranslation(I18nNamespace.STANDARD_MASTER);
  const dispatch = useDispatch();

  const [levelList, setLevelList] = useState<string[]>([]);
  const [complianceAnswerList, setComplianceAnswerList] = useState<
    ComplianceAnswer[]
  >([]);

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('ThisFieldIsRequired')),
    fieldName: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
  });

  const { errorList, loading } = useSelector((state) => state.standardMaster);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    getValues,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetDefault = useCallback(
    (defaultParams) => {
      reset(defaultParams);
      history.goBack();
    },
    [reset],
  );

  const handleCancel = useCallback(() => {
    let defaultParams = {};
    const params = {
      ...getValues(),
      levels: levelList || [],
      complianceAnswer: complianceAnswerList || [],
    };
    const defaultComplianceAnswer = data?.complianceAnswers?.map((item) => ({
      answer: item?.answer,
      compliance: item?.compliance,
      colour: item?.colour,
    }));

    if (isCreate) {
      defaultParams = {
        ...defaultValues,
        levels: [],
        complianceAnswer: [],
      };
    } else {
      defaultParams = {
        code: data.code,
        name: data.name,
        fieldName: data.fieldName,
        scoreApplicable: data.scoreApplicable,
        status: 'active',
        levels: data.levels || [],
        complianceAnswer: defaultComplianceAnswer || [],
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.STANDARD_MASTER);
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
            ? history.push(AppRouteConst.STANDARD_MASTER)
            : resetDefault(defaultParams),
      });
    }
  }, [
    complianceAnswerList,
    data,
    getValues,
    isCreate,
    levelList,
    resetDefault,
    t,
  ]);

  const onSubmitForm = (data) => {
    onSubmit({
      ...data,
      levels: levelList || [],
      complianceAnswers: complianceAnswerList || [],
      others: data.others || {},
    });
  };

  useEffect(() => {
    if (data) {
      setValue('code', data?.code || '');
      setValue('name', data?.name);
      setValue('fieldName', data?.fieldName);
      setValue('status', data?.status);

      setValue('scoreApplicable', data?.scoreApplicable);
      setLevelList(data?.levels);
      const defaultComplianceAnswer = data?.complianceAnswers?.map((item) => ({
        answer: item?.answer,
        compliance: item?.compliance,
        colour: item?.colour,
      }));
      setComplianceAnswerList(defaultComplianceAnswer);
    }
    return () => {
      dispatch(clearStandardMasterErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  useEffect(() => {
    if (errorList?.statusCode === 400) {
      if (errorList?.message?.includes('standard code')) {
        setError('code', { message: errorList?.message });
      }
      if (errorList?.message?.includes('standard name')) {
        setError('name', { message: errorList?.message });
      }
    } else {
      clearErrors();
    }
  }, [clearErrors, errorList, setError]);

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <>
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <div className={cx('fw-bold', styles.titleForm)}>
            {t('generalInformation')}
          </div>
          <Row className="pt-2 mx-0">
            <Col className={cx('p-0 me-3')}>
              <Input
                label={t('form.standardCode')}
                className={cx({ [styles.disabledInput]: !isEdit })}
                isRequired
                readOnly={!isEdit}
                placeholder={t('placeholder.standardCode')}
                messageRequired={errors?.code?.message || ''}
                {...register('code')}
                maxLength={5}
              />
            </Col>
            <Col className={cx('p-0 mx-3')}>
              <Input
                label={t('form.standardName')}
                className={cx({ [styles.disabledInput]: !isEdit })}
                {...register('name')}
                isRequired
                readOnly={!isEdit}
                messageRequired={errors?.name?.message || ''}
                placeholder={t('placeholder.standardName')}
                maxLength={20}
              />
            </Col>
            <Col className={cx('p-0 ms-3')}>
              <Input
                label={t('form.fieldName')}
                className={cx({ [styles.disabledInput]: !isEdit })}
                {...register('fieldName')}
                isRequired
                readOnly={!isEdit}
                messageRequired={errors?.fieldName?.message || ''}
                placeholder={t('placeholder.fieldName')}
                maxLength={20}
              />
            </Col>
          </Row>
          <Row className="pt-3 mx-0">
            <Col className={cx('p-0 me-3')}>
              <RadioForm
                label={t('form.status')}
                labelClassName={styles.radioLabel}
                className={styles.radioForm}
                name="status"
                control={control}
                radioOptions={statusOptions}
                disabled={!isEdit}
              />
            </Col>
            <Col className={cx('p-0 mx-3')}>
              <div
                className={cx(
                  styles.labelSelect,
                  'd-flex align-items-start pb-2',
                )}
              >
                <span className={styles.label}>{t('scoreApplicable')} </span>
              </div>
              <ToggleSwitch
                disabled={!isEdit}
                control={control}
                name="scoreApplicable"
              />
            </Col>
            <Col />
          </Row>
        </div>
      </div>
      <RowAnt className={cx(styles.tableWrapper)}>
        <ColAnt sm={24} xl={10} className={cx('pb-3', styles.tableLevel)}>
          <div
            className={cx(
              styles.wrapperContainer,
              styles.wrapperTableContainer,
              'mt-3',
            )}
          >
            <TableLevels
              data={levelList || []}
              setLevelList={setLevelList}
              disable={!isEdit}
            />
          </div>
        </ColAnt>
        <ColAnt
          xl={14}
          sm={24}
          className={cx('ps-2 pb-3', styles.tableComplianceAnswer)}
        >
          <div
            className={cx(
              styles.wrapperContainer,
              styles.wrapperTableContainer,
              'mt-3',
            )}
          >
            <TableComplianceAnswer
              setComplianceAnswerList={setComplianceAnswerList}
              data={complianceAnswerList || []}
              disable={!isEdit}
            />
          </div>
        </ColAnt>
      </RowAnt>

      {isEdit && (
        <GroupButton
          className="pt-3"
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={!isEdit}
        />
      )}
    </>
  );
};

export default StandardMasterForm;
