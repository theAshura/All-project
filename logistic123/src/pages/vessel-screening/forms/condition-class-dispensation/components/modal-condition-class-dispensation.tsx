import { FC, useEffect, useCallback, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import SelectUI from 'components/ui/select/Select';
import {
  PARAMS_DEFAULT,
  CONDITION_STATUS_OPTIONS,
} from 'constants/filter.const';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GroupButton } from 'components/ui/button/GroupButton';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { CommonApiParam } from 'models/common.model';
import { getListAuthorityMasterActions } from 'store/authority-master/authority-master.action';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { AuthorityMaster } from 'models/api/authority-master/authority-master.model';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import moment from 'moment';
import useEffectOnce from 'hoc/useEffectOnce';
import { ConditionOfClassDetailResponse } from 'models/api/condition-of-class/condition-of-class.model';
import { getConditionOfClassDetailActionsApi } from 'api/condition-of-class.api';
import RiskSection from 'pages/vessel-screening/components/RiskSection';
import { TableComment } from 'pages/vessel-screening/components/Comment';
import {
  RISK_LEVEL_OPTIONS,
  RISK_LEVEL_TO_SCORE,
  RISK_LEVEL_TO_VALUE,
  RISK_VALUE_TO_LEVEL,
} from 'pages/vessel-screening/utils/constant';
import styles from './modal-condition-class-dispensation.module.scss';
import { VesselScreeningClassDispensationsExtends } from '../list-condition-class-dispensation';

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  toggle?: () => void;
  onSubmit?: (data) => void;
  data?: VesselScreeningClassDispensationsExtends;
  isEdit?: boolean;
  loading?: boolean;
}

const defaultValues = {
  potentialRisk: null,
  observedRisk: null,
  timeLoss: true,
  comments: [],
};

const ModalConditionOfClass: FC<ModalProps> = (props) => {
  const { loading, toggle, title, isOpen, onSubmit, isEdit, data } = props;

  const [detailData, setDetailData] =
    useState<ConditionOfClassDetailResponse>(null);
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();

  const { listAuthorityMasters } = useSelector(
    (state) => state.authorityMaster,
  );
  const { vesselDetail } = useSelector((state) => state.vessel);

  const authorityOption = useMemo(
    () =>
      listAuthorityMasters?.data?.map((item: AuthorityMaster) => ({
        value: item.id,
        label: item?.name,
      })),
    [listAuthorityMasters?.data],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListAuthorityMasterActions.request({
          ...newParams,
          pageSize: -1,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    handleGetList(PARAMS_DEFAULT);
  }, [handleGetList]);

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

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, setValue, control } = methods;

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (dataForm) => {
      const dataCreate = {
        classDispensationsId: data?.id,
        ...dataForm,
        potentialRisk: RISK_LEVEL_TO_VALUE[dataForm?.potentialRisk] ?? null,
        observedRisk: RISK_LEVEL_TO_VALUE[dataForm?.observedRisk] ?? null,
        potentialScore: RISK_LEVEL_TO_SCORE[dataForm?.potentialRisk] ?? null,
        observedScore: RISK_LEVEL_TO_SCORE[dataForm?.observedRisk] ?? null,
        comments: dataForm.comments?.length ? dataForm.comments : null,
      };
      onSubmit(dataCreate);
      resetForm();
    },
    [data?.id, onSubmit, resetForm],
  );

  useEffectOnce(() => {
    handleGetList(PARAMS_DEFAULT);
  });

  useEffect(() => {
    const defaultData = data?.classDispensationsRequests?.[0];
    if (defaultData) {
      setValue(
        'potentialRisk',
        RISK_VALUE_TO_LEVEL[defaultData?.potentialRisk] ?? null,
      );
      setValue(
        'observedRisk',
        RISK_VALUE_TO_LEVEL[defaultData?.observedRisk] ?? null,
      );
      setValue('timeLoss', defaultData?.timeLoss !== false);
      setValue('comments', defaultData?.CDRComments ?? []);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (data?.id) {
      getConditionOfClassDetailActionsApi(data?.id).then((res) => {
        const { data } = res;
        setDetailData(data);
      });
    } else {
      setDetailData(null);
    }
    return () => {
      setDetailData(null);
    };
  }, [data?.id]);

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('vesselName')}
              className={styles.disabledInput}
              disabled
              value={vesselDetail?.name}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('imoNumber')}
              className={styles.disabledInput}
              maxLength={20}
              disabled
              value={vesselDetail?.imoNumber}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('eventType')}
              className={styles.disabledInput}
              maxLength={200}
              disabled
              value={data?.eventType?.name}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Issue date"
              value={data?.issueDate ? moment(data?.issueDate) : null}
              name="issueDate"
              disabled
              placeholder=""
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <SelectUI
              labelSelect={t('authority')}
              data={authorityOption}
              disabled
              value={data?.authorityId}
              placeholder=""
              name="authorityId"
              id="entity"
              className={cx('w-100')}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <SelectUI
              labelSelect={t('status')}
              data={CONDITION_STATUS_OPTIONS}
              value="Open"
              disabled
              placeholder=""
              id="entity"
              name="status"
              className={cx('w-100')}
            />
          </Col>
        </Row>

        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Expiry date"
              name="expiryDate"
              value={
                detailData?.expiryDate ? moment(detailData?.expiryDate) : null
              }
              disabled
              placeholder=""
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <Input
              label={t('remarks')}
              className={styles.disabledInput}
              placeholder=""
              maxLength={20}
              disabled
              value={detailData?.remarks}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Closed date"
              disabled
              name="closedDate"
              placeholder=""
              inputReadOnly
              value={
                detailData?.closedDate ? moment(detailData?.closedDate) : null
              }
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')} id="name">
            <Input
              label={t('closureRemarks')}
              className={styles.disabledInput}
              placeholder=""
              maxLength={20}
              disabled
              value={detailData?.closureRemarks}
            />
          </Col>
          <Col className={cx('p-0 mx-3')} />
          <Col className={cx('p-0 ms-3')} />
        </Row>

        <TableAttachment
          featurePage={Features.QUALITY_ASSURANCE}
          subFeaturePage={SubFeatures.SAIL_GENERAL_REPORT}
          scrollVerticalAttachment
          loading={false}
          disable
          value={detailData?.attachments}
          buttonName="Attach"
          onchange={() => {}}
        />
        <FormProvider {...methods}>
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

export default ModalConditionOfClass;
