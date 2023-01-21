import { useCallback, useMemo, useState } from 'react';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import {
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX_QA,
  DATE_DEFAULT,
  DATA_SPACE,
} from 'constants/components/ag-grid.const';
import images from 'assets/images/images';
import history from 'helpers/history.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { StandardMaster } from 'models/api/standard-master/standard-master.model';

import {
  getListStandardMasterActions,
  deleteStandardMasterActions,
  setDataFilterAction,
} from 'store/standard-master/standard-master.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';

import { ColumnApi } from 'ag-grid-community';
import PermissionCheck from 'hoc/withPermissionCheck';
import HeaderPage from 'components/common/header-page/HeaderPage';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import { Action, CommonApiParam } from 'models/common.model';
import { handleFilterParams } from 'helpers/filterParams.helper';
import cx from 'classnames';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import styles from 'components/list-common.module.scss';

const StandardMasterContainer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(I18nNamespace.STANDARD_MASTER);
  const { loading, listStandardMasters, params, dataFilter } = useSelector(
    (state) => state.standardMaster,
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

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListStandardMasterActions.request({
          ...newParams,
          pageSize: -1,
        }),
      );
    },
    [dispatch],
  );

  const editDetail = useCallback((id?: string) => {
    history.push(`${AppRouteConst.getStandardMasterById(id)}?edit`);
  }, []);

  const handleSaveFilter = useCallback(
    (data: CommonApiParam) => {
      dispatch(setDataFilterAction(data));
    },
    [dispatch],
  );

  const viewDetail = useCallback(
    (id?: string, isNewTab?: boolean) => {
      if (isNewTab) {
        const win = window.open(
          AppRouteConst.getStandardMasterById(id),
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
        history.push(AppRouteConst.getStandardMasterById(id));
      }
    },
    [
      currentFilterModel,
      dateFilter,
      gridColumnApi,
      page,
      pageSize,
      typeRange,
      handleSaveFilter,
    ],
  );

  const handleDeleteStandardMaster = useCallback(
    (id: string) => {
      dispatch(
        deleteStandardMasterActions.request({
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
        onPressButtonRight: () => handleDeleteStandardMaster(id),
      });
    },
    [handleDeleteStandardMaster, t],
  );

  const checkWorkflow = useCallback(
    (item: StandardMaster): Action[] => {
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.STANDARD_MASTER,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        item?.createdUserId && {
          img: images.icons.icEdit,
          function: () => editDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.STANDARD_MASTER,
          action: ActionTypeEnum.UPDATE,
          cssClass: 'me-1',
        },
        item?.createdUserId && {
          img: images.icons.icRemove,
          function: () => handleDelete(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.STANDARD_MASTER,
          action: ActionTypeEnum.DELETE,
          buttonType: ButtonType.Orange,
          cssClass: 'me-1',
        },
        {
          img: images.icons.table.icNewTab,
          function: () => viewDetail(item?.id, true),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.STANDARD_MASTER,
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
      listStandardMasters?.data?.map((item) => ({
        id: item.id || DATA_SPACE,
        standardCode: item.code || DATA_SPACE,
        standardName: item.name || DATA_SPACE,
        scoreApplicable: item.scoreApplicable ? 'Yes' : 'No',
        status: item?.status || DATA_SPACE,
        createdUserId: item?.createdUserId,
      })) || [],
    [listStandardMasters?.data],
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
        field: 'standardCode',
        headerName: t('standardCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'standardName',
        headerName: t('standardName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'scoreApplicable',
        headerName: t('scoreApplicable'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [t, isMultiColumnFilter, checkWorkflow],
  );

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.STANDARD_MASTER}
        titlePage={t('standardMaster')}
      >
        <PermissionCheck
          options={{
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.STANDARD_MASTER,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  history.push(AppRouteConst.STANDARD_MASTER_CREATE);
                }}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
                disabled={loading}
              >
                {t('buttons.createNew')}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <div className={styles.wrapTable}>
        <AGGridModule
          loading={loading}
          params={null}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          hasRangePicker
          columnDefs={columnDefs}
          dataFilter={null}
          moduleTemplate={MODULE_TEMPLATE.standardMaster}
          colDefProp={DEFAULT_COL_DEF_TYPE_FLEX_QA}
          fileName="Self-assessment_Standard Master"
          dataTable={dataTable}
          height="calc(100vh - 188px)"
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

export default StandardMasterContainer;
