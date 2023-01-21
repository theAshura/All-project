import { Col, Row } from 'antd/lib/grid';
import cx from 'classnames';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  clearSailReportingGeneralReportReducer,
  getSailReportingGeneralReportActions,
  getSailReportingLatestRecordsUpdateActions,
} from 'store/summary-sail-reporting/summary-sail-reporting.action';
import moment from 'moment';
import { DetailInformation } from './components/DetailInformation';
import { LatestRecordsUpdate } from './components/LatestRecordsUpdate';
import { StatisticList } from './components/StatisticList';
import styles from './summary.module.scss';

interface Props {
  className?: string;
}

export const SummaryContainer: FC<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(
      getSailReportingGeneralReportActions.request({
        vesselId: id,
        currentDate: moment().endOf('day').toISOString(),
      }),
    );
    dispatch(getSailReportingLatestRecordsUpdateActions.request(id));
    return () => {
      dispatch(clearSailReportingGeneralReportReducer());
    };
  }, [dispatch, id]);

  return (
    <div className={cx(styles.container, className)}>
      <Row gutter={[24, 0]}>
        <Col span={24} className={cx('pt-3')}>
          <StatisticList />
        </Col>
      </Row>
      <Row gutter={[24, 0]}>
        <Col span={12} className={cx('p-1 pt-3')}>
          <DetailInformation />
        </Col>
        <Col span={12} className={cx('pt-3')}>
          <LatestRecordsUpdate />
        </Col>
      </Row>
    </div>
  );
};
