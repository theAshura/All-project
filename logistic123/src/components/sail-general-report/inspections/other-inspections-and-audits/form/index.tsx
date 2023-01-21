import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  FormProvider,
  FieldValues,
  useForm,
  Controller,
} from 'react-hook-form';
import isEqual from 'lodash/isEqual';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import history from 'helpers/history.helper';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getListPscActions } from 'store/psc-action/psc-action.action';
import { getListPSCDeficiencyActions } from 'store/psc-deficiency/psc-deficiency.action';
import { getListVIQActions } from 'store/viq/viq.action';
import {
  CreateExternalParams,
  ExternalInspectionReportsDetail,
  GetDetailExternal,
} from 'models/api/external/external.model';
import { useParams } from 'react-router';
import { ModuleName } from 'constants/common.const';
import { AppRouteConst } from 'constants/route.const';
import { getListUserRecordActions } from 'store/user/user.action';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { getListRolesDefaultsApi } from 'api/role.api';
import { Role } from 'models/api/role/role.model';
import {
  Features,
  FIXED_ROLE_NAME,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import useEffectOnce from 'hoc/useEffectOnce';
import styles from './form.module.scss';
import GeneralInformation from './GeneralInformationIncident';
import Place from './Place';
import AddRemark from './AddRemark';

interface FormProps {
  isEdit: boolean;
  isCreate?: boolean;
  loading?: boolean;
  data: GetDetailExternal;
  onSubmit: (data: CreateExternalParams) => void;
}

const defaultValues = {
  vesselId: null,
  eventTypeId: null,
  authorityId: null,
  dateOfInspection: null,
  noFindings: false,
  inspectorName: null,
  isPort: true,
  portId: null,
  terminalId: null,
  externalInspectionReports: [],
  detention: 'No',
  comment: null,
  attachments: [],
};

const Form: FC<FormProps> = ({ isEdit, data, loading, onSubmit, isCreate }) => {
  const { t } = useTranslation([
    I18nNamespace.PORT_STATE_CONTROL,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const { listAuthorityMasters } = useSelector(
    (state) => state.authorityMaster,
  );
  const [roles, setRoles] = useState<Role[]>(null);
  const { vesselDetail } = useSelector((state) => state.vessel);
  const { listAuditTypes } = useSelector((state) => state.auditType);
  const schema = useMemo(
    () =>
      Yup.object().shape({
        isPort: Yup.boolean().nullable().required(t('errors.required')),
        authorityId: Yup.array()
          .nullable()
          .required(t('errors.required'))
          .min(1, t('errors.required')),
        eventTypeId: Yup.array()
          .nullable()
          .required(t('errors.required'))
          .min(1, t('errors.required')),
        dateOfInspection: Yup.string()
          .nullable()
          .required(t('errors.required')),
        noFindings: Yup.string().nullable().required(t('errors.required')),
        comment: Yup.string().nullable().required(t('errors.required')),
        inspectorName: Yup.string().nullable().required(t('errors.required')),
        terminalId: Yup.string()
          .nullable()
          .when('isPort', {
            is: (value) => !value,
            then: Yup.string().nullable().trim().required(t('errors.required')),
          }),
        portId: Yup.string()
          .nullable()
          .when('isPort', {
            is: (value) => value,
            then: Yup.string().nullable().trim().required(t('errors.required')),
          }),
      }),
    [t],
  );

  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { setValue, watch, getValues, handleSubmit, control } = methods;

  useEffect(() => {
    if (data?.attachments?.length) {
      setValue('attachments', [...data.attachments]);
    }
  }, [data?.attachments, setValue]);

  useEffect(() => {
    if (!isCreate) {
      setValue(
        'externalInspectionReports',
        data?.externalInspectionReports || [],
      );
    }
  }, [data?.externalInspectionReports, isCreate, setValue]);

  const watchFindings: ExternalInspectionReportsDetail[] = watch(
    'externalInspectionReports',
  );

  const watchDetention = watch('detention');
  const watchNoFinding = watch('noFindings');
  const watchDateOfInspection = watch('dateOfInspection');

  const handleCancel = useCallback(() => {
    let defaultData = {};
    const values = getValues();

    const params = {
      ...values,
      eventTypeId: null,
      dateOfInspection: values?.dateOfInspection
        ? values?.dateOfInspection?.format('MM/DD/YYYY')
        : null,
    };

    if (isCreate) {
      defaultData = defaultValues;
    } else {
      const findings = data?.externalInspectionReports?.map((item) => ({
        ...item,
        pscDeficiencyId: item?.pscDeficiency?.id,
        pscActionId: item?.pscAction?.id,
        // viqId: item?.viq?.id,
        mainCategoryId: item?.mainCategory?.id || null,
      }));
      const eventTypeSelected = listAuditTypes?.data
        ?.filter((i) => i.id === data?.eventTypeId)
        ?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      const authoritySelected = listAuthorityMasters?.data
        ?.filter((i) => i.id === data?.authorityId)
        ?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      defaultData = {
        vesselId: data?.vesselId || null,
        isPort: Boolean(data?.isPort),
        noFindings: Boolean(data?.noFindings),
        portId: data?.portId || null,
        eventTypeId: eventTypeSelected || null,
        terminalId: data?.terminalId || null,
        dateOfInspection:
          moment(data?.dateOfInspection).format('MM/DD/YYYY') || null,
        comment: data?.comment || null,
        externalInspectionReports: findings || [],
        inspectorName: data?.inspectorName || null,
        authorityId: authoritySelected || null,
      };
    }
    if (isEqual(defaultData, params)) {
      history.push(
        `${AppRouteConst.getSailGeneralReportById(
          vesselRequestId,
        )}?tab=inspections&subTab=other-inspections-audit`,
      );
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () =>
          history.push(
            `${AppRouteConst.getSailGeneralReportById(
              vesselRequestId,
            )}?tab=inspections&subTab=other-inspections-audit`,
          ),
      });
    }
  }, [
    data?.authorityId,
    data?.comment,
    data?.dateOfInspection,
    data?.eventTypeId,
    data?.externalInspectionReports,
    data?.inspectorName,
    data?.isPort,
    data?.noFindings,
    data?.portId,
    data?.terminalId,
    data?.vesselId,
    getValues,
    isCreate,
    listAuditTypes?.data,
    listAuthorityMasters?.data,
    t,
    vesselRequestId,
  ]);

  const onSubmitForm = useCallback(
    (data: CreateExternalParams) => {
      const params: CreateExternalParams = {
        ...data,
        vesselId: vesselRequestId,
        dateOfInspection: moment(data?.dateOfInspection).toISOString(),
        attachments: data?.attachments,
        externalInspectionReports: data?.externalInspectionReports?.map(
          (item) => {
            const {
              estimatedCompletion,
              actualCompletion,
              mainCategoryId,
              ...other
            } = item;
            return {
              ...other,
              estimatedCompletion: moment(estimatedCompletion).toISOString(),
              actualCompletion: moment(actualCompletion).toISOString(),
              mainCategoryId: mainCategoryId || null,
            };
          },
        ),
      };
      onSubmit(params);
    },
    [onSubmit, vesselRequestId],
  );

  const inspectorRole = useMemo(
    () => roles?.find((item) => item?.name === FIXED_ROLE_NAME.INSPECTOR),
    [roles],
  );

  useEffect(() => {
    dispatch(getListPscActions.request({ pageSize: -1, status: 'active' }));
    dispatch(
      getListPSCDeficiencyActions.request({ pageSize: -1, status: 'active' }),
    );
    dispatch(getListVIQActions.request({ pageSize: -1, status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    if (inspectorRole && vesselDetail) {
      dispatch(
        getListUserRecordActions.request({
          pageSize: -1,
          status: 'active',
          role: inspectorRole?.id,
          vesselId: vesselDetail?.id || undefined,
          moduleName: vesselDetail?.id ? ModuleName.QA : undefined,
        }),
      );
    }
  }, [data, dispatch, inspectorRole, vesselDetail]);

  useEffectOnce(() => {
    getListRolesDefaultsApi()
      .then((res) => {
        setRoles(res.data);
      })
      .catch((e) => {
        setRoles([]);
      });
  });

  useEffect(() => {
    if (watchFindings?.length) {
      const findSpecialCode = watchFindings?.find(
        (item) => item?.pscAction?.code === '30',
      );
      if (findSpecialCode) {
        setValue('detention', 'Yes');
      } else {
        setValue('detention', 'No');
      }
    }
  }, [watchFindings, watchDetention, setValue]);

  useEffect(() => {
    if (watchNoFinding && watchFindings?.length) {
      setValue('externalInspectionReports', []);
    }
  }, [watchNoFinding, watchFindings, setValue]);

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <Container>
      <div className={cx(styles.wrapper)}>
        <FormProvider {...methods}>
          <GeneralInformation data={data} isEdit={isEdit} isCreate={isCreate} />
          <Place isEdit={isEdit} isCreate={isCreate} data={data} />
          <Controller
            control={control}
            name="externalInspectionReports"
            render={({ field: { onChange, value } }) => (
              <AddRemark
                setRemarkList={onChange}
                data={value}
                disable={!isEdit || watchNoFinding}
                watchDateOfInspection={watchDateOfInspection}
              />
            )}
          />
          <Controller
            control={control}
            name="attachments"
            render={({ field }) => (
              <div className="wrap__attachments">
                <TableAttachment
                  featurePage={Features.QUALITY_ASSURANCE}
                  subFeaturePage={SubFeatures.SAIL_GENERAL_REPORT}
                  scrollVerticalAttachment
                  loading={loading}
                  disable={!isEdit}
                  isEdit={isEdit}
                  isCreate={isCreate}
                  value={field.value}
                  buttonName="Attach"
                  onchange={field.onChange}
                />
              </div>
            )}
          />
          {isEdit && (
            <GroupButton
              className="mt-4 pb-4 justify-content-end"
              handleCancel={handleCancel}
              visibleSaveBtn
              handleSubmit={handleSubmit(onSubmitForm)}
            />
          )}
        </FormProvider>
      </div>
    </Container>
  );
};

export default Form;
