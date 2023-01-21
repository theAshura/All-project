import { FC, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import {
  FieldValues,
  useForm,
  Controller,
  FormProvider,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import moment from 'moment';
import { DATA_SPACE } from 'constants/components/ag-grid.const';
import RiskSection from 'pages/vessel-screening/components/RiskSection';
import {
  InjuriesSafetyRequests,
  UpdateInjuriesSafetyRequestParams,
} from 'pages/vessel-screening/utils/models/injuries-safety.model';
import { useParams } from 'react-router-dom';
import { getInjuriesSafetyRequestDetailActions } from 'pages/vessel-screening/store/vessel-injuries-safety.action';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import {
  RISK_LEVEL_OPTIONS,
  RISK_LEVEL_TO_SCORE,
  RISK_LEVEL_TO_VALUE,
  RISK_VALUE_TO_LEVEL,
} from 'pages/vessel-screening/utils/constant';
import styles from './modal-injuries.module.scss';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (UpdateInjuriesSafetyRequestParams) => void;
  isEdit?: boolean;
  w?: string | number;
  loading?: boolean;
  h?: string | number;
  no?: number;
}

const defaultValues = {
  eventType: null,
  lti: 'Yes',
  eventTitle: null,
  dateOfInjuries: '',
  deptOfInjuredPerson: null,
  locationOfIncident: null,
  injuriesBodyPart: null,
  causes: '',
  countermeasures: '',
  attachments: [],
  potentialRisk: null,
  observedRisk: null,
  timeLoss: true,
  comments: [],
};

const ModalInjuries: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, onSubmit, isEdit } = props;
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const { id: vesselScreeningId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { injuryDetail } = useSelector((state) => state.injury);
  const { injuriesSafetyRequestDetail } = useSelector(
    (state) => state.vesselInjuriesSafety,
  );

  const schema = useMemo(
    () =>
      yup.object().shape({
        potentialRisk: yup
          .string()
          .nullable()
          .required(t('thisFieldIsRequired'))
          .oneOf(RISK_LEVEL_OPTIONS, t('thisFieldIsRequired')),
        observedRisk: yup
          .string()
          .nullable()
          .required(t('thisFieldIsRequired'))
          .oneOf(RISK_LEVEL_OPTIONS, t('thisFieldIsRequired')),
        timeLoss: yup.boolean().nullable().required(t('thisFieldIsRequired')),
      }),
    [t],
  );

  const method = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors },
  } = method;

  const resetForm = useCallback(() => {
    reset(defaultValues);
    dispatch(getInjuriesSafetyRequestDetailActions.success(null));
  }, [dispatch, reset]);

  const handleCancel = () => {
    toggle();
    resetForm();
  };

  const onSubmitForm = useCallback(
    (formData: InjuriesSafetyRequests) => {
      const params: UpdateInjuriesSafetyRequestParams = {
        id: vesselScreeningId,
        data: {
          vesselScreeningId,
          injuryId: injuryDetail?.id,
          potentialRisk: RISK_LEVEL_TO_VALUE[formData?.potentialRisk] ?? null,
          potentialScore: RISK_LEVEL_TO_SCORE[formData?.potentialRisk] ?? null,
          observedRisk: RISK_LEVEL_TO_VALUE[formData?.observedRisk] ?? null,
          observedScore: RISK_LEVEL_TO_SCORE[formData?.observedRisk] ?? null,
          timeLoss: formData?.timeLoss,
          comments: formData?.comments?.length ? formData?.comments : null,
        },
      };
      onSubmit({ ...params });
      resetForm();
    },
    [injuryDetail?.id, onSubmit, resetForm, vesselScreeningId],
  );

  useEffect(() => {
    if (injuryDetail) {
      setValue('eventType', injuryDetail?.injuryMaster?.name);
      setValue('lti', injuryDetail?.injuryMaster?.lti === true ? 'Yes' : 'No');
      setValue('eventTitle', injuryDetail?.eventTitle);
      setValue(
        'dateOfInjuries',
        injuryDetail?.injuryDate && moment(injuryDetail?.injuryDate),
      );
      setValue('deptOfInjuredPerson', injuryDetail?.department?.name);
      setValue('locationOfIncident', injuryDetail?.location?.name);
      setValue('injuriesBodyPart', injuryDetail?.injuredBodyPart?.name);
      setValue('causes', injuryDetail?.causes);
      setValue('countermeasures', injuryDetail?.countermeasures);
      setValue(
        'attachments',
        injuryDetail?.attachments?.length ? [...injuryDetail?.attachments] : [],
      );
      setValue('imoNumber', injuryDetail?.vessel?.imoNumber || DATA_SPACE);
      setValue('vessel', injuryDetail?.vessel?.name || DATA_SPACE);
    }
  }, [injuryDetail, setValue]);

  useEffect(() => {
    if (injuriesSafetyRequestDetail) {
      setValue(
        'potentialRisk',
        RISK_VALUE_TO_LEVEL[injuriesSafetyRequestDetail?.potentialRisk] ?? null,
      );
      setValue(
        'observedRisk',
        RISK_VALUE_TO_LEVEL[injuriesSafetyRequestDetail?.observedRisk] ?? null,
      );
      setValue('timeLoss', injuriesSafetyRequestDetail?.timeLoss !== false);
      setValue('comments', injuriesSafetyRequestDetail?.IRComments ?? []);
    }
  }, [injuriesSafetyRequestDetail, setValue]);

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('vesselName')}
              className={styles.disabledInput}
              maxLength={20}
              disabled
              id="vessel"
              name="vessel"
              {...register('vessel')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('imoNumber')}
              className={styles.disabledInput}
              maxLength={20}
              disabled
              id="imoNumber"
              name="imoNumber"
              {...register('imoNumber')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('injuries.eventType')}
              className={styles.disabledInput}
              maxLength={20}
              disabled
              id="eventType"
              name="eventType"
              {...register('eventType')}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('injuries.lti')}
              className={styles.disabledInput}
              maxLength={20}
              disabled
              {...register('lti')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('injuries.eventTitle')}
              className={styles.disabledInput}
              maxLength={100}
              disabled
              {...register('eventTitle')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Date of injury"
              name="dateOfInjuries"
              disabled
              control={control}
              messageRequired={errors?.dateOfInjuries?.message || null}
              placeholder={t('placeholder.pleaseSelect')}
              inputReadOnly
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('injuries.deptOfInjuredPerson')}
              className={styles.disabledInput}
              maxLength={300}
              disabled
              {...register('deptOfInjuredPerson')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('injuries.locationOfIncident')}
              className={styles.disabledInput}
              maxLength={300}
              disabled
              {...register('locationOfIncident')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('injuries.injuriesBodyPart')}
              className={styles.disabledInput}
              maxLength={300}
              disabled
              {...register('injuriesBodyPart')}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')} id="name">
            <Input
              label={t('injuries.causes')}
              className={styles.disabledInput}
              maxLength={300}
              disabled
              {...register('causes')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('injuries.countermeasures')}
              className={styles.disabledInput}
              maxLength={300}
              disabled
              {...register('countermeasures')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')} />
        </Row>

        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.QUALITY_ASSURANCE}
              subFeaturePage={SubFeatures.VESSEL_SCREENING}
              scrollVerticalAttachment
              loading={false}
              disable
              isEdit={false}
              isCreate={false}
              value={field.value}
              buttonName="Attach"
              onchange={field.onChange}
              classWrapper="pb-1"
            />
          )}
        />
        <FormProvider {...method}>
          <RiskSection
            className="p-0"
            potentialRiskName="potentialRisk"
            observedRiskName="observedRisk"
            timeLossName="timeLoss"
            isEdit={isEdit}
          />
        </FormProvider>

        <Controller
          control={control}
          name="comments"
          render={({ field }) => (
            <TableComment
              disable={!isEdit}
              loading={false}
              value={field.value}
              onchange={field.onChange}
              className="p-0"
            />
          )}
        />
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className="mt-1 justify-content-end"
          handleCancel={handleCancel}
          visibleSaveBtn
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={loading}
        />
      </div>
    </>
  );

  return (
    <ModalComponent
      w={1156}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      contentClassName={cx(styles.contentClassName)}
      bodyClassName={cx(styles.formWrapper)}
      footer={isEdit ? renderFooter() : null}
    />
  );
};

export default ModalInjuries;
