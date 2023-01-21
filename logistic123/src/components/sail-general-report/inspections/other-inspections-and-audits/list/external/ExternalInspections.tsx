import { ColumnApi } from 'ag-grid-community';
import images from 'assets/images/images';
import cx from 'classnames';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  DATA_SPACE,
  DATE_DEFAULT,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import {
  formatDateTime,
  formatDateTimeDay,
  setHeightTable,
} from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setDataFilterAction } from 'store/element-master/element-master.action';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  deleteExternalActions,
  getDetailExternal,
  getLisExternalActions,
} from 'store/external/external.action';
import { useParams } from 'react-router';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import styles from './external-inspections.module.scss';

const ExternalInspections = () => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { loading, params, dataFilter, listExternal } = useSelector(
    (state) => state.external,
  );

  const [gridColumnApi] = useState<ColumnApi>(null);
  const [currentFilterModel] = useState<any>();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [typeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );
  const [page, setPage] = useState(params.page || 1);
  const [pageSize] = useState(5);
  const dispatch = useDispatch();
  const [dateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );

  const { id: vesselRequestId } = useParams<{ id: string }>();
  const { userInfo } = useSelector((state) => state.authenticate);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { handleSuccess, ...other } = params;
      let newParams = handleFilterParams(other);
      if (handleSuccess) {
        newParams = { ...newParams, handleSuccess };
      }
      dispatch(
        getLisExternalActions.request({
          ...newParams,
          pageSize: -1,
          vesselId: vesselRequestId,
        }),
      );
    },
    [dispatch, vesselRequestId],
  );

  const handleSaveFilter = useCallback(
    (data: CommonApiParam) => {
      dispatch(setDataFilterAction(data));
    },
    [dispatch],
  );
  // getExternalInspectionById
  const editDetail = useCallback(
    (idRecord?: string) => {
      dispatch(getDetailExternal.request(idRecord));
      history.push(
        `${AppRouteConst.getExternalInspectionById(
          vesselRequestId,
        )}?status=edit&idSail=${idRecord}`,
      );
    },
    [dispatch, vesselRequestId],
  );

  const viewDetail = useCallback(
    (idRecord?: string, isNewTab?: boolean) => {
      if (isNewTab) {
        const win = window.open(
          `${AppRouteConst.getExternalInspectionById(
            vesselRequestId,
          )}?idSail=${idRecord}`,
          '_blank',
        );
        win.focus();
      } else {
        handleSaveFilter({
          columnsAGGrid: gridColumnApi?.getColumnState(),
          filterModel: currentFilterModel,
          page,
          pageSize,
          dateFilter,
          typeRange,
        });
        history.push(
          `${AppRouteConst.getExternalInspectionById(
            vesselRequestId,
          )}?idSail=${idRecord}`,
        );
      }
    },
    [
      currentFilterModel,
      dateFilter,
      gridColumnApi,
      handleSaveFilter,
      page,
      pageSize,
      typeRange,
      vesselRequestId,
    ],
  );

  const handleDeleteStandardMaster = useCallback(
    (id: string) => {
      dispatch(
        deleteExternalActions.request({
          id,
          afterDelete: () => {
            if (page > 1 && listExternal?.data.length === 1) {
              setPage(page - 1);
              handleGetList({
                createdAtFrom: dateFilter[0].toISOString(),
                createdAtTo: dateFilter[1].toISOString(),
                isRefreshLoading: false,
              });
            } else {
              handleGetList({
                createdAtFrom: dateFilter[0].toISOString(),
                createdAtTo: dateFilter[1].toISOString(),
                isRefreshLoading: false,
              });
            }
          },
        }),
      );
    },
    [dateFilter, dispatch, handleGetList, listExternal?.data.length, page],
  );
  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteStandardMaster(id),
      });
    },
    [handleDeleteStandardMaster, t],
  );

  const canUserEdit = useCallback(
    (item) => {
      if (!item) {
        return false;
      }

      return checkDocHolderChartererVesselOwner(
        {
          createdAt: item?.createdAt,
          vesselCharterers: item?.vessel?.vesselCharterers,
          vesselDocHolders: item?.vessel?.vesselDocHolders,
          vesselOwners: item?.vessel?.vesselOwners,
        },
        userInfo,
      );
    },
    [userInfo],
  );

  const checkWorkflow = useCallback(
    (item): Action[] => {
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        canUserEdit(item) && {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        canUserEdit(item) && {
          img: images.icons.icRemove,
          function: () => handleDelete(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.DELETE,
          buttonType: ButtonType.Orange,
          cssClass: 'me-1',
        },
        {
          img: images.icons.table.icNewTab,
          function: () => viewDetail(item?.id, true),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Green,
        },
      ];
      return actions.filter((action) => action);
    },
    [viewDetail, editDetail, handleDelete, canUserEdit],
  );

  const dataTable = useMemo(
    () =>
      listExternal?.data?.map((item, index) => ({
        id: item.id || DATA_SPACE,
        no: item?.refId || DATA_SPACE,
        eventType: item.eventType.name,
        dateOfInspection: item?.dateOfInspection
          ? formatDateTimeDay(item?.dateOfInspection)
          : DATA_SPACE,
        port: item?.port?.name || DATA_SPACE,
        country: item?.port?.country || DATA_SPACE,
        total: item.externalInspectionReports.length || DATA_SPACE,
        totalOpenFindings:
          item.externalInspectionReports.filter(
            (item) => item.status === 'Open',
          )?.length || DATA_SPACE,
        updatedAt: item?.updatedAt
          ? formatDateTime(item?.updatedAt)
          : DATA_SPACE,
        vessel: item?.vessel,
        createdAt: item?.createdAt,
      })) || [],
    [listExternal?.data],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          let actions = checkWorkflow(data);
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
        field: 'no',
        headerName: 'Ref.ID',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'eventType',
        headerName: t('table.eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'dateOfInspection',
        headerName: t('table.inspectionDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'port',
        headerName: t('table.inspectionPort'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'country',
        headerName: t('table.inspectionCountry'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'total',
        headerName: t('table.totalFindings'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'totalOpenFindings',
        headerName: t('table.openFindings'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'updatedAt',
        headerName: t('table.updatedAt'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow],
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
            <Button
              onClick={() =>
                history.push(
                  AppRouteConst.getCreateExternalInspectionById(
                    vesselRequestId,
                  ),
                )
              }
              className={styles.btnAdd}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  alt="createNew"
                  className={styles.icButton}
                />
              }
            >
              Create New
            </Button>
          )
        }
      </PermissionCheck>
    ),
    [vesselRequestId],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.wrapTable}>
          <AGGridModule
            classNameHeader={styles.header}
            title={t('otherInspectionAudit')}
            loading={loading}
            params={params}
            pageSizeDefault={5}
            buttons={buttonGroup}
            columnDefs={columnDefs}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            dataFilter={dataFilter}
            moduleTemplate={`${MODULE_TEMPLATE.sailReportInspectionExternal}__${vesselRequestId}`}
            fileName="SAIL Reporting_External Inspections"
            dataTable={dataTable}
            height={setHeightTable(listExternal?.totalItem || 0)}
            view={(id) => {
              viewDetail(id);
              return true;
            }}
            getList={handleGetList}
          />
        </div>
      </div>
    </div>
  );
};

export default ExternalInspections;
