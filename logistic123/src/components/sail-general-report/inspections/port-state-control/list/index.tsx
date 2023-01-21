import { FC, useCallback, useMemo, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';

import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  MODULE_TEMPLATE,
  DATE_DEFAULT,
  DATA_SPACE,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import history from 'helpers/history.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PortStateControl } from 'models/api/port-state-control/port-state-control.model';

import {
  getListPortStateControlActions,
  deletePortStateControlActions,
  setDataFilterAction,
} from 'store/port-state-control/port-state-control.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ColumnApi } from 'ag-grid-community';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import PermissionCheck from 'hoc/withPermissionCheck';
import { useParams } from 'react-router';
import moment from 'moment';
import { Vessel } from 'models/api/condition-of-class/condition-of-class.model';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
import styles from './list.module.scss';

interface ListPortStateControlProps {
  activeTab: string;
}

const ListPortStateControls: FC<ListPortStateControlProps> = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);
  const { loading, listPortStateControls, params, dataFilter } = useSelector(
    (state) => state.portStateControl,
  );
  const [page] = useState(params.page || 1);
  const [pageSize] = useState(params.pageSize || 20);
  const [gridColumnApi] = useState<ColumnApi>(null);
  const [currentFilterModel] = useState<any>();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [dateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [typeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );
  const { id: vesselRequestId } = useParams<{ id: string }>();
  const { userInfo } = useSelector((state) => state.authenticate);

  const canCurrentUserEdit = useCallback(
    (createdAt?: string | Date, vessel?: Vessel) =>
      vessel
        ? checkDocHolderChartererVesselOwner(
            {
              createdAt,
              vesselCharterers: vessel?.vesselCharterers || [],
              vesselDocHolders: vessel?.vesselOwners || [],
              vesselOwners: vessel?.vesselDocHolders || [],
            },
            userInfo,
          )
        : false,
    [userInfo],
  );

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListPortStateControlActions.request({
          ...newParams,
          pageSize: -1,
          vesselId: vesselRequestId,
        }),
      );
    },
    [dispatch, vesselRequestId],
  );

  const editDetail = useCallback(
    (idRecord?: string) => {
      history.push(
        `${AppRouteConst.getInspectionPSCById(
          vesselRequestId,
        )}?status=edit&idSail=${idRecord}`,
      );
    },
    [vesselRequestId],
  );

  const handleSaveFilter = useCallback(
    (data: CommonApiParam) => {
      dispatch(setDataFilterAction(data));
    },
    [dispatch],
  );

  const viewDetail = useCallback(
    (idRecord?: string, isNewTab?: boolean) => {
      if (isNewTab) {
        const win = window.open(
          `${AppRouteConst.getInspectionPSCById(
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
          `${AppRouteConst.getInspectionPSCById(
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

  const handleDeletePortStateControl = useCallback(
    (id: string) => {
      dispatch(
        deletePortStateControlActions.request({
          id,
          handleSuccess: () => {
            handleGetList({
              createdAtFrom: dateFilter[0].toISOString(),
              createdAtTo: dateFilter[1].toISOString(),
            });
          },
        }),
      );
    },
    [dateFilter, dispatch, handleGetList],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: 'Confirmation?',
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeletePortStateControl(id),
      });
    },
    [handleDeletePortStateControl, t],
  );

  const checkWorkflow = useCallback(
    (item: PortStateControl): Action[] => {
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
        canCurrentUserEdit(item?.createdAt, item?.vessel) && {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        canCurrentUserEdit(item?.createdAt, item?.vessel) && {
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
      ].filter((action) => action);
      return actions;
    },
    [viewDetail, editDetail, handleDelete, canCurrentUserEdit],
  );

  const dataTable = useMemo(
    () =>
      listPortStateControls?.data?.map((item) => ({
        id: item?.id || DATA_SPACE,
        refId: item.refId || DATA_SPACE,
        eventType: item?.eventType?.name || DATA_SPACE,
        inspectionDate:
          moment(item?.dateOfInspection).format('DD/MM/YYYY') || DATA_SPACE,
        inspectionPort: item?.port?.name || item?.terminal?.portMaster?.name,
        inspectionCountry:
          item?.port?.country ||
          item?.terminal?.portMaster?.country ||
          DATA_SPACE,
        detention: item?.detention,
        totalFindings: item.portStateInspectionReports?.length || 0,
        openFindings:
          item.portStateInspectionReports?.filter(
            (element) => element.status === 'Open',
          )?.length || 0,
        lastUpdatedDate: item?.updatedAt
          ? moment(item?.updatedAt).format('DD/MM/YYYY')
          : DATA_SPACE,
        vessel: item?.vessel,
        createdAt: item?.createdAt,
      })) || [],
    [listPortStateControls?.data],
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
        field: 'refId',
        headerName: t('refID'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'eventType',
        headerName: t('eventType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionPort',
        headerName: t('inspectionPort'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionCountry',
        headerName: t('inspectionCountry'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'detention',
        headerName: t('detention'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'inspectionDate',
        headerName: t('inspectionDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'totalFindings',
        headerName: t('totalFindings'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'openFindings',
        headerName: t('openFindings'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'lastUpdatedDate',
        headerName: t('lastUpdatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow],
  );

  const headButtons = useMemo(
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
                  AppRouteConst.getCreateInspectionPSCById(vesselRequestId),
                )
              }
              buttonSize={ButtonSize.Medium}
              className="button_create"
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
            loading={loading}
            title={t('portStateControl')}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            columnDefs={columnDefs}
            dataFilter={null}
            moduleTemplate={`${MODULE_TEMPLATE.portStateControl}__${vesselRequestId}`}
            fileName="SAIL Reporting_Port State Control"
            dataTable={dataTable}
            height="calc(100vh - 312px)"
            view={(id) => {
              viewDetail(id);
              return true;
            }}
            getList={handleGetList}
            buttons={headButtons}
          />
        </div>
      </div>
    </div>
  );
};

export default ListPortStateControls;
