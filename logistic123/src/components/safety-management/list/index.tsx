import Tabs from 'antd/lib/tabs';
import cx from 'classnames';
import queryString from 'query-string';

import { AppRouteConst } from 'constants/route.const';
import ListIncident from 'containers/safety-management/incident';
import ListInjuriesAndSMS from 'containers/safety-management/injuries-and-sms';
import history from 'helpers/history.helper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import styles from './list.module.scss';

export default function SafetyManagementContainer() {
  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState<string>('incident');
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const metadata = useVesselMetadata();

  const parsedQueries = useMemo(() => queryString.parse(search), [search]);

  const handleChangeTab = useCallback(
    (tabKey: string) => {
      const isEditMode = parsedQueries?.status?.toString();
      let toTab = `tab=safety-management&subTab=${tabKey}`;

      if (isEditMode) {
        toTab = `${toTab}&status=${isEditMode}`;
      }
      history.push(`${AppRouteConst.getSailGeneralReportById(id)}?${toTab}`);
    },
    [id, parsedQueries?.status],
  );

  useEffect(() => {
    setActiveTab(parsedQueries?.subTab?.toString() || 'incident');
  }, [parsedQueries?.subTab]);

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
                [styles.activeTab]: activeTab === 'incident',
              })}
            >
              Incidents
            </div>
          }
          key="incident"
        >
          <ListIncident />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'injuries-sms',
              })}
            >
              Injuries and Other SMS Records
            </div>
          }
          key="injuries-sms"
        >
          <ListInjuriesAndSMS />
        </TabPane>
      </Tabs>
    </div>
  );
}
