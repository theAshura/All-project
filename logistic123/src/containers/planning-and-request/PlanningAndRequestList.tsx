import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useDispatch, useSelector } from 'react-redux';
import Button, { ButtonSize } from 'components/ui/button/Button';
import cx from 'classnames';
import history from 'helpers/history.helper';
import { useEffect, useState } from 'react';
import images from 'assets/images/images';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import { useLocation } from 'react-router-dom';
import { ActivePermission, WorkFlowType } from 'constants/common.const';
import { AppRouteConst } from 'constants/route.const';
import queryString from 'query-string';

import { clearTemplateReducer } from 'store/template/template.action';
import useEffectOnce from 'hoc/useEffectOnce';
import Tabs from 'antd/lib/tabs';
import { PLANNING_TAB } from 'constants/components/planning.const';
import GraphicalPlanningComponent from 'components/planning-and-request/graphical-planning/GraphicalPlanning';
import CompletedTabComponent from 'components/planning-and-request/completed-tab';
import UnplannedTabComponent from 'components/planning-and-request/unplanned-tab';
import PlanningTabComponent from 'components/planning-and-request/planning-tab/index';
import Container from 'components/common/container/ContainerPage';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { LIST_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { getTotalUnplannedPlanningActions } from 'store/planning-and-request/planning-and-request.action';

import styles from './list.module.scss';

const { TabPane } = Tabs;

const PlanningAndRequestContainer = () => {
  const { search } = useLocation();

  const dispatch = useDispatch();

  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );
  const { loading, totalUnplannedPlanning } = useSelector(
    (state) => state.planningAndRequest,
  );
  const [activeTab, setActiveTab] = useState<string>(
    PLANNING_TAB.graphicalPlanning,
  );
  const [planningId, setPlanningId] = useState<string>('');

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionPar,
    modulePage: ModulePage.List,
  });

  useEffect(() => {
    if (search) {
      const parsed = queryString.parse(search);
      const activeValue =
        parsed?.tab?.toString() || PLANNING_TAB.graphicalPlanning;
      const id = parsed?.id?.toString() || '';
      setActiveTab(activeValue);
      setPlanningId(id);
    }
  }, [search]);

  useEffectOnce(() => {
    dispatch(getTotalUnplannedPlanningActions.request());
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.PLANNING_REQUEST,
        isRefreshLoading: false,
      }),
    );
    return () => {
      dispatch(clearTemplateReducer());
    };
  });

  return (
    <div className={styles.container}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.PLANNING}
        titlePage={renderDynamicLabel(
          dynamicLabels,
          LIST_PLANNING_DYNAMIC_FIELDS.Planning,
        )}
      >
        {activeTab !== PLANNING_TAB.graphicalPlanning && (
          <div>
            <div className="d-flex justify-content-end">
              {!planningId &&
                workFlowActiveUserPermission.includes(
                  ActivePermission.CREATOR,
                ) && (
                  <Button
                    onClick={() =>
                      history.push(AppRouteConst.PLANNING_AND_REQUEST_CREATE)
                    }
                    buttonSize={ButtonSize.Medium}
                    className={cx('button_create', styles.btnCreate)}
                    renderSuffix={
                      <img
                        src={images.icons.icAddCircle}
                        alt="createNew"
                        className={styles.icButton}
                      />
                    }
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      LIST_PLANNING_DYNAMIC_FIELDS['Create New'],
                    )}
                  </Button>
                )}
            </div>
          </div>
        )}
      </HeaderPage>

      <Tabs
        activeKey={activeTab}
        tabBarStyle={{ margin: '0 20px' }}
        onChange={(e) => {
          if (!loading) {
            switch (e) {
              case PLANNING_TAB.graphicalPlanning: {
                history.push(
                  `${AppRouteConst.PLANNING}?tab=${PLANNING_TAB.graphicalPlanning}`,
                );
                break;
              }
              case PLANNING_TAB.planning: {
                history.push(
                  `${AppRouteConst.PLANNING}?tab=${PLANNING_TAB.planning}`,
                );
                break;
              }
              case PLANNING_TAB.completed: {
                history.push(
                  `${AppRouteConst.PLANNING}?tab=${PLANNING_TAB.completed}`,
                );
                break;
              }
              case PLANNING_TAB.unplanned: {
                history.push(
                  `${AppRouteConst.PLANNING}?tab=${PLANNING_TAB.unplanned}`,
                );
                break;
              }
              default: {
                history.push(AppRouteConst.PLANNING);
              }
            }
          }
        }}
      >
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]:
                  activeTab === PLANNING_TAB.graphicalPlanning,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                LIST_PLANNING_DYNAMIC_FIELDS['Graphical planning'],
              )}
            </div>
          }
          key={PLANNING_TAB.graphicalPlanning}
        >
          <div className={styles.wrapContent}>
            <Container>
              <GraphicalPlanningComponent />
            </Container>
          </div>
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === PLANNING_TAB.planning,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                LIST_PLANNING_DYNAMIC_FIELDS.Planning,
              )}
            </div>
          }
          key={PLANNING_TAB.planning}
        >
          <div className={styles.wrapContent}>
            <PlanningTabComponent tab={activeTab} />
          </div>
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === PLANNING_TAB.completed,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                LIST_PLANNING_DYNAMIC_FIELDS.Completed,
              )}
            </div>
          }
          key={PLANNING_TAB.completed}
        >
          <div className={styles.wrapContent}>
            <CompletedTabComponent tab={activeTab} />
          </div>
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === PLANNING_TAB.unplanned,
              })}
            >
              {`${renderDynamicLabel(
                dynamicLabels,
                LIST_PLANNING_DYNAMIC_FIELDS.Unplanned,
              )} (${totalUnplannedPlanning
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')})`}
            </div>
          }
          key={PLANNING_TAB.unplanned}
        >
          <div className={styles.wrapContent}>
            <UnplannedTabComponent tab={activeTab} />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default PlanningAndRequestContainer;
