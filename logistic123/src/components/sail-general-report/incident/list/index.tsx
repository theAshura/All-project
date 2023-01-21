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
import {
  getListTemplateActions,
  clearTemplateReducer,
} from 'store/template/template.action';
import { ColumnApi } from 'ag-grid-community';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { useParams } from 'react-router';
import { Action, CommonApiParam } from 'models/common.model';
import useEffectOnce from 'hoc/useEffectOnce';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import RangePickerFilter from 'components/common/table-filter/range-picker-filter/RangePickerFilter';
import PermissionCheck from 'hoc/withPermissionCheck';
import moment from 'moment';
import styles from './list.module.scss';

interface ListIncidentInvestigationProps {
  activeTab: string;
}

const tabName = 'incident';
const tabSafetyName = 'safety-management';

const ListIncident: FC<ListIncidentInvestigationProps> = ({ activeTab }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { loading, listIncidentInvestigations, params, dataFilter } =
    useSelector((state) => state.incidentInvestigation);
  const [page] = useState(params.page || 1);
  const [pageSize] = useState(params.pageSize || 20);
  const [gridColumnApi] = useState<ColumnApi>(null);
  const [currentFilterModel] = useState<any>();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState(
    dataFilter?.dateFilter?.length > 0 ? dataFilter?.dateFilter : DATE_DEFAULT,
  );
  const [typeRange, setTypeRange] = useState<string>(
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
        }),
      );
    },
    [dispatch],
  );

  useEffectOnce(() => {
    if (
      !params?.isLeftMenu &&
      (tabName === activeTab || tabSafetyName === activeTab)
    ) {
      handleGetList({
        isLeftMenu: false,
        createdAtFrom: dataFilter?.dateFilter[0]
          ? dataFilter?.dateFilter[0]?.toISOString()
          : DATE_DEFAULT[0].toISOString(),
        createdAtTo: dataFilter?.dateFilter[1]
          ? dataFilter?.dateFilter[1]?.toISOString()
          : DATE_DEFAULT[1].toISOString(),

        handleSuccess: () => {
          dispatch(
            getListTemplateActions.request({
              content: MODULE_TEMPLATE.incidentInvestigation,
            }),
          );
        },
      });
    }
    return () => {
      dispatch(clearTemplateReducer());
      dispatch(
        getListIncidentInvestigationActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    };
  });

  const handleSaveFilter = useCallback(
    (data: CommonApiParam) => {
      dispatch(setDataFilterAction(data));
    },
    [dispatch],
  );

  const editDetail = useCallback(
    (idRecord?: string) => {
      history.push(
        `${AppRouteConst.getSailGeneralReportIncidentById(
          vesselRequestId,
        )}?status=edit&idSail=${idRecord}`,
      );
    },
    [vesselRequestId],
  );

  const viewDetail = useCallback(
    (idRecord?: string, isNewTab?: boolean) => {
      if (isNewTab) {
        const win = window.open(
          `${AppRouteConst.getSailGeneralReportIncidentById(
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
          `${AppRouteConst.getSailGeneralReportIncidentById(
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
        {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        {
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
      return actions;
    },
    [viewDetail, editDetail, handleDelete],
  );

  const dataTable = useMemo(
    () =>
      listIncidentInvestigations?.data?.map((item) => {
        const typeIncidents = item?.typeIncidents?.map((item) => item?.name);
        if (item?.otherType || item?.typeIncidents?.length === 0) {
          typeIncidents.push('Other');
        }
        return {
          id: item.id || DATA_SPACE,
          refId: item.refId || DATA_SPACE,
          companyName: item?.company?.name || DATA_SPACE,
          fleetName: item.vessel?.fleet?.name || DATA_SPACE,
          vesselType: item?.vessel?.vesselType?.name || DATA_SPACE,
          incidentDate:
            moment(item?.dateTimeOfIncident).format('DD/MM/YYYY') || DATA_SPACE,
          sNo: item.sNo || DATA_SPACE,
          incidentTitle: item?.title || DATA_SPACE,
          typeOfIncident: typeIncidents?.join(', ') || DATA_SPACE,
          atPort: item?.atPort ? 'At Port' : 'At Sea',
          voyageNo: item?.voyageNo || DATA_SPACE,
          reportDate:
            moment(item?.dateTimeOfIncident).format('DD/MM/YYYY') ||
            DATA_SPACE ||
            DATA_SPACE,
        };
      }) || [],
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
        minWidth: 125,
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
        headerName: t('refId'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyName',
        headerName: t('companyName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'fleetName',
        headerName: t('txFleetName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: t('txVesselType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'incidentDate',
        headerName: t('incidentDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'sNo',
        headerName: t('sNoTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'incidentTitle',
        headerName: t('incidentTitleTx'),
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
        field: 'atPort',
        headerName: t('atPort'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'voyageNo',
        headerName: t('voyageNoTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'reportDate',
        headerName: t('reportDateTx'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow],
  );

  return (
    <div className={styles.wrapper}>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <div className={styles.headerTitle}>{t('incidentInvestigation')}</div>
          <RangePickerFilter
            disable={loading}
            valueDateRange={dateFilter}
            onChangeRange={(data) => {
              setDateFilter(data);
            }}
            handleGetList={() =>
              handleGetList({
                createdAtFrom: dateFilter[0].toISOString(),
                createdAtTo: dateFilter[1].toISOString(),
              })
            }
            setTypeRange={(type: string) => {
              handleSaveFilter({ typeRange: type });
              setTypeRange(type);
            }}
            typeRange={typeRange}
          />
        </div>

        <PermissionCheck
          options={{
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.SAIL_GENERAL_REPORT,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <div className="pt10">
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
              </div>
            )
          }
        </PermissionCheck>
      </div>

      <div className={styles.wrapTable}>
        <AGGridModule
          loading={loading}
          params={null}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          hasRangePicker={false}
          columnDefs={columnDefs}
          dataFilter={null}
          moduleTemplate={MODULE_TEMPLATE.incidentInvestigation}
          fileName="SAIL Reporting_Incident Investigation"
          dataTable={dataTable}
          height="calc(100vh - 250px)"
          view={(params) => {
            viewDetail(params);
            return true;
          }}
          getList={handleGetList}
        />
      </div>
    </div>
  );
};

export default ListIncident;
