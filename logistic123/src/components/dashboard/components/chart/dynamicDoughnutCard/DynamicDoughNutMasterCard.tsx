import { useMemo, memo, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useEffectOnce from 'hoc/useEffectOnce';

import {
  getInspectionPlanActions,
  getLastInspectionActions,
  getTotalNumberRiskActions,
  getVesselGHGRatingActions,
  getVesselRiskRatingActions,
  getVesselSafetyScoreActions,
} from 'store/dashboard/dashboard.action';
import images from 'assets/images/images';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import DashBoardMasterCard from '../dashboardCard/DashBoardMasterCard';
import {
  vesselSafetyScoreData,
  inspectionPlanData,
  vesselGHGScoreDate,
  rightShipData,
  vesselRiskRatingData,
  potentialObservedRiskRatingData,
} from '../../../master/mockData';
import { ListProgressSortType } from '../../list-progress/ListProgress';

export enum MasterDoughnutCardType {
  VESSEL_SAFETY_SCORE = 'vesselSafetyScore',
  VESSEL_GHG_SCORE = 'vesselGHGScore',
  INSPECTION_PLAN = 'InspectionPlan',
  VALIDITY = 'VALIDITY',
  VESSEL_RISK_RATING = 'VESSEL_RISK_RATING',
  POTENTIAL_RISK = 'POTENTIAL_RISK',
  OBSERVED_RISK = 'OBSERVED_RISK',
}

interface DynamicDoughNutMasterCardProps {
  handleViewMore?: () => void;
  cardType: MasterDoughnutCardType;
  displayFooterStatistic?: boolean;
  containerClassName?: string;
  layoutMinHeight?: boolean;
}

const DynamicDoughNutMasterCard: FC<DynamicDoughNutMasterCardProps> = ({
  handleViewMore,
  cardType,
  displayFooterStatistic = false,
  containerClassName,
  layoutMinHeight = true,
}) => {
  const dispatch = useDispatch();
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const {
    companyVesselSafetyScore,
    companyInspectionPlan,
    vesselGHGRating,
    vesselLastInspection,
    vesselRiskRating,
    totalNumberRisk,
  } = useSelector((state) => state.dashboard);

  const resultData = useMemo(() => {
    let chartData = [];
    let title = '';
    let body = '';
    let icon = '';
    let cardIconBG = '';
    let infoCardTitle = '';
    let infoCardTitleColor = '';
    let listProgressSortType: ListProgressSortType;
    let total = 0;
    let isRisks = false;
    let tooltipTitle = '';
    let averageScore;
    let showAverageScore;

    switch (cardType) {
      case MasterDoughnutCardType.VESSEL_SAFETY_SCORE:
        chartData = [...vesselSafetyScoreData];
        chartData[0].value = companyVesselSafetyScore?.totalScoreNone;
        chartData[1].value = companyVesselSafetyScore?.totalScore0;
        chartData[2].value = companyVesselSafetyScore?.totalScore1;
        chartData[3].value = companyVesselSafetyScore?.totalScore2;
        chartData[4].value = companyVesselSafetyScore?.totalScore3;
        chartData[5].value = companyVesselSafetyScore?.totalScore4;
        chartData[6].value = companyVesselSafetyScore?.totalScore5;

        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel safety score'],
        );
        body = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Total number of vessels with Safety Score = N/A,0,1,2,3,4,5'
          ],
        );
        icon = images.icons.icApprovedGuard;
        cardIconBG = '#D2FBF0';
        infoCardTitle =
          companyVesselSafetyScore?.vesselSafetyScores.length.toString() || '0';
        infoCardTitleColor = '#1BD2A4';
        listProgressSortType = ListProgressSortType.INDEX_INCREASE;
        total = companyVesselSafetyScore?.totalVessel;
        break;

      case MasterDoughnutCardType.INSPECTION_PLAN:
        chartData = [...inspectionPlanData];
        chartData[0].value = companyInspectionPlan?.totalPlanningDraft;
        chartData[1].value = companyInspectionPlan?.totalPlanningAccepted;
        chartData[2].value = companyInspectionPlan?.totalPlanningCancelled;
        chartData[3].value = companyInspectionPlan?.totalPlanningPlanned;
        chartData[4].value = companyInspectionPlan?.totalPlanningReassigned;
        chartData[5].value = companyInspectionPlan?.totalPlanningInProgress;
        chartData[6].value = companyInspectionPlan?.totalPlanningSubmitted;
        chartData[7].value = companyInspectionPlan?.totalPlanningCompleted;
        chartData[8].value = companyInspectionPlan?.totalPlanningApproved;

        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Inspection plan'],
        );
        body = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Total number of vessels are under inspection'
          ],
        );
        icon = images.icons.menu.icStack;
        cardIconBG = '#FFF1E6';
        infoCardTitle =
          companyInspectionPlan?.planningUnderInspection.length.toString() ||
          '0';
        infoCardTitleColor = '#FF6E01';
        listProgressSortType = ListProgressSortType.INDEX_INCREASE;
        total = companyInspectionPlan?.totalPlanning;

        break;

      case MasterDoughnutCardType.VESSEL_GHG_SCORE:
        chartData = [...vesselGHGScoreDate];
        chartData[0].value = vesselGHGRating?.totalGHGRatingA;
        chartData[1].value = vesselGHGRating?.totalGHGRatingB;
        chartData[2].value = vesselGHGRating?.totalGHGRatingC;
        chartData[3].value = vesselGHGRating?.totalGHGRatingD;
        chartData[4].value = vesselGHGRating?.totalGHGRatingE;
        chartData[5].value = vesselGHGRating?.totalGHGRatingF;
        chartData[6].value = vesselGHGRating?.totalGHGRatingG;
        chartData[7].value = vesselGHGRating?.totalGHGRatingU;

        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel GHG rating'],
        );
        body = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Total number of vessels with GHG rating from A to E'
          ],
        );
        icon = images.icons.menu.icLike;
        cardIconBG = '#EEF2FA';
        infoCardTitle =
          vesselGHGRating?.vesselGHGRating.length.toString() || '0';
        infoCardTitleColor = '#1E62DC';
        listProgressSortType = ListProgressSortType.INDEX_INCREASE;
        total = vesselGHGRating?.totalVessel;

        break;

      case MasterDoughnutCardType.VALIDITY:
        chartData = [...rightShipData];
        chartData[0].value =
          vesselLastInspection?.totalVesselLastInspectionAcceptable;
        chartData[1].value =
          vesselLastInspection?.totalVesselLastInspectionUnacceptable;
        chartData[2].value = vesselLastInspection?.totalVesselLastInspectionNAN;

        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Vessel last inspection outcome from RightShip'
          ],
        );
        body = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Total number of vessels with last inspection validity < 90 days'
          ],
        );
        icon = images.icons.menu.icVessel;
        cardIconBG = '#FFE6F3';
        infoCardTitle =
          vesselLastInspection?.vesselRemainingValidity90s?.length.toString() ||
          '0';
        infoCardTitleColor = '#C80068';
        total = vesselLastInspection?.totalVessel;

        break;

      case MasterDoughnutCardType.VESSEL_RISK_RATING:
        chartData = [...vesselRiskRatingData];
        chartData[0].value = vesselRiskRating?.vesselRiskRatingNA;
        chartData[1].value = vesselRiskRating?.vesselRiskRatingNegligible;
        chartData[2].value = vesselRiskRating?.vesselRiskRatingLow;
        chartData[3].value = vesselRiskRating?.vesselRiskRatingMedium;
        chartData[4].value = vesselRiskRating?.vesselRiskRatingHigh;

        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel risk rating'],
        );
        icon = images.icons.menu.icVessel;
        cardIconBG = '#FFE6F3';
        listProgressSortType = ListProgressSortType.INDEX_INCREASE;
        total =
          vesselRiskRating &&
          Object.values(vesselRiskRating)
            ?.slice(0, 4)
            ?.reduce((a, b) => a + b, 0);

        isRisks = true;
        tooltipTitle = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Vessel Risk Rating group by Score'],
        );
        averageScore = vesselRiskRating?.vesselAverageRiskRating || '-';
        showAverageScore = true;
        break;
      case MasterDoughnutCardType.POTENTIAL_RISK:
        chartData = [...potentialObservedRiskRatingData];
        chartData[0].value =
          totalNumberRisk?.potentialRisk?.totalPotentialRiskNA;
        chartData[1].value =
          totalNumberRisk?.potentialRisk?.totalPotentialRiskNegligible;
        chartData[2].value =
          totalNumberRisk?.potentialRisk?.totalPotentialRiskLow;
        chartData[3].value =
          totalNumberRisk?.potentialRisk?.totalPotentialRiskMedium;
        chartData[4].value =
          totalNumberRisk?.potentialRisk?.totalPotentialRiskHigh;

        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Potential risks'],
        );
        icon = images.icons.menu.icVessel;
        cardIconBG = '#FFE6F3';
        listProgressSortType = ListProgressSortType.INDEX_INCREASE;
        total = totalNumberRisk?.potentialRisk?.totalPotentialRisk;
        isRisks = true;
        tooltipTitle = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Total number of Potential Risk records from Vessel Screening group by Risk level'
          ],
        );
        break;
      case MasterDoughnutCardType.OBSERVED_RISK:
        chartData = [...potentialObservedRiskRatingData];
        chartData[0].value = totalNumberRisk?.observedRisk?.totalObservedRiskNA;
        chartData[1].value =
          totalNumberRisk?.observedRisk?.totalObservedRiskNegligible;
        chartData[2].value =
          totalNumberRisk?.observedRisk?.totalObservedRiskLow;
        chartData[3].value =
          totalNumberRisk?.observedRisk?.totalObservedRiskMedium;
        chartData[4].value =
          totalNumberRisk?.observedRisk?.totalObservedRiskHigh;

        title = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Observed risks'],
        );
        icon = images.icons.menu.icVessel;
        cardIconBG = '#FFE6F3';
        listProgressSortType = ListProgressSortType.INDEX_INCREASE;
        total = totalNumberRisk?.observedRisk?.totalObservedRisk;
        isRisks = true;
        tooltipTitle = renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Total number of Observed Risk records from Vessel Screening group by Risk level'
          ],
        );
        break;
      default:
        break;
    }

    return {
      chartData,
      title,
      body: displayFooterStatistic ? body : undefined,
      icon: displayFooterStatistic ? icon : undefined,
      cardIconBG: displayFooterStatistic ? cardIconBG : undefined,
      infoCardTitle: displayFooterStatistic ? infoCardTitle : undefined,
      infoCardTitleColor: displayFooterStatistic
        ? infoCardTitleColor
        : undefined,
      listProgressSortType,
      total,
      isRisks,
      tooltipTitle,
      averageScore,
      showAverageScore,
    };
  }, [
    cardType,
    displayFooterStatistic,
    companyVesselSafetyScore?.totalScoreNone,
    companyVesselSafetyScore?.totalScore0,
    companyVesselSafetyScore?.totalScore1,
    companyVesselSafetyScore?.totalScore2,
    companyVesselSafetyScore?.totalScore3,
    companyVesselSafetyScore?.totalScore4,
    companyVesselSafetyScore?.totalScore5,
    companyVesselSafetyScore?.vesselSafetyScores.length,
    companyVesselSafetyScore?.totalVessel,
    dynamicLabels,
    companyInspectionPlan?.totalPlanningDraft,
    companyInspectionPlan?.totalPlanningAccepted,
    companyInspectionPlan?.totalPlanningCancelled,
    companyInspectionPlan?.totalPlanningPlanned,
    companyInspectionPlan?.totalPlanningReassigned,
    companyInspectionPlan?.totalPlanningInProgress,
    companyInspectionPlan?.totalPlanningSubmitted,
    companyInspectionPlan?.totalPlanningCompleted,
    companyInspectionPlan?.totalPlanningApproved,
    companyInspectionPlan?.planningUnderInspection.length,
    companyInspectionPlan?.totalPlanning,
    vesselGHGRating?.totalGHGRatingA,
    vesselGHGRating?.totalGHGRatingB,
    vesselGHGRating?.totalGHGRatingC,
    vesselGHGRating?.totalGHGRatingD,
    vesselGHGRating?.totalGHGRatingE,
    vesselGHGRating?.totalGHGRatingF,
    vesselGHGRating?.totalGHGRatingG,
    vesselGHGRating?.totalGHGRatingU,
    vesselGHGRating?.vesselGHGRating.length,
    vesselGHGRating?.totalVessel,
    vesselLastInspection?.totalVesselLastInspectionAcceptable,
    vesselLastInspection?.totalVesselLastInspectionUnacceptable,
    vesselLastInspection?.totalVesselLastInspectionNAN,
    vesselLastInspection?.vesselRemainingValidity90s?.length,
    vesselLastInspection?.totalVessel,
    vesselRiskRating,
    totalNumberRisk?.potentialRisk?.totalPotentialRiskNA,
    totalNumberRisk?.potentialRisk?.totalPotentialRiskNegligible,
    totalNumberRisk?.potentialRisk?.totalPotentialRiskLow,
    totalNumberRisk?.potentialRisk?.totalPotentialRiskMedium,
    totalNumberRisk?.potentialRisk?.totalPotentialRiskHigh,
    totalNumberRisk?.potentialRisk?.totalPotentialRisk,
    totalNumberRisk?.observedRisk?.totalObservedRiskNA,
    totalNumberRisk?.observedRisk?.totalObservedRiskNegligible,
    totalNumberRisk?.observedRisk?.totalObservedRiskLow,
    totalNumberRisk?.observedRisk?.totalObservedRiskMedium,
    totalNumberRisk?.observedRisk?.totalObservedRiskHigh,
    totalNumberRisk?.observedRisk?.totalObservedRisk,
  ]);

  useEffectOnce(() => {
    switch (cardType) {
      case MasterDoughnutCardType.VESSEL_SAFETY_SCORE:
        dispatch(getVesselSafetyScoreActions.request());
        break;
      case MasterDoughnutCardType.INSPECTION_PLAN:
        dispatch(getInspectionPlanActions.request());
        break;
      case MasterDoughnutCardType.VESSEL_GHG_SCORE:
        dispatch(getVesselGHGRatingActions.request());
        break;
      case MasterDoughnutCardType.VALIDITY:
        dispatch(getLastInspectionActions.request());
        break;
      case MasterDoughnutCardType.VESSEL_RISK_RATING:
        dispatch(getVesselRiskRatingActions.request());
        break;
      case MasterDoughnutCardType.POTENTIAL_RISK:
        dispatch(getTotalNumberRiskActions.request());
        break;
      case MasterDoughnutCardType.OBSERVED_RISK:
        dispatch(getTotalNumberRiskActions.request());
        break;
      default:
        break;
    }
  });

  return (
    <DashBoardMasterCard
      data={resultData?.chartData}
      title={resultData?.title}
      handleOnClickViewMore={handleViewMore}
      infoCardBody={resultData?.body}
      infoCardIcon={resultData?.icon}
      infoCardIconBGColor={resultData?.cardIconBG}
      infoCardTitle={resultData?.infoCardTitle}
      isRisks={resultData?.isRisks}
      infoCardTitleColor={resultData?.infoCardTitleColor}
      progressHeight={resultData?.isRisks ? '18rem' : '14rem'}
      displayFooterStatistic={displayFooterStatistic}
      listProgressType={resultData?.listProgressSortType}
      totalValue={resultData?.total}
      containerClassName={containerClassName}
      tooltipTitle={resultData?.tooltipTitle}
      averageScore={resultData?.averageScore}
      showAverageScore={resultData?.showAverageScore}
      useMinHeight={layoutMinHeight}
    />
  );
};

export default memo(DynamicDoughNutMasterCard);
