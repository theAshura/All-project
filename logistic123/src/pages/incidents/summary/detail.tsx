import HeaderPage from 'components/common/header-page/HeaderPage';
import { Row, Col } from 'antd/lib/grid';

import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';

import { useTranslation } from 'react-i18next';

import styles from './detail.module.scss';
import NumberIncidents from './number-incidents';
import IncidentPlace from './incident-place';

import TypeOfIncidents from './type-of-incidents';
import ReviewStatus from './review-status';
import RiskDetails from './risk-details';

const ListIncidentDetail = () => {
  const { t } = useTranslation(I18nNamespace.INCIDENTS);

  return (
    <div className={styles.container}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.INCIDENTS}
        titlePage={t('incidents')}
      />

      <div className={styles.wrapperForm}>
        <Row gutter={[12, 12]}>
          <Col xl={14} xs={24}>
            <NumberIncidents />
          </Col>
          <Col xl={10} xs={24}>
            <IncidentPlace />
          </Col>
          <Col xl={14} xs={24}>
            <TypeOfIncidents />
          </Col>
          <Col xl={10} xs={24}>
            <ReviewStatus displayChartMargin={false} />
            <div className="pt-3" />
            <RiskDetails />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ListIncidentDetail;
