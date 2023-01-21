import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import history from 'helpers/history.helper';
import { ReportOfFinding } from 'models/api/report-of-finding/report-of-finding.model';
import { tz } from 'moment-timezone';
import {
  FC,
  memo,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FieldValues, useForm, Controller } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { getListPortActions } from 'store/port/port.action';
import {
  clearReportOfFindingErrorsReducer,
  clearReportOfFindingReducer,
  // getReportOfFindingDetailActions,
} from 'store/report-of-finding/report-of-finding.action';
// import { useParams } from 'react-router-dom';
import { ROF_STATUES } from 'constants/rof.const';
import { getListVesselActions } from 'store/vessel/vessel.action';
import * as yup from 'yup';
import { ActivePermission } from 'constants/common.const';
import uniq from 'lodash/uniq';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { clearPlanningAndRequestReducer } from 'store/planning-and-request/planning-and-request.action';
import { formatDateTimeDay } from 'helpers/utils.helper';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import { toastError } from 'helpers/notification.helper';
import Tooltip from 'antd/lib/tooltip';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { ReportOfFindingContext } from 'contexts/report-of-finding/ReportOfFindingContext';
import TableHistoryAGGrid from 'components/report-template/forms/table-history/TableHistoryAGGrid';
import RofAssignment from '../rof-assignment/RofAssignment';
import { FindingDetails } from './FindingDetails';
import styles from './form.module.scss';
import { TableOfficeComment } from './TableOfficeCommentNew';
import { ReportOfFindingTable } from './ReportOfFindingTable';
import CarActionReqTable from '../car-action-request/CarActionReqTable';

interface ReportOfFindingFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: ReportOfFinding;
  onSaveDraft: (data) => void;
  onSubmit: (data) => void;
  onResetPlanning?: (value) => void;
  setIsEdit?: (value: boolean) => void;
  titleModalRemark?: string;
  onSubmitStatus?: (remark?: string, userAssignment?: any) => void;
  handleRemark?: (remark?: string) => void;
  modalAssignMentVisible?: boolean;
  openModalAssignment?: (open?: boolean) => void;
  loadingWhenSubmit?: boolean;
  dynamicLabels: IDynamicLabel;
}
export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

const defaultValues = {
  vesselId: [],
  vesselTypeId: '',
  fleetId: '',
  attachments: [],
  officeComments: [],
  additionalReviewers: [],
  fromPortId: '',
  toPortId: '',
  plannedFromDate: undefined,
  plannedToDate: undefined,
  auditTypes: [],
  memo: '',
  auditors: [],
  leadAuditor: '',
};

const ReportOfFindingForm: FC<ReportOfFindingFormProps> = ({
  isEdit,
  isCreate,
  data,
  onResetPlanning,
  onSaveDraft,
  onSubmit,
  titleModalRemark,
  onSubmitStatus,
  modalAssignMentVisible,
  openModalAssignment,
  handleRemark,
  loadingWhenSubmit = false,
  dynamicLabels,
}) => {
  // state
  const { officeComment, handleSetOfficeComment } = useContext(
    ReportOfFindingContext,
  );
  // const { id } = useParams<{ id: string }>();
  const [isTouched, setTouched] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation([
    I18nNamespace.REPORT_OF_FINDING,
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.COMMON,
  ]);
  const { loading, errorList } = useSelector((state) => state.reportOfFinding);
  const [reportFindingItems, setReportFindingItems] = useState(
    data?.planningRequest?.reportFindingItems || [],
  );

  const { ReportOfFindingDetail } = useSelector(
    (state) => state.reportOfFinding,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const schema = yup.object().shape({
    vesselId: yup.array().nullable().min(1, 'This field is required'),
  });

  const { control, handleSubmit, setError, setValue, getValues, watch } =
    useForm<FieldValues>({
      mode: 'all',
      defaultValues,
      resolver: yupResolver(schema),
    });

  const officeComments = watch('officeComments');

  // function
  const onSaveDraftForm = () => {
    if (!data?.planningRequest) {
      toastError('Report of finding is required');
      return;
    }

    onSaveDraft(
      officeComments?.length > 0
        ? {
            reportFindingItems,
            officeComments: officeComments.map((item) => ({
              serialNumber: Number() + 1,
              comment: item.comment,
              id: item.id,
            })),
          }
        : { reportFindingItems },
    );
  };

  const onSubmitForm = useCallback(
    (values?: any) => {
      if (!data?.planningRequest) {
        toastError('Report of finding is required');
        return;
      }
      const newState = reportFindingItems?.map((item) => ({
        ...item,
        natureFindingId: item?.natureFindingId?.value || item?.natureFindingId,
        auditTypeId: item?.auditTypeId?.value || item?.auditTypeId,
      }));
      onSubmit(
        officeComments?.length > 0
          ? {
              reportFindingItems: [...newState],
              officeComments: officeComments.map((item) => ({
                serialNumber: Number() + 1,
                comment: item.comment,
                id: item.id,
              })),
              userAssignment: values?.userAssignment,
            }
          : {
              reportFindingItems: [...newState],
              userAssignment: values?.userAssignment,
            },
      );
    },
    [data?.planningRequest, officeComments, onSubmit, reportFindingItems],
  );

  const handleFillData = useCallback(() => {
    const timezone = tz?.guess();
    setValue('timezone', timezone);
    if (data) {
      if (isCreate) {
        setValue(
          'vesselManager',
          data?.planningRequest?.vessel?.owners
            ?.map((i) => i?.username)
            ?.join('\n'),
        );
        setValue('auditNumber', data?.planningRequest?.auditNo);
        setValue(
          'auditTypes',
          data?.planningRequest?.auditTypes?.map((i) => i?.name).join('\n'),
        );
        setValue('leadAuditor', data?.planningRequest?.leadAuditor?.username);
        setValue(
          'auditors',
          data?.planningRequest?.auditors?.map((i) => i?.username).join(', '),
        );
        setValue('plannedFromPort', data?.planningRequest?.fromPort?.name);
        setValue('plannedToPort', data?.planningRequest?.toPort?.name);
        if (data?.planningRequest) {
          setValue(
            'plannedFromDate',
            formatDateTimeDay(data?.planningRequest?.plannedFromDate) ||
              undefined,
          );
          setValue(
            'plannedToDate',
            formatDateTimeDay(data?.planningRequest?.plannedToDate) ||
              undefined,
          );
        }
      } else {
        setValue('vesselId', [
          {
            value: data?.vesselId,
            label: data?.rofPlanningRequest?.vesselName,
          },
        ]);
        setValue(
          'vesselManager',
          data?.vessel?.owners?.map((i) => i?.username)?.join('\n'),
        );
        setValue('auditNumber', data?.planningRequest?.auditNo);
        setValue(
          'auditTypes',
          data?.planningRequest?.auditTypes?.map((i) => i?.name).join('\n'),
        );
        setValue('leadAuditor', data?.planningRequest?.leadAuditor?.username);
        setValue(
          'auditors',
          data?.planningRequest?.auditors?.map((i) => i?.username).join(', '),
        );
        setValue('plannedFromPort', data?.planningRequest?.fromPort?.name);
        setValue('plannedToPort', data?.planningRequest?.toPort?.name);
        if (data?.planningRequest) {
          setValue(
            'plannedFromDate',
            formatDateTimeDay(data?.planningRequest?.plannedFromDate) ||
              undefined,
          );
          setValue(
            'plannedToDate',
            formatDateTimeDay(data?.planningRequest?.plannedToDate) ||
              undefined,
          );
        }
      }

      setValue('officeComments', data?.rofOfficeComments || []);
      setTouched(false);
    }
  }, [data, isCreate, setValue]);

  const handleCancel = () => {
    if (isEdit && isTouched) {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () => {
          if (isTouched) {
            setTouched(false);
            handleFillData();
          }
          history.goBack();
        },
      });
    } else {
      history.goBack();
    }
  };

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
          case 'vesselId':
            setError('vesselId', { message: item.message });
            break;
          case 'auditNumber':
            setError('auditNumber', { message: item.message });
            break;
          case 'leadAuditor':
            setError('leadAuditor', { message: item.message });
            break;
          case 'auditTypes':
            setError('auditTypes', { message: item.message });
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
      setError('vesselId', { message: '' });
      setError('plannedToDate', { message: '' });
    }
  }, [errorList, setError]);

  const fillDataFindingsDetails = useMemo(() => {
    const noOfNonConformity =
      reportFindingItems?.filter(
        (item) => item.natureFindingName === 'Non Conformity',
      )?.length || 0;
    const noOfObservation =
      reportFindingItems?.filter(
        (item) => item.natureFindingName === 'Observation',
      )?.length || 0;
    return {
      noOfFindings: reportFindingItems?.length ?? 0,
      noOfNonConformity,
      noOfObservation,
      reportFindingItems,
    };
  }, [reportFindingItems]);

  useEffect(() => {
    handleFillData();
    return () => {
      dispatch(clearReportOfFindingErrorsReducer());
    };
  }, [data, dispatch, handleFillData]);

  useEffect(() => {
    dispatch(
      getListVesselActions.request({
        pageSize: -1,
        status: 'active',
        isRefreshLoading: false,
        companyId: userInfo?.mainCompanyId,
      }),
    );
    // dispatch(
    //   getListAuditTypeActions.request({
    //     pageSize: -1,
    //     isRefreshLoading: false,
    //     companyId: userInfo?.mainCompanyId,
    //   }),
    // );
    dispatch(
      getListPortActions.request({
        pageSize: -1,
        status: 'active',
        isRefreshLoading: false,
        companyId: userInfo?.mainCompanyId,
      }),
    );
    // dispatch(
    //   getListUserActions.request({
    //     pageSize: -1,
    //     status: 'active',
    //     isRefreshLoading: false,
    //   }),
    // );
    return () => {
      dispatch(clearPlanningAndRequestReducer());
      dispatch(clearReportOfFindingReducer(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isCreate) {
      if (data?.planningRequest?.reportFindingItems) {
        setReportFindingItems(data?.planningRequest?.reportFindingItems);
      }
    } else {
      setReportFindingItems(data?.reportFindingItems);
    }
  }, [
    data?.planningRequest?.reportFindingItems,
    data?.reportFindingItems,
    isCreate,
  ]);

  // useEffect(() => {
  //   if (vesselIdWatch && vesselIdWatch[0]?.value?.length) {
  //     dispatch(
  //       getListPlanningAndRequestActions.request({
  //         vesselId: vesselIdWatch[0]?.value,
  //         reportFinding: true,
  //       }),
  //     );
  //   }
  // }, [vesselIdWatch]);

  useEffect(() => {
    handleSetOfficeComment(getValues('comment'));
  }, [getValues, handleSetOfficeComment]);

  useEffect(() => {
    if (isCreate) {
      onResetPlanning(undefined);
      setValue('vesselManager', '');
      setValue('auditNumber', '');
      setValue('auditTypes', '');
      setValue('leadAuditor', '');
      setValue('auditors', '');
      setValue('plannedFromPort', '');
      setValue('plannedToPort', '');
      setValue('plannedFromDate', undefined);
      setValue('plannedToDate', undefined);
      setValue('comment', officeComment);
    }
  }, [isCreate, officeComment, onResetPlanning, setValue]);

  const dataItemSorted = ReportOfFindingDetail?.reportFindingHistories.sort(
    (x, y) => {
      if (x.createdAt > y.createdAt) return -1;
      return 1;
    },
  );

  const getListByRelationship = useCallback(
    (relationship) => {
      if (data?.rofUsers?.length > 0) {
        const rofUserManager = data?.rofUsers?.filter(
          (item) => item.relationship === relationship,
        );
        return rofUserManager.map((item) => item.username)?.join(', ');
      }
      return '-';
    },
    [data],
  );

  const renderActiveVesselManager = useMemo(() => {
    if (data?.planningRequest?.vessel?.vesselDocHolders?.length > 0) {
      const vesselManager =
        data?.planningRequest?.vessel?.vesselDocHolders?.filter(
          (item) => item.status === 'active',
        );
      return vesselManager?.length > 0
        ? vesselManager?.[0]?.company?.name
        : '-';
    }
    return '-';
  }, [data?.planningRequest?.vessel?.vesselDocHolders]);

  const vesselManagerList = useMemo(
    () => getListByRelationship('vesselManager'),
    [getListByRelationship],
  );
  const leadAuditorList = useMemo(
    () => getListByRelationship('leadAuditor'),
    [getListByRelationship],
  );

  const auditorList = useMemo(() => {
    if (data?.rofUsers?.length > 0) {
      const rofUserManager = data?.rofUsers?.filter(
        (item) =>
          item.relationship === 'auditor' ||
          item.relationship === 'leadAuditor',
      );
      return rofUserManager.map((item) => item.username)?.join(', ');
    }
    return '-';
  }, [data]);

  const auditTypeList = useMemo(() => {
    if (data?.rofAuditTypes?.length > 0) {
      return data?.rofAuditTypes?.map((item) => item.auditTypeName)?.join(', ');
    }
    return '-';
  }, [data]);

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

  const populateAssignment = useCallback(
    (value?: any) => {
      const currentReviewer =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === ActivePermission.REVIEWER,
        )?.userIds || [];
      const currentCloseOut =
        userAssignmentFromDetail?.find(
          (item) => item?.permission === ActivePermission.CLOSE_OUT,
        )?.userIds || [];

      const reviewerIds = value?.reviewer?.map((item) => item?.id);
      const closeOutIds = value?.close_out?.map((item) => item?.id);

      const userAssignment = {
        usersPermissions: [
          {
            permission: ActivePermission.REVIEWER,
            userIds: reviewerIds?.length
              ? reviewerIds
              : uniq(currentReviewer?.concat(reviewerIds || [])),
          },
          {
            permission: ActivePermission.CLOSE_OUT,
            userIds: closeOutIds?.length
              ? closeOutIds
              : uniq(
                  currentCloseOut?.concat(
                    value?.close_out?.map((item) => item?.id) || [],
                  ),
                ),
          },
        ]?.filter((item) => item?.userIds?.length),
      };
      if (!userAssignment?.usersPermissions?.length) {
        return null;
      }
      return userAssignment;
    },
    [userAssignmentFromDetail],
  );

  const renderGeneral = useCallback(
    () => (
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <div className={cx(styles.titleContainer)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['General information'],
            )}
          </div>
          <Row className="pt-2 mx-0">
            <Col className="ps-0">
              {/* <AsyncSelectForm
                labelSelect={t('txVesselName')}
                control={control}
                name="vesselId"
                placeholder="Please select"
                disabled={!isCreate}
                searchContent={t('txVesselName')}
                messageRequired={errors?.vesselId?.message || ''}
                onChangeSearch={(value: string) =>
                  dispatch(
                    getListVesselActions.request({
                      pageSize: -1,
                      isRefreshLoading: false,
                      content: value,
                      status: 'active',
                    }),
                  )
                }
                options={vesselNameOptions}
              /> */}
              {data?.entityType === 'Vessel' && (
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Vessel name'],
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={data?.rofPlanningRequest?.vesselName}
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {data?.rofPlanningRequest?.vesselName}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
              {data?.entityType === 'Office' && (
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Company name'],
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={data?.rofPlanningRequest?.auditCompanyName}
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {data?.rofPlanningRequest?.auditCompanyName}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
            </Col>
            <Col>
              {/* <Input
                className={styles.disabledInput}
                label={t('txVesselManager')}
                {...register('vesselManager')}
                disabled
              /> */}
              {data?.entityType === 'Vessel' && (
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Vessel manager'],
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={vesselManagerList}
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {renderActiveVesselManager}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
              {data?.entityType === 'Office' && (
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Department,
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={
                        data?.rofPlanningRequest?.departments
                          ?.map((i) => i.name)
                          .join(', ') || '-'
                      }
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {data?.rofPlanningRequest?.departments
                          ?.map((i) => i.name)
                          .join(', ') || '-'}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
            </Col>
            <Col>
              {/* <Input
                className={styles.disabledInput}
                label={t('txAuditNumber')}
                {...register('auditNumber')}
                disabled
              /> */}
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                      'Inspection number'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  {data?.planningRequest?.auditNo}
                </div>
              </div>
            </Col>
            <Col className="pe-0">
              <Col className="ps-0">
                {/* <Input
                  className={styles.disabledInput}
                  label={t('txAuditType')}
                  {...register('auditTypes')}
                  disabled
                /> */}
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                        'Inspection type'
                      ],
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={auditTypeList}
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {auditTypeList}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </Col>
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0">
              {/* <Input
                className={styles.disabledInput}
                label={t('txLeadAuditorName')}
                {...register('leadAuditor')}
                disabled
              /> */}
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                      'Lead inspector name'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  <Tooltip
                    placement="topLeft"
                    title={leadAuditorList}
                    id="leadAuditorList"
                    color="#3B9FF3"
                  >
                    <div className={styles.wrapTextOverflow}>
                      {leadAuditorList}
                    </div>
                  </Tooltip>
                </div>
              </div>
            </Col>
            <Col>
              {/* <Input
                className={styles.disabledInput}
                label={t('txAuditorName')}
                {...register('auditors')}
                disabled
              /> */}
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Inspector name'],
                  )}
                </div>
                <div className={styles.content}>
                  <Tooltip
                    placement="topLeft"
                    title={auditorList}
                    color="#3B9FF3"
                  >
                    <div className={styles.wrapTextOverflow}>{auditorList}</div>
                  </Tooltip>
                </div>
              </div>
            </Col>
            <Col>
              {/* <Input
                label={t('txActualAuditFromPort')}
                {...register('plannedFromPort')}
                disabled
                className={styles.disabledInput}
              /> */}
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                      'Actual inspection from port'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  {data?.rofPlanningRequest?.fromPortName}
                </div>
              </div>
            </Col>
            <Col className="pe-0">
              {/* <Input
                label={t('txActualAuditToPort')}
                {...register('plannedToPort')}
                className={styles.disabledInput}
                disabled
              /> */}
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                      'Actual inspection to port'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  {data?.rofPlanningRequest?.toPortName}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="pt-2">
            <Col>
              {/* <Input
                label={t('txPlannedFromDate')}
                {...register('plannedFromDate')}
                className={styles.disabledInput}
                disabled
              /> */}
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                      'Planned from date'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  {formatDateTimeDay(data?.planningRequest?.plannedFromDate) ||
                    undefined}
                </div>
              </div>
            </Col>
            <Col>
              {/* <Input
                label={t('txPlannedToDate')}
                {...register('plannedToDate')}
                className={styles.disabledInput}
                disabled
              /> */}
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Planned to date'],
                  )}
                </div>
                <div className={styles.content}>
                  {formatDateTimeDay(data?.planningRequest?.plannedToDate) ||
                    undefined}
                </div>
              </div>
            </Col>
            <Col />
            <Col />
          </Row>
        </div>
      </div>
    ),
    [
      dynamicLabels,
      data?.entityType,
      data?.rofPlanningRequest?.vesselName,
      data?.rofPlanningRequest?.auditCompanyName,
      data?.rofPlanningRequest?.departments,
      data?.rofPlanningRequest?.fromPortName,
      data?.rofPlanningRequest?.toPortName,
      data?.planningRequest?.auditNo,
      data?.planningRequest?.plannedFromDate,
      data?.planningRequest?.plannedToDate,
      vesselManagerList,
      renderActiveVesselManager,
      auditTypeList,
      leadAuditorList,
      auditorList,
    ],
  );

  const btnSubmitVisible = useMemo(() => {
    if (isCreate) {
      return true;
    }
    const isCreator = ReportOfFindingDetail?.createdUserId === userInfo?.id;
    if (
      (data?.status === ROF_STATUES.DRAFT &&
        ReportOfFindingDetail?.leadAuditorId === userInfo?.id) ||
      (data?.status === ROF_STATUES.REASSIGNED &&
        dataItemSorted[1]?.status !== ROF_STATUES.REVIEWED &&
        ReportOfFindingDetail?.leadAuditorId === userInfo?.id) ||
      (data?.status === ROF_STATUES.REASSIGNED && isCreator)
    ) {
      return true;
    }
    return false;
  }, [
    ReportOfFindingDetail?.createdUserId,
    ReportOfFindingDetail?.leadAuditorId,
    data?.status,
    dataItemSorted,
    isCreate,
    userInfo?.id,
  ]);

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div className="pb-4">
      {renderGeneral()}
      <FindingDetails
        data={fillDataFindingsDetails}
        loading={false}
        memo={data?.planningRequest?.memo}
        dynamicLabels={dynamicLabels}
      />
      <ReportOfFindingTable
        data={data}
        loading={false}
        isCreate={isCreate}
        reportFindingItems={reportFindingItems}
        disabled={!isEdit || data?.status === ROF_STATUES.CLOSE_OUT}
        handleAdd={(data) => {
          setReportFindingItems(data);
        }}
        dynamicLabels={dynamicLabels}
      />
      <CarActionReqTable
        planningAndRequestId={data?.planningRequestId}
        disabled={!isEdit || data?.status === ROF_STATUES.CLOSE_OUT}
        disabledDelete={
          data?.status === ROF_STATUES.REVIEWED ||
          data?.status === ROF_STATUES.SUBMITTED
        }
        // isEditCapOnly={!isEdit && isEditCarOnly}
        // handleGetList={() => {
        //   dispatch(getReportOfFindingDetailActions.request(id));
        // }}
        dynamicLabels={dynamicLabels}
      />
      <Controller
        control={control}
        name="officeComments"
        render={({ field }) => (
          <TableOfficeComment
            disable={!isEdit || data?.status === ROF_STATUES.CLOSE_OUT}
            loading={false}
            value={field.value}
            onchange={(value) => {
              field.onChange(value);
              setTouched(true);
            }}
            aggridId="ag-grid-table-3"
            dynamicLabels={dynamicLabels}
          />
        )}
      />
      <div
        className={cx(styles.wrapperContainer, styles.wrapperHistoryContainer)}
      >
        <TableHistoryAGGrid
          data={data?.reportFindingHistories}
          loading={loading}
          pageSizeDefault={5}
          moduleTemplate={MODULE_TEMPLATE.reportOfFindingFormTableHistory}
          aggridId="ag-grid-table-4"
          dynamicLabels={dynamicLabels}
        />
      </div>
      <RofAssignment
        data={data}
        titleModalRemark={titleModalRemark}
        isOpen={modalAssignMentVisible}
        isCreate={isCreate}
        userAssignmentDetails={data?.userAssignments}
        initialData={userAssignmentFromDetail}
        onClose={() => openModalAssignment(false)}
        loadingWhenSubmit={loadingWhenSubmit}
        dynamicLabels={dynamicLabels}
        onConfirm={(values) => {
          const { dataInput, ...dataAssignment } = values;
          const userAssignment = populateAssignment(dataAssignment);
          // case submit

          if (btnSubmitVisible) {
            handleSubmit((data) => onSubmitForm({ ...data, userAssignment }))();
            return;
          }

          if (
            titleModalRemark === 'Review' ||
            titleModalRemark === 'Close out'
          ) {
            onSubmitStatus(dataInput, userAssignment);
            return;
          }

          handleRemark(dataInput);
        }}
      />

      {isEdit && data?.status !== ROF_STATUES.CLOSE_OUT && (
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 pb-4')}
          handleCancel={handleCancel}
          dynamicLabels={dynamicLabels}
          handleSubmit={handleSubmit(onSaveDraftForm)}
          disable={loading}
          txButtonBetween={
            isCreate || (data?.status === ROF_STATUES.DRAFT && btnSubmitVisible)
              ? renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Save as draft'],
                )
              : null
          }
          buttonTypeRight={ButtonType.Green}
          txButtonRight={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Submit,
          )}
          handleSubmitAndNew={
            btnSubmitVisible ? () => openModalAssignment(true) : null
          }
        />
      )}
    </div>
  );
};

export default memo(ReportOfFindingForm);
