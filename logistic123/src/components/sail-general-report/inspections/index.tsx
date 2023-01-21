import Tabs from 'antd/lib/tabs';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import queryString from 'query-string';
import { useLocation, useParams } from 'react-router-dom';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import ListPortStateControls from './port-state-control/list';
import styles from './list.module.scss';
import ListOtherInspectionAudit from './other-inspections-and-audits/list';

export enum TAB_PANE_NAME_INSPECTION {
  PSC = 'psc',
  OTHER_INSPECTIONS_AUDIT = 'other-inspections-audit',
}

export default function ListInspections() {
  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState<string>('psc');
  const { search } = useLocation();
  const { id } = useParams<{ id: string }>();
  const metadata = useVesselMetadata();

  const parsedQueries = useMemo(() => queryString.parse(search), [search]);

  const handleChangeTab = useCallback(
    (tabKey: string) => {
      const isEditMode = parsedQueries?.subTab?.toString();
      let toTab = `tab=inspections&subTab=${tabKey}`;

      if (isEditMode) {
        toTab = `${toTab}&status=edit`;
      }
      history.push(`${AppRouteConst.getSailGeneralReportById(id)}?${toTab}`);
    },
    [id, parsedQueries?.subTab],
  );

  useEffect(() => {
    setActiveTab(parsedQueries?.subTab?.toString() || 'surveys');
  }, [parsedQueries]);

  return (
    <div className={cx('card-container', styles.wrapper)}>
      {metadata}
      <Tabs
        activeKey={activeTab}
        tabBarStyle={{
          margin: '0 20px ',
          borderBottom: 'unset',
          border: 'none',
        }}
        onChange={handleChangeTab}
      >
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === TAB_PANE_NAME_INSPECTION.PSC,
              })}
            >
              Port State Control
            </div>
          }
          key={TAB_PANE_NAME_INSPECTION.PSC}
        >
          <ListPortStateControls activeTab={activeTab} />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]:
                  activeTab ===
                  TAB_PANE_NAME_INSPECTION.OTHER_INSPECTIONS_AUDIT,
              })}
            >
              Other Inspections/Audits
            </div>
          }
          key={TAB_PANE_NAME_INSPECTION.OTHER_INSPECTIONS_AUDIT}
        >
          <ListOtherInspectionAudit />
        </TabPane>
      </Tabs>
    </div>
  );
}
