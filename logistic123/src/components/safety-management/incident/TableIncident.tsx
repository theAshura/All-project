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
import { IncidentInvestigation } from 'models/api/incident-investigation/incident-investigation.model';

import {
  getListIncidentInvestigationActions,
  deleteIncidentInvestigationActions,
  setDataFilterAction,
} from 'store/incident-investigation/incident-investigation.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { checkDocHolderChartererVesselOwner } from 'components/planning-and-request/forms/planning-and-request.helps';
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
import { useParams } from 'react-router';
import PermissionCheck from 'hoc/withPermissionCheck';
import moment from 'moment';
import styles from './incident.module.scss';

const tabSafetyName = 'safety-management';
interface ListIncidentInvestigationProps {
  activeTab: string;
}

const ListIncident: FC<ListIncidentInvestigationProps> = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { loading, listIncidentInvestigations, params, dataFilter } =
    useSelector((state) => state.incidentInvestigation);
  const [page] = useState(params.page || 1);
  const [pageSize] = useState(params.pageSize || 5);
  const [gridColumnApi] = useState<ColumnApi>(null);
  const [currentFilterModel] = useState<any>();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [dateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const [typeRange] = useState<string>(
    dataFilter?.typeRange || TYPE_CUSTOM_RANGE,
  );

  const { id: vesselRequestId } = useParams<{ id: string }>();

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);

      dispatch(
        getListIncidentInvestigationActions.request({
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

  const viewDetail = useCallback(
    (idRecord?: string, isNewTab?: boolean) => {
      if (isNewTab) {
        const win = window.open(
          `${AppRouteConst.getSailGeneralReportIncidentById(
            vesselRequestId,
          )}?idSail=${idRecord}&tab=${tabSafetyName}`,
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
          `${AppRouteConst.getSailGeneralReportIncidentById(
            vesselRequestId,
          )}?idSail=${idRecord}&tab=${tabSafetyName}`,
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

  const editDetail = useCallback(
    (idRecord?: string) => {
      history.push(
        `${AppRouteConst.getSailGeneralReportIncidentById(
          vesselRequestId,
        )}?status=edit&idSail=${idRecord}&tab=${tabSafetyName}`,
      );
    },
    [vesselRequestId],
  );

  const handleDeleteIncidentInvestigation = useCallback(
    (id: string) => {
      dispatch(
        deleteIncidentInvestigationActions.request({
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

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: 'Confirmation?',
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteIncidentInvestigation(id),
      });
    },
    [handleDeleteIncidentInvestigation, t],
  );

  const checkWorkflow = useCallback(
    (item: IncidentInvestigation): Action[] => {
      const isCurrentDocChartererVesselOwner =
        checkDocHolderChartererVesselOwner(
          {
            vesselDocHolders: item?.vessel?.vesselDocHolders,
            vesselCharterers: item?.vessel?.vesselCharterers,
            vesselOwners: item?.vessel?.vesselOwners,
            createdAt: item?.createdAt,
          },
          userInfo,
        );

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
        isCurrentDocChartererVesselOwner && {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        isCurrentDocChartererVesselOwner && {
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
      ]?.filter((item) => item);
      return actions;
    },
    [userInfo, viewDetail, editDetail, handleDelete],
  );

  const dataTable = useMemo(
    () =>
      listIncidentInvestigations?.data?.map((item) => ({
        id: item.id || DATA_SPACE,
        refId: item.refId || DATA_SPACE,
        companyName: item?.company?.name || DATA_SPACE,
        fleetName: item.vessel?.fleet?.name || DATA_SPACE,
        vesselType: item?.vessel?.vesselType?.name || DATA_SPACE,
        incidentDate:
          moment(item?.dateTimeOfIncident).format('DD/MM/YYYY') || DATA_SPACE,
        sNo: item.sNo || DATA_SPACE,
        incidentDescription: item?.description || DATA_SPACE,
        typeOfIncident:
          item?.typeIncidents?.map((item) => item?.name)?.join(', ') ||
          DATA_SPACE,
        atPort: item?.atPort ? 'At Port' : 'At Sea',
        createdDate: moment(item?.createdAt).format('DD/MM/YYYY') || DATA_SPACE,
        createdByUser: item?.createdUser?.username || DATA_SPACE,
        updatedDate: moment(item?.updatedAt).format('DD/MM/YYYY') || DATA_SPACE,
        updatedByUser: item?.updatedUser?.username || DATA_SPACE,
        vessel: item?.vessel,
        createdAt: item?.createdAt,
      })) || [],
    [listIncidentInvestigations?.data],
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
        field: 'incidentDate',
        headerName: t('incidentDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'typeOfIncident',
        headerName: t('typeOfIncidentTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'incidentDescription',
        headerName: t('incidentDescription'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdDate',
        headerName: t('createdDate'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdByUser',
        headerName: t('createdByUser'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedDate',
        headerName: t('updatedDate'),
        minWidth: 200,
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedByUser',
        headerName: t('updatedByUser'),
        minWidth: 200,
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
                  AppRouteConst.getCreateSailGeneralReportIncidentById(
                    vesselRequestId,
                  ),
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
      <div className={styles.wrapTable}>
        <AGGridModule
          loading={loading}
          title={t('incident')}
          params={null}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          columnDefs={columnDefs}
          dataFilter={null}
          moduleTemplate={`${MODULE_TEMPLATE.incidentInvestigation}__${vesselRequestId}`}
          fileName="SAIL Reporting_Incident"
          dataTable={dataTable}
          height="calc(100vh - 315px)"
          view={(id) => {
            viewDetail(id);
            return true;
          }}
          getList={handleGetList}
          buttons={headButtons}
        />
      </div>
    </div>
  );
};

export default ListIncident;
