import { useCallback, useState } from 'react';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import NumberIncidents from 'pages/incidents/summary/number-incidents';
import ReviewStatus from 'pages/incidents/summary/review-status';
import { I18nNamespace } from 'constants/i18n.const';
import { useSelector, useDispatch } from 'react-redux';
import { AppRouteConst } from 'constants/route.const';
import { openNewPage } from 'helpers/utils.helper';
import {
  IVesselGHGRating,
  IVesselRemainingValidity,
  VesselSafetyScores,
} from 'models/api/dashboard/dashboard.model';
import useEffectOnce from 'hoc/useEffectOnce';
import {
  getVesselHasRestrictedActions,
  getBlacklistedVesselActions,
} from 'store/dashboard/dashboard.action';
import images from 'assets/images/images';
import { ModalType } from 'components/ui/modal/Modal';
import styles from './dashboard-qa.module.scss';
import StatisticCard from '../components/chart/statisticCard/StatisticCard';
import DynamicDoughNutMasterCard, {
  MasterDoughnutCardType,
} from '../components/chart/dynamicDoughnutCard/DynamicDoughNutMasterCard';
import VesselAgeBarChart from '../components/chart/vesselAgeBarChart/VesselAgeBarChart';
import { columnsDefinition } from './columns-def';
import ModalTableAGGrid from '../components/modal/ModalTableAGGrid';

enum ModalTabType {
  SAFETY_SCORE = 'SAFETY_SCORE',
  GHO_RATING = 'GHO_RATING',
  RESTRICTED = 'RESTRICTED',
  MOU = 'MOU',
  VALIDITY = 'VALIDITY',
  HIDDEN = 'HIDDEN',
}
const DashBoardQAContainer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation([I18nNamespace.DASHBOARD, I18nNamespace.COMMON]);
  const [modal, setModal] = useState<ModalTabType>(ModalTabType.HIDDEN);
  const {
    companyVesselSafetyScore,
    vesselGHGRating,
    vesselLastInspection,
    companyBlacklistedVessel,
    vesselHasRestricted,
  } = useSelector((state) => state.dashboard);
  const [sort, setSort] = useState('');
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  useEffectOnce(() => {
    dispatch(getVesselHasRestrictedActions.request());
    dispatch(getBlacklistedVesselActions.request());
  });

  const handleViewMore = useCallback((modalType: ModalTabType) => {
    setModal(modalType);
  }, []);

  const handleClickNewTab = useCallback(
    (data) => data?.id && openNewPage(AppRouteConst.getVesselById(data?.id)),
    [],
  );

  const handleClickHighLightTextModal = useCallback(
    (columnData, clickedKey?: string, valueStrArray?: string) => {
      let matchPlanRefID = '';
      switch (clickedKey) {
        case 'imo':
          if (columnData.id) {
            openNewPage(AppRouteConst.getVesselById(columnData.id));
          }
          break;
        case 'planRef':
          matchPlanRefID =
            Array.isArray(columnData?.planPopup) &&
            columnData?.planPopup.find(
              (plan: { id: string; refId: string }) =>
                plan.refId === valueStrArray,
            )?.id;
          if (matchPlanRefID) {
            openNewPage(
              AppRouteConst.getPlanningAndRequestById(matchPlanRefID),
            );
          }
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
    let data;
    let total = 0;
    if (modal === ModalTabType.HIDDEN) {
      return null;
    }
    switch (modal) {
      case ModalTabType.SAFETY_SCORE:
        title = t('safetyScore');
        columns = columnsDefinition(
          isMultiColumnFilter,
          t,
          handleClickHighLightTextModal,
          'safetyScore',
        );
        data = companyVesselSafetyScore?.vesselSafetyScores
          .map((item: VesselSafetyScores) => ({
            vesselName: item.name,
            imo: item.imoNumber,
            vesselType: item.vesselType.name,
            safetyScore: item.rightShip.safetyScore,
            businessDivision: item.divisionMapping?.division?.name || '',
            id: item.id,
          }))
          .sort((a, b) => (a.safetyScore < b.safetyScore ? 1 : -1));
        total = companyVesselSafetyScore?.vesselSafetyScores.length;
        break;
      case ModalTabType.GHO_RATING:
        title = t('ghoRating');
        columns = columnsDefinition(
          isMultiColumnFilter,
          t,
          handleClickHighLightTextModal,
          'ghgRating',
        );
        data = vesselGHGRating?.vesselGHGRating
          .map((item: IVesselGHGRating) => ({
            vesselName: item.name,
            imo: item.imoNumber,
            vesselType: item.vesselType.name,
            ghgRating: item.rightShip.ghgRating,
            businessDivision: item?.divisionMapping?.division?.name || '',
            id: item.id,
          }))
          .sort((a, b) => (a.ghgRating > b.ghgRating ? 1 : -1));
        total = vesselGHGRating?.vesselGHGRating.length;
        break;
      case ModalTabType.VALIDITY:
        title = t('validity');
        columns = columnsDefinition(
          isMultiColumnFilter,
          t,
          handleClickHighLightTextModal,
          'validity',
        );
        data = vesselLastInspection?.vesselRemainingValidity90s
          .map((item: IVesselRemainingValidity) => ({
            vesselName: item.name,
            imo: item.imoNumber,
            vesselType: item.vesselType.name,
            businessDivision: item.divisionMapping?.division?.name || '',
            validity: item.rightShip.validityRemaining,
            id: item.id,
          }))
          .sort((a, b) => (a.validity > b.validity ? 1 : -1));
        total = vesselLastInspection?.vesselRemainingValidity90s.length;
        break;
      case ModalTabType.RESTRICTED:
        title = t('restricted');
        columns = columnsDefinition(
          isMultiColumnFilter,
          t,
          handleClickHighLightTextModal,
        );
        data = vesselHasRestricted.map((vessel) => ({
          vesselName: vessel.name,
          imo: vessel.imoNumber,
          vesselType: vessel.vesselType.name,
          businessDivision: vessel.divisionMapping?.division?.name || '',
          id: vessel.id,
        }));
        total = vesselHasRestricted.length;
        break;
      case ModalTabType.MOU:
        title = t('mou');
        columns = columnsDefinition(
          isMultiColumnFilter,
          t,
          handleClickHighLightTextModal,
        );
        data = companyBlacklistedVessel.map((vessel) => ({
          vesselName: vessel.name,
          imo: vessel.imoNumber,
          vesselType: vessel.vesselType.name,
          businessDivision: vessel.divisionMapping?.division?.name || '',
          id: vessel.id,
        }));
        total = companyBlacklistedVessel.length;
        break;

      default:
        break;
    }

    return (
      <ModalTableAGGrid
        scroll={{ x: 'max-content', y: 265 }}
        isOpen
        dataSource={data}
        toggle={() => setModal(ModalTabType.HIDDEN)}
        columns={columns}
        title={title}
        total={total}
        sort={sort}
        titleClasseName={styles.customTableModalTitle}
        onSort={(value: string) => {
          setSort(value);
        }}
        handleClick={(data) => handleClickNewTab(data)}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        w={1000}
        modalType={ModalType.LARGE}
      />
    );
  }, [
    modal,
    sort,
    t,
    isMultiColumnFilter,
    handleClickHighLightTextModal,
    companyVesselSafetyScore?.vesselSafetyScores,
    vesselGHGRating?.vesselGHGRating,
    vesselLastInspection?.vesselRemainingValidity90s,
    vesselHasRestricted,
    companyBlacklistedVessel,
    handleClickNewTab,
  ]);

  return (
    <div>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.QA_DASHBOARD}
        titlePage={t('sidebar.qaDashboard')}
      />
      <div className={styles.container}>
        <Row gutter={[16, 0]}>
          <Col span={8}>
            <DynamicDoughNutMasterCard
              key={MasterDoughnutCardType.VESSEL_SAFETY_SCORE}
              handleViewMore={() => handleViewMore(ModalTabType.SAFETY_SCORE)}
              cardType={MasterDoughnutCardType.VESSEL_SAFETY_SCORE}
              displayFooterStatistic
            />
          </Col>

          <Col span={8}>
            <DynamicDoughNutMasterCard
              key={MasterDoughnutCardType.VESSEL_GHG_SCORE}
              handleViewMore={() => handleViewMore(ModalTabType.GHO_RATING)}
              cardType={MasterDoughnutCardType.VESSEL_GHG_SCORE}
              displayFooterStatistic
            />
          </Col>

          <Col span={8}>
            <DynamicDoughNutMasterCard
              key={MasterDoughnutCardType.VALIDITY}
              handleViewMore={() => handleViewMore(ModalTabType.VALIDITY)}
              cardType={MasterDoughnutCardType.VALIDITY}
              displayFooterStatistic
            />
          </Col>
        </Row>

        <div className="mt-4">
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <div
                className={cx(
                  styles.contentContainer,
                  styles.contentContainerPadding,
                )}
              >
                <NumberIncidents
                  barColor="#3B9FF3"
                  barThickness={20}
                  barHeight={310}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.contentContainer}>
                <ReviewStatus
                  dropdown
                  isVertical
                  height={170}
                  width={170}
                  legendTop={16}
                  title={t('incidentReviewStatus')}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div className="mt-4">
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <VesselAgeBarChart />
            </Col>
            <Col span={8}>
              <StatisticCard
                body={t('restrictedVesselBodyCard')}
                backgroundIconColor="#D2FBF0"
                iconSrc={images.icons.icNews}
                text={vesselHasRestricted?.length.toString()}
                key="#18BA92"
                minHeight={191}
                marginBottom
                textValueColor="#18BA92"
                handleViewMore={() => setModal(ModalTabType.RESTRICTED)}
              />
              <StatisticCard
                body={t('blacklistedOnMouBodyCard')}
                backgroundIconColor="#FEEAEA"
                iconSrc={images.icons.icList}
                text={companyBlacklistedVessel?.length.toString()}
                key="#F42829"
                minHeight={191}
                textValueColor="#F42829"
                handleViewMore={() => setModal(ModalTabType.MOU)}
              />
            </Col>
          </Row>
        </div>
      </div>
      {renderModalTable()}
    </div>
  );
};

export default DashBoardQAContainer;
