import cx from 'classnames';
import {
  useEffect,
  FC,
  useCallback,
  useState,
  ReactElement,
  useContext,
  useRef,
  useMemo,
} from 'react';
import { Col, Row } from 'reactstrap';
import { useForm, FieldValues, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useEffectOnce from 'hoc/useEffectOnce';
import history from 'helpers/history.helper';
import { toastError } from 'helpers/notification.helper';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Tooltip from 'antd/lib/tooltip';
import {
  CalendarTimeTableContext,
  OptionEditor,
} from 'contexts/audit-time-table/CalendarTimeTable';

import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { AppRouteConst } from 'constants/route.const';
import { getListFileActions } from 'store/dms/dms.action';
import { getListVesselActions } from 'store/vessel/vessel.action';

import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { ButtonType } from 'components/ui/button/Button';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import ModalListTableRadio from 'components/common/modal-list-table/ModalListTableRadio';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import TableHistoryAGGrid from 'components/report-template/forms/table-history/TableHistoryAGGrid';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import {
  ENTITY_OFFICE,
  ENTITY_OPTIONS,
  ENTITY_VESSEL,
} from 'constants/filter.const';
import { InspectionTimeTableStatuses } from 'constants/inspection-time-table.const';
import images from 'assets/images/images';
import {
  getAuditCheckListByPlanningAndRequestActionsApi,
  getListPlanningAndRequestsActionsApi,
} from 'api/planning-and-request.api';
import { tz } from 'moment-timezone';
import SelectUI from 'components/ui/select/Select';
import moment from 'moment';
import { PlanningAndRequest } from 'models/api/planning-and-request/planning-and-request.model';
import { TableAttachmentAGGrid } from 'components/common/table-attachment/TableAttachmentAGGrid';
import isEmpty from 'lodash/isEmpty';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { ModuleName } from 'constants/common.const';
import isEqual from 'lodash/isEqual';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { getListCompanyManagementActions } from 'store/company/company.action';
import { DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-time-table.const';
import { formatDateNoTime } from 'helpers/date.helper';
import styles from './form.module.scss';
import {
  AuditTimeTable,
  AuditTimeTableDetailResponse,
} from '../../../models/api/audit-time-table/audit-time-table.model';

import {
  clearAuditTimeTableErrorsReducer,
  clearAuditTimeTableReducer,
  closeOutActions,
} from '../../../store/audit-time-table/audit-time-table.action';
import { ChecklistViewTable } from './TableCheckListView';
import { CalenderTable } from './Calender';

interface AuditTimeTableFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: AuditTimeTableDetailResponse;
  onSubmit: (CreateAuditTimeTableParams) => void;
  onSaveDraft: (CreateAuditTimeTableParams) => void;
  dynamicLabels?: IDynamicLabel;
}

export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

const sortPosition = ['vesselId', 'actualFrom', 'actualTo'];

const AuditTimeTableForm: FC<AuditTimeTableFormProps> = ({
  isEdit,
  data,
  onSaveDraft,
  onSubmit,
  isCreate,
  dynamicLabels,
}) => {
  const dispatch = useDispatch();
  const { setOptionEditor } = useContext(CalendarTimeTableContext);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [planningId, setPlanningId] = useState(undefined);
  const [listCheckView, setListCheckView] = useState([]);
  const [firstErrorId, setFirstErrorId] = useState('');
  const [listPlanningAndRequest, setListPlanningAndRequest] = useState<
    PlanningAndRequest[]
  >([]);

  const { listCompanyManagementTypes } = useSelector(
    (state) => state.companyManagement,
  );

  const companyOptions = useMemo(() => {
    const companyOptions =
      listCompanyManagementTypes?.data?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })) || [];

    if (isCreate || isEdit) {
      return companyOptions;
    }

    if (
      companyOptions?.some((item) => item?.value === userInfo?.mainCompany?.id)
    ) {
      return companyOptions;
    }

    return companyOptions?.concat({
      label: userInfo?.mainCompany?.name,
      value: userInfo?.mainCompany?.id,
    });
  }, [
    isCreate,
    isEdit,
    listCompanyManagementTypes?.data,
    userInfo?.mainCompany?.id,
    userInfo?.mainCompany?.name,
  ]);

  const defaultValues = useMemo(
    () => ({
      entityType: ENTITY_VESSEL,
      company: userInfo?.company?.id,
      vesselId: [],
      scope: undefined,
    }),
    [userInfo?.company?.id],
  );

  const schema = yup.object().shape({
    entityType: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    company: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    vesselId: yup
      .array()
      .nullable()
      .when('entityType', ([entityType], schema) =>
        entityType === 'V'
          ? schema.min(
              1,
              renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['This field is required'],
              ),
            )
          : schema.min(0),
      ),
    actualFrom: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    actualTo: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    control,
    handleSubmit,
    watch,
    setError,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const watchVesselId = watch('vesselId');
  const watchEntity = watch('entityType');
  const watchCompany = watch('company');

  const refToTop = useRef(null);

  const { errorList, loading, auditTimeTableDetail } = useSelector(
    (state) => state.auditTimeTable,
  );

  const { listVesselResponse } = useSelector((state) => state.vessel);

  const listOptionVessel: Array<NewAsyncOptions> = useMemo(
    () =>
      listVesselResponse?.data &&
      listVesselResponse.data.map((item) => ({
        value: item.id,
        label: item?.name,
      })),
    [listVesselResponse],
  );

  const resetForm = useCallback(() => {
    setValue('vesselId', []);
    setValue('vesselName', '');
    setValue('auditTypes', '');
    setValue('auditor', '');
    setValue('leadAuditor', '');
    setValue('plannedForm', '');
    setValue('plannedTo', '');
    setValue('memo', '');
    setListPlanningAndRequest(null);
  }, [setValue]);

  const getListPlanningAndRequests = useCallback(
    (id: string, entityType: string) => {
      let params = null;
      params = {
        status: InspectionTimeTableStatuses.PlannedSuccessfully,
        auditTimeTable: true,
        companyId: userInfo?.mainCompanyId,
      };
      if (entityType === ENTITY_VESSEL) {
        params = { ...params, vesselId: id, entityType: ENTITY_VESSEL };
      } else {
        params = {
          ...params,
          auditCompanyId: id,
          entityType: ENTITY_OFFICE,
        };
      }

      getListPlanningAndRequestsActionsApi(params)
        .then((value) => {
          setListPlanningAndRequest(value.data.data);
        })
        .catch((e) => {
          toastError(e);
        });
    },
    [userInfo?.mainCompanyId],
  );

  useEffect(() => {
    if (watchVesselId?.length > 0 && watchEntity === ENTITY_VESSEL) {
      if (watchVesselId?.[0]?.value) {
        getListPlanningAndRequests(watchVesselId[0]?.value, ENTITY_VESSEL);
      }
    }
  }, [getListPlanningAndRequests, watchVesselId, watchEntity]);

  useEffect(() => {
    if (watchVesselId?.length === 0) {
      resetForm();
      setPlanningId(undefined);
      setListPlanningAndRequest([]);
    }
  }, [resetForm, watchVesselId?.length]);

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
      planningRequestId: planningId,
      scope: getValues('scope'),
    };

    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      defaultParams = {
        planningRequestId: data?.planningRequest?.id,
        scope: data.scope,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.AUDIT_TIME_TABLE);
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
            ? history.push(AppRouteConst.AUDIT_TIME_TABLE)
            : resetDefault(defaultParams),
      });
    }
  }, [
    planningId,
    getValues,
    isCreate,
    defaultValues,
    data?.planningRequest?.id,
    data?.scope,
    dynamicLabels,
    resetDefault,
  ]);

  useEffect(() => {
    if (data) {
      setValue('vesselId', [
        { value: data?.vesselId, label: data?.vessel?.name },
      ]);
      setValue(
        'entityType',
        data?.planningRequest?.entityType || ENTITY_VESSEL,
      );
      setPlanningId(data?.planningRequest?.id);
      setValue('vesselName', data.vessel?.name);
      setValue(
        'auditTypes',
        data?.planningRequest?.auditTypes.map((item) => item?.name).join(', '),
      );
      setValue(
        'auditor',
        data?.planningRequest?.auditors
          .map((item) => item?.username)
          .join(', '),
      );
      setValue('leadAuditor', data?.planningRequest?.leadAuditor?.username);
      setValue(
        'plannedForm',
        data?.planningRequest?.plannedFromDate &&
          moment(data?.planningRequest?.plannedFromDate),
      );
      setValue(
        'plannedTo',
        data?.planningRequest?.plannedToDate &&
          moment(data?.planningRequest?.plannedToDate),
      );
      setValue('actualFrom', data?.actualFrom && moment(data?.actualFrom));
      setValue('actualTo', data?.actualTo && moment(data?.actualTo));
      setValue('memo', data?.planningRequest?.memo);
      setValue('scope', data?.scope);
      setValue(
        'attachments',
        data?.attachments?.length ? [...data?.attachments] : [],
      );

      getAuditCheckListByPlanningAndRequestActionsApi(
        data?.planningRequest?.id,
      ).then((result) => {
        const listCheckList = result.data.map((item) => ({
          code: item.code,
          auditType: data?.planningRequest?.auditTypes
            ?.map((item) => item?.name)
            ?.join('\n'),
          name: item?.name,
          updatedAt: item.updatedAt,
        }));

        setListCheckView(listCheckList);
      });
    }

    if (data?.attachments?.length > 0) {
      dispatch(getListFileActions.request({ ids: data?.attachments || [] }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dispatch, setValue]);

  useEffectOnce(() => () => {
    dispatch(clearAuditTimeTableErrorsReducer());
    reset();
  });

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: item.message });
            break;
          case 'name':
            setError('name', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('name', { message: '' });
    }
  }, [errorList, setError]);

  useEffectOnce(() => {
    if (isCreate) {
      const timezone = tz.guess();
      setValue('timezone', timezone);
      setValue('attachments', []);
    }
    return () => {
      dispatch(clearAuditTimeTableReducer());
    };
  });

  const handleSubmitAndNew = useCallback(
    (data: AuditTimeTable) => {
      if (!planningId) {
        toastError('Planning and request is required');
        return;
      }

      const timezone = tz.guess();
      onSubmit({
        ...data,
        timezone,
        planningRequestId: planningId,
        attachments:
          data?.attachments?.length === 0 ? undefined : data?.attachments,
        isSubmit: true,
      });
    },
    [onSubmit, planningId],
  );
  const onSaveDraftForm = (data) => {
    if (!planningId) {
      toastError('Planning and request is required');
      return;
    }
    const timezone = tz.guess();
    onSaveDraft({
      ...data,
      planningRequestId: planningId,
      attachments:
        data?.attachments?.length === 0 ? undefined : data?.attachments,
      timezone,
    });
  };

  const onErrorForm = (errors) => {
    if (!isEmpty(errors)) {
      const firstError = sortPosition.find((item) => errors[item]);
      const el = document.querySelector(`.form_data #${firstError}`);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setFirstErrorId(firstError);
      }
    }
  };

  const rowLabels = useMemo(() => {
    const defaultRows = [
      {
        title: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Inspection type'],
        ),
        dataIndex: 'auditTypes',
        width: 150,
        tooltip: false,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Inspector,
        ),
        dataIndex: 'auditor',
        width: 200,
        tooltip: true,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Lead auditor'],
        ),
        dataIndex: 'leaderAuditor',
        width: 180,
        tooltip: true,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Planned from'],
        ),
        dataIndex: 'plannedForm',
        width: 150,
        tooltip: false,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Planned to'],
        ),
        dataIndex: 'plannedTo',
        width: 150,
        tooltip: false,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
            'Scheduler reference.No.'
          ],
        ),
        dataIndex: 'schedulerRef',
        width: 200,
        tooltip: false,
      },
      {
        title: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Scheduler S.No.'],
        ),
        dataIndex: 'schedulerNo',
        width: 200,
        tooltip: false,
      },
    ];

    if (watchEntity === ENTITY_OFFICE) {
      return defaultRows;
    }

    return [
      {
        title: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Vessel name'],
        ),
        width: 180,
        dataIndex: 'vesselName',
        tooltip: false,
      },
      ...defaultRows,
    ];
  }, [dynamicLabels, watchEntity]);

  const mapPlanningToView = (id: string) => {
    const item = listPlanningAndRequest.find((item) => item.id === id);
    const optionEditor: OptionEditor[] =
      item?.auditors?.map((i) => ({ value: i?.id, label: i?.username })) || [];
    setOptionEditor([...optionEditor]);
    setValue('vesselName', item?.vessel?.name);
    setValue(
      'auditTypes',
      item.auditTypes.map((item) => item?.name).join(', ') || '',
    );
    setValue(
      'auditor',
      item.auditors.map((item) => item.username).join(', ') || '',
    );
    setValue('leadAuditor', item.leadAuditor?.username);
    setValue('plannedForm', moment(item.plannedFromDate));
    setValue('plannedTo', moment(item.plannedToDate));
    setValue('memo', item.memo);
  };

  const handleCloseOut = useCallback(
    (remark?: string) => {
      dispatch(
        closeOutActions.request({ id: auditTimeTableDetail?.id, remark }),
      );
    },
    [auditTimeTableDetail?.id, dispatch],
  );

  const handleSubmitStatus = useCallback(
    (remark?: string) => {
      if (data?.status === 'closeOut') {
        return null;
      }
      if (data?.status === 'submitted') {
        handleCloseOut(remark);
        return null;
      }
      return null;
    },
    [data?.status, handleCloseOut],
  );

  const listToView = useMemo(
    () =>
      listPlanningAndRequest?.map((item) => ({
        id: item.id,
        vesselName: item?.vessel?.name,
        auditTypes: item.auditTypes.map((item) => item?.name).join(', '),
        auditor: item?.auditors?.map((el) => el.username).join(', '),
        leaderAuditor: item?.leadAuditor?.username,
        plannedForm: formatDateNoTime(item.plannedFromDate),
        plannedTo: formatDateNoTime(item.plannedToDate),
        schedulerRef: item.refId,
        schedulerNo: item.auditNo,
      })),
    [listPlanningAndRequest],
  );

  const formValues = watch();

  const renderContentWithTooltip = (text) => (
    <Tooltip placement="topLeft" title={text} color="#3B9FF3">
      <div className={styles.wrapTextOverflow}>{text}</div>
    </Tooltip>
  );

  const renderGeneral = () => (
    <>
      <div className={cx(styles.wrapperContainer, 'pb-4')} ref={refToTop}>
        <div className={cx(styles.containerForm)}>
          {isCreate && (
            <Row className={styles.rowCustom}>
              <Col xs={4}>
                <SelectUI
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Entity,
                  )}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Please select'],
                  )}
                  data={ENTITY_OPTIONS}
                  isRequired
                  disabled={!isEdit}
                  name="entityType"
                  id="entity"
                  className={cx('w-100')}
                  messageRequired={errors?.entityType?.message || null}
                  control={control}
                  onChange={(value) => {
                    resetForm();
                    if (value === ENTITY_VESSEL) {
                      setPlanningId(undefined);
                      setValue('vesselId', '');
                      setListPlanningAndRequest([]);
                      setListCheckView([]);
                    } else {
                      setListCheckView([]);
                      setPlanningId(userInfo?.mainCompany?.id);
                      getListPlanningAndRequests(
                        userInfo?.mainCompany?.id,
                        ENTITY_OFFICE,
                      );
                    }
                  }}
                />
              </Col>
              <Col xs={4}>
                {watchEntity === ENTITY_VESSEL ? (
                  <AsyncSelectForm
                    control={control}
                    name="vesselId"
                    id="vesselId"
                    labelSelect={renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Vessel,
                    )}
                    isRequired
                    placeholder={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )}
                    dynamicLabels={dynamicLabels}
                    searchContent={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.Vessel,
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Select all'],
                    )}
                    textBtnConfirm={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS.Confirm,
                    )}
                    disabled={loading}
                    messageRequired={errors?.vesselId?.message || ''}
                    onChangeSearch={(value: string) => {
                      dispatch(
                        getListVesselActions.request({
                          pageSize: -1,
                          isRefreshLoading: false,
                          content: value,
                          status: 'active',
                          companyId: userInfo?.mainCompanyId,
                          moduleName: ModuleName.INSPECTION,
                        }),
                      );
                    }}
                    options={listOptionVessel || []}
                  />
                ) : (
                  <SelectUI
                    labelSelect={renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Company,
                    )}
                    placeholder={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )}
                    data={companyOptions}
                    isRequired
                    disabled={!isEdit}
                    name="company"
                    id="company"
                    className={cx('w-100')}
                    messageRequired={errors?.company?.message || null}
                    control={control}
                  />
                )}
              </Col>

              <Col
                xs={4}
                className={cx(styles.choosePlan, 'd-flex align-items-start')}
              >
                <ModalListTableRadio
                  labelSelect=" "
                  buttonName={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
                      'Choose planning'
                    ],
                  )}
                  title={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
                      'Choose planning'
                    ],
                  )}
                  disable={!isEdit}
                  data={listToView}
                  dynamicLabels={dynamicLabels}
                  rowLabels={rowLabels}
                  values={planningId}
                  onChangeValues={(value) => {
                    setPlanningId(value);
                    mapPlanningToView(value);
                    getAuditCheckListByPlanningAndRequestActionsApi(value).then(
                      (result) => {
                        const listCheckList = result.data.map((item) => ({
                          code: item.code,
                          auditType: formValues?.auditTypes,
                          name: item?.name,
                          updatedAt: item.updatedAt,
                        }));

                        setListCheckView(listCheckList);
                      },
                    );
                  }}
                />
              </Col>
            </Row>
          )}
          <Row className={styles.rowCustom}>
            <Col xs={3}>
              <div className={cx('font-weight-bold', styles.label)}>
                {watchEntity === ENTITY_VESSEL
                  ? renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
                        'Vessel name'
                      ],
                    )
                  : renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
                        'Company name'
                      ],
                    )}
              </div>
              <div className={styles.value}>
                {watchEntity === ENTITY_VESSEL
                  ? formValues?.vesselName || '-'
                  : userInfo?.mainCompany?.name || '-'}
              </div>
            </Col>
            <Col xs={3}>
              <div className={cx('font-weight-bold', styles.label)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Lead inspector'],
                )}
              </div>
              <div className={styles.value}>
                {renderContentWithTooltip(formValues?.leadAuditor)}
              </div>
            </Col>
            <Col xs={3}>
              <div className={cx('font-weight-bold', styles.label)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Inspector,
                )}
              </div>
              <div className={styles.value}>
                {renderContentWithTooltip(
                  formValues?.auditor?.replaceAll('\n', ', '),
                )}
              </div>
            </Col>
            <Col xs={3}>
              <div className={cx('font-weight-bold', styles.label)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
                    'Inspection type'
                  ],
                )}
              </div>
              <div className={styles.value}>
                {renderContentWithTooltip(formValues?.auditTypes)}
              </div>
            </Col>
          </Row>
          <Row className={styles.rowCustom}>
            <Col xs={3}>
              <div className={cx('font-weight-bold', styles.label)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Planned from'],
                )}
              </div>
              <div className={styles.value}>
                {formatDateNoTime(formValues?.plannedForm) || '-'}
              </div>
            </Col>
            <Col xs={3}>
              <div className={cx('font-weight-bold', styles.label)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Planned to'],
                )}
              </div>
              <div className={styles.value}>
                {formatDateNoTime(formValues?.plannedTo) || '-'}
              </div>
            </Col>
            <Col xs={6}>
              <div className={cx('font-weight-bold', styles.label)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Memo,
                )}
              </div>

              <div className={styles.value}>
                {formValues?.memo ? (
                  <Tooltip
                    placement="topLeft"
                    title={formValues?.memo}
                    color="#3B9FF3"
                  >
                    <div className={styles.memoField}> {formValues?.memo}</div>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </div>
            </Col>
          </Row>

          <Row className={styles.rowCustom}>
            <Col xs={4}>
              <DateTimePicker
                disabled={!isEdit}
                isRequired
                messageRequired={errors?.actualFrom?.message || ''}
                label={
                  <b>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
                        'Actual from'
                      ],
                    )}
                  </b>
                }
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                className="w-100"
                maxDate={getValues('actualTo')}
                control={control}
                name="actualFrom"
                id="actualFrom"
                inputReadOnly
                open={firstErrorId === 'actualFrom' || undefined}
              />
            </Col>
            <Col xs={4}>
              <DateTimePicker
                disabled={!isEdit}
                isRequired
                messageRequired={errors?.actualTo?.message || ''}
                minDate={getValues('actualFrom')}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                label={
                  <b>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Actual to'],
                    )}
                  </b>
                }
                className="w-100"
                control={control}
                name="actualTo"
                id="actualTo"
                inputReadOnly
                open={firstErrorId === 'actualTo' || undefined}
              />
            </Col>
            <Col xs={4} className={cx('')}>
              <span className={cx(styles.labelSelect)}>
                <b>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Scope,
                  )}
                </b>
              </span>
              <TextAreaForm
                disabled={!isEdit}
                control={control}
                autoSize={{ minRows: 1 }}
                name="scope"
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Enter scope'],
                )}
                className={cx('w-100  mt-2', styles.customScope)}
                id="scope"
                maxLength={2000}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );

  const isAllowCloseout = useMemo(
    () =>
      auditTimeTableDetail?.status === InspectionTimeTableStatuses.Submitted &&
      userInfo?.id === data?.planningRequest?.leadAuditorId,
    [data, userInfo, auditTimeTableDetail],
  );

  const isAllowSubmitted = useMemo(() => {
    const isCreator = userInfo?.id === data?.createdUserId;
    if (
      auditTimeTableDetail?.status === InspectionTimeTableStatuses.Submitted
    ) {
      return null;
    }
    return (
      (auditTimeTableDetail?.status === InspectionTimeTableStatuses.Draft &&
        userInfo?.id === data?.planningRequest?.leadAuditorId) ||
      isCreator ||
      isCreate
    );
  }, [
    userInfo.id,
    data?.createdUserId,
    data?.planningRequest?.leadAuditorId,
    auditTimeTableDetail?.status,
    isCreate,
  ]);

  const btnAction = useMemo(() => {
    if (isAllowCloseout) {
      return renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Close out'],
      );
    }
    if (isAllowSubmitted) {
      return renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Submit);
    }
    return null;
  }, [dynamicLabels, isAllowCloseout, isAllowSubmitted]);

  const submitAndNew = useCallback(
    (remark?: string) => {
      if (data?.status === InspectionTimeTableStatuses.Draft || !data?.status) {
        handleSubmit(handleSubmitAndNew, onErrorForm)();
      } else {
        handleSubmitStatus(remark);
      }
    },
    [data?.status, handleSubmit, handleSubmitAndNew, handleSubmitStatus],
  );

  useEffect(() => {
    if (watchCompany) {
      getListPlanningAndRequests(watchCompany, ENTITY_OFFICE);
    }
  }, [watchCompany, getListPlanningAndRequests]);

  useEffect(() => {
    dispatch(
      getListCompanyManagementActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
  }, [dispatch, userInfo?.mainCompanyId]);

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div onClick={() => setFirstErrorId('')} className="form_data">
      {renderGeneral()}

      <ChecklistViewTable
        data={listCheckView?.map((item) => ({
          ...item,
          auditType: formValues?.auditTypes,
        }))}
        loading={false}
        dynamicLabels={dynamicLabels}
      />
      <CalenderTable
        isEdit={isEdit}
        dynamicLabels={dynamicLabels}
        loading={loading}
      />

      <Controller
        control={control}
        name="attachments"
        render={({ field }) => (
          <div className={cx('mt-3', styles.wrapAttachments)}>
            <TableAttachmentAGGrid
              featurePage={Features.AUDIT_INSPECTION}
              subFeaturePage={SubFeatures.AUDIT_TIME_TABLE}
              loading={false}
              disable={!(isEdit && !loading)}
              isEdit={isEdit && !loading}
              value={field.value}
              buttonName={renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Attach,
              )}
              onchange={field.onChange}
              pageSizeDefault={5}
              aggridId="ag-grid-table-2"
              moduleTemplate={MODULE_TEMPLATE.auditTimeTableTableAttachment}
              dynamicLabels={dynamicLabels}
            />
          </div>
        )}
      />
      {!isCreate && (
        <div
          className={cx(
            styles.wrapperContainer,
            'mt-3',
            styles.wrapperContainerHistory,
          )}
        >
          <TableHistoryAGGrid
            data={data?.statusHistory}
            loading={loading}
            pageSizeDefault={5}
            moduleTemplate={MODULE_TEMPLATE.auditTimeTableTableHistory}
            aggridId="ag-grid-table-3"
            dynamicLabels={dynamicLabels}
          />
        </div>
      )}
      {isEdit && (
        <GroupButton
          className={cx(styles.GroupButton, 'mt-3 pb-3')}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSaveDraftForm, onErrorForm)}
          buttonTypeRight={ButtonType.Green}
          txButtonBetween={
            isCreate ||
            (data?.status === InspectionTimeTableStatuses.Draft &&
              isAllowSubmitted)
              ? renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Save as draft'],
                )
              : null
          }
          txButtonRight={btnAction}
          dynamicLabels={dynamicLabels}
          renderSuffixRight={
            <img
              src={images.icons.icSend}
              alt="createNew"
              className={styles.icButtonSend}
            />
          }
          handleSubmitAndNew={btnAction ? submitAndNew : null}
          disable={loading}
        />
      )}
    </div>
  );
};

export default AuditTimeTableForm;
