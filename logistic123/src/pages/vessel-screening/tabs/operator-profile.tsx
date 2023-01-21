import cx from 'classnames';
import '../custom-tabs.scss';
import images from 'assets/images/images';
import { Col, Row } from 'antd/lib/grid';
import styles from '../list.module.scss';
import useVesselMetadata from '../utils/hooks/useVesselMetadata';

const TabOperatorProfile = () => {
  const metadata = useVesselMetadata(undefined, true);

  return (
    <div className={styles.wrapper}>
      <div className={cx(styles.card_container, 'pt-0')}>
        {metadata}
        <Row gutter={16}>
          <Col span={18} className="d-flex flex-column">
            <img
              src={images.common.SelfDeclarationMatrix}
              alt="tab section"
              style={{
                padding: '10px 20px',

                width: '100%',
              }}
            />
          </Col>
          <Col span={6}>
            <img
              src={images.common.summarySection1}
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

export default TabOperatorProfile;
