import HeaderPage from 'components/common/header-page/HeaderPage';
import TableAntd from 'components/common/table-antd/TableAntd';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import images from 'assets/images/images';

import StatisticCard from 'components/dashboard/components/chart/statisticCard/StatisticCard';
import { useEffect, useMemo, useState } from 'react';
import {
  getAnalysisDataActions,
  getListActivityActions,
} from 'store/home-page/home-page.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { HOME_PAGE_DYNAMIC_LABEL } from 'constants/dynamic/home-page.const';
import NoDataImg from 'components/common/no-data/NoData';

import NotificationItem from 'pages/notification/NotificationItem';
import { renderAgingopenRecordsColumn } from './home-page.const';
import styles from './home-page.module.scss';
import './home-page.scss';
import CalendarHomePage from './calendar-homepage/CalendarHomepage';

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.authenticate);
  const [listNotifications, setListNotifications] = useState([]);
  const dispatch = useDispatch();
  const { listActivity, analysisData } = useSelector((state) => state.homepage);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Homepage,
    modulePage: ModulePage.List,
  });

  useEffect(() => {
    setListNotifications(listActivity?.data);
  }, [listActivity?.data]);

  useEffect(() => {
    const params: any = {
      pageSize: -1,
    };
    dispatch(getListActivityActions.request(params));
    setListNotifications(listActivity?.data);

    dispatch(getAnalysisDataActions.request());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const renderAgingopenRecordsRowData = useMemo(
    () => [
      {
        lifecycleWorkFlow: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionPar,
        ),
        below15days: 0,
        to30days: 0,
        to60days: 0,
        over60days: 0,
      },
      {
        lifecycleWorkFlow: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.AuditInspectionInspectionFollowUp,
        ),
        below15days: 0,
        to30days: 0,
        to60days: 0,
        over60days: 0,
      },
      {
        lifecycleWorkFlow: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.QuantityAssuranceSelfAssessmentSelfAssessment,
        ),
        below15days: 0,
        to30days: 0,
        to60days: 0,
        over60days: 0,
      },
      {
        lifecycleWorkFlow: renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.QuantityAssuranceIncidents,
        ),
        below15days: 0,
        to30days: 0,
        to60days: 0,
        over60days: 0,
      },
    ],
    [listModuleDynamicLabels],
  );

  return (
    <div className={cx(styles.homepageContainer, 'homepage-container')}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.HOME_PAGE}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.Homepage,
        )}
      />
      <div className={styles.container}>
        <div className={styles.welcomeText}>
          {renderDynamicLabel(dynamicLabels, HOME_PAGE_DYNAMIC_LABEL.Welcome)}
          {', '}
          <span className={styles.username}>{userInfo?.username}!</span>
        </div>
        <Row gutter={[12, 0]}>
          <Col xs={12}>
            <div className="mt-3">
              <Row gutter={[12, 0]}>
                <Col span={12}>
                  <StatisticCard
                    body={renderDynamicLabel(
                      dynamicLabels,
                      HOME_PAGE_DYNAMIC_LABEL.Watchlist,
                    )}
                    subTitle={renderDynamicLabel(
                      dynamicLabels,
                      HOME_PAGE_DYNAMIC_LABEL.All,
                    )}
                    backgroundIconColor="#E6ECFF"
                    iconSrc={images.icons.icEyeHomepage}
                    text={analysisData?.numberOfWatchList || '0'}
                    key="#0842FF"
                    minHeight={143}
                    textValueColor="#0842FF"
                    hiddenViewMore
                  />
                </Col>
                <Col span={12}>
                  <StatisticCard
                    body={renderDynamicLabel(
                      dynamicLabels,
                      HOME_PAGE_DYNAMIC_LABEL['Vessel screening'],
                    )}
                    subTitle={renderDynamicLabel(
                      dynamicLabels,
                      HOME_PAGE_DYNAMIC_LABEL['High potential risks'],
                    )}
                    backgroundIconColor="#E6ECFF"
                    iconSrc={images.icons.icVesselHomePage}
                    text={analysisData?.numberOfVSHighPotentialRisk || '0'}
                    key="#0842FF"
                    minHeight={143}
                    textValueColor="#0842FF"
                    hiddenViewMore
                  />
                </Col>
              </Row>
            </div>
            <div className="mt-3">
              <Row gutter={[12, 0]}>
                <Col span={12}>
                  <StatisticCard
                    subTitle={renderDynamicLabel(
                      dynamicLabels,
                      HOME_PAGE_DYNAMIC_LABEL['Open actionables'],
                    )}
                    backgroundIconColor="#F9E6FF"
                    iconSrc={images.icons.icOpenActionable}
                    text={analysisData?.numberOfOpenActionable || '0'}
                    key="#964FFF"
                    minHeight={143}
                    textValueColor="#964FFF"
                    hiddenViewMore
                  />
                </Col>
                <Col span={12}>
                  <StatisticCard
                    subTitle={renderDynamicLabel(
                      dynamicLabels,
                      HOME_PAGE_DYNAMIC_LABEL['Overdue actionables'],
                    )}
                    backgroundIconColor="#FFE6FF"
                    iconSrc={images.icons.icOverdueActionable}
                    text={analysisData?.numberOfOverdueActionable || '0'}
                    key="#E042FA"
                    minHeight={143}
                    textValueColor="#E042FA"
                    hiddenViewMore
                  />
                </Col>
              </Row>
            </div>
            <div className="mt-3 calendar-container">
              <Col span={24}>
                <CalendarHomePage dynamicLabels={dynamicLabels} />
              </Col>
            </div>
          </Col>
          <Col xs={5}>
            <div className="mt-3">
              <StatisticCard
                body={renderDynamicLabel(
                  dynamicLabels,
                  HOME_PAGE_DYNAMIC_LABEL['Vessel screening'],
                )}
                subTitle={renderDynamicLabel(
                  dynamicLabels,
                  HOME_PAGE_DYNAMIC_LABEL['High observed risks'],
                )}
                backgroundIconColor="#E6ECFF"
                iconSrc={images.icons.icVesselHomePage}
                text={analysisData?.numberOfVSHighObservedRisk || '0'}
                key="#0842FF"
                minHeight={143}
                textValueColor="#0842FF"
                hiddenViewMore
              />
            </div>
            <div className="mt-3">
              <StatisticCard
                subTitle={renderDynamicLabel(
                  dynamicLabels,
                  HOME_PAGE_DYNAMIC_LABEL['New/Yet to start jobs'],
                )}
                backgroundIconColor="#E6FFEA"
                iconSrc={images.icons.icStartJob}
                text={analysisData?.numberOfNewYetToStart || '0'}
                key="#1ED39D"
                minHeight={143}
                textValueColor="#1ED39D"
                hiddenViewMore
              />
            </div>
            <div className="mt-3">
              <StatisticCard
                subTitle={renderDynamicLabel(
                  dynamicLabels,
                  HOME_PAGE_DYNAMIC_LABEL['Open records'],
                )}
                backgroundIconColor="#FFF8E6"
                iconSrc={images.icons.icRecordHomepage}
                text={analysisData?.numberOfOpenRecords || '0'}
                key="#FC9700"
                minHeight={143}
                textValueColor="#FC9700"
                hiddenViewMore
              />
            </div>
            <div className="mt-3">
              <StatisticCard
                subTitle={renderDynamicLabel(
                  dynamicLabels,
                  HOME_PAGE_DYNAMIC_LABEL.Overdues,
                )}
                backgroundIconColor="#FFEFE6"
                iconSrc={images.icons.icClockHomepage}
                text={analysisData?.numberOfOverdueRecords || '0'}
                key="#FF6E01"
                minHeight={143}
                textValueColor="#FF6E01"
                hiddenViewMore
              />
            </div>
          </Col>
          <Col xs={7}>
            <div className={cx(styles.activityContainer, 'mt-3')}>
              <div className={styles.myActivityTitle}>
                {renderDynamicLabel(
                  dynamicLabels,
                  HOME_PAGE_DYNAMIC_LABEL['My activity'],
                )}{' '}
              </div>
              {listNotifications?.length > 0 ? (
                listNotifications?.map((item) => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    getList={() => {}}
                    myActivityHomePage
                    dynamicLabels={dynamicLabels}
                  />
                ))
              ) : (
                <NoDataImg className={styles.noData} />
              )}
            </div>
          </Col>
        </Row>
        <div className={cx(styles.agingOpenRecordContainer, 'mt-3 mr-4')}>
          <div className={styles.agingOpenRecordsTitle}>
            {renderDynamicLabel(
              dynamicLabels,
              HOME_PAGE_DYNAMIC_LABEL['Aging open records'],
            )}
          </div>
          <TableAntd
            columns={renderAgingopenRecordsColumn(dynamicLabels)}
            dataSource={renderAgingopenRecordsRowData}
            rowHeight
          />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
