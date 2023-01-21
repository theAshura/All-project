import Tabs from 'antd/lib/tabs';
import images from 'assets/images/images';
import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { WorkflowConfigType } from 'constants/components/workflow-config.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { WORK_FLOW_FIELDS_LIST } from 'constants/dynamic/work-flow.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import history from 'helpers/history.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import PermissionCheck from 'hoc/withPermissionCheck';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getListWorkFlowActions } from 'store/work-flow/work-flow.action';
import ListWorkFlow from './List';
import styles from './list.module.scss';

export default function WorkFlowContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState<string>('Vessel');

  useEffect(() => {
    const params =
      search.substring(1, search.length) || WorkflowConfigType.Planning;
    setActiveTab(params);
    dispatch(
      getListWorkFlowActions.request({
        pageSize: -1,
        workflowType: params?.replaceAll('-', ' '),
        tabKey: params,
      }),
    );
  }, [dispatch, search]);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonWorkflowConfiguration,
    modulePage: ModulePage.List,
  });

  // render
  return (
    <div className={styles.workFlow}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.WORK_FLOW}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonWorkflowConfiguration,
        )}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  history.push(AppRouteConst.WORK_FLOW_CREATE);
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
                {renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_LIST['Create New'],
                )}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <Tabs
        activeKey={activeTab}
        tabBarStyle={{ margin: '0 20px ', borderBottom: 'unset' }}
        onChange={(tabKey: string) => {
          history.push(`${AppRouteConst.WORK_FLOW}?${tabKey}`);
        }}
      >
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === WorkflowConfigType.Planning,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_LIST.Planning,
              )}
            </div>
          }
          key={WorkflowConfigType.Planning}
        >
          <div className={styles.wrapTabPane}>
            <ListWorkFlow tab={WorkflowConfigType.Planning} />
          </div>
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]:
                  activeTab === WorkflowConfigType.AuditChecklist,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_LIST['Inspection checklist template'],
              )}
            </div>
          }
          key={WorkflowConfigType.AuditChecklist}
        >
          <div className={styles.wrapTabPane}>
            <ListWorkFlow tab={WorkflowConfigType.AuditChecklist} />
          </div>
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]:
                  activeTab === WorkflowConfigType.ReportFinding,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_LIST['Report of finding'],
              )}
            </div>
          }
          key={WorkflowConfigType.ReportFinding}
        >
          <div className={styles.wrapTabPane}>
            <ListWorkFlow tab={WorkflowConfigType.ReportFinding} />
          </div>
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]:
                  activeTab === WorkflowConfigType.InternalAuditReport,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_LIST['Inspection report'],
              )}
            </div>
          }
          key={WorkflowConfigType.InternalAuditReport}
        >
          <div className={styles.wrapTabPane}>
            <ListWorkFlow tab={WorkflowConfigType.InternalAuditReport} />
          </div>
        </TabPane>

        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === WorkflowConfigType.CarCap,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_LIST['CAR/CAP'],
              )}
            </div>
          }
          key={WorkflowConfigType.CarCap}
        >
          <div className={styles.wrapTabPane}>
            <ListWorkFlow tab={WorkflowConfigType.CarCap} />
          </div>
        </TabPane>

        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]:
                  activeTab === WorkflowConfigType.SelfAssessment,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_LIST['Self assessment'],
              )}
            </div>
          }
          key={WorkflowConfigType.SelfAssessment}
        >
          <div className={styles.wrapTabPane}>
            <ListWorkFlow tab={WorkflowConfigType.SelfAssessment} />
          </div>
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === WorkflowConfigType.Incidents,
              })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_LIST.Incidents,
              )}
            </div>
          }
          key={WorkflowConfigType.Incidents}
        >
          <div className={styles.wrapTabPane}>
            <ListWorkFlow tab={WorkflowConfigType.Incidents} />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
