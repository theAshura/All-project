import Tabs from 'antd/lib/tabs';
import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import TechnicalList from 'containers/technical/TechnicalList';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import useEffectOnce from 'hoc/useEffectOnce';
import { useDispatch, useSelector } from 'react-redux';
import { getVesselDetailActions } from 'store/vessel/vessel.action';
// import images from 'assets/images/images';
import SafetyManagementList from 'containers/safety-management/SafetyManagement';
import styles from './list.module.scss';
import ListPlansAndDrawing from '../plans-and-drawings/list';
import ListInspections from '../inspections';
import './list-sail.scss';
import { SummaryContainer } from '../summary';
// import ListSafetyEngagement from '../safety-engagement';
// import FormRightShip from '../right-ship/FormRightShip';
import ShipParticularsSailReporting from '../ship-particular';

const DEFAULT_SUB_TAB_OF_TAB = {
  technical: 'surveys',
  'safety-management': 'incident',
  inspections: 'psc',
};

export default function SailGeneralReportContainer() {
  const { search } = useLocation();
  const { TabPane } = Tabs;
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const parsedQueries = useMemo(() => queryString.parse(search), [search]);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  // const ComingSoon = useMemo(
  //   () => (
  //     <div className={styles.dataWrapper}>
  //       <p>Coming Soon</p>
  //     </div>
  //   ),
  //   [],
  // );

  useEffect(() => {
    setActiveTab(parsedQueries?.tab?.toString() || 'summary');
  }, [parsedQueries]);

  const breadCrumbTab = useMemo(
    () => BREAD_CRUMB.SAIL_GENERAL_REPORT_DETAIL,
    [],
  );

  const handleChangeTab = useCallback(
    (tabKey: string) => {
      const isEditMode = parsedQueries?.subTab?.toString();
      let toTab = `tab=${tabKey}`;
      if (DEFAULT_SUB_TAB_OF_TAB[tabKey]) {
        toTab = `tab=${tabKey}&subTab=${DEFAULT_SUB_TAB_OF_TAB[tabKey]}`;
      }
      if (isEditMode) {
        toTab = `${toTab}&status=edit`;
      }
      history.push(`${AppRouteConst.getSailGeneralReportById(id)}?${toTab}`);
    },
    [id, parsedQueries?.subTab],
  );

  // const ChecklistTab = useMemo(
  //   () => (
  //     <div className={styles.checklist}>
  //       <img src={images.common.ChecklistQA1} alt="no data" />
  //     </div>
  //   ),
  //   [],
  // );

  useEffectOnce(() => {
    dispatch(getVesselDetailActions.request(id));
  });

  return (
    <div className={cx(styles.wrapper, 'wrapper_sail')}>
      <HeaderPage
        breadCrumb={breadCrumbTab}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.QuantityAssuranceSailingReportSailingGeneralReport,
        )}
      />
      <Tabs
        activeKey={activeTab}
        tabBarStyle={{ margin: '0 20px ', borderBottom: 'unset' }}
        onChange={handleChangeTab}
        destroyInactiveTabPane
      >
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'summary',
              })}
            >
              Summary
            </div>
          }
          key="summary"
        >
          <SummaryContainer />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'ship-particular',
              })}
            >
              Ship Particulars
            </div>
          }
          key="ship-particular"
        >
          <ShipParticularsSailReporting />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'technical',
              })}
            >
              Technical
            </div>
          }
          key="technical"
        >
          <TechnicalList />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'safety-management',
              })}
            >
              Safety Management
            </div>
          }
          key="safety-management"
        >
          <SafetyManagementList />
        </TabPane>

        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'plans-and-drawings',
              })}
            >
              Plans and Drawings
            </div>
          }
          key="plans-and-drawings"
        >
          <ListPlansAndDrawing activeTab={activeTab} />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'inspections',
              })}
            >
              Inspections
            </div>
          }
          key="inspections"
        >
          <ListInspections />
        </TabPane>
        {/* <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'crewing',
              })}
            >
              Crewing
            </div>
          }
          key="crewing"
        >
          {ComingSoon}
        </TabPane> */}
        {/* <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'operations',
              })}
            >
              Operations
            </div>
          }
          key="operations"
        >
          {ComingSoon}
        </TabPane> */}

        {/* <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'checklist',
              })}
            >
              Checklist
            </div>
          }
          key="checklist"
        >
          {ChecklistTab}
        </TabPane> */}

        {/* <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'others',
              })}
            >
              Others
            </div>
          }
          key="others"
        >
          {ComingSoon}
        </TabPane> */}
        {/* <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'safety-engagement',
              })}
            >
              Safety Engagement
            </div>
          }
          key="safety-engagement"
        >
          <ListSafetyEngagement />
        </TabPane> */}
      </Tabs>
    </div>
  );
}
