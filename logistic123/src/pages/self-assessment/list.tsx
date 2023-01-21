import { ColumnApi } from 'ag-grid-community';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import images from 'assets/images/images';
import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import styles from 'components/list-common.module.scss';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { ActivePermission, WorkFlowType } from 'constants/common.const';
import {
  DATA_SPACE,
  DATE_DEFAULT,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import { TYPE_CUSTOM_RANGE } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import {
  formatDateLocalNoTime,
  formatDateLocalWithTime,
} from 'helpers/date.helper';
import { handleFilterParams } from 'helpers/filterParams.helper';
import history from 'helpers/history.helper';
import { dateStringComparator } from 'helpers/utils.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import PermissionCheck from 'hoc/withPermissionCheck';
import capitalize from 'lodash/capitalize';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import {
  getListSelfAssessmentActions,
  setDataFilterAction,
} from './store/action';
import { SELF_ASSESSMENT_STEPS } from './utils/constant';
// import { checkHideEditSelfAssessmentButton } from './utils/functions';
import { SelfAssessmentDetailResponse } from './utils/model';

const SelfAssessmentPageList = () => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);
  const dispatch = useDispatch();
  const { loading, listSelfAssessment, params, dataFilter } = useSelector(
    (state) => state.selfAssessment,
  );
  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

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
          `${AppRouteConst.SELF_ASSESSMENT_DETAIL}/${id}?${SELF_ASSESSMENT_STEPS.standardAndMatrix}`,
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
          `${AppRouteConst.SELF_ASSESSMENT_DETAIL}/${id}?${SELF_ASSESSMENT_STEPS.standardAndMatrix}`,
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
    ],
  );

  const editDetail = useCallback((id?: string) => {
    history.push(
      `${AppRouteConst.SELF_ASSESSMENT_DETAIL}/${id}?${SELF_ASSESSMENT_STEPS.standardAndMatrix}&edit`,
    );
  }, []);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListSelfAssessmentActions.request({ ...newParams, pageSize: -1 }),
      );
    },
    [dispatch],
  );

  const checkWorkflow = useCallback(
    (item: SelfAssessmentDetailResponse): Action[] => {
      // const shouldHideEditButton = checkHideEditSelfAssessmentButton(
      //   item,
      //   workFlowActiveUserPermission,
      // );
      const createdAssignmentPermission = userInfo?.id === item?.createdUserId;
      const reviewerAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.REVIEWER,
        item?.userAssignments,
      );

      const publisherAssignmentPermission = checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.PUBLISHER,
        item?.userAssignments,
      );
      const shouldEditButton =
        // !shouldHideEditButton &&
        publisherAssignmentPermission ||
        (createdAssignmentPermission && item?.status === 'Open') ||
        (reviewerAssignmentPermission && item?.status !== 'Closed');
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => viewDetail(item?.id),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SELF_ASSESSMENT,
          buttonType: ButtonType.Blue,
          cssClass: 'me-1',
        },
        {
          img: images.icons.table.icNewTab,
          function: () => viewDetail(item?.id, true),
          feature: Features.QUALITY_ASSURANCE,
          subFeature: SubFeatures.SELF_ASSESSMENT,
          buttonType: ButtonType.Green,
        },
      ];
      const editAction = {
        img: images.icons.icEdit,
        function: () => editDetail(item?.id),
        feature: Features.QUALITY_ASSURANCE,
        subFeature: SubFeatures.SELF_ASSESSMENT,
        cssClass: 'me-1',
      };
      if (shouldEditButton) {
        actions.splice(1, 0, editAction);
      }
      return actions;
    },
    [editDetail, userInfo?.id, viewDetail],
  );

  const dataTable = useMemo(() => {
    if (!listSelfAssessment?.data) {
      return [];
    }
    return listSelfAssessment?.data?.map((item) => ({
      standard: item?.standardMaster?.code || DATA_SPACE,
      standardName: item?.standardMaster?.name || DATA_SPACE,
      type: item?.type || DATA_SPACE,
      lastExternalSubmission: item?.lastExternalSubmission
        ? formatDateLocalNoTime(item?.lastExternalSubmission)
        : DATA_SPACE,
      companyName: item?.company?.name || DATA_SPACE,
      createdUser: item?.createdUser.username || DATA_SPACE,
      createdDate: item?.createdAt
        ? formatDateLocalWithTime(item?.createdAt)
        : DATA_SPACE,
      updatedUser: item?.updatedUser?.username || DATA_SPACE,
      updatedDate:
        item?.updatedUser?.username && item?.updatedAt
          ? formatDateLocalWithTime(item?.updatedAt)
          : DATA_SPACE,
      selfAssessmentStatus: item?.selfAssessmentStatus
        ? capitalize(item?.selfAssessmentStatus)
        : DATA_SPACE,
      inspectionType: item?.inspectionType?.name || DATA_SPACE,
      createdUserId: item?.createdUserId,
      authority: item?.authority?.name || DATA_SPACE,
      sno: item?.sNo || DATA_SPACE,
      status: item?.status || DATA_SPACE,
      id: item?.id,
      userAssignments: item?.userAssignments,
    }));
  }, [listSelfAssessment?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('table.action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
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
        field: 'standard',
        headerName: t('table.standard'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'standardName',
        headerName: t('table.standardName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'type',
        headerName: t('table.type'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'lastExternalSubmission',
        headerName: t('table.lastExternalSubmission'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'companyName',
        headerName: t('table.companyName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: t('table.createdUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdDate',
        headerName: t('table.createdDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedUser',
        headerName: t('table.updatedUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedDate',
        headerName: t('table.updatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'selfAssessmentStatus',
        headerName: t('table.selfAssessmentStatus'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      // {
      //   field: 'inspectionType',
      //   headerName: t('table.inspectionType'),
      //   filter: isMultiColumnFilter
      //     ? 'agMultiColumnFilter'
      //     : 'agTextColumnFilter',
      // },
      // {
      //   field: 'authority',
      //   headerName: t('table.authority'),
      //   filter: isMultiColumnFilter
      //     ? 'agMultiColumnFilter'
      //     : 'agTextColumnFilter',
      // },
      {
        field: 'sno',
        headerName: t('table.sno'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('table.status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
    ],
    [checkWorkflow, isMultiColumnFilter, t],
  );

  useEffectOnce(() => {
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.SELF_ASSESSMENT,
        isRefreshLoading: false,
      }),
    );
  });

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.SELF_ASSESSMENT}
        titlePage={t('selfAssessmentList')}
      >
        <PermissionCheck
          options={{
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.SELF_ASSESSMENT,
          }}
        >
          {({ hasPermission }) =>
            hasPermission &&
            workFlowActiveUserPermission.includes(ActivePermission.CREATOR) && (
              <Button
                onClick={() => {
                  history.push(
                    `${AppRouteConst.SELF_ASSESSMENT_CREATE}?${SELF_ASSESSMENT_STEPS.standardAndMatrix}`,
                  );
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
              >
                {t('createNew')}
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
          moduleTemplate={MODULE_TEMPLATE.selfAssessmentTemplate}
          fileName="Self-assessment_Self-assessment List"
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

export default SelfAssessmentPageList;
