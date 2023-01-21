import { I18nNamespace } from 'constants/i18n.const';
import cx from 'classnames';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendOfTime } from 'components/dashboard/components/trend-of-time-filter/TrendOfTimeFilter';
import { BarsOutlined, PieChartOutlined } from '@ant-design/icons';
import moment from 'moment';
import TableAntd, {
  ColumnTableType,
} from 'components/common/table-antd/TableAntd';
import {
  ChartInfoType,
  DoughnutChartNoSort,
} from 'components/common/chart/doughnut-chart/DoughnutChartNoSort';
import { formatToNumberPercent, randomColor } from 'helpers/utils.helper';
import { useDispatch, useSelector } from 'react-redux';
import Button, { ButtonType } from 'components/ui/button/Button';
import { getTypeOfIncidentActions } from '../../store/action';

import styles from '../detail.module.scss';

enum TYPE_DISPLAY {
  TABLE = 'TABLE',
  CHART = 'CHART',
}

export const columns: ColumnTableType[] = [
  {
    title: 'S.No',
    dataIndex: 'sNo',
    sortField: 'sNo',
    width: 60,
  },
  {
    title: 'Incident type',
    dataIndex: 'incidentType',
    sortField: 'incidentType',
    width: 200,
  },
  {
    title: 'Number of incidents',
    dataIndex: 'numberOfIncidents',
    sortField: 'numberOfIncidents',
    width: 200,
  },
  {
    title: 'Percentage',
    dataIndex: 'percentage',
    sortField: 'percentage',
    width: 200,
  },
];

const TypeOfIncidents = () => {
  const { t } = useTranslation(I18nNamespace.INCIDENTS);
  const dispatch = useDispatch();

  const { typeOfIncident } = useSelector((state) => state.incidents);

  const [trendSelected, setTimeTrendSelected] = useState<TrendOfTime>(
    TrendOfTime.M,
  );

  const [typeDisplay, setTypeDisplay] = useState<TYPE_DISPLAY>(
    TYPE_DISPLAY.CHART,
  );

  const [dataDisplay, setDataDisplay] = useState<ChartInfoType[]>([]);

  const data = useMemo(
    () =>
      typeOfIncident?.map((item) => ({
        name: item.typeName,
        value: Number(item.total),
        color: randomColor(),
      })),
    [typeOfIncident],
  );

  const totalNumber: number = useMemo(() => {
    let total = 0;
    data?.forEach((item) => {
      total += Number(item.value);
    });
    return total;
  }, [data]);

  const dataTable = useMemo(
    () =>
      typeOfIncident?.map((item, index) => ({
        sNo: index + 1,
        incidentType: item.typeName,
        numberOfIncidents: Number(item.total),
        percentage: formatToNumberPercent(Number(item.total), totalNumber),
      })),
    [totalNumber, typeOfIncident],
  );

  useEffect(() => {
    let subtractDate = 0;
    switch (trendSelected) {
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

    dispatch(
      getTypeOfIncidentActions.request({
        fromDate: priorDate.toISOString(),
        toDate: moment().toISOString(),
      }),
    );
  }, [dispatch, trendSelected]);

  useEffect(() => {
    if (!dataDisplay?.length) {
      setDataDisplay(data);
    } else {
      setDataDisplay((prev) =>
        data?.map((valueData) => {
          const finding = prev?.find((i) => i.name === valueData?.name);
          return finding
            ? { ...valueData, color: finding.color }
            : {
                ...valueData,
                color: randomColor(),
              };
        }),
      );
    }
  }, [data, dataDisplay?.length]);

  return (
    <div className={cx(styles.containerWrapper, 'd-flex flex-column h-100')}>
      <div className="d-flex justify-content-between align-items-center">
        <div className={cx(styles.title)}>{t('title.typeOfIncidents')}</div>
        <div className="d-flex ">
          <Button
            className={styles.btnChart}
            buttonType={
              trendSelected === TrendOfTime.W
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeTrendSelected(TrendOfTime.W)}
          >
            1W
          </Button>
          <Button
            className={styles.btnChart}
            buttonType={
              trendSelected === TrendOfTime.M
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeTrendSelected(TrendOfTime.M)}
          >
            1M
          </Button>
          <Button
            className={styles.btnChart}
            buttonType={
              trendSelected === TrendOfTime.M3
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeTrendSelected(TrendOfTime.M3)}
          >
            3M
          </Button>
          <Button
            className={styles.btnChart}
            buttonType={
              trendSelected === TrendOfTime.Y
                ? ButtonType.BlueChart
                : ButtonType.CancelOutline
            }
            onClick={() => setTimeTrendSelected(TrendOfTime.Y)}
          >
            1Y
          </Button>

          <Button
            className={cx(styles.btnType, 'ms-3', {
              [styles.active]: typeDisplay === TYPE_DISPLAY.CHART,
            })}
            buttonType={ButtonType.OutlineGray}
            onClick={() => setTypeDisplay(TYPE_DISPLAY.CHART)}
          >
            <PieChartOutlined />
          </Button>
          <Button
            className={cx(styles.btnType, {
              [styles.active]: typeDisplay === TYPE_DISPLAY.TABLE,
            })}
            buttonType={ButtonType.OutlineGray}
            onClick={() => setTypeDisplay(TYPE_DISPLAY.TABLE)}
          >
            <BarsOutlined />
          </Button>
        </div>
      </div>
      <div className={cx(styles.chartTypeDoughnut, 'pb-4 ')}>
        {typeDisplay === TYPE_DISPLAY.CHART ? (
          <>
            <DoughnutChartNoSort
              isHorizon
              isChartCenter
              data={dataDisplay}
              className="d-flex flex-column justify-content-center "
              styleChartDoughnut={styles.styleChartDoughnut}
              styleChartInfo={styles.styleChartInfo}
              marginOnChart={false}
            />
          </>
        ) : (
          <>
            <TableAntd
              columns={columns}
              dataSource={dataTable}
              scroll={{ x: 'max-content', y: 290 }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TypeOfIncidents;
