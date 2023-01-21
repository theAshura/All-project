import images from 'assets/images/images';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';

import {
  DATA_SPACE,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteSailReportInspectionInternalActions,
  getListSailReportInspectionInternalActions,
} from 'store/sail-report-inspection-internal/sail-report-inspection-internal.action';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import PermissionCheck from 'hoc/withPermissionCheck';
import Button, { ButtonType } from 'components/ui/button/Button';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { I18nNamespace } from 'constants/i18n.const';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { formatDateTimeDay, setHeightTable } from 'helpers/utils.helper';
import styles from './internal.module.scss';

interface Props {
  activeTab?: string;
}

const ListOtherInspectionsAndAudits = ({ activeTab }: Props) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const dispatch = useDispatch();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { loading, listSailReportInspectionInternal, params, dataFilter } =
    useSelector((state) => state.sailReportInspectionInternal);
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const { userInfo } = useSelector((state) => state.authenticate);

  const viewDetail = useCallback(
    (idRecord?: string, isNewTab?: boolean) => {
      if (isNewTab) {
        const win = window.open(
          `${AppRouteConst.getSailReportInspectionInternalById(
            vesselRequestId,
          )}?idSail=${idRecord}`,
          '_blank',
        );
        win.focus();
        return true;
      }
      history.push(
        `${AppRouteConst.getSailReportInspectionInternalById(
          vesselRequestId,
        )}?idSail=${idRecord}`,
      );
      return false;
    },
    [vesselRequestId],
  );

  const editDetail = useCallback(
    (idRecord?: string) => {
      history.push(
        `${AppRouteConst.getSailReportInspectionInternalById(
          vesselRequestId,
        )}?status=edit&idSail=${idRecord}`,
      );
    },
    [vesselRequestId],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      let newParams = handleFilterParams(params);
      if (params?.handleSuccess) {
        newParams = { ...newParams, handleSuccess: params?.handleSuccess };
      }
      dispatch(
        getListSailReportInspectionInternalActions.request({
          ...newParams,
          isRefreshLoading: true,
          pageSize: -1,
          vesselId: vesselRequestId,
        }),
      );
    },
    [dispatch, vesselRequestId],
  );

  const deleteSailReportInspectionInternal = useCallback(
    (id: string) => {
      dispatch(
        deleteSailReportInspectionInternalActions.request({
          id,
          handleSuccess: () => handleGetList({ isRefreshLoading: false }),
        }),
      );
    },
    [dispatch, handleGetList],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => deleteSailReportInspectionInternal(id),
      });
    },
    [deleteSailReportInspectionInternal, t],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: 'Action',
        filter: false,
        enableRowGroup: false,
        sortable: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          const isCurrentDoc = checkDocHolderChartererVesselOwner(
            data,
            userInfo,
          );

          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => data && viewDetail(data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.SAIL_GENERAL_REPORT,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            isCurrentDoc && {
              img: images.icons.icEdit,
              function: () => data && editDetail(params?.data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.SAIL_GENERAL_REPORT,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'me-1',
            },
            isCurrentDoc && {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.SAIL_GENERAL_REPORT,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'me-1',
            },
            {
              img: images.icons.table.icNewTab,
              function: () => data && viewDetail(data?.id, true),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.SAIL_GENERAL_REPORT,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Green,
            },
          ].filter((item) => item !== null);
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'refId',
        headerName: 'Ref.ID',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'eventType',
        headerName: t('tableHeaders.eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionDateFrom',
        headerName: t('tableHeaders.inspectionDateFrom'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionDateTo',
        headerName: t('tableHeaders.inspectionDateTo'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionPort',
        headerName: t('tableHeaders.inspectionPort'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionCountry',
        headerName: t('tableHeaders.inspectionCountry'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('tableHeaders.status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'nextInspectionDue',
        headerName: t('tableHeaders.nextInspectionDue'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'attachment',
        headerName: t('tableHeaders.attachments'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRendererFramework: ({ data }) => {
          if (data?.attachments?.length > 0) {
            return (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  editDetail(data?.id);
                }}
                buttonType={ButtonType.Outline}
                className={styles.btnAttachment}
              >
                {t('tableHeaders.attachment')}
              </Button>
            );
          }
          return null;
        },
      },
      {
        field: 'lastUpdatedAt',
        headerName: t('tableHeaders.updatedAt'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [editDetail, handleDelete, isMultiColumnFilter, t, userInfo, viewDetail],
  );

  const dataTable = useMemo(
    () =>
      listSailReportInspectionInternal?.data?.map((item) => ({
        id: item?.id,
        refId: item?.refId || DATA_SPACE,
        eventType: item?.eventType?.name || DATA_SPACE,
        vesselId: item?.vesselId,
        inspectionDateFrom: item?.inspectionDateFrom
          ? formatDateTimeDay(item?.inspectionDateFrom)
          : DATA_SPACE,
        inspectionDateTo: item?.inspectionDateTo
          ? formatDateTimeDay(item?.inspectionDateTo)
          : DATA_SPACE,
        inspectionPort: item?.port?.name,
        inspectionCountry: item?.port?.country,
        nextInspectionDue: item?.nextInspectionDue
          ? formatDateTimeDay(item?.nextInspectionDue)
          : DATA_SPACE,
        status: item?.status,
        lastUpdatedAt: item?.updatedAt
          ? formatDateTimeDay(item?.updatedAt)
          : DATA_SPACE,
        attachments: item?.attachments,
        vesselDocHolders: item?.vessel?.vesselDocHolders || [],
        vesselCharterers: item?.vessel?.vesselCharterers || [],
        vesselOwners: item?.vessel?.vesselOwners || [],
        createdAt: item?.createdAt,
      })),
    [listSailReportInspectionInternal],
  );

  const buttonGroup = useMemo(
    () => (
      <PermissionCheck
        options={{
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.CREATE,
        }}
      >
        {({ hasPermission }) =>
          hasPermission && (
            <div className="">
              <Button
                className={styles.btnAdd}
                onClick={() => {
                  history.push(
                    AppRouteConst.getCreateSailReportInspectionInternalById(
                      vesselRequestId,
                    ),
                  );
                }}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {t('button.createNew')}
              </Button>
            </div>
          )
        }
      </PermissionCheck>
    ),
    [t, vesselRequestId],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <AGGridModule
          classNameHeader={styles.header}
          title={t('internalInspectionsAudit')}
          loading={loading}
          params={params}
          pageSizeDefault={5}
          buttons={buttonGroup}
          columnDefs={columnDefs}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          dataFilter={dataFilter}
          moduleTemplate={`${MODULE_TEMPLATE.sailReportInspectionInternal}__${vesselRequestId}`}
          fileName="SAIL Reporting_Internal Inspections Audit"
          dataTable={dataTable}
          height={setHeightTable(
            listSailReportInspectionInternal?.totalItem || 0,
          )}
          view={viewDetail}
          getList={handleGetList}
        />
      </div>
    </div>
  );
};

export default ListOtherInspectionsAndAudits;
