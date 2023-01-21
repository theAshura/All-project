import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';

export const renderTitleThroughStepDate = (dateStep: TrendOfTime): string => {
  switch (dateStep) {
    case TrendOfTime.W:
      return 'week';
    case TrendOfTime.M:
      return 'month';
    case TrendOfTime.M3:
      return 'quarter';
    case TrendOfTime.Y:
      return 'year';
    default:
      return '';
  }
};
