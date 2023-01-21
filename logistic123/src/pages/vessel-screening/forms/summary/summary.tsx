import cx from 'classnames';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import { DetailInformation } from './components/DetailInformation';
import { DetailRiskAnalysis } from './components/DetailRiskAnalysis';
import { LatestDocumentsUpload } from './components/LatestDocumentsUpload';
import { StatisticList } from './components/StatisticList';
import { SummaryRemarks } from './components/SummaryRemarks';
import styles from './summary.module.scss';

const FormSummary = () => {
  const metadata = useVesselMetadata();
  return (
    <div className={cx(styles.container)}>
      <div>{metadata}</div>
      <StatisticList />
      <LatestDocumentsUpload />

      <div className={styles.wrapDetailInfo}>
        <div className={styles.detail}>
          <DetailRiskAnalysis />
          <DetailInformation />
        </div>
        <SummaryRemarks className={styles.summaryRemarks} />
      </div>
    </div>
  );
};

export default FormSummary;
