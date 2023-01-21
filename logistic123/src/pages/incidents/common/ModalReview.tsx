import { yupResolver } from '@hookform/resolvers/yup';
import ModalComponent from 'components/ui/modal/Modal';
import { I18nNamespace } from 'constants/i18n.const';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import cx from 'classnames';
import { GroupButton } from 'components/ui/button/GroupButton';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import SelectUI from 'components/ui/select/Select';
import { useDispatch, useSelector } from 'react-redux';
import { getListRiskFactorActions } from 'store/risk-factor/risk-factor.action';
import useEffectOnce from 'hoc/useEffectOnce';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { ReviewType } from 'models/api/incident-investigation/incident-investigation.model';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import styles from './modal.module.scss';

interface ModalAddReviewProps {
  isOpen: boolean;
  toggle: () => void;
  index: number;
  review: ReviewType;
  handleSubmitForm: (data: ReviewType, index: number, isNew?: boolean) => void;
  disabled?: boolean;
}

const defaultValues = {
  remark: '',
  riskFactorId: undefined,
  incidentStatus: undefined,
  vesselAcceptable: 'Yes',
  attachments: [],
};

const ModalAddReview = ({
  isOpen,
  toggle,
  index,
  review,
  disabled = false,
  handleSubmitForm,
}: ModalAddReviewProps) => {
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { loading: loadingRiskFactor, listRiskFactor } = useSelector(
    (state) => state.riskFactor,
  );
  const schema = useMemo(
    () =>
      yup.object().shape({
        remark: yup.string().trim().nullable().required(t('errors.required')),
        riskFactorId: yup
          .string()
          .trim()
          .nullable()
          .required(t('errors.required')),
        incidentStatus: yup
          .string()
          .trim()
          .nullable()
          .required(t('errors.required')),
      }),
    [t],
  );

  const {
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetForm = useCallback(() => {
    reset(defaultValues);
    clearErrors();
  }, [clearErrors, reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const RISK_FACTOR_OPTIONS = useMemo(
    () =>
      listRiskFactor?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [listRiskFactor?.data],
  );
  const INCIDENT_STATUS_OPTIONS = useMemo(
    () => [
      { value: 'Accepted', label: 'Accepted' },
      { value: 'Completed', label: 'Completed' },
      { value: 'Reviewed', label: 'Reviewed' },
    ],
    [],
  );
  const onSubmitForm = useCallback(
    (formData) => {
      const riskFactor = RISK_FACTOR_OPTIONS.find(
        (item) => item.value === formData.riskFactorId,
      );
      if (riskFactor) {
        handleSubmitForm(
          { ...formData, riskFactor: { name: riskFactor.label } },
          index,
        );
        handleCancel();
      }
    },
    [RISK_FACTOR_OPTIONS, handleCancel, handleSubmitForm, index],
  );

  const handleSubmitAndNew = useCallback(
    (formData) => {
      const riskFactor = RISK_FACTOR_OPTIONS.find(
        (item) => item.value === formData.riskFactorId,
      );
      if (riskFactor) {
        handleSubmitForm(
          { ...formData, riskFactor: { name: riskFactor.label } },
          index,
          true,
        );
        resetForm();
      }
    },
    [RISK_FACTOR_OPTIONS, handleSubmitForm, index, resetForm],
  );

  const handleGetListRiskFactor = () => {
    dispatch(getListRiskFactorActions.request({ page: 1, pageSize: -1 }));
  };

  useEffectOnce(() => {
    handleGetListRiskFactor();
  });
  useEffect(() => {
    if (isOpen && Number.isInteger(index)) {
      setValue('remark', review?.remark || '');
      setValue('riskFactorId', review?.riskFactorId || undefined);
      setValue('incidentStatus', review?.incidentStatus || undefined);
      setValue('vesselAcceptable', review?.vesselAcceptable || 'Yes');
      setValue(
        'attachments',
        review?.attachments?.length ? [...review?.attachments] : [],
      );
    } else {
      resetForm();
    }
  }, [review, isOpen, resetForm, setValue, index]);

  const renderForm = useCallback(
    () => (
      <div>
        <Row className="pt-2 mx-0">
          <div className={cx(styles.labelForm)}>
            {t('remarkLabel')}
            <span className={cx(styles.required)}>*</span>
          </div>
          <TextAreaForm
            name="remark"
            placeholder={t('placeholder.remark')}
            maxLength={500}
            control={control}
            rows={3}
            required
            disabled={disabled}
          />
        </Row>
        <Row className="pt-3 mx-0">
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              labelSelect={t('riskFactor')}
              data={RISK_FACTOR_OPTIONS}
              placeholder={t('placeholder.pleaseSelect')}
              name="riskFactorId"
              id="riskFactorId"
              className={cx('w-100')}
              messageRequired={errors?.riskFactorId?.message || null}
              control={control}
              loading={loadingRiskFactor}
              disabled={disabled}
              isRequired
            />
          </Col>
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              labelSelect={t('incidentStatus')}
              data={INCIDENT_STATUS_OPTIONS}
              placeholder={t('placeholder.pleaseSelect')}
              name="incidentStatus"
              id="incidentStatus"
              className={cx('w-100')}
              messageRequired={errors?.incidentStatus?.message || null}
              control={control}
              disabled={disabled}
              isRequired
            />
          </Col>
          <Col className="p-0">
            <RadioForm
              label={t('vesselAcceptable')}
              name="vesselAcceptable"
              labelClassName={styles.radioLabel}
              className={styles.radioForm}
              control={control}
              messageRequired={errors?.vesselAcceptable?.message || ''}
              isRequired
              disabled={disabled}
              radioOptions={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]}
            />
          </Col>
        </Row>
        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              scrollVerticalAttachment
              loading={false}
              disable={disabled}
              value={field.value}
              buttonName="Attach"
              onchange={field.onChange}
              isEdit={!disabled}
              featurePage={Features.QUALITY_ASSURANCE}
              subFeaturePage={SubFeatures.INCIDENTS}
            />
          )}
        />
      </div>
    ),
    [
      t,
      control,
      disabled,
      RISK_FACTOR_OPTIONS,
      errors?.riskFactorId?.message,
      errors?.incidentStatus?.message,
      errors?.vesselAcceptable?.message,
      loadingRiskFactor,
      INCIDENT_STATUS_OPTIONS,
    ],
  );
  const renderFooter = useCallback(
    () => (
      <>
        {!disabled && (
          <div>
            <GroupButton
              className="mt-4 justify-content-end"
              handleCancel={handleCancel}
              visibleSaveBtn
              handleSubmit={handleSubmit(onSubmitForm)}
              handleSubmitAndNew={handleSubmit(handleSubmitAndNew)}
            />
          </div>
        )}
      </>
    ),
    [disabled, handleCancel, handleSubmit, handleSubmitAndNew, onSubmitForm],
  );

  return (
    <ModalComponent
      w={800}
      isOpen={isOpen}
      toggle={handleCancel}
      title={t('reviewInformation')}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default ModalAddReview;
