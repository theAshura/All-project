import cx from 'classnames';
import { Col, Row } from 'reactstrap';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import useVesselMetadata from 'pages/vessel-screening/utils/hooks/useVesselMetadata';
import { useSelector } from 'react-redux';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import styles from './right-ship.module.scss';
import RightShipTable from './RightShipTable';

export const rowLabels = [
  {
    id: 'updateValue',
    label: 'UPDATE VALUE',
    sort: true,
    width: '20',
  },
  {
    id: 'lastUpdate',
    label: 'LAST UPDATE AT',
    sort: true,
    width: '20',
  },
];

const ListRightShip = () => {
  // const { userInfo } = useSelector((state) => state.authenticate);
  const { vesselDetail } = useSelector((state) => state.vessel);
  // const [reload, setReload] = useState(false);
  const metadata = useVesselMetadata();
  const { t } = useTranslation([
    I18nNamespace.RIGHT_SHIP,
    I18nNamespace.COMMON,
  ]);

  // const refreshData = (id) => {
  //   createRightShipSyncApi({
  //     companyId: id,
  //     fromDate: moment()?.format('YYYY-MM-DD'),
  //     toDate: moment()?.format('YYYY-MM-DD'),
  //   })
  //     .then(async () => {
  //       setReload((prevState) => !prevState);
  //     })
  //     .catch((e) => {
  //       toastError(e);
  //     });
  // };

  const VesselInfo = (id) => {
    history.push(`${AppRouteConst.getVesselById(id)}`);
  };

  return (
    <>
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.header)}>{metadata}</div>
        <div className={styles.container}>
          <div className={cx(styles.part)}>
            <div className={cx('fw-bold', styles.titleContainer)}>
              {t('RightShip Data')}
              <div>
                <button
                  onClick={() => VesselInfo(vesselDetail.id)}
                  className={cx(styles.button)}
                >
                  Vessel info
                </button>
                {/* <button
                  onClick={() => refreshData(userInfo.companyId)}
                  className={cx(styles.button)}
                >
                  Refresh data
                </button> */}
              </div>
            </div>
            <Row className="pt-2 mx-0">
              <Col xl="12" xs="12" className="ps-0 col-xxl-6  ">
                <div className={cx('fw-bold', styles.formContainer)}>
                  <RightShipTable
                    // reload={reload}
                    filter="safetyScore"
                    title="Safety Score"
                    isFilter
                    key="safetyScore"
                  />
                </div>
              </Col>
              <Col xl="12" xs="12" className="ps-0 pe-0 col-xxl-6  ">
                <div className={cx('fw-bold', styles.formContainer)}>
                  <RightShipTable
                    // reload={reload}
                    filter="docSafetyScore"
                    title="DOC Safety Score "
                    key="safetyScore"
                    isFilter
                  />
                </div>
              </Col>
            </Row>

            <Row className="pt-2 mx-0">
              <Col xl="12" xs="12" className="ps-0 col-xxl-6  ">
                <div className={cx('fw-bold', styles.formContainer)}>
                  <RightShipTable
                    // reload={reload}
                    filter="ghgRating"
                    key="ghgRating"
                    title="GHG"
                    isFilter
                  />
                </div>
              </Col>
              <Col xl="12" xs="12" className="ps-0 pe-0 col-xxl-6 ">
                <div className={cx('fw-bold', styles.formContainer)}>
                  <RightShipTable
                    // reload={reload}
                    filter="lastInspectionValidity"
                    title="Last Date Of RightShip Inspection"
                    isFilter
                    key="lastInspectionValidity"
                  />
                </div>
              </Col>
            </Row>
          </div>
          <Row className="pt-2 mx-0">
            <Col xl="12" xs="12" className="ps-0 col-xxl-12  ">
              <div className={cx('fw-bold', styles.formContainer)}>
                <RightShipTable
                  // reload={reload}
                  filter="rightShip"
                  title=""
                  key="rightShip"
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default ListRightShip;
