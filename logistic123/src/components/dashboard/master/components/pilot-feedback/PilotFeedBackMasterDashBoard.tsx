import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import ReviewStatus from 'pages/incidents/summary/review-status';
import { I18nNamespace } from 'constants/i18n.const';
import NumberIncidents, {
  ChartDataType,
} from 'pages/incidents/summary/number-incidents';
import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import images from 'assets/images/images';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPilotFeedbackAverageScoreActions } from 'pages/pilot-terminal-feedback/store/action';
import styles from '../../dashboard-master.module.scss';
import ScoreDateFilter from './ScoreDateFilter';

const PilotFeedBackMasterDashBoard = () => {
  const { t } = useTranslation([I18nNamespace.DASHBOARD, I18nNamespace.COMMON]);
  const [filter, setFilter] = useState<string>(TrendOfTime.M);
  const dispatch = useDispatch();
  const { listPilotFeedbackAverageScore } = useSelector(
    (globalState) => globalState.pilotTerminalFeedback,
  );
  useEffect(() => {
    let subtractDate = 0;
    switch (filter) {
      case TrendOfTime.M3:
        subtractDate = -90;
        break;
      case TrendOfTime.Y:
        subtractDate = -365;
        break;

      case TrendOfTime.M:
        subtractDate = -30;
        break;
      default:
        subtractDate = -7;
        break;
    }
    const priorDate = moment().add(subtractDate, 'days');

    const dateObj = {
      fromDate: priorDate.toISOString(),
      toDate: moment().toISOString(),
    };

    dispatch(getPilotFeedbackAverageScoreActions.request(dateObj));
  }, [dispatch, filter]);

  return (
    <div className="mt-4">
      <Row gutter={[16, 0]}>
        <Col span={16}>
          <div
            className={cx(
              styles.contentContainer,
              styles.contentPilotFeedbackIncidents,
            )}
          >
            <NumberIncidents
              barColor="#3B9FF3"
              barThickness={20}
              barHeight={310}
              title={t('numberOfPilotFeedback')}
              key="numberOfPilotFeedback"
              type={ChartDataType.PILOT_FEEDBACK}
            />
          </div>
        </Col>
        <Col span={8} className={styles.flexColumns}>
          <div
            className={cx(
              styles.paddingNone,
              styles.contentPilotFeedbackStatus,
            )}
          >
            <ReviewStatus
              dropdown
              isVertical
              height={170}
              width={170}
              title={t('pilotFeedbackStatus')}
              fullHeight
              containerClassName={styles.fullHeight}
              key="pilotFeedbackStatus"
              type={ChartDataType.PILOT_FEEDBACK}
            />
          </div>

          <div className="mt-3">
            <ScoreDateFilter
              content={{
                body: t('averagePilotScore'),
                totalPoint: listPilotFeedbackAverageScore?.[0]?.average
                  ? Number(
                      listPilotFeedbackAverageScore?.[0]?.average,
                    )?.toFixed(2)
                  : '_',
                titleColor: '#FF6E01',
              }}
              images={{
                link: images.icons.menu.icStack,
                bgColor: '#FFF1E6',
              }}
              value={filter}
              setValueFilter={setFilter}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PilotFeedBackMasterDashBoard;
