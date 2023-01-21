import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import images from 'assets/images/images';
import useEffectOnce from 'hoc/useEffectOnce';
import cx from 'classnames';
import { Doughnut } from 'react-chartjs-2';
import Button, { ButtonType } from 'components/ui/button/Button';
import { LineChart } from 'components/common/chart/line-chart/LineChart';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Col from 'antd/lib/col';
import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import Row from 'antd/lib/row';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import {
  convertNumberInt,
  arrThreeMonthCurrent,
  arrDateInWeek,
  arrDateInMonth,
  arrMonthInYear,
} from 'helpers/utils.helper';
import { getAdminTotalAccountActions } from 'store/dashboard/dashboard.action';
import ListOverview from '../components/tab/admin-svm/ListOverview';
import styles from './dashboard-admin.module.scss';
import ModalTable from '../components/modal/ModalTable';

import {
  columnTotalSubscription,
  mockTotalSubscription,
  columnNumberOfTotalAccount,
  dataLineChart,
  ModalDashboardType,
} from '../constants/admin.const';

const DashBoardSVMAdminContainer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation([I18nNamespace.DASHBOARD, I18nNamespace.COMMON]);
  const [sort, setSort] = useState('');

  const [totalTraction, setTotalTraction] = useState<TrendOfTime>(
    TrendOfTime.M,
  );
  const [modal, setModal] = useState<ModalDashboardType>(
    ModalDashboardType.HIDDEN,
  );

  useEffectOnce(() => {
    dispatch(getAdminTotalAccountActions.request({ page: 1, pageSize: -1 }));
  });

  const { totalAccount } = useSelector((state) => state.dashboard);

  const arrChart = useCallback((value: TrendOfTime) => {
    switch (value) {
      case TrendOfTime.M:
        return arrDateInMonth();
      case TrendOfTime.M3:
        return arrThreeMonthCurrent();
      case TrendOfTime.Y:
        return arrMonthInYear();
      default:
        return arrDateInWeek();
    }
  }, []);
  const renderFirstContent = () => (
    <Row>
      <Col span={8} className="pe-2">
        <div className={styles.wrapperBox}>
          <p className={cx('text-center mb-2 fw-b', styles.titleBox)}>
            Total Traction By Device
          </p>
          <div className={styles.doughnutChart}>
            <Doughnut
              options={{ plugins: { legend: { display: false } } }}
              data={{
                labels: ['Web', 'Mobile'],
                datasets: [
                  {
                    label: 'My First Dataset',
                    data: [50, 50],
                    backgroundColor: ['#964FFF', '#0842FF'],
                  },
                ],
              }}
            />
            <div className={styles.totalNumber}>100</div>
          </div>
          <Row>
            <Col span={12} className="d-flex align-items-center">
              <div
                className={cx('ms-auto', styles.imgWrapper, styles.imgMobile)}
              >
                <img src={images.icons.icMobile} alt="img" />
              </div>
              <span className={cx('ms-2', styles.textContent)}>Mobile</span>
            </Col>
            <Col span={12} className="d-flex align-items-center">
              <div className={cx('ms-4', styles.imgWrapper, styles.imgWeb)}>
                <img src={images.icons.icWeb} alt="img" />
              </div>
              <span className={cx('ms-2', styles.textContent)}>Web</span>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={16} className="ps-2">
        <div className={cx(styles.wrapperBox, styles.heightContent)}>
          <Row>
            <Col
              span={12}
              className={cx(styles.titleTOAAndIA, 'd-flex align-items-center')}
            >
              <span className={styles.titleBox}>Total traction By Time</span>
            </Col>
            <Col span={12}>
              <div className="d-flex justify-content-end">
                <div className={styles.btns}>
                  <Button
                    buttonType={
                      totalTraction === TrendOfTime.W
                        ? ButtonType.BlueChart
                        : ButtonType.CancelOutline
                    }
                    onClick={() => setTotalTraction(TrendOfTime.W)}
                  >
                    1W
                  </Button>
                  <Button
                    buttonType={
                      totalTraction === TrendOfTime.M
                        ? ButtonType.BlueChart
                        : ButtonType.CancelOutline
                    }
                    onClick={() => setTotalTraction(TrendOfTime.M)}
                  >
                    1M
                  </Button>
                  <Button
                    buttonType={
                      totalTraction === TrendOfTime.M3
                        ? ButtonType.BlueChart
                        : ButtonType.CancelOutline
                    }
                    onClick={() => setTotalTraction(TrendOfTime.M3)}
                  >
                    3M
                  </Button>
                  <Button
                    buttonType={
                      totalTraction === TrendOfTime.Y
                        ? ButtonType.BlueChart
                        : ButtonType.CancelOutline
                    }
                    onClick={() => setTotalTraction(TrendOfTime.Y)}
                  >
                    1Y
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <LineChart
            data={dataLineChart}
            labels={arrChart(totalTraction)}
            hiddenItem
          />
        </div>
      </Col>
    </Row>
  );

  const renderOverview = () => (
    <Row className={cx(styles.mt10)}>
      <Col span={16} className={cx(styles.pr10)}>
        <div className={styles.contentOverview}>
          <ListOverview title="Overview of statistic" />
        </div>
      </Col>
      <Col span={8}>
        <div
          onClick={() => setModal(ModalDashboardType.TOTAL_OF_DESCRIPTION)}
          className={cx(
            'd-flex align-items-center',
            styles.wrapperNumberTotalAccount,
          )}
        >
          <div>
            <div className={cx('fw-b', styles.numberAccount)}>
              {convertNumberInt(totalAccount?.totalItem || 0)}
            </div>
            <div>Number of total Account</div>
          </div>
          <div className={cx('ms-auto', styles.imgWrapper, styles.bgBlue)}>
            <img src={images.common.icAvatar} alt="img" />
          </div>
        </div>
        <div className={styles.wrapperTotalSubscription}>
          <p className={cx(styles.totalSubScription, 'fw-b')}>4,624</p>
          <div className={styles.bgTotal}>
            <img src={images.common.bgChartLine} alt="required" />
            <div className={styles.wrapTextTotal}>
              <p className="mb-0">Total subscription by types</p>
              <div
                onClick={() =>
                  setModal(ModalDashboardType.NUMBER_OF_TOTAL_ACCOUNT)
                }
                className={styles.viewMoreTotal}
              >
                View More
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
  const renderOverviewStatistic = () => (
    <Row className={styles.wrapperOverviewStatistic}>
      <Col span={16}>
        <p className={styles.titleBox}> Overview of statistic</p>
        <LineChart
          data={dataLineChart}
          labels={arrChart(TrendOfTime.M)}
          hiddenItem
          height={230}
        />
      </Col>
      <Col span={8} className={styles.pl10}>
        <p className={styles.titleBox}>Number </p>
        <div
          className={cx(
            'd-flex justify-content-between align-items-center',
            styles.wrapperItemBox,
          )}
        >
          <p className={cx('mb-1', styles.titleTotalVisit)}>Total visit</p>
          <p className={cx('mb-3', styles.valueTotalVisit)}>100,000</p>
        </div>
        <div
          className={cx(
            'd-flex justify-content-between',
            styles.wrapperItemBox,
            styles.pt10,
          )}
        >
          <p>Average Visit Duration</p>
          <p>100,000</p>
        </div>
        <div
          className={cx(
            'd-flex justify-content-between',
            styles.wrapperItemBox,
            styles.pt10,
          )}
        >
          <p>Bounce Rate</p>
          <p>100,000</p>
        </div>
      </Col>
    </Row>
  );
  const renderModalTable = useCallback(() => {
    let title = '';
    let columns = [];
    let data = [];
    if (modal === ModalDashboardType.HIDDEN) {
      return null;
    }
    switch (modal) {
      case ModalDashboardType.NUMBER_OF_TOTAL_ACCOUNT:
        title = 'Total subscription';
        columns = columnTotalSubscription;
        data = mockTotalSubscription;
        break;
      case ModalDashboardType.TOTAL_OF_DESCRIPTION:
        title = 'Number of total Account';
        columns = columnNumberOfTotalAccount;
        data =
          totalAccount?.data?.map((item, index) => ({
            sno: index + 1,
            username: item?.username || '',
            company: item?.company?.name || '',
          })) || [];
        break;
      default:
        break;
    }

    return (
      <ModalTable
        isOpen
        dataSource={data}
        toggle={() => setModal(ModalDashboardType.HIDDEN)}
        columns={columns}
        title={title}
        sort={sort}
        onSort={(value: string) => {
          setSort(value);
          dispatch(
            getAdminTotalAccountActions.request({
              page: 1,
              pageSize: -1,
              sort: value,
            }),
          );
        }}
      />
    );
  }, [modal, sort, totalAccount?.data, dispatch]);

  return (
    <div className={styles.dashboard}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.DASHBOARD}
        titlePage={t('sidebar.dashboard')}
      />

      <div className={styles.container}>
        {renderFirstContent()}
        {renderOverview()}
        {renderOverviewStatistic()}
        {renderModalTable()}
      </div>
    </div>
  );
};

export default DashBoardSVMAdminContainer;
