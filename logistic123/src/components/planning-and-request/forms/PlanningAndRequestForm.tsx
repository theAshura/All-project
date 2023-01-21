import { yupResolver } from '@hookform/resolvers/yup';
import { getDepartmentsLastAuditTimeAndDueDateApi } from 'api/department-master.api';
import {
  checkAvailableAuditors,
  getListPlanningAndRequestsActionsApi,
} from 'api/planning-and-request.api';
import { getVesselLastAuditTimeAndDueDateApi } from 'api/vessel.api';
import images from 'assets/images/images';
import cx from 'classnames';
import uniq from 'lodash/uniq';
import TableHistoryAGGrid from 'components/report-template/forms/table-history/TableHistoryAGGrid';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { getListCompanyManagementActions } from 'store/company/company.action';
import useEffectOnce from 'hoc/useEffectOnce';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  ActivePermission,
  CommonQuery,
  fieldsPRForm,
  ModuleName,
  WorkFlowType,
} from 'constants/common.const';
import { PLANNING_STATUES } from 'constants/planning-and-request.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError } from 'helpers/notification.helper';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import {
  IFocusRequest,
  PlanningAndRequest,
} from 'models/api/planning-and-request/planning-and-request.model';
import moment from 'moment';
import { tz } from 'moment-timezone';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import InspectionHistory from 'components/common/inspection-history/InspectionHistory';
import { getListFileActions } from 'store/dms/dms.action';
import { getListLocationActions } from 'store/location/location.action';
import { clearPlanningAndRequestErrorsReducer } from 'store/planning-and-request/planning-and-request.action';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { getListPortActions } from 'store/port/port.action';
import { getListVesselActions } from 'store/vessel/vessel.action';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { EntityType } from 'models/common.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  getListAuditorsActions,
  getWorkFlowActiveUserPermissionActions,
} from 'store/work-flow/work-flow.action';
import { TableAttachmentAGGrid } from 'components/common/table-attachment/TableAttachmentAGGrid';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { formatDateIso } from '../../../helpers/date.helper';
import { compareStatus } from '../../../helpers/utils.helper';
import { handleDataSumit } from './planning.func';
import FocusRequest from './focus-request/FocusRequest';
import Assignment from '../components/assignment/Assignment';
import styles from './form.module.scss';
import './form.scss';
import { ModalSchedule } from './ModalSchedule';
import GeneralInfo from './general-info/GeneralInfo';
import {
  defaultValues,
  fillOptions,
  planningSchema,
  sortPosition,
} from './planning-and-request.helps';
import { TableOfficeComment } from './TableOfficeComment';

interface DataSenMailForm {
  dueDate: string;
  dateOfLastInspection: string;
}
interface PlanningAndRequestFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: PlanningAndRequest;
  dataFocusRequest: IFocusRequest[];
  getDataSendMail?: (dataSenMailForm: DataSenMailForm) => void;
  onSubmit: (CreatePlanningAndRequestParams: PlanningAndRequest) => void;
  onReject?: any;
  titleModalRemark?: string;
  onSubmitStatus?: (
    titleModalRemark: string,
    remark: string,
    userAssignment?: any,
  ) => void;
  modalAssignMentVisible?: boolean;
  openModalAssignment?: (open?: boolean) => void;
  dynamicLabels?: IDynamicLabel;
}

const PlanningAndRequestForm: FC<PlanningAndRequestFormProps> = ({
  isEdit,
  isCreate,
  data,
  onSubmit,
  getDataSendMail,
  dataFocusRequest,
  onReject,
  titleModalRemark,
  onSubmitStatus,
  modalAssignMentVisible,
  openModalAssignment,
  dynamicLabels,
}) => {
  // state
  const dispatch = useDispatch();
  const { search } = useLocation<String>();

  // const { t } = useTranslation([
  //   I18nNamespace.PLANNING_AND_REQUEST,
  //   I18nNamespace.COMMON,
  // ]);
  const { loading, errorList } = useSelector(
    (state) => state.planningAndRequest,
  );

  const { listVesselResponse } = useSelector((state) => state.vessel);

  const { listPort } = useSelector((state) => state.port);
  const { auditors } = useSelector((state) => state.workFlow);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [firstErrorId, setFirstErrorId] = useState('');
  const [modal, setModal] = useState<boolean>(false);
  const [dataSchedule, setDataSchedule] = useState<PlanningAndRequest[]>();
  const [listAuditorUnAvailable, setListAuditorUnAvailable] = useState<any>([]);
  const [focusRequest, setFocusRequest] = useState<IFocusRequest[]>([]);
  const [isOpenFocusRequest, setIsOpenFocusRequest] = useState(true);

  const [fieldsTouched, setFieldsTouched] = useState(null);
  const [departmentDueDateData, setDepartmentDueDateData] = useState(null);

  const portOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listPort?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listPort?.data],
  );

  const userOptions = useMemo(() => {
    const dataOptions: any =
      auditors?.map((item) => ({
        id: item.id,
        label: item.username,
        name: item.username,
        department: item?.primaryDepartment
          ? item?.primaryDepartment?.name
          : '',
        rank: item?.rank ? item?.rank?.name : '',
      })) || [];

    const aditionalAuditor: any =
      data?.auditors?.filter(
        (item) => !dataOptions?.some((i) => i.id === item?.id),
      ) || [];

    if (aditionalAuditor?.length) {
      return aditionalAuditor
        ?.map((item) => ({
          ...item,
          name: item.username,
          label: item.username,
        }))
        ?.concat(dataOptions);
    }

    return dataOptions;
  }, [auditors, data?.auditors]);

  const schema = useMemo(() => planningSchema(dynamicLabels), [dynamicLabels]);

  const {
    watch,
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchAuditors = watch('auditor');
  const watchAuditorIds = watch('auditorIds');
  const watchLeadAuditorId = watch('leadAuditorId');
  const watchVesselId = watch('vesselId');
  const watchAuditTypeIds = watch('auditTypeIds');
  const watchFromETA: string = watch('fromPortEstimatedTimeArrival');
  const watchFromETD = watch('fromPortEstimatedTimeDeparture');
  const watchToETA = watch('toPortEstimatedTimeArrival');
  const watchToETD = watch('toPortEstimatedTimeDeparture');
  const watchPlannedFrom = watch('plannedFromDate');
  const watchPlannedTo = watch('plannedToDate');
  const watchVisitType = watch('typeOfAudit');
  const watchFromPortId = watch('fromPortId');
  const watchToPortId = watch('toPortId');
  const watchDepartmentId = watch('departmentIds');
  const watchEntity = watch('entityType');
  const watchWorkingType = watch('workingType');
  const watchCompanyId = watch('auditCompanyId');

  const leaderOptions = useMemo(
    () =>
      watchAuditorIds?.map(
        (element) =>
          userOptions
            ?.filter((e) => e.id === element)
            ?.map((item) => ({
              value: item.id,
              label: item.name,
            }))?.[0],
      ),
    [userOptions, watchAuditorIds],
  );

  const disableAuditor = useMemo(
    () => !isEdit || watchAuditors?.length < 1,
    [isEdit, watchAuditors],
  );

  const userAssignmentFromDetail = useMemo(() => {
    if (!data?.userAssignments) {
      return null;
    }
    let usersPermissions = [];
    data?.userAssignments?.forEach((item) => {
      if (usersPermissions?.some((i) => i.permission === item?.permission)) {
        usersPermissions = usersPermissions?.map((i) =>
          i?.permission === item?.permission
            ? {
                permission: i?.permission,
                userIds: [item?.user?.id]?.concat(i.userIds),
              }
            : i,
        );
      } else {
        usersPermissions?.push({
          permission: item.permission,
          userIds: [item?.user?.id],
        });
      }
    });
    return usersPermissions;
  }, [data?.userAssignments]);

  const onSubmitForm = useCallback(
    (values: PlanningAndRequest) => {
      const dataSubmit = handleDataSumit(
        values,
        focusRequest,
        isCreate,
        userAssignmentFromDetail,
        departmentDueDateData,
      );
      onSubmit(dataSubmit);
      setValue('isSubmit', false);
    },
    [
      focusRequest,
      isCreate,
      userAssignmentFromDetail,
      departmentDueDateData,
      onSubmit,
      setValue,
    ],
  );

  const fillReviewerOptions = (data) => {
    if (data.length > 0) {
      return data?.map((e) => ({
        value: e?.id,
        label: e?.username,
      }));
    }
    return undefined;
  };
  const fillUserOptions = (auditor) => {
    const listAuditor = auditor?.map((item) => item.id);
    return listAuditor;
  };

  const fillAdditional = useCallback((data) => {
    if (data.length > 0) {
      return data?.map((e) => ({
        ...e,
        reviewerId: fillReviewerOptions([e?.reviewer]),
        // rankId: fillOptions([e?.rank]),
      }));
    }
    return undefined;
  }, []);

  const resetDefault = (defaultParams) => {
    reset(defaultParams);
    history.goBack();
  };

  const handleCancel = () => {
    let defaultParams = {};
    const { timezone, ...params } = getValues();
    setFocusRequest(dataFocusRequest);

    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      fieldsPRForm.forEach((item) => {
        switch (item) {
          case 'vesselId':
            defaultParams = {
              ...defaultParams,
              [item]: (data.vessel && fillOptions([data.vessel])) || [],
            };
            break;
          case 'vesselTypeId':
            defaultParams = {
              ...defaultParams,
              [item]: data.vessel?.vesselType?.name,
            };
            break;
          case 'fleetId':
            defaultParams = {
              ...defaultParams,
              [item]: data.vessel?.fleetName,
            };
            break;
          case 'fromPortId':
            defaultParams = {
              ...defaultParams,
              [item]: data.fromPort && fillOptions([data.fromPort] || []),
            };
            break;
          case 'toPortId':
            defaultParams = {
              ...defaultParams,
              [item]: data.toPort && fillOptions([data.toPort] || []),
            };
            break;
          case 'toPortEstimatedTimeArrival':
            defaultParams = {
              ...defaultParams,
              [item]: data[item] && moment(data[item]),
            };
            break;
          case 'toPortEstimatedTimeDeparture':
            defaultParams = {
              ...defaultParams,
              [item]: data[item] && moment(data[item]),
            };
            break;
          case 'fromPortEstimatedTimeArrival':
            defaultParams = {
              ...defaultParams,
              [item]: data[item] && moment(data[item]),
            };
            break;
          case 'fromPortEstimatedTimeDeparture':
            defaultParams = {
              ...defaultParams,
              [item]: data[item] && moment(data[item]),
            };
            break;
          case 'plannedFromDate':
            defaultParams = {
              ...defaultParams,
              [item]: data[item] && moment(data[item]),
            };
            break;
          case 'plannedToDate':
            defaultParams = {
              ...defaultParams,
              [item]: data[item] && moment(data[item]),
            };
            break;
          case 'auditTypeIds':
            defaultParams = {
              ...defaultParams,
              [item]: fillOptions(data.auditTypes || []),
            };
            break;
          case 'auditorIds':
            defaultParams = {
              ...defaultParams,
              [item]: data.auditors && fillUserOptions(data.auditors),
            };
            break;
          case 'officeComments':
            defaultParams = {
              ...defaultParams,
              [item]: data.planningRequestOfficeComments,
            };
            break;
          case 'additionalReviewers':
            defaultParams = {
              ...defaultParams,
              [item]: data.planningRequestAdditionalReviewers,
            };
            break;
          default:
            defaultParams = { ...defaultParams, [item]: data[item] };
        }
      });
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.PLANNING);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Cancel?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.PLANNING)
            : resetDefault(defaultParams),
      });
    }
  };

  const onErrorForm = (errors) => {
    if (!isEmpty(errors)) {
      const firstError = sortPosition.find((item) => errors[item]);
      const el = document.querySelector(`#form_data #${firstError}`);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setFirstErrorId(firstError);
      }
    }
  };

  // effect

  useEffect(() => {
    setFocusRequest(dataFocusRequest);
  }, [dataFocusRequest]);

  useEffect(() => {
    if (watchVesselId) {
      const vesselFilter = listVesselResponse?.data?.filter(
        (e) => e.id === watchVesselId?.[0]?.value,
      );
      if (vesselFilter) {
        setValue('vesselTypeId', vesselFilter?.[0]?.vesselType?.name);
        setValue('fleetId', vesselFilter?.[0]?.fleetName);
      }
    }
  }, [listVesselResponse?.data, setValue, watchVesselId]);

  useEffect(() => {
    if (
      watchAuditorIds?.length > 0 &&
      watchLeadAuditorId?.length > 0 &&
      watchAuditorIds?.filter((e) => e === watchLeadAuditorId)?.length === 0
    ) {
      setValue('leadAuditorId', undefined);
    }
    if (!watchAuditorIds || watchAuditorIds?.length === 0) {
      setValue('leadAuditorId', undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAuditorIds]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item?.fieldName) {
          case 'fromPortEstimatedTimeDeparture':
            setError('fromPortEstimatedTimeDeparture', {
              message: item?.message,
            });
            break;
          case 'toPortEstimatedTimeDeparture':
            setError('toPortEstimatedTimeDeparture', { message: item.message });
            break;
          case 'plannedFromDate':
            setError('plannedFromDate', { message: item.message });
            break;
          case 'plannedToDate':
            setError('plannedToDate', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('fromPortEstimatedTimeDeparture', { message: '' });
      setError('toPortEstimatedTimeDeparture', { message: '' });
      setError('plannedFromDate', { message: '' });
      setError('plannedToDate', { message: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  useEffect(() => {
    if (data) {
      fieldsPRForm.forEach((item) => {
        switch (item) {
          case 'vesselId':
            setValue(item, (data.vessel && fillOptions([data.vessel])) || []);
            return;
          case 'entityType':
            setValue(item, data.entityType);
            return;
          case 'departmentIds':
            setValue(item, fillOptions(data?.departments || []));
            return;
          case 'companyId':
            setValue(
              'auditCompanyId',
              data.auditCompanyId || userInfo?.company?.id,
            );
            return;
          case 'vesselTypeId':
            setValue(item, data.vessel?.vesselType?.name);
            return;
          case 'fleetId':
            setValue(item, data.vessel?.fleetName);
            return;
          case 'fromPortId':
            setValue(item, data.fromPort && fillOptions([data.fromPort] || []));
            return;
          case 'toPortId':
            setValue(item, data.toPort && fillOptions([data.toPort] || []));
            return;
          case 'toPortEstimatedTimeArrival':
            setValue(item, data[item] && moment(data[item]));
            return;
          case 'toPortEstimatedTimeDeparture':
            setValue(item, data[item] && moment(data[item]));
            return;
          case 'fromPortEstimatedTimeArrival':
            setValue(item, data[item] && moment(data[item]));
            return;
          case 'fromPortEstimatedTimeDeparture':
            setValue(item, data[item] && moment(data[item]));
            return;
          case 'plannedFromDate':
            setValue(item, moment(data[item]));
            return;
          case 'plannedToDate':
            setValue(item, moment(data[item]));
            return;
          case 'auditTypeIds':
            setValue(item, fillOptions(data.auditTypes || []));
            return;
          case 'auditorIds':
            setValue(item, data.auditors && fillUserOptions(data.auditors));
            return;
          case 'officeComments':
            setValue(item, data.planningRequestOfficeComments);
            return;
          case 'additionalReviewers':
            setValue(item, data.planningRequestAdditionalReviewers);
            return;

          case 'workingType':
            setValue(item, data.workingType !== 'Physical');
            return;
          case 'locationId':
            setValue(item, data.locationId);
            return;
          default:
            setValue(item, data[item]);
        }
      });
      if (data.attachments?.length > 0) {
        dispatch(getListFileActions.request({ ids: data.attachments }));
      }
    }
    return () => {
      dispatch(clearPlanningAndRequestErrorsReducer());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, fillAdditional]);

  useEffect(() => {
    if (watchFromPortId) {
      setValue(
        'toPortId',
        watchToPortId && isFirst ? watchToPortId : watchFromPortId,
      );
      setIsFirst(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchFromPortId]);

  useEffect(() => {
    if (watchToPortId) {
      setError('toPortId', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchToPortId]);

  useEffect(() => {
    if (watchPlannedFrom && !watchPlannedTo) {
      setValue('plannedToDate', watchPlannedFrom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPlannedFrom]);

  useEffect(() => {
    if (watchPlannedTo) {
      setError('plannedToDate', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPlannedTo]);

  const handleGetAvailableAuditors = useCallback(() => {
    const listAuditorIds = userOptions.map((item) => item.id);

    const params = {
      listAuditorId: listAuditorIds,
      fromDate: formatDateIso(watchPlannedFrom, { startDay: true }),
      toDate: formatDateIso(watchPlannedTo, { endDay: true }),
    };
    checkAvailableAuditors(params)
      .then((res) => setListAuditorUnAvailable(res?.data))
      .catch((err) => toastError(err));
  }, [userOptions, watchPlannedFrom, watchPlannedTo]);

  useEffect(() => {
    if (watchPlannedFrom && watchPlannedTo && userOptions) {
      handleGetAvailableAuditors();
    }
  }, [
    watchPlannedFrom,
    watchPlannedTo,
    handleGetAvailableAuditors,
    userOptions,
  ]);

  useEffect(() => {
    const isVessel = watchEntity === EntityType.Vessel;
    const vesselCase = watchVesselId?.length && isVessel;
    const officeCase = watchCompanyId && !isVessel;

    if (watchAuditTypeIds?.length && (vesselCase || officeCase)) {
      const params = isVessel
        ? {
            inspectionTypeIds: watchAuditTypeIds?.length
              ? watchAuditTypeIds?.map((i) => i?.value)
              : null,
            vesselId: watchVesselId ? watchVesselId?.[0]?.value : null,
            entityType: watchEntity,
          }
        : {
            inspectionTypeIds: watchAuditTypeIds?.length
              ? watchAuditTypeIds?.map((i) => i?.value)
              : null,
            entityType: watchEntity,
          };
      dispatch(getListAuditorsActions.request(params));
    } else {
      dispatch(getListAuditorsActions.success([]));
    }
    if (fieldsTouched?.auditTypeIds) {
      setValue('auditorIds', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, watchAuditTypeIds, watchVesselId, watchEntity, watchCompanyId]);

  const handleGetDueDate = useCallback(() => {
    const auditTypesIds = watchAuditTypeIds?.map((i) => i?.value) || [];
    if (
      watchVesselId &&
      watchVesselId[0]?.value &&
      watchEntity === EntityType.Vessel &&
      auditTypesIds?.length
    ) {
      getVesselLastAuditTimeAndDueDateApi(
        watchVesselId[0]?.value,
        auditTypesIds,
      )
        .then((res: any) => {
          const dataDueDate = res?.data?.dueDate
            ? moment(res?.data.dueDate)
            : undefined;
          const dataDLI = res?.data?.dateOfLastInspection
            ? moment(res?.data?.dateOfLastInspection)
            : undefined;

          getDataSendMail?.({
            dueDate: dataDueDate?.toString(),
            dateOfLastInspection: dataDLI?.toString(),
          });
          setValue('dueDate', dataDueDate);
          setValue('dateOfLastInspection', dataDLI);
        })
        .catch((err) => toastError(err));
      return;
    }
    if (
      watchDepartmentId?.length &&
      watchEntity === EntityType.Office &&
      auditTypesIds?.length
    ) {
      getDepartmentsLastAuditTimeAndDueDateApi(
        watchDepartmentId?.map((item) => item?.value),
        auditTypesIds,
      )
        .then((res: any) => {
          const dataDueDate = res?.data?.[0]?.dueDate
            ? moment(res?.data?.[0]?.dueDate)
            : undefined;
          const dataDLI = res?.data?.[0]?.dateOfLastInspection
            ? moment(res?.data?.[0]?.dateOfLastInspection)
            : undefined;

          getDataSendMail?.({
            dueDate: dataDueDate?.toString(),
            dateOfLastInspection: dataDLI?.toString(),
          });
          setDepartmentDueDateData(res?.data);
        })
        .catch((err) => toastError(err));
      return;
    }
    setValue('dueDate', undefined);
    setValue('dateOfLastInspection', undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // getDataSendMail,
    setValue,
    watchAuditTypeIds,
    watchDepartmentId,
    watchEntity,
    watchVesselId,
  ]);

  useEffect(() => {
    handleGetDueDate();
  }, [
    watchVesselId,
    watchDepartmentId,
    watchEntity,
    watchAuditTypeIds,
    handleGetDueDate,
  ]);

  useEffectOnce(() => {
    const timezone = tz?.guess();
    setValue('timezone', timezone);
    dispatch(
      getListVesselActions.request({
        pageSize: -1,
        status: 'active',
        isRefreshLoading: false,
        companyId: userInfo?.mainCompanyId,
        moduleName: ModuleName.INSPECTION,
      }),
    );
    dispatch(
      getListAuditTypeActions.request({
        pageSize: -1,
        isRefreshLoading: false,
        companyId: userInfo?.mainCompanyId,
      }),
    );
    dispatch(
      getListPortActions.request({
        pageSize: -1,
        status: 'active',
        isRefreshLoading: false,
        companyId: userInfo?.mainCompanyId,
      }),
    );

    dispatch(
      getListLocationActions.request({
        pageSize: -1,
        status: 'active',
      }),
    );

    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.PLANNING_REQUEST,
        isRefreshLoading: false,
      }),
    );
    getListPlanningAndRequestsActionsApi({
      pageSize: -1,
      status: 'planned_successfully',
      companyId: userInfo?.mainCompanyId,
    }).then((res) => {
      setDataSchedule(res?.data?.data);
    });

    if (isCreate) {
      setValue('attachments', []);
    }

    dispatch(
      getListCompanyManagementActions.request({
        isLeftMenu: false,
        pageSize: -1,
      }),
    );

    return () => {
      reset(defaultValues);
      dispatch(getListAuditorsActions.success([]));
    };
  });

  const renderGeneral = useMemo(
    () => (
      <GeneralInfo
        control={control}
        data={data}
        disableAuditor={disableAuditor}
        dispatch={dispatch}
        errors={errors}
        firstErrorId={firstErrorId}
        isCreate={isCreate}
        isEdit={isEdit}
        leaderOptions={leaderOptions}
        loading={loading}
        portOptions={portOptions}
        register={register}
        setValue={setValue}
        userOptions={userOptions}
        listAuditorUnAvailable={listAuditorUnAvailable}
        watchEntity={watchEntity}
        watchFromETA={watchFromETA}
        watchFromETD={watchFromETD}
        watchPlannedFrom={watchPlannedFrom}
        watchPlannedTo={watchPlannedTo}
        watchToETA={watchToETA}
        watchToETD={watchToETD}
        watchVisitType={watchVisitType}
        watchWorkingType={watchWorkingType}
        setFirstErrorId={setFirstErrorId}
        setFieldsTouched={setFieldsTouched}
        watch={watch}
        setModal={setModal}
        departmentDueDateData={departmentDueDateData}
        setError={setError}
        dynamicLabels={dynamicLabels}
      />
    ),
    [
      control,
      data,
      disableAuditor,
      dispatch,
      errors,
      firstErrorId,
      isCreate,
      isEdit,
      leaderOptions,
      loading,
      portOptions,
      register,
      setValue,
      userOptions,
      listAuditorUnAvailable,
      watchEntity,
      watchFromETA,
      watchFromETD,
      watchPlannedFrom,
      watchPlannedTo,
      watchToETA,
      watchToETD,
      watchVisitType,
      watchWorkingType,
      watch,
      departmentDueDateData,
      setError,
      dynamicLabels,
    ],
  );

  const isDisabledOfficeComment = useMemo(() => {
    if (
      search === CommonQuery.EDIT &&
      data?.status !== PLANNING_STATUES.Planned_successfully &&
      data?.status !== PLANNING_STATUES.Cancelled
    )
      return false;
    return !isEdit;
  }, [search, data, isEdit]);

  const populateAssignment = useCallback(
    (value?: any) => {
      const currentCreator =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === ActivePermission.CREATOR,
        )?.userIds || [];
      const currentApprover =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === ActivePermission.APPROVER,
        )?.userIds || [];
      const currentAuditor =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === ActivePermission.AUDITOR,
        )?.userIds || [];
      const currentOwnerManager =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === ActivePermission.OWNER_MANAGER,
        )?.userIds || [];

      const approverIds = value?.approver?.map((item) => item?.id);
      const auditorIds = value?.auditor?.map((item) => item?.id);
      const ownerManagerIds = value?.['owner/manager']?.map((item) => item?.id);

      const userAssignment = {
        usersPermissions: [
          {
            permission: ActivePermission.CREATOR,
            userIds: currentCreator?.length ? currentCreator : [userInfo?.id],
          },
          {
            permission: ActivePermission.APPROVER,
            userIds: approverIds?.length
              ? approverIds
              : uniq(currentApprover?.concat(approverIds || [])),
          },
          {
            permission: ActivePermission.AUDITOR,
            userIds: auditorIds?.length
              ? auditorIds
              : uniq(currentAuditor?.concat(auditorIds || [])),
          },
          {
            permission: ActivePermission.OWNER_MANAGER,
            userIds: ownerManagerIds?.length
              ? ownerManagerIds
              : uniq(currentOwnerManager?.concat(ownerManagerIds || [])),
          },
        ]?.filter((item) => item?.userIds?.length),
      };
      if (!userAssignment?.usersPermissions?.length) {
        return null;
      }
      return userAssignment;
    },
    [userAssignmentFromDetail, userInfo?.id],
  );

  const handleSubmitPAR = useCallback(
    async (value?: any) => {
      const userAssignment: any = populateAssignment(value);
      await setValue('isSubmit', true);
      await handleSubmit(
        (value) =>
          onSubmitForm({
            ...value,
            userAssignment,
          }),
        onErrorForm,
      )();
      openModalAssignment(false);
    },
    [
      handleSubmit,
      onSubmitForm,
      openModalAssignment,
      populateAssignment,
      setValue,
    ],
  );

  const buttonSubmitVisible = useMemo(() => {
    const draftCase = compareStatus(data?.status, PLANNING_STATUES.Draft);
    const rejectedCase = compareStatus(data?.status, PLANNING_STATUES.Rejected);
    if (isCreate) {
      return true;
    }
    if (draftCase || rejectedCase) {
      return true;
    }
    return false;
  }, [data?.status, isCreate]);

  const handleChangeFocusRequest = useCallback(
    (value: string, field: string, id: string) => {
      const newDataFocusRequest = focusRequest.map((item) => {
        if (item.focusRequestId === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      setFocusRequest(newDataFocusRequest);
    },
    [focusRequest],
  );

  const rendersFocusRequest = useCallback(
    () => (
      <div className={cx(styles.wrapFocusRequest, 'ant-table-content')}>
        {focusRequest.length ? (
          focusRequest.map((item, index) => (
            <div
              key={String(item.focusRequestId + index)}
              className={cx(styles.focusRequestItem, '')}
            >
              <FocusRequest
                data={item}
                dynamicLabels={dynamicLabels}
                index={index}
                onChange={handleChangeFocusRequest}
                isReadOnly={search !== CommonQuery.EDIT && !isCreate}
              />
            </div>
          ))
        ) : (
          <div className={cx(styles.dataWrapperEmpty)}>
            <img
              src={images.icons.icNoData}
              className={styles.noData}
              alt="no data"
            />
          </div>
        )}
      </div>
    ),
    [focusRequest, dynamicLabels, handleChangeFocusRequest, search, isCreate],
  );

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div id="form_data">
      {renderGeneral}

      <CollapseUI
        className={cx(styles.mb_16)}
        collapseHeaderClassName={cx(styles.headerCollapse)}
        isOpen={isOpenFocusRequest}
        toggle={() => setIsOpenFocusRequest((p) => !p)}
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Focus request'],
        )}
        content={rendersFocusRequest()}
      />
      <Controller
        control={control}
        name="attachments"
        render={({ field }) => (
          <div
            className={cx(
              'wrap__attachments',
              styles.wrapperContainerHeight,
              styles.wrapperContainerAttachment,
              styles.paddingTop10px,
            )}
          >
            <TableAttachmentAGGrid
              featurePage={Features.AUDIT_INSPECTION}
              subFeaturePage={SubFeatures.PLANNING_AND_REQUEST}
              disable={!isEdit}
              loading={loading}
              isCreate={isCreate}
              buttonName={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS.Attach,
              )}
              isEdit={isEdit && !loading}
              value={field.value}
              onchange={field.onChange}
              pageSizeDefault={5}
              moduleTemplate={
                MODULE_TEMPLATE.planningAndRequestFormTableAttachment
              }
              aggridId="ag-grid-table-1"
              dynamicLabels={dynamicLabels}
            />{' '}
          </div>
        )}
      />
      <Controller
        control={control}
        name="officeComments"
        render={({ field }) => (
          <TableOfficeComment
            disable={isDisabledOfficeComment}
            loading={false}
            value={field.value}
            onchange={field.onChange}
            pageSizeDefault={5}
            moduleTemplate={
              MODULE_TEMPLATE.planningAndRequestFormTableOfficeComment
            }
            dynamicLabels={dynamicLabels}
            aggridId="ag-grid-table-2"
          />
        )}
      />
      <div className="mt-3">
        <TableHistoryAGGrid
          data={data?.planningRequestHistories}
          loading={loading}
          pageSizeDefault={5}
          moduleTemplate={MODULE_TEMPLATE.planningAndRequestFormTableHistory}
          dynamicLabels={dynamicLabels}
          aggridId="ag-grid-table-3"
        />
      </div>

      <div className="mt-3">
        <InspectionHistory
          title={DETAIL_PLANNING_DYNAMIC_FIELDS?.['Inspection history']}
          vesselId={data?.vesselId}
          departmentId={data?.departmentIds}
          loading={loading}
          featurePage={Features.AUDIT_INSPECTION}
          subFeaturePage={SubFeatures.PLANNING_AND_REQUEST}
          pageSizeDefault={5}
          moduleTemplate={
            MODULE_TEMPLATE.planningAndRequestFormInspectionHistory
          }
          dynamicLabels={dynamicLabels}
          aggridId="ag-grid-table-4"
        />
      </div>
      {(isEdit || !isDisabledOfficeComment) && (
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4')}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm, onErrorForm)}
          buttonTypeRight={ButtonType.Green}
          txButtonBetween={
            isCreate ||
            (data?.status === PLANNING_STATUES.Draft && buttonSubmitVisible)
              ? renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Save as draft'],
                )
              : null
          }
          txButtonRight={renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS.Submit,
          )}
          dynamicLabels={dynamicLabels}
          handleSubmitAndNew={
            buttonSubmitVisible ? () => openModalAssignment(true) : null
          }
          disable={loading}
        />
      )}

      <Assignment
        planningAndRequestDetail={data}
        titleModalRemark={titleModalRemark}
        isOpen={modalAssignMentVisible}
        isCreate={isCreate}
        initialData={userAssignmentFromDetail}
        userAssignmentDetails={data?.userAssignments}
        onClose={() => openModalAssignment(false)}
        vesselId={watchVesselId?.[0]?.value}
        dynamicLabels={dynamicLabels}
        onConfirm={(values) => {
          const { dataInput, ...dataAssignment } = values;

          // case submit
          if (
            data?.status === PLANNING_STATUES.Draft ||
            data?.status === PLANNING_STATUES.Rejected ||
            isCreate
          ) {
            handleSubmitPAR(dataAssignment);
            return;
          }

          const userAssignment = populateAssignment(dataAssignment);
          // case reject
          if (titleModalRemark === 'reject') {
            onReject(dataInput, userAssignment);
            return;
          }

          onSubmitStatus(titleModalRemark, dataInput, userAssignment);
        }}
      />
      <ModalSchedule
        isShow={modal}
        setShow={() => setModal((e) => !e)}
        data={dataSchedule}
        loading={loading}
        plannedFrom={watchPlannedFrom}
        plannedTo={watchPlannedTo}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default PlanningAndRequestForm;
