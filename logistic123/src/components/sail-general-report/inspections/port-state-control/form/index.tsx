import cx from 'classnames';
import Container from 'components/common/container/ContainerPage';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  FormProvider,
  FieldValues,
  useForm,
  Controller,
} from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import images from 'assets/images/images';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import history from 'helpers/history.helper';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreatePortStateControlParams,
  PortStateControlDetailResponse,
  PortStateInspectionReportParams,
} from 'models/api/port-state-control/port-state-control.model';
import moment from 'moment';
import { getListUserRecordActions } from 'store/user/user.action';
import { clearPortStateControlErrorsReducer } from 'store/port-state-control/port-state-control.action';
import { getListPscActions } from 'store/psc-action/psc-action.action';
import { getListPSCDeficiencyActions } from 'store/psc-deficiency/psc-deficiency.action';
import { getListVIQActions } from 'store/viq/viq.action';
import isEqual from 'lodash/isEqual';
import { AppRouteConst } from 'constants/route.const';
import { useParams } from 'react-router';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { ModuleName } from 'constants/common.const';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListRolesDefaultsApi } from 'api/role.api';
import { Role } from 'models/api/role/role.model';
import { getVesselDetailActions } from 'store/vessel/vessel.action';
import {
  Features,
  FIXED_ROLE_NAME,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import styles from './form.module.scss';
import GeneralInformation from './GeneralInformationPSC';
import Place from './Place';
import AddRemark from './AddRemark';

interface FormProps {
  isEdit: boolean;
  isCreate?: boolean;
  loading?: boolean;
  data: PortStateControlDetailResponse;
  onSubmit: (data: CreatePortStateControlParams) => void;
}

const defaultValues = {
  vesselId: null,
  // eventType: 'Port State Control',
  eventTypeId: [],
  authorityId: [],
  dateOfInspection: null,
  noFindings: false,
  inspectorIds: [],
  isPort: true,
  portId: null,
  terminalId: null,
  portStateInspectionReports: [],
  detention: 'No',
  comment: null,
};

const Form: FC<FormProps> = ({ isEdit, data, loading, onSubmit, isCreate }) => {
  const { t } = useTranslation([
    I18nNamespace.PORT_STATE_CONTROL,
    I18nNamespace.COMMON,
  ]);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { vesselDetail } = useSelector((state) => state.vessel);
  const [roles, setRoles] = useState<Role[]>(null);

  const schema = useMemo(
    () =>
      Yup.object().shape({
        isPort: Yup.boolean().nullable().required(t('errors.required')),
        authorityId: Yup.array().nullable().min(1, t('errors.required')),
        eventTypeId: Yup.array().nullable().min(1, t('errors.required')),
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
  const { setValue } = methods;

  const watchFindings: PortStateInspectionReportParams[] = methods.watch(
    'portStateInspectionReports',
  );
  const eventTypeWatch = methods.watch('eventTypeId');

  const watchDetention = methods.watch('detention');
  const watchNoFindings = methods.watch('noFindings');

  const handleCancel = useCallback(() => {
    let defaultData = {};

    const values = methods.getValues();

    const params = {
      ...values,
      eventType: 'Port State Control',
      dateOfInspection: values?.dateOfInspection
        ? values?.dateOfInspection?.format('MM/DD/YYYY')
        : null,
    };
    if (isCreate) {
      defaultData = defaultValues;
    } else {
      const findings = data?.portStateInspectionReports?.map((item) => ({
        ...item,
        pscDeficiencyId: item?.pscDeficiency?.id,
        pscActionId: item?.pscAction?.id,
        viqId: item?.viq?.id,
      }));
      defaultData = {
        vesselId: data?.vesselId || null,
        authorityId: data?.authorityId || null,
        isPort: Boolean(data?.isPort),
        noFindings: Boolean(data?.noFindings),
        portId: data?.portId || null,
        // eventType: 'Port State Control',
        eventType: [],
        terminalId: data?.terminalId || null,
        dateOfInspection:
          moment(data?.dateOfInspection).format('MM/DD/YYYY') || null,
        inspectorName: data?.inspectorName || null,
        comment: data?.comment || null,
        detention: data?.detention || 'No',
        portStateInspectionReports: findings || [],
      };
    }

    if (isEqual(defaultData, params)) {
      history.push(
        `${AppRouteConst.SAIL_GENERAL_REPORT}/detail/${vesselRequestId}?tab=inspections&subTab=psc`,
      );
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () =>
          history.push(
            `${AppRouteConst.SAIL_GENERAL_REPORT}/detail/${vesselRequestId}?tab=inspections&subTab=psc`,
          ),
      });
    }
  }, [data, isCreate, methods, t, vesselRequestId]);

  const onSubmitForm = useCallback(
    (data: any) => {
      const params: any = {
        ...data,
        attachments: data?.attachments,
        vesselId: vesselRequestId,
        // eventType: 'Port State Control',
        eventTypeId: data?.eventTypeId[0]?.value?.toString(),
        authorityId: data?.authorityId[0]?.value?.toString(),
        dateOfInspection: moment(data?.dateOfInspection).toISOString(),
        portStateInspectionReports: data?.portStateInspectionReports?.map(
          (item) => {
            const {
              pscAction,
              pscDeficiency,
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

  useEffect(() => {
    if (data) {
      // const auditors = data?.inspectors?.map((item) => item?.id);
      const findings = data?.portStateInspectionReports?.map((item) => ({
        ...item,
        pscDeficiencyId: item.pscDeficiency?.id,
        pscActionId: item.pscAction?.id,
        viqId: item?.viq?.id,
        mainCategoryId: item?.mainCategory?.id || null,
      }));

      setValue('vesselId', data?.vesselId || null);
      setTimeout(() => {
        setValue(
          'authorityId',
          data?.authorityId
            ? [
                {
                  value: data?.authorityId,
                  label: data?.authority?.name,
                },
              ]
            : [],
        );
      }, 100);

      setValue(
        'eventTypeId',
        data?.eventTypeId
          ? [
              {
                value: data?.eventTypeId,
                label: data?.eventType?.name,
              },
            ]
          : [],
      );

      setValue('isPort', Boolean(data?.isPort));
      setValue('noFindings', Boolean(data?.noFindings));
      setValue('portId', data?.portId || null);
      setValue('terminalId', data?.terminalId || null);
      setValue('dateOfInspection', moment(data?.dateOfInspection) || null);
      setValue('inspectorName', data?.inspectorName || null);
      setValue('comment', data?.comment || null);
      setValue('detention', data?.detention || 'No');
      setValue('portStateInspectionReports', findings || []);
      setValue(
        'attachments',
        data?.attachments?.length ? [...data?.attachments] : [],
      );
    }
    return () => {
      dispatch(clearPortStateControlErrorsReducer());
    };
  }, [data, dispatch, setValue]);

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
    if (inspectorRole && vesselDetail?.id) {
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
  }, [vesselDetail, dispatch, inspectorRole]);

  useEffectOnce(() => {
    getListRolesDefaultsApi()
      .then((res) => {
        setRoles(res.data);
      })
      .catch((e) => {
        setRoles([]);
      });
    return () => {
      getVesselDetailActions.success(null);
    };
  });

  useEffect(() => {
    const findSpecialCode = watchFindings?.find(
      (item) => item?.pscAction?.code === '30',
    );
    if (findSpecialCode) {
      setValue('detention', 'Yes');
    } else {
      setValue('detention', 'No');
    }
  }, [watchFindings, watchDetention, setValue]);

  useEffect(() => {
    if (watchNoFindings) {
      setValue('portStateInspectionReports', []);
    }
  }, [setValue, watchNoFindings]);

  useEffect(() => {
    if (!vesselDetail) {
      dispatch(getVesselDetailActions.request(vesselRequestId));
    }
  }, [dispatch, vesselDetail, vesselRequestId]);

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
          <GeneralInformation
            data={data}
            isCreate={isCreate}
            isEdit={isEdit}
            eventTypeWatch={eventTypeWatch}
            methods={methods}
            defaultValueEventType="Port State Control"
          />
          <Place isEdit={isEdit} data={data} />
          <Controller
            control={methods.control}
            name="portStateInspectionReports"
            render={({ field: { onChange, value } }) => (
              <AddRemark
                setRemarkList={onChange}
                data={value}
                disable={!isEdit || watchNoFindings}
              />
            )}
          />
          <Controller
            control={methods.control}
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
              handleSubmit={methods.handleSubmit(onSubmitForm)}
            />
          )}
        </FormProvider>
      </div>
    </Container>
  );
};

export default Form;
