import {
  FC,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Col, Row } from 'reactstrap';
import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as yup from 'yup';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import SelectUI from 'components/ui/select/Select';
import { ANY_EXPIRED_CERTIFICATES } from 'constants/filter.const';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toastError } from 'helpers/notification.helper';
import { EventType } from 'models/api/event-type/event-type.model';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import { getListAuthorityMasterActionsApi } from 'api/authority-master.api';
import { GroupButton } from 'components/ui/button/GroupButton';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { CommonApiParam } from 'models/common.model';
import { AuthorityMaster } from 'models/api/authority-master/authority-master.model';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { CreateSurveyClassInfoParams } from 'models/api/survey-class-info/survey-class-info.model';
import { clearSurveyClassInfo } from 'store/survey-class-info/survey-class-info.action';
import moment from 'moment';
import { getListFileActions } from 'store/dms/dms.action';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListVesselActions } from 'store/vessel/vessel.action';
import styles from './survey-class-info.module.scss';

interface ModalProps {
  isOpen?: boolean;
  isCreate?: boolean;
  title?: string;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  toggle?: () => void;
  onSubmit?: (data: CreateSurveyClassInfoParams) => void;
  setIsCreate?: (value: boolean) => void;
  data?: any;
  eventTypes?: EventType[];
  isEdit?: boolean;
  w?: string | number;
  isView?: boolean;
  loading?: boolean;
  h?: string | number;
  defaultValueEventType?: string;
}

const defaultValues = {
  eventType: [],
  anyExpiredCertificates: 1,
  anyOpenCOC: 1,
  issueDate: '',
  authorityId: [],
  remarks: '',
  cocRemarks: '',
  attachments: [],
};

const ModalSurveyClassInfo: FC<ModalProps> = (props) => {
  const {
    loading,
    toggle,
    title,
    isOpen,
    onSubmit,
    eventTypes,
    data,
    isCreate,
    isEdit,
    isView,
    defaultValueEventType,
  } = props;
  const { t } = useTranslation([
    I18nNamespace.SAIL_GENERAL_REPORT,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();

  const [optionEventTypes, setOptionEventTypes] = useState([]);
  const [optionAuthority, setOptionAuthority] = useState([]);
  const [dataAuthority, setDataAuthority] = useState([]);

  const { errorList } = useSelector((state) => state.incidentType);

  const { detailSurveyClassInfo } = useSelector(
    (state) => state.surveyClassInfo,
  );
  const { vesselDetail } = useSelector((state) => state.vessel);

  const handleGetList = useCallback((params?: CommonApiParam) => {
    const newParams = handleFilterParams(params);
    getListAuthorityMasterActionsApi(newParams)
      .then((r) => {
        setDataAuthority(r?.data?.data);
      })
      .catch((e) => toastError(e));
  }, []);

  useEffect(() => {
    handleGetList({ page: 1, pageSize: -1 });
  }, [dispatch, handleGetList]);

  const schema = yup.object().shape({
    eventType: yup.array().nullable().min(1, t('ThisFieldIsRequired')),
    anyExpiredCertificates: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
    anyOpenCOC: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
    authorityId: yup.array().nullable().min(1, t('ThisFieldIsRequired')),
    issueDate: yup
      .string()
      .trim()
      .nullable()
      .required(t('ThisFieldIsRequired')),
  });

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const eventTypeWatch = watch('eventType');

  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const handleCancel = useCallback(() => {
    toggle();
    resetForm();
  }, [resetForm, toggle]);

  const onSubmitForm = useCallback(
    (data) => {
      const dataSubmit: CreateSurveyClassInfoParams = {
        ...data,
        authorityId: data?.authorityId[0].value,
        eventTypeId: data?.eventType[0].value,
        anyExpiredCertificates: data.anyExpiredCertificates === '1',
        anyOpenCOC: data.anyOpenCOC === '1',
        remarks: data.remarks ? data.remarks.trim() : undefined,
        cocRemarks: data.cocRemarks ? data.cocRemarks.trim() : undefined,
        attachments: data.attachments.length > 0 ? data.attachments : undefined,
        issueDate: moment(data.issueDate).startOf('day').toISOString(),
        vesselId: vesselDetail?.id,
      };
      onSubmit(dataSubmit);
      resetForm();
      toggle();
    },
    [onSubmit, resetForm, toggle, vesselDetail?.id],
  );

  useEffect(() => {
    let paramAuthority: CommonApiParam = {
      pageSize: -1,
      status: 'active',
    };
    if (data?.eventTypeId && isOpen) {
      paramAuthority = { ...paramAuthority, eventTypeId: data?.eventTypeId };
    }
    if (isOpen) handleGetList(paramAuthority);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOpen]);

  useEffect(() => {
    if (eventTypeWatch?.length > 0 && (isCreate || isEdit)) {
      handleGetList({
        pageSize: -1,
        status: 'active',
        eventTypeId: eventTypeWatch[0].value,
      });
      setValue('authorityId', []);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTypeWatch]);

  useEffect(() => {
    if (isCreate) {
      setValue('issueDate', '');
      setValue('authorityId', []);
      setValue('anyExpiredCertificates', 1);
      setValue('remarks', '');
      setValue('anyOpenCOC', 1);
      setValue('cocRemarks', '');
      setValue('attachments', []);
    }
  }, [isCreate, setValue]);

  useEffect(() => {
    if (isEdit || isView) {
      if (detailSurveyClassInfo?.attachments?.length > 0) {
        dispatch(
          getListFileActions.request({
            ids: detailSurveyClassInfo?.attachments || [],
          }),
        );
      } else {
        dispatch(getListFileActions.success([]));
      }
    }
  }, [detailSurveyClassInfo?.attachments, dispatch, isEdit, isView]);

  useEffect(() => {
    if ((isEdit || isView) && detailSurveyClassInfo) {
      setValue(
        'eventType',
        detailSurveyClassInfo?.eventTypeId
          ? [
              {
                value: detailSurveyClassInfo?.eventTypeId,
                label: detailSurveyClassInfo?.eventType?.name,
              },
            ]
          : [],
      );
      setTimeout(() => {
        setValue(
          'authorityId',
          detailSurveyClassInfo?.authorityId
            ? [
                {
                  value: detailSurveyClassInfo?.authorityId,
                  label: detailSurveyClassInfo?.authority?.name,
                },
              ]
            : [],
        );
      }, 100);

      setValue(
        'issueDate',
        detailSurveyClassInfo?.issueDate
          ? moment(detailSurveyClassInfo?.issueDate)
          : '',
      );
      setValue(
        'anyExpiredCertificates',
        detailSurveyClassInfo?.anyExpiredCertificates ? 1 : 0,
      );
      setValue('remarks', detailSurveyClassInfo?.remarks);
      setValue('anyOpenCOC', detailSurveyClassInfo?.anyOpenCOC ? 1 : 0);
      setValue('cocRemarks', detailSurveyClassInfo?.cocRemarks);
      setValue(
        'attachments',
        detailSurveyClassInfo?.attachments?.length
          ? [...detailSurveyClassInfo?.attachments]
          : [],
      );
    }
  }, [detailSurveyClassInfo, isEdit, isView, setValue]);

  useEffect(() => {
    setValue('vesselName', vesselDetail?.name);
    setValue('imoNumber', vesselDetail?.imoNumber);
  }, [setValue, vesselDetail?.imoNumber, vesselDetail?.name]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearSurveyClassInfo());
    }
  }, [dispatch, isOpen]);

  useEffectOnce(() => {
    dispatch(getListVesselActions.request({ pageSize: -1, status: 'active' }));
  });

  const listOptionEventTypes = useMemo(
    () =>
      eventTypes?.map((item) => ({
        value: item.id,
        label: item.name,
      })) || [],
    [eventTypes],
  );

  useEffect(() => {
    if (
      isOpen &&
      isCreate &&
      defaultValueEventType &&
      !data &&
      listOptionEventTypes?.length
    ) {
      const dataDefaultEventType = listOptionEventTypes?.find(
        (i) =>
          i?.label?.trim()?.toUpperCase() ===
          defaultValueEventType?.toUpperCase(),
      );

      if (dataDefaultEventType) {
        setValue('eventType', [dataDefaultEventType]);
        setTimeout(() => {
          handleGetList({
            pageSize: -1,
            status: 'active',
            eventTypeId: dataDefaultEventType.value,
          });
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValueEventType, data, listOptionEventTypes, isOpen]);

  const listAuthorityOption = useMemo(
    () =>
      dataAuthority?.map((item: AuthorityMaster) => ({
        value: item.id,
        label: item.name,
      })),
    [dataAuthority],
  );

  const onChangeSearchEventType = useCallback(
    (value: string) => {
      const newData = filterContentSelect(value, listOptionEventTypes || []);
      setOptionEventTypes(newData);
    },
    [listOptionEventTypes],
  );

  const onChangeSearchAuthority = useCallback(
    (value: string) => {
      const newData = filterContentSelect(value, listAuthorityOption || []);
      setOptionAuthority(newData);
    },
    [listAuthorityOption],
  );
  const renderForm = () => (
    <>
      <div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('vesselName')}
              className={styles.disabledInput}
              disabled
              id="vesselName"
              name="vesselName"
              {...register('vesselName')}
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
            <AsyncSelectForm
              disabled={isView}
              messageRequired={errors?.eventType?.message}
              control={control}
              name="eventType"
              labelSelect={t('eventType')}
              isRequired
              placeholder="Please select"
              searchContent={t('eventType')}
              onChangeSearch={onChangeSearchEventType}
              options={optionEventTypes}
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <DateTimePicker
              wrapperClassName={cx(styles.datePickerWrapper)}
              className="w-100 "
              label="Issue date"
              isRequired
              control={control}
              disabled={isView}
              name="issueDate"
              messageRequired={errors?.issueDate?.message || null}
              placeholder={
                detailSurveyClassInfo && !isEdit
                  ? ''
                  : t('placeholder.pleaseSelect')
              }
              inputReadOnly
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <AsyncSelectForm
              disabled={isView}
              messageRequired={errors?.authorityId?.message}
              control={control}
              name="authorityId"
              labelSelect={t('authority')}
              isRequired
              placeholder="Please select"
              searchContent={t('authority')}
              onChangeSearch={onChangeSearchAuthority}
              options={optionAuthority}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <SelectUI
              labelSelect="Any Expired Certificates/Surveys"
              data={ANY_EXPIRED_CERTIFICATES}
              isRequired
              disabled={isView}
              name="anyExpiredCertificates"
              id="anyExpiredCertificates"
              className={cx('w-100')}
              messageRequired={errors?.anyExpiredCertificates?.message || null}
              control={control}
              notAllowSortData
            />
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('remarks')}
              className={styles.disabledInput}
              placeholder={
                detailSurveyClassInfo && !isEdit ? '' : t('placeholder.remarks')
              }
              maxLength={500}
              disabled={isView}
              {...register('remarks')}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <SelectUI
              labelSelect=" Any Open COC"
              data={ANY_EXPIRED_CERTIFICATES}
              isRequired
              disabled={isView}
              name="anyOpenCOC"
              id="anyOpenCOC"
              className={cx('w-100')}
              messageRequired={errors?.anyOpenCOC?.message || null}
              control={control}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label="COC Remarks"
              disabled={isView}
              className={styles.disabledInput}
              placeholder={
                detailSurveyClassInfo && !isEdit ? '' : 'Enter COC remarks'
              }
              maxLength={500}
              {...register('cocRemarks')}
            />
          </Col>
        </Row>

        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.QUALITY_ASSURANCE}
              subFeaturePage={SubFeatures.SAIL_GENERAL_REPORT}
              loading={false}
              scrollVerticalAttachment
              isEdit={!detailSurveyClassInfo || isEdit}
              disable={!(!detailSurveyClassInfo || isEdit)}
              value={field.value}
              buttonName="Attach"
              onchange={field.onChange}
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

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'no':
            setError('no', { message: t('incidentTypeCodeIsExisted') });
            break;
          default:
            break;
        }
      });
    } else {
      setError('no', { message: '' });
    }
  }, [errorList, setError, t]);

  return (
    <ModalComponent
      w={1156}
      isOpen={isOpen}
      toggle={handleCancel}
      title={title}
      content={renderForm()}
      footer={
        (detailSurveyClassInfo && isEdit) || isCreate ? renderFooter() : null
      }
      headerSubPart={
        isEdit || isView ? (
          <span>
            {t('refID')}: {data?.refID}
          </span>
        ) : null
      }
    />
  );
};

export default ModalSurveyClassInfo;
