import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { WATCH_LIST_DYNAMIC_LABELS } from 'constants/dynamic/watch-list.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Action, CommonApiParam } from 'models/common.model';
import images from 'assets/images/images';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { useDispatch, useSelector } from 'react-redux';
import { getListCrewGroupingActions } from 'pages/crew-grouping/store/action';

import { dateStringComparator } from 'helpers/utils.helper';
import { SelectionChangedEvent } from 'ag-grid-community';
import {
  getWatchListActions,
  unWatchListMultiActions,
} from 'store/watch-list/watch-list.actions';
import { GetWatchListDataResponse } from 'models/api/watch-list/watch-list.model';
import { formatDateNoTime } from 'helpers/date.helper';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './watch-list.module.scss';
import { handleRedirectToTargetPage } from './watch-list.const';

const WatchListLandingPage = () => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Watchlist,
    modulePage: ModulePage.List,
  });
  const [listDataSelected, setListDataSelected] = useState([]);
  const [isMultiColumnFilter, setIsMultiColumnFilter] =
    useState<boolean>(false);
  const { watchingList, loading } = useSelector((state) => state.watchList);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWatchListActions.request());
  }, [dispatch]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WATCH_LIST_DYNAMIC_LABELS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({
          data,
        }: {
          data: GetWatchListDataResponse;
        }) => {
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () =>
                handleRedirectToTargetPage(
                  data?.referenceModuleName,
                  data?.referenceId,
                ),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.CREW_GROUPING,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
          ];
          if (!data) {
            actions = [];
          }
          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'stopWatching',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WATCH_LIST_DYNAMIC_LABELS['Stop watching'],
        ),
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        headerCheckboxSelectionFilteredOnly: true,
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 150,
        maxWidth: 250,
        pinned: 'center',
      },
      {
        field: 'referenceModuleName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WATCH_LIST_DYNAMIC_LABELS['Module name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'referenceRefId',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WATCH_LIST_DYNAMIC_LABELS['Reference ID'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'watchedDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          WATCH_LIST_DYNAMIC_LABELS['Watched date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
    ],
    [dynamicLabels, isMultiColumnFilter],
  );
  const handleGetList = (params?: CommonApiParam) => {
    const { createdAtFrom, createdAtTo, ...newParams } =
      handleFilterParams(params);
    dispatch(
      getListCrewGroupingActions.request({
        ...newParams,
        pageSize: -1,
        isLeftMenu: false,
      }),
    );
  };

  const handleStopWatching = useCallback(() => {
    if (listDataSelected?.length > 0) {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          WATCH_LIST_DYNAMIC_LABELS['My Watchlist'],
        ),

        txMsg: renderDynamicLabel(
          dynamicLabels,
          WATCH_LIST_DYNAMIC_LABELS[
            'Are you sure you want to remove this record from My Watchlist ?'
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
          dispatch(
            unWatchListMultiActions.request({
              watchlistIds: listDataSelected?.map((item) => item?.id),
            }),
          ),
      });
      setListDataSelected([]);
    }
  }, [dispatch, dynamicLabels, listDataSelected]);

  return (
    <div className={styles.container}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.MY_WATCHLIST}
        titlePage={renderDynamicLabel(
          dynamicLabels,
          WATCH_LIST_DYNAMIC_LABELS['My Watchlist'],
        )}
      />
      <div className={styles.stopWatching} onClick={handleStopWatching}>
        <Button
          className={cx('ms-1 mb-2', styles.stopWatching)}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Outline}
        >
          {renderDynamicLabel(
            dynamicLabels,
            WATCH_LIST_DYNAMIC_LABELS['Stop watching'],
          )}
        </Button>
      </div>
      <AGGridModule
        loading={loading}
        params={null}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.crewGrouping}
        fileName={renderDynamicLabel(
          dynamicLabels,
          WATCH_LIST_DYNAMIC_LABELS['My Watchlist'],
        )}
        dataTable={watchingList?.data?.map((item) => ({
          ...item,
          watchedDate: formatDateNoTime(item?.updatedAt),
        }))}
        height="calc(100vh - 175px)"
        getList={handleGetList}
        classNameHeader={styles.header}
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        rowSelection="multiple"
        suppressRowClickSelection
        onSelectionChanged={(event: SelectionChangedEvent) => {
          const selectedRows = event.api.getSelectedRows();
          setListDataSelected(selectedRows);
        }}
        onFirstDataRendered={(params) => {
          params.api.forEachNode((node) =>
            node.setSelected(
              listDataSelected.some((x) => x.id === node?.data?.id),
            ),
          );
        }}
      />
    </div>
  );
};

export default WatchListLandingPage;
