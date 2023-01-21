import cx from 'classnames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ButtonType } from 'components/ui/button/Button';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import ModalComponent from 'components/ui/modal/Modal';
import { Col, Row } from 'reactstrap';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MaxLength } from 'constants/common.const';
import Input from 'components/ui/input/Input';
import { GroupButton } from 'components/ui/button/GroupButton';
import SelectUI from 'components/ui/select/Select';
import { v4 } from 'uuid';
import {
  ElementMaster,
  StandardMaster,
} from 'models/api/element-master/element-master.model';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import { toastError } from 'helpers/notification.helper';
import styles from '../form.module.scss';

interface ModalCreateElementProps {
  selectedStandard?: StandardMaster;
  handleAdd?: (data) => void;
  loading?: boolean;
  isAdd?: boolean;
  isCreate?: boolean;
  selectedData?: ElementMaster;
  isShow?: boolean;
  setShow?: () => void;
  title?: string;
  dataTable?: ElementMaster[];
}

const defaultValues = {
  code: '',
  name: '',
  number: undefined,
  stage: undefined,
  questionNumber: undefined,
  elementStageQ: '',
  keyPerformanceIndicator: '',
  bestPracticeGuidance: '',
};

export const ModalCreateElement: FC<ModalCreateElementProps> = (props) => {
  const {
    handleAdd,
    selectedData,
    selectedStandard,
    isAdd,
    loading,
    isShow,
    setShow,
    title,
    dataTable,
  } = props;
  const { t } = useTranslation([
    I18nNamespace.ELEMENT_MASTER,
    I18nNamespace.COMMON,
  ]);
  const [modal, setModal] = useState(isShow || false);
  const [isFirst, setIsFirst] = useState(true);
  const disabledCode = useMemo(
    () => loading || (selectedData && !selectedData.isAddItem),
    [loading, selectedData],
  );

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('errors.required')),
    name: yup.string().trim().nullable().required(t('errors.required')),
    number: yup.string().trim().nullable().required(t('errors.required')),
    questionNumber: yup
      .number()
      .min(1, `This field must be greater than 0`)
      .transform((v, o) => {
        if (o === '') {
          return null;
        }
        if (Number.isNaN(v)) {
          return null;
        }
        if (String(o).includes('.')) {
          return o;
        }
        return v;
      })
      .nullable()
      .test(
        'maxDigits',
        'This field should not be more than 4 digits',
        (number) => String(number).length <= 4,
      )
      .integer('This field is invalid')
      .typeError('This field is invalid')
      .required(t('errors.required')),
    stage: yup.string().trim().nullable().required(t('errors.required')),
    elementStageQ: yup
      .string()
      .trim()
      .nullable()
      .required(t('errors.required')),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchElementNumber = watch('number');
  const watchQuestionNumber = watch('questionNumber');
  const watchStage = watch('stage');

  useEffect(() => {
    if (watchElementNumber && watchQuestionNumber && watchStage) {
      const ElementStageQ = `${watchElementNumber}-${watchStage}-${watchQuestionNumber}`;
      setValue('elementStageQ', ElementStageQ);
      setError('elementStageQ', { message: '' });
    } else {
      setValue('elementStageQ', '');
    }
  }, [watchElementNumber, watchQuestionNumber, watchStage, setValue, setError]);

  const LEVELS_OPTION = useMemo(
    () =>
      selectedStandard?.levels?.map((item) => ({
        label: item,
        value: item,
      })) || [],
    [selectedStandard],
  );

  const resetForm = useCallback(() => {
    setValue('code', '');
    setValue('name', '');
    setValue('number', '');
    setValue('stage', null);
    setValue('questionNumber', null);
    setValue('elementStageQ', '');
    setValue('keyPerformanceIndicator', '');
    setValue('bestPracticeGuidance', '');
  }, [setValue]);

  const handleNewData = useCallback(
    (formData: ElementMaster) => {
      let dataNew = {};
      if (isAdd) {
        dataNew = {
          ...formData,
          id: v4(),
          isAddItem: true,
        };
      } else {
        dataNew = {
          ...selectedData,
          ...formData,
        };
      }
      return dataNew;
    },
    [isAdd, selectedData],
  );

  const getExitDataRecord = useCallback((data: ElementMaster[]) => {
    const exitDatas = data.filter((i, index) => {
      if (
        data
          .slice(index + 1, data.length + 1)
          .some(
            (item) =>
              item.elementStageQ.toLowerCase() ===
              i.elementStageQ.toLowerCase(),
          )
      ) {
        return true;
      }
      return false;
    });
    return exitDatas;
  }, []);

  const checkValidation = useCallback(
    (dataNew: ElementMaster) => {
      if (isAdd || dataNew?.elementStageQ !== selectedData?.elementStageQ) {
        const dataResultExit = getExitDataRecord([...dataTable, dataNew]);
        if (dataResultExit.length) {
          toastError(t('validation.uniqueElementStageQ'));
          return true;
        }
      }
      return false;
    },
    [dataTable, t, getExitDataRecord, isAdd, selectedData],
  );

  const onSubmitForm = useCallback(
    (formData: ElementMaster) => {
      const isExit = checkValidation(formData);
      if (isExit) {
        return true;
      }
      const dataNew = handleNewData(formData);
      handleAdd({ ...dataNew, resetForm });
      return false;
    },
    [checkValidation, handleAdd, resetForm, handleNewData],
  );

  const handleSubmitAndNew = useCallback(
    (formData: ElementMaster) => {
      const isExit = checkValidation(formData);
      if (isExit) {
        return true;
      }
      const dataNew = handleNewData(formData);
      handleAdd({ ...dataNew, isNew: true, resetForm });
      return false;
    },
    [checkValidation, handleAdd, resetForm, handleNewData],
  );

  const handleCancel = useCallback(() => {
    setModal(false);
    setShow();
  }, [setShow]);

  useEffect(() => {
    setModal(isShow);
  }, [isShow]);

  useEffect(() => {
    if (isFirst && selectedData && !isAdd) {
      setValue('code', selectedData.code);
      setValue('name', selectedData.name);
      setValue('number', selectedData.number);
      setValue('stage', selectedData.stage);
      setValue('questionNumber', selectedData.questionNumber);
      setValue('elementStageQ', selectedData.elementStageQ);
      setValue('keyPerformanceIndicator', selectedData.keyPerformanceIndicator);
      setValue('bestPracticeGuidance', selectedData.bestPracticeGuidance);
      setIsFirst(false);
    }
  }, [selectedData, isAdd, isFirst, setValue]);

  const renderForm = () => (
    <>
      <div>
        <Row className="mx-0">
          <Col className="ps-0">
            <Input
              isRequired
              label={t('form.code')}
              {...register('code')}
              name="code"
              readOnly={disabledCode}
              className={disabledCode && 'cssDisabled'}
              maxLength={4}
              placeholder={t('placeholder.code')}
              messageRequired={errors?.code?.message || ''}
            />
          </Col>
          <Col className="pe-0">
            <Input
              isRequired
              label={t('form.name')}
              {...register('name')}
              name="name"
              disabled={loading}
              maxLength={MaxLength.MAX_LENGTH_COMMENTS}
              placeholder={t('placeholder.name')}
              messageRequired={errors?.name?.message || ''}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <Input
              isRequired
              label={t('form.number')}
              {...register('number')}
              name="number"
              disabled={loading}
              maxLength={4}
              placeholder={t('placeholder.number')}
              messageRequired={errors?.number?.message || ''}
            />
          </Col>
          <Col className="pe-0">
            <SelectUI
              isRequired
              labelSelect={t('form.stage')}
              messageRequired={errors?.stage?.message || ''}
              data={LEVELS_OPTION}
              disabled={loading}
              name="stage"
              className={cx('w-100')}
              control={control}
              notAllowSortData
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <Input
              label={t('form.questionNumber')}
              {...register('questionNumber')}
              name="questionNumber"
              type="number"
              maxLength={4}
              isRequired
              messageRequired={errors?.questionNumber?.message || ''}
              placeholder={t('placeholder.questionNumber')}
            />
          </Col>
          <Col className="pe-0">
            <InputForm
              label={t('form.elementStageQ')}
              name="elementStageQ"
              {...register('elementStageQ')}
              patternValidate={/^[a-z\d\-_\s]+$/i}
              control={control}
              className="cssDisabled"
              disabled
              messageRequired={errors?.elementStageQ?.message || ''}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <div className={cx('d-flex pb-1 pt-2', styles.wrapLabel)}>
            <p className={cx('mb-0', styles.label)}>
              {t('keyPerformanceIndicator')}
            </p>
          </div>
          <TextAreaForm
            name="keyPerformanceIndicator"
            placeholder={t('placeholder.keyPerformanceIndicator')}
            control={control}
            maxLength={5000}
            className={styles.scrollY}
            rows={4}
          />
        </Row>
        <Row className="pt-4 mx-0">
          <div className={cx('d-flex pb-1 pt-2', styles.wrapLabel)}>
            <p className={cx('mb-0', styles.label)}>
              {t('bestPracticeGuidance')}
            </p>
          </div>
          <TextAreaForm
            name="bestPracticeGuidance"
            placeholder={t('placeholder.bestPracticeGuidance')}
            control={control}
            className={styles.scrollY}
            maxLength={5000}
            rows={4}
          />
        </Row>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.OutlineGray}
          handleCancel={() => {
            handleCancel();
            setIsFirst(true);
          }}
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
          disable={loading}
        />
      </div>
    </>
  );

  return (
    <ModalComponent
      isOpen={modal}
      toggle={() => {
        setModal(false);
        setShow();
        resetForm();
        setIsFirst(true);
      }}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};
