import Tabs from 'antd/lib/tabs';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import queryString from 'query-string';
import { useLocation, useParams } from 'react-router-dom';
import ListSurveys from 'containers/technical/surveys/SurveysList';
import ListDryDocking from 'containers/technical/dry-docking/DryDockingList';
import MaintenanceTechnicalList from 'containers/technical/maintenance-technical/index';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import styles from './list.module.scss';

const TechnicalContainer = () => {
  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState<string>('surveys');
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const metadata = useVesselMetadata();

  const parsedQueries = useMemo(() => queryString.parse(search), [search]);

  const handleChangeTab = useCallback(
    (tabKey: string) => {
      const isEditMode = parsedQueries?.status?.toString();
      let toTab = `tab=technical&subTab=${tabKey}`;

      if (isEditMode) {
        toTab = `${toTab}&status=${isEditMode}`;
      }
      history.push(`${AppRouteConst.getSailGeneralReportById(id)}?${toTab}`);
    },
    [id, parsedQueries?.status],
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
        className=""
        onChange={handleChangeTab}
      >
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'surveys',
              })}
            >
              Surveys
            </div>
          }
          key="surveys"
        >
          <ListSurveys />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]:
                  activeTab === 'maintenance-technical-information',
              })}
            >
              Maintenance and Technical Information
            </div>
          }
          key="maintenance-technical-information"
        >
          <MaintenanceTechnicalList />
        </TabPane>
        <TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]: activeTab === 'dry-docking',
              })}
            >
              Dry Docking
            </div>
          }
          key="dry-docking"
        >
          <ListDryDocking />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TechnicalContainer;
