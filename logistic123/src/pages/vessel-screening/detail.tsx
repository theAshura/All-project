import { useCallback, useEffect, useMemo, useState } from 'react';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { useLocation, useParams } from 'react-router-dom';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import Tabs from 'antd/lib/tabs';
import queryString from 'query-string';
import PermissionCheck from 'hoc/withPermissionCheck';
import images from 'assets/images/images';
import { useDispatch, useSelector } from 'react-redux';
import { getVesselDetailActions } from 'store/vessel/vessel.action';
import ListRightShip from 'pages/vessel-screening/forms/right-ship/ListRightShip';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { getCurrentModulePageByStatus } from 'helpers/dynamic.helper';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import styles from './create.module.scss';
import TabSummary from './tabs/summary';
import TabTechnical from './tabs/technical';
import TabSafetyManagement from './tabs/safety-management';
import TabInspections from './tabs/inspections';
import TabBasicManagement from './tabs/basic-info';
import TabShipParticulars from './tabs/ship-particulars';
import VesselScreeningProvider from './VesselScreeningContext';
import { isEditMode } from './utils/functions';
import './custom-tabs.scss';
import { getVesselScreeningDetailActions } from './store/action';
// import TabOperatorProfile from './tabs/operator-profile';
// import TabChecklist from './tabs/checklist';
// import TabSafetyEngagement from './tabs/safety-engagement';
import { clearSummaryObjectsReducer } from './store/vessel-summary.action';
// import TabOperations from './tabs/operations';
// import TabCrewing from './tabs/crewing';
import TabPilotTerminalFeedback from './tabs/pilot-terminal-feedback';

const DEFAULT_SUBTAB_OF_TAB = {
  technical: 'surveys',
  'safety-management': 'incident',
  inspections: 'port-state-control',
};

const PageVesselScreeningDetail = () => {
  const { t } = useTranslation(I18nNamespace.VESSEL_SCREENING);
  const { search, pathname } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { TabPane } = Tabs;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>('summary');
  const { vesselScreeningDetail } = useSelector(
    (store) => store.vesselScreening,
  );
  const isEditVessel = isEditMode(pathname);

  const dynamicLabels = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.QuantityAssuranceVesselScreeningVesselScreening,
    modulePage: getCurrentModulePageByStatus(isEditVessel, false),
  });

  const backToList = useCallback(() => {
    history.push(AppRouteConst.VESSEL_SCREENING);
  }, []);

  const { record } = useMemo(() => queryString.parse(search), [search]);

  const handleChangeTab = useCallback(
    (tabKey: string) => {
      const vesselStatus = isEditVessel ? 'edit' : 'detail';
      let toTab = `tab=${tabKey}`;
      if (DEFAULT_SUBTAB_OF_TAB[tabKey]) {
        toTab = `tab=${tabKey}&subTab=${DEFAULT_SUBTAB_OF_TAB[tabKey]}`;
      }
      history.push(
        `${AppRouteConst.VESSEL_SCREENING}/${vesselStatus}/${id}?${toTab}`,
      );
    },
    [id, isEditVessel],
  );

  const parsedQueries = useMemo(() => queryString.parse(search), [search]);

  useEffect(() => {
    setActiveTab(parsedQueries?.tab?.toString() || 'summary');
  }, [parsedQueries?.tab]);

  useEffect(() => {
    dispatch(getVesselScreeningDetailActions.request(id));
    return () => {
      dispatch(getVesselScreeningDetailActions.success(null));
      dispatch(clearSummaryObjectsReducer());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (vesselScreeningDetail?.vesselId) {
      dispatch(getVesselDetailActions.request(vesselScreeningDetail?.vesselId));
    }
  }, [dispatch, vesselScreeningDetail?.vesselId]);

  // const ComingSoon = useMemo(
  //   () => (
  //     <div className={styles.dataWrapper}>
  //       <p>Coming Soon</p>
  //     </div>
  //   ),
  //   [],
  // );

  const renderBackAndEditButtons = useMemo(() => {
    if (isEditVessel || record) {
      return null;
    }

    return (
      <div className="d-flex align-items-center">
        {!isEditVessel && (
          <PermissionCheck
            options={{
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
              action: ActionTypeEnum.VIEW,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <>
                  <WatchListManagement
                    dynamicLabels={dynamicLabels}
                    referenceId={vesselScreeningDetail?.id}
                    referenceRefId={vesselScreeningDetail?.requestNo}
                    referenceModuleName={WatchlistModuleEnum.VESSEL_SCREENING}
                  />
                  <Button
                    className={cx('me-2', styles.buttonFilter)}
                    buttonType={ButtonType.CancelOutline}
                    onClick={backToList}
                  >
                    <span className="pe-2">Back</span>
                  </Button>
                </>
              )
            }
          </PermissionCheck>
        )}
        {!isEditVessel && (
          <PermissionCheck
            options={{
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
              action: ActionTypeEnum.UPDATE,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <Button
                  onClick={() => {
                    let url = `${AppRouteConst.VESSEL_SCREENING}/edit/${id}?tab=${activeTab}`;
                    if (parsedQueries?.subTab) {
                      url = `${AppRouteConst.VESSEL_SCREENING}/edit/${id}?tab=${activeTab}&subTab=${parsedQueries?.subTab}`;
                    }
                    history.push(url);
                  }}
                  buttonSize={ButtonSize.Medium}
                  renderSuffix={
                    <img
                      src={images.icons.icEdit}
                      alt="edit"
                      className={styles.icEdit}
                    />
                  }
                >
                  {t('buttons.edit')}&nbsp;&nbsp;
                </Button>
              )
            }
          </PermissionCheck>
        )}
      </div>
    );
  }, [
    activeTab,
    backToList,
    dynamicLabels,
    id,
    isEditVessel,
    parsedQueries?.subTab,
    record,
    t,
    vesselScreeningDetail?.id,
    vesselScreeningDetail?.requestNo,
  ]);

  return (
    <div className="vessel-screening_wrapper">
      <VesselScreeningProvider isEditVessel={isEditVessel}>
        <div
          className={cx(styles.wrapHeader, 'd-flex justify-content-between')}
        >
          <div className={cx(styles.headers)}>
            <BreadCrumb
              current={
                isEditVessel
                  ? BREAD_CRUMB.VESSEL_SCREENING_EDIT
                  : BREAD_CRUMB.VESSEL_SCREENING_DETAIL
              }
            />
            <div className={cx('fw-bold', styles.title)}>
              {t('vesselScreening')}
            </div>
          </div>
          {renderBackAndEditButtons}
        </div>
        <Tabs
          activeKey={activeTab}
          tabBarStyle={{
            margin: '0',
            padding: '0 20px',
            borderBottom: 'unset',
          }}
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
            <TabSummary />
          </TabPane>
          <TabPane
            tab={
              <div
                className={cx(styles.tableTabTitle, {
                  [styles.activeTab]: activeTab === 'basic-info',
                })}
              >
                Basic Info
              </div>
            }
            key="basic-info"
          >
            <TabBasicManagement />
          </TabPane>
          <TabPane
            tab={
              <div
                className={cx(styles.tableTabTitle, {
                  [styles.activeTab]: activeTab === 'ship-particulars',
                })}
              >
                Ship Particulars
              </div>
            }
            key="ship-particulars"
          >
            <TabShipParticulars />
          </TabPane>

          {/* <TabPane
            tab={
              <div
                className={cx(styles.tableTabTitle, {
                  [styles.activeTab]: activeTab === 'operator-profile',
                })}
              >
                Operator Profile
              </div>
            }
            key="operator-profile"
          >
            <TabOperatorProfile />
          </TabPane> */}
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
            <TabTechnical />
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
            <TabSafetyManagement />
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
            <TabInspections />
          </TabPane>
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
            <TabSafetyEngagement />
          </TabPane> */}
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
            <TabCrewing />
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
            <TabOperations />
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
            <TabChecklist />
          </TabPane> */}
          {/* <TabPane
            tab={
              <div
                className={cx(styles.tableTabTitle, {
                  [styles.activeTab]: activeTab === 'right-ship',
                })}
              >
                Right Ship
              </div>
            }
            key="right-ship"
          >
            {ComingSoon}
          </TabPane> */}
          <TabPane
            tab={
              <div
                className={cx(styles.tableTabTitle, {
                  [styles.activeTab]: activeTab === 'pilot-terminal-feedback',
                })}
              >
                Pilot Feedback
              </div>
            }
            key="pilot-terminal-feedback"
          >
            <TabPilotTerminalFeedback />
          </TabPane>
          <TabPane
            tab={
              <div
                className={cx(styles.tableTabTitle, {
                  [styles.activeTab]: activeTab === 'pilot-terminal-feedback',
                })}
              >
                Right Ship
              </div>
            }
            key="right-ship"
          >
            <ListRightShip />
          </TabPane>
        </Tabs>
      </VesselScreeningProvider>
    </div>
  );
};

export default PageVesselScreeningDetail;
