import { useCallback, useState } from 'react';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import images from 'assets/images/images';
import { ModalType } from 'components/ui/modal/Modal';
import { AppRouteConst } from 'constants/route.const';
import { openNewPage } from 'helpers/utils.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import {
  getBlacklistedVesselActions,
  getCompanyOverviewTaskActions,
  getInspectionPlanActions,
  getVesselSafetyScoreActions,
  getVesselHasRestrictedActions,
} from 'store/dashboard/dashboard.action';
import {
  IVesselGHGRating,
  IVesselRemainingValidity,
} from 'models/api/dashboard/dashboard.model';
import {
  RIOTINTO_ID,
  RIOTINTO_UAT_ID,
} from 'store/authenticate/authenticate.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import VesselAgeBarChart from '../components/chart/vesselAgeBarChart/VesselAgeBarChart';
import styles from './dashboard-master.module.scss';
import StatisticCard from '../components/chart/statisticCard/StatisticCard';
import { restrictedVesselColumn, validityColumn } from './mockData';
import OutStandingIssue from './components/OutStandingIssue';
import TrendsOfOutstandingIssue from './components/TrendsOfOutstandingIssue';
import DynamicDoughNutMasterCard, {
  MasterDoughnutCardType,
} from '../components/chart/dynamicDoughnutCard/DynamicDoughNutMasterCard';
import './components/dashboard-master.scss';
import { ColumnsDefinition } from './columns-def';
import ModalTableAGGrid from '../components/modal/ModalTableAGGrid';
import InspectionOverview from './components/inspection-overview/InspectionOverview';
import IncidentsOverview from './components/incidents-overview/IncidentsOverview';

// import OpenTask from './components/OpenTask';

enum ModalTabType {
  SAFETY_SCORE = 'SAFETY_SCORE',
  GHO_RATING = 'GHO_RATING',
  INSPECTION_PLAN = 'INSPECTION_PLAN',
  RESTRICTED = 'RESTRICTED',
  MOU = 'MOU',
  VALIDITY = 'VALIDITY',
  HIDDEN = 'HIDDEN',
}

const DashBoardMasterContainer = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const {
    companyVesselSafetyScore,
    companyInspectionPlan,
    companyBlacklistedVessel,
    vesselGHGRating,
    vesselLastInspection,
    vesselHasRestricted,
  } = useSelector((state) => state.dashboard);

  const [modal, setModal] = useState<ModalTabType>(ModalTabType.HIDDEN);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const handleViewMore = useCallback((modalType: ModalTabType) => {
    setModal(modalType);
  }, []);

  const handleClickHighLightTextModal = useCallback(
    (columnData, clickedKey?: string, valueStrArray?: string) => {
      switch (clickedKey) {
        case 'imo':
          if (columnData.id) {
            openNewPage(AppRouteConst.getVesselById(columnData.id));
          }
          break;
        case 'planRef':
          openNewPage(AppRouteConst.getPlanningAndRequestById(columnData?.id));
          break;
        default:
          break;
      }
    },
    [],
  );

  const renderModalTable = useCallback(() => {
    let title = '';
    let columns = [];
    let dataSource = [];
    let totalRecord = 0;
    let moduleTemplate = '';
    let fileName = '';
    let aggridId = '';
    let w = '';

    if (modal === ModalTabType.HIDDEN) {
      return null;
    }
    switch (modal) {
      case ModalTabType.SAFETY_SCORE:
        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Total number of vessels with Safety Score = N/A,0,1,2,3,4,5'
          ],
        );
        columns = ColumnsDefinition(
          dynamicLabels,
          isMultiColumnFilter,
          handleClickHighLightTextModal,
          'safetyScore',
        );
        fileName = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Total number of vessels with Safety Score = N/A,0,1,2,3,4,5'
          ],
        );
        aggridId = 'ag-grid-table-1';
        w = '1200px';
        moduleTemplate = MODULE_TEMPLATE.companyVesselSafetyScoreTemplate;
        dataSource = companyVesselSafetyScore?.vesselSafetyScores
          .map((score) => ({
            vesselName: score.name,
            imo: score.imoNumber,
            vesselType: score?.vesselType?.name,
            safetyScore:
              score?.rightShip?.safetyScore &&
              score?.rightShip?.safetyScore !== 'None'
                ? score?.rightShip?.safetyScore
                : 'N/A',
            businessDivision: score.divisionMapping?.division?.name || '',
            id: score.id,
          }))
          .sort(
            (value, compareValue) =>
              parseInt(compareValue.safetyScore, 10) -
              parseInt(value.safetyScore, 10),
          );

        totalRecord = companyVesselSafetyScore?.vesselSafetyScores.length;

        break;
      case ModalTabType.GHO_RATING:
        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessels with GHG Rating from A to E'],
        );
        columns = ColumnsDefinition(
          dynamicLabels,
          isMultiColumnFilter,
          handleClickHighLightTextModal,
          'ghgRating',
        );
        fileName = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessels with GHG Rating from A to E'],
        );
        moduleTemplate = MODULE_TEMPLATE.vesselGHGRatingTemplate;
        aggridId = 'ag-grid-table-2';
        w = '1200px';
        dataSource = vesselGHGRating?.vesselGHGRating
          .map((item: IVesselGHGRating) => ({
            vesselName: item.name,
            imo: item.imoNumber,
            vesselType: item.vesselType.name,
            ghgRating: item.rightShip.ghgRating,
            businessDivision: item?.divisionMapping?.division?.name || '',
            id: item.id,
          }))
          .sort((a, b) => (a.ghgRating > b.ghgRating ? 1 : -1));
        totalRecord = vesselGHGRating?.vesselGHGRating.length;
        break;
      case ModalTabType.INSPECTION_PLAN:
        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessels under inspection'],
        );
        columns = ColumnsDefinition(
          dynamicLabels,
          isMultiColumnFilter,
          handleClickHighLightTextModal,
          'vesselUnderInspection',
        );
        aggridId = 'ag-grid-table-3';
        w = '1200px';
        moduleTemplate = MODULE_TEMPLATE.companyInspectionPlanTemplate;
        fileName = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessels under inspection'],
        );
        dataSource = companyInspectionPlan?.planningUnderInspection?.map(
          (plan) => ({
            vesselName: plan.name,
            imo: plan.imoNumber,
            vesselType: plan.vesselType.name,
            planRef: plan.planningRequests.map((request) => request.refId),
            businessDivision: plan.divisionMapping?.division?.name || '',
            id: plan.id,
            planPopup: plan.planningRequests,
          }),
        );
        totalRecord = companyInspectionPlan?.planningUnderInspection.length;
        break;
      case ModalTabType.RESTRICTED:
        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessels are "Customer restricted"'],
        );
        columns = restrictedVesselColumn;
        aggridId = 'ag-grid-table-4';
        columns = ColumnsDefinition(
          dynamicLabels,
          isMultiColumnFilter,
          handleClickHighLightTextModal,
        );
        moduleTemplate = MODULE_TEMPLATE.vesselHasRestrictedTemplate;
        fileName = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessels are "Customer Restricted"'],
        );
        w = '1200px';
        dataSource = vesselHasRestricted.map((vessel) => ({
          vesselName: vessel.name,
          imo: vessel.imoNumber,
          vesselType: vessel.vesselType.name,
          businessDivision: vessel.divisionMapping?.division?.name || '',
          id: vessel.id,
        }));
        totalRecord = vesselHasRestricted.length;
        break;
      case ModalTabType.MOU:
        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Vessels are blacklisted on MOU websites'
          ],
        );
        columns = restrictedVesselColumn;
        columns = ColumnsDefinition(
          dynamicLabels,
          isMultiColumnFilter,
          handleClickHighLightTextModal,
        );
        w = '1200px';
        moduleTemplate = MODULE_TEMPLATE.companyBlacklistedVesselTemplate;
        fileName = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Vessels are blacklisted on MOU websites'
          ],
        );
        aggridId = 'ag-grid-table-5';
        dataSource = companyBlacklistedVessel.map((vessel) => ({
          vesselName: vessel.name,
          imo: vessel.imoNumber,
          vesselType: vessel.vesselType.name,
          businessDivision: vessel.divisionMapping?.division?.name || '',
          id: vessel.id,
        }));
        totalRecord = companyBlacklistedVessel.length;
        break;
      case ModalTabType.VALIDITY:
        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Vessels with last inspection validity < 90 days'
          ],
        );
        columns = validityColumn;
        columns = ColumnsDefinition(
          dynamicLabels,
          isMultiColumnFilter,
          handleClickHighLightTextModal,
          'validity',
        );
        aggridId = 'ag-grid-table-6';
        moduleTemplate = MODULE_TEMPLATE.vesselRemainingValidity90sTemplate;
        fileName = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Vessels with last inspection validity < 90 days'
          ],
        );
        w = '1200px';
        dataSource = vesselLastInspection?.vesselRemainingValidity90s
          .map((item: IVesselRemainingValidity) => ({
            vesselName: item.name,
            imo: item.imoNumber,
            vesselType: item.vesselType.name,
            businessDivision: item.divisionMapping?.division?.name || '',
            validity: item.rightShip.validityRemaining,
            id: item.id,
          }))
          .sort((a, b) => (a.validity > b.validity ? 1 : -1));
        totalRecord = vesselLastInspection?.vesselRemainingValidity90s.length;
        break;
      default:
        break;
    }

    return (
      <ModalTableAGGrid
        scroll={{ x: 'max-content', y: 265 }}
        isOpen
        dataSource={dataSource}
        toggle={() => setModal(ModalTabType.HIDDEN)}
        columns={columns}
        moduleTemplate={moduleTemplate}
        fileName={fileName}
        title={title}
        total={totalRecord}
        aggridId={aggridId}
        w={w}
        titleClasseName={styles.customTableModalTitle}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        handleClick={(data, dataIndex, keyStrInArray) => {
          handleClickHighLightTextModal(data, dataIndex, keyStrInArray);
        }}
        modalType={ModalType.LARGE}
        dynamicLabels={dynamicLabels}
      />
    );
  }, [
    modal,
    dynamicLabels,
    isMultiColumnFilter,
    handleClickHighLightTextModal,
    companyVesselSafetyScore?.vesselSafetyScores,
    vesselGHGRating?.vesselGHGRating,
    companyInspectionPlan?.planningUnderInspection,
    vesselHasRestricted,
    companyBlacklistedVessel,
    vesselLastInspection?.vesselRemainingValidity90s,
  ]);

  useEffectOnce(() => {
    dispatch(getCompanyOverviewTaskActions.request({}));
    dispatch(getVesselSafetyScoreActions.request());
    dispatch(getInspectionPlanActions.request());
    dispatch(getBlacklistedVesselActions.request());
    dispatch(getVesselHasRestrictedActions.request());
  });

  return (
    <div>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.DASHBOARD_MASTER}
        titlePage={
          userInfo?.company?.id === RIOTINTO_ID ||
          userInfo?.company?.id === RIOTINTO_UAT_ID
            ? renderDynamicLabel(
                dynamicLabels,
                MAIN_DASHBOARD_DYNAMIC_FIELDS[
                  'SAIL Dashboard - Rio Tinto Marine Services'
                ],
              )
            : renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.Dashboard,
              )
        }
      />
      <div className={styles.container}>
        <Row gutter={[16, 0]} className="mb-4">
          <Col span={8} className="d-flex flex-column">
            <DynamicDoughNutMasterCard
              cardType={MasterDoughnutCardType.VESSEL_RISK_RATING}
            />
          </Col>

          <Col span={8} className="d-flex flex-column">
            <DynamicDoughNutMasterCard
              cardType={MasterDoughnutCardType.POTENTIAL_RISK}
            />
          </Col>

          <Col span={8} className="d-flex flex-column">
            <DynamicDoughNutMasterCard
              cardType={MasterDoughnutCardType.OBSERVED_RISK}
            />
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col span={8} className="d-flex flex-column">
            <DynamicDoughNutMasterCard
              key={MasterDoughnutCardType.VESSEL_SAFETY_SCORE}
              handleViewMore={() => handleViewMore(ModalTabType.SAFETY_SCORE)}
              cardType={MasterDoughnutCardType.VESSEL_SAFETY_SCORE}
              displayFooterStatistic
              layoutMinHeight={false}
            />
          </Col>

          <Col span={8} className="d-flex flex-column">
            <DynamicDoughNutMasterCard
              key={MasterDoughnutCardType.VESSEL_GHG_SCORE}
              handleViewMore={() => handleViewMore(ModalTabType.GHO_RATING)}
              cardType={MasterDoughnutCardType.VESSEL_GHG_SCORE}
              displayFooterStatistic
              layoutMinHeight={false}
            />
          </Col>

          <Col span={8} className="d-flex flex-column">
            <DynamicDoughNutMasterCard
              key={MasterDoughnutCardType.INSPECTION_PLAN}
              handleViewMore={() =>
                handleViewMore(ModalTabType.INSPECTION_PLAN)
              }
              cardType={MasterDoughnutCardType.INSPECTION_PLAN}
              displayFooterStatistic
              layoutMinHeight={false}
            />
          </Col>
        </Row>

        {/* <div className={styles.openTaskContainer}>
          <OpenTask /> */}

        {/* <Row>
            <ListOfItemReview
              data={companyOverviewTask}
              title="Open tasks"
              containerWidth="100%"
            />
          </Row> */}
        {/* </div> */}
        <div className="mt-4">
          <IncidentsOverview />
        </div>
        <div className="mt-4">
          <InspectionOverview />
        </div>

        <div className="mt-4">
          <Row gutter={[16, 0]}>
            <Col span={16} className="d-flex flex-column">
              <div
                className={cx(
                  styles.contentContainer,
                  styles.wrapTrendOfOutstading,
                )}
              >
                <TrendsOfOutstandingIssue />
              </div>
            </Col>
            <Col span={8} className="d-flex flex-column">
              <OutStandingIssue />
            </Col>
          </Row>
        </div>

        <div className="mt-4">
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <VesselAgeBarChart />
            </Col>
            <Col span={8}>
              <DynamicDoughNutMasterCard
                key={MasterDoughnutCardType.VALIDITY}
                handleViewMore={() => handleViewMore(ModalTabType.VALIDITY)}
                cardType={MasterDoughnutCardType.VALIDITY}
                displayFooterStatistic={false}
                containerClassName={styles.rightShip}
                layoutMinHeight={false}
              />
            </Col>
          </Row>
        </div>

        <div className="mt-4">
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <StatisticCard
                body={renderDynamicLabel(
                  dynamicLabels,
                  MAIN_DASHBOARD_DYNAMIC_FIELDS[
                    'Total number of restricted vessels'
                  ],
                )}
                backgroundIconColor="#D2FBF0"
                iconSrc={images.icons.icNews}
                text={vesselHasRestricted?.length.toString()}
                key="#18BA92"
                minHeight={191}
                textValueColor="#18BA92"
                handleViewMore={() => setModal(ModalTabType.RESTRICTED)}
              />
            </Col>
            <Col span={8}>
              <StatisticCard
                body={renderDynamicLabel(
                  dynamicLabels,
                  MAIN_DASHBOARD_DYNAMIC_FIELDS[
                    'Total number of vessels blacklisted on MOU websites'
                  ],
                )}
                backgroundIconColor="#FEEAEA"
                iconSrc={images.icons.icList}
                text={companyBlacklistedVessel?.length.toString()}
                key="#F42829"
                minHeight={191}
                textValueColor="#F42829"
                handleViewMore={() => setModal(ModalTabType.MOU)}
              />
            </Col>
            <Col span={8}>
              <StatisticCard
                body={renderDynamicLabel(
                  dynamicLabels,
                  MAIN_DASHBOARD_DYNAMIC_FIELDS[
                    'Total number of vessels with remaining validity < 90 days'
                  ],
                )}
                backgroundIconColor="#FFE6F3"
                iconSrc={images.icons.icShip}
                text={vesselLastInspection?.vesselRemainingValidity90s?.length.toString()}
                key="#C80068"
                minHeight={191}
                textValueColor="#C80068"
                handleViewMore={() => setModal(ModalTabType.VALIDITY)}
              />
            </Col>
          </Row>
        </div>
        {renderModalTable()}
      </div>
    </div>
  );
};

export default DashBoardMasterContainer;
