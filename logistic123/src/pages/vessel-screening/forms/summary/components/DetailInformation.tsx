import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { formatDateLocalNoTime } from 'helpers/date.helper';
import { convertToAge } from 'helpers/utils.helper';
import { FC, useMemo } from 'react';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styles from './detail-information.module.scss';

interface Props {
  data?: any;
  className?: string;
}

export const DetailInformation: FC<Props> = ({ data, className }) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const { vesselDetail } = useSelector((state) => state.vessel);
  const convertDemention = useMemo(
    () =>
      `${vesselDetail?.dimensionL || '-'}m (L) x ${
        vesselDetail?.dimensionB || '-'
      }m (B) x ${vesselDetail?.dimensionH || '-'}m (H)`,
    [
      vesselDetail?.dimensionL,
      vesselDetail?.dimensionB,
      vesselDetail?.dimensionH,
    ],
  );
  return (
    <Row className={cx(styles.container, className)}>
      <Col xs={12} className={styles.title}>
        {t('summary.detailInformation')}
      </Col>
      <Col xs={4} className={cx(styles.textInfo)}>
        {t('summary.vesselName')}: <span>{vesselDetail?.name || '-'}</span>
      </Col>
      <Col xs={4} className={cx(styles.textInfo)}>
        {t('summary.dateOfBuild')}:{' '}
        <span>{formatDateLocalNoTime(vesselDetail?.buildDate) || '-'}</span>
      </Col>
      <Col xs={4} className={cx(styles.textInfo)}>
        {t('summary.imoNumber')}: <span>{vesselDetail?.imoNumber || '-'}</span>
      </Col>
      <Col xs={4} className={cx(styles.textInfo)}>
        {t('summary.age')}: <span>{convertToAge(vesselDetail?.buildDate)}</span>
      </Col>
      <Col xs={4} className={cx(styles.textInfo)}>
        {t('summary.dimension')}: <span>{convertDemention}</span>
      </Col>
      <Col xs={4} className={cx(styles.textInfo)}>
        {t('summary.shipwardCountry')}:{' '}
        <span>{vesselDetail?.shipyardCountry || '-'}</span>
      </Col>
      <Col xs={4} className={cx(styles.textInfo)}>
        {t('summary.vesselType')}:{' '}
        <span>{vesselDetail?.vesselType?.name || '-'}</span>
      </Col>
    </Row>
  );
};
