import { AppRouteConst } from 'constants/route.const';
import images from 'assets/images/images';
import { useEffect, useState, useCallback, useContext, useMemo } from 'react';
import cx from 'classnames';
import {
  CalendarTimeTableContext,
  OptionEditor,
} from 'contexts/audit-time-table/CalendarTimeTable';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import NoPermission from 'containers/no-permission';
import {
  getAuditTimeTableDetailActions,
  updateAuditTimeTableActions,
  deleteAuditTimeTableActions,
  submitAuditTimeTableActions,
} from 'store/audit-time-table/audit-time-table.action';
import {
  CreateAuditTimeTableParams,
  CalendarDate,
} from 'models/api/audit-time-table/audit-time-table.model';
import { CommonQuery } from 'constants/common.const';
import Container from 'components/common/container/ContainerPage';
import history from 'helpers/history.helper';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-time-table.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { InspectionTimeTableStatuses } from 'constants/inspection-time-table.const';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import PopoverStatus from 'components/audit-checklist/common/popover-status/PopoverStatus';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import { Item, StepStatus } from 'components/common/step-line/lineStepCP';
import styles from './detail.module.scss';
import AuditTimeTableForm from '../forms/AuditTimeTableForm';
import { checkDocHolderChartererVesselOwner } from '../../planning-and-request/forms/planning-and-request.helps';

export default function AuditTimeTableManagementDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { setListEvent, setOptionEditor, listEvent } = useContext(
    CalendarTimeTableContext,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const { loading, auditTimeTableDetail, dataCalendar } = useSelector(
    (state) => state.auditTimeTable,
  );

  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const { t } = useTranslation(I18nNamespace.AUDIT_TIME_TABLE);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionAuditTimeTable,
    modulePage: isEdit ? ModulePage.Edit : ModulePage.View,
  });

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  useEffect(() => {
    if (auditTimeTableDetail?.planningRequest?.auditors) {
      const auditors: OptionEditor[] =
        auditTimeTableDetail?.planningRequest?.auditors?.map((item) => ({
          value: item.id,
          label: item.username,
        }));
      setOptionEditor(auditors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditTimeTableDetail]);

  useEffect(() => {
    if (dataCalendar?.length > 0) {
      const dataViewCalendar: CalendarDate[] = dataCalendar?.map((item) => ({
        id: item.id,
        date: item.date,
        from: item.from,
        to: item.to,
        process: item.process,
        auditee: item.auditee,
        auditorId: item.auditorId,
        operator: 'keep',
      }));
      setListEvent([...dataViewCalendar]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCalendar]);

  const handleSaveDraft = useCallback(
    (formData: CreateAuditTimeTableParams) => {
      dispatch(
        updateAuditTimeTableActions.request({
          id,
          data: {
            ...formData,
            calendars:
              listEvent
                .filter((t) => t.operator !== 'keep')
                .map((item) => {
                  if (item.operator === 'add') {
                    const { id, operator, ...other } = item;
                    return other;
                  }
                  return item;
                }) || [],
          },
        }),
      );
    },
    [dispatch, id, listEvent],
  );

  const handleSubmit = useCallback(
    (formData: CreateAuditTimeTableParams) => {
      dispatch(
        updateAuditTimeTableActions.request({
          id,
          data: {
            ...formData,
            calendars:
              listEvent.map((item) => {
                if (item.operator === 'add') {
                  const { id, operator, ...other } = item;
                  return other;
                }
                return item;
              }) || [],
          },
          afterUpdate: () => {
            dispatch(submitAuditTimeTableActions.request(id));
          },
        }),
      );
    },
    [dispatch, id, listEvent],
  );

  useEffect(() => {
    dispatch(getAuditTimeTableDetailActions.request(id));
    // return () => {
    //   dispatch(
    //     getAuditTimeTableDetailActions.success(),
    //   );
    // };
  }, [dispatch, id]);

  // useEffectOnce(() => {
  //   dispatch(
  //     getListVesselActions.request({
  //       pageSize: -1,
  //       companyId: userInfo?.companyId,
  //     }),
  //   );
  // });

  const DEFAULT_ITEMS: Item[] = [
    {
      id: 'draft',
      name: t('statusPlan.txDraft'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'submitted',
      name: t('statusPlan.txSubmitted'),
      status: StepStatus.INACTIVE,
    },
    {
      id: 'close_out',
      name: t('statusPlan.txCloseOut'),
      status: StepStatus.INACTIVE,
    },
  ];

  const findHistoryByStatus = (status: string) => {
    const statusHistory = auditTimeTableDetail?.statusHistory || [];
    const historyFiltered = statusHistory.filter(
      (item) => item.status === status,
    );
    const dataPopulated = historyFiltered.map((item) => ({
      datetime: item?.updatedAt,
      description: item?.createdUser?.username,
      name: item?.createdUser?.jobTitle,
    }));
    return dataPopulated;
  };

  const stepStatusItems = () => {
    const items: Item[] = DEFAULT_ITEMS;
    switch (auditTimeTableDetail?.status) {
      case 'draft': {
        const newItems = items.map((i, index) => {
          if (index < 1) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          return i;
        });
        return newItems;
      }

      case 'submitted': {
        const newItems = items.map((i, index) => {
          if (index < 2) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          return i;
        });
        return newItems;
      }
      case 'close_out': {
        const newItems = items.map((i, index) => {
          if (index < 3) {
            return {
              ...i,
              status: StepStatus.ACTIVE,
              info: findHistoryByStatus(i.id),
            };
          }
          return i;
        });
        return newItems;
      }

      default:
        return items;
    }
  };
  const renderActions = useMemo(() => {
    if (isEdit) {
      return null;
    }
    const isCreator = userInfo?.id === auditTimeTableDetail?.createdUserId;
    const isCompany =
      userInfo?.mainCompanyId === auditTimeTableDetail?.companyId;
    const draftCase =
      isCreator &&
      auditTimeTableDetail?.status?.toLowerCase() ===
        InspectionTimeTableStatuses.Draft;
    const submittedCase =
      isCreator &&
      auditTimeTableDetail?.status?.toLowerCase() ===
        InspectionTimeTableStatuses.Submitted;
    const isCurrentDoc = checkDocHolderChartererVesselOwner(
      {
        vesselDocHolders: auditTimeTableDetail?.vessel?.vesselDocHolders,
        vesselCharterers: auditTimeTableDetail?.vessel?.vesselCharterers,
        vesselOwners: auditTimeTableDetail?.vessel?.vesselOwners,
        createdAt: auditTimeTableDetail?.createdAt,
        entityType: auditTimeTableDetail?.planningRequest?.entityType,
      },
      userInfo,
    );

    const allowEdit = (draftCase || submittedCase) && isCompany && isCurrentDoc;
    const allowDelete = draftCase && isCompany && isCurrentDoc;
    return (
      <div className={styles.flex}>
        <WatchListManagement
          dynamicLabels={dynamicLabels}
          referenceId={id}
          referenceModuleName={WatchlistModuleEnum.INSPECTION_TIME_TABLE}
          referenceRefId={auditTimeTableDetail?.sNo}
        />

        <Button
          className={cx('me-2', styles.buttonFilter)}
          buttonType={ButtonType.CancelOutline}
          disabled={loading}
          onClick={(e) => {
            history.goBack();
          }}
        >
          <span className="pe-2">
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Back,
            )}
          </span>
        </Button>
        {allowEdit && (
          <Button
            className={cx('me-1', styles.buttonFilter)}
            disabled={loading}
            onClick={(e) => {
              history.push(
                `${AppRouteConst.getAuditTimeTableById(id)}${CommonQuery.EDIT}`,
              );
            }}
          >
            <span className="pe-2">
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Edit,
              )}
            </span>
            <img
              src={images.icons.icEdit}
              alt="edit"
              className={styles.icEdit}
            />
          </Button>
        )}
        {allowDelete && (
          <Button
            className={cx('ms-1', styles.buttonFilter)}
            buttonType={ButtonType.Orange}
            onClick={(e) => setModal(true)}
            disabled={loading}
          >
            <span className="pe-2">
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Delete,
              )}
            </span>
            <img
              src={images.icons.icRemove}
              alt="remove"
              className={styles.icRemove}
            />
          </Button>
        )}
      </div>
    );
  }, [
    auditTimeTableDetail?.companyId,
    auditTimeTableDetail?.createdAt,
    auditTimeTableDetail?.createdUserId,
    auditTimeTableDetail?.planningRequest?.entityType,
    auditTimeTableDetail?.sNo,
    auditTimeTableDetail?.status,
    auditTimeTableDetail?.vessel?.vesselCharterers,
    auditTimeTableDetail?.vessel?.vesselDocHolders,
    auditTimeTableDetail?.vessel?.vesselOwners,
    dynamicLabels,
    id,
    isEdit,
    loading,
    userInfo,
  ]);
  return (
    <PermissionCheck
      options={{
        feature: Features.AUDIT_INSPECTION,
        subFeature: SubFeatures.AUDIT_TIME_TABLE,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.getAuditTimeTableById}>
            <Container className={styles.wrap}>
              <div className={styles.wrapHeader}>
                <div className="d-flex justify-content-between">
                  <div className={styles.headers}>
                    <BreadCrumb
                      current={
                        search === CommonQuery.EDIT
                          ? BREAD_CRUMB.AUDIT_TIME_TABLE_EDIT
                          : BREAD_CRUMB.AUDIT_TIME_TABLE_DETAIL
                      }
                    />
                    <div className={cx('fw-bold', styles.title)}>
                      {renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.AuditInspectionAuditTimeTable,
                      )}
                    </div>
                  </div>
                  {renderActions}
                </div>
                <div className="d-flex justify-content-end align-items-center">
                  <div className={styles.sno}>
                    <span className={styles.label}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['S.No'],
                      )}
                      :
                    </span>
                    <b>{auditTimeTableDetail?.sNo}</b>
                  </div>
                  <PopoverStatus
                    header={renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
                        'Workflow progress'
                      ],
                    )}
                    dynamicLabels={dynamicLabels}
                    stepStatusItems={stepStatusItems()}
                    status={auditTimeTableDetail?.status}
                    className={styles.historySteps}
                  />
                </div>
              </div>
              <ModalConfirm
                title={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['Delete?'],
                )}
                content={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
                    'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
                  ],
                )}
                isDelete
                disable={loading}
                toggle={() => setModal(!modal)}
                modal={modal}
                handleSubmit={() => {
                  dispatch(
                    deleteAuditTimeTableActions.request({
                      id,
                      isDetail: true,
                      getListAuditTimeTable: () => {
                        history.push(AppRouteConst.AUDIT_TIME_TABLE);
                      },
                    }),
                  );
                }}
              />
              <div className={styles.wrapForm}>
                <AuditTimeTableForm
                  isEdit={isEdit}
                  data={auditTimeTableDetail}
                  onSaveDraft={handleSaveDraft}
                  onSubmit={handleSubmit}
                  dynamicLabels={dynamicLabels}
                />
              </div>
            </Container>
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
