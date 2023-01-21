import cx from 'classnames';
import '../custom-tabs.scss';
import images from 'assets/images/images';
import { useMemo } from 'react';
import { Col, Row } from 'antd/lib/grid';
import styles from '../list.module.scss';
import useVesselMetadata from '../utils/hooks/useVesselMetadata';

const TabCrewing = () => {
  const metadata = useVesselMetadata(undefined, true);

  const ComingSoon = useMemo(
    () => (
      <div className={styles.dataWrapper}>
        <p>Coming Soon</p>
      </div>
    ),
    [],
  );

  return (
    <div className={styles.wrapper}>
      <div className={cx(styles.card_container, 'pt-0')}>
        {metadata}
        <Row gutter={16}>
          <Col span={18} className="d-flex flex-column">
            {ComingSoon}
          </Col>
          <Col span={6}>
            <img
              src={images.common.summarySection}
              alt="summary section"
              style={{
                width: '100%',
                margin: '10px 0 10px -20px',
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TabCrewing;
