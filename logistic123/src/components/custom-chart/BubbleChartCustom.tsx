/* eslint-disable func-names */
import { FC } from 'react';
import Highcharts from 'highcharts/highstock';
import HcMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './chart.module.scss';
import { IDynamicLabel } from '../../models/api/dynamic/dynamic.model';

// interface Series {
//   x: number;
//   y: number;
//   z?: number;
//   name: string;
//   country: string;
//   color: string;
// }

// const mockData = [
//   {
//     x: 95,
//     y: 95,
//     z: 13.8,
//     name: 'BE',
//     country: 'Belgium',
//     color: '#0A84FF',
//   },
//   {
//     x: 86.5,
//     y: 102.9,
//     z: 14.7,
//     name: 'DE',
//     country: 'Germany',
//     color: '#0A84FF',
//   },
//   {
//     x: 80.8,
//     y: 91.5,
//     z: 15.8,
//     name: 'FI',
//     country: 'Finland',
//     color: '#0A84FF',
//   },
//   {
//     x: 80.4,
//     y: 102.5,
//     z: 12,
//     name: 'NL',
//     country: 'Netherlands',
//     color: '#0A84FF',
//   },
//   {
//     x: 80.3,
//     y: 86.1,
//     z: 11.8,
//     name: 'SE',
//     country: 'Sweden',
//     color: '#FF9F0A',
//   },
//   {
//     x: 78.4,
//     y: 70.1,
//     z: 16.6,
//     name: 'ES',
//     country: 'Spain',
//     color: '#FF9F0A',
//   },
//   {
//     x: 74.2,
//     y: 68.5,
//     z: 14.5,
//     name: 'FR',
//     country: 'France',
//     color: '#FF9F0A',
//   },
//   {
//     x: 73.5,
//     y: 83.1,
//     z: 10,
//     name: 'NO',
//     country: 'Norway',
//     color: '#FF9F0A',
//   },
//   {
//     x: 71,
//     y: 93.2,
//     z: 24.7,
//     name: 'UK',
//     country: 'United Kingdom',
//     color: '#FF9F0A',
//   },
//   {
//     x: 69.2,
//     y: 57.6,
//     z: 10.4,
//     name: 'IT',
//     country: 'Italy',
//     color: '#FF9F0A',
//   },
//   {
//     x: 68.6,
//     y: 20,
//     z: 16,
//     name: 'RU',
//     country: 'Russia',
//     color: '#FF9F0A',
//   },
//   {
//     x: 65.5,
//     y: 126.4,
//     z: 35.3,
//     name: 'US',
//     country: 'United States',
//     color: '#FF9F0A',
//   },
//   {
//     x: 65.4,
//     y: 50.8,
//     z: 28.5,
//     name: 'HU',
//     country: 'Hungary',
//     color: '#30D158',
//   },
//   {
//     x: 63.4,
//     y: 51.8,
//     z: 15.4,
//     name: 'PT',
//     country: 'Portugal',
//     color: '#30D158',
//   },
//   {
//     x: 64,
//     y: 82.9,
//     z: 31.3,
//     name: 'NZ',
//     country: 'New Zealand',
//     color: '#30D158',
//   },
// ];

interface Props {
  data?: any;
  badges?: any;
  xAxisTitle?: string;
  yAxisTitle?: string;
  dynamicLabels?: IDynamicLabel;
}

HcMore(Highcharts);

const BubbleChartCustom: FC<Props> = ({
  data,
  xAxisTitle,
  yAxisTitle,
  badges,
  dynamicLabels,
}) => {
  const options = {
    chart: {
      type: 'bubble',
      plotBorderWidth: 1,
      zoomType: 'xy',
    },

    legend: {
      enabled: false,
    },

    title: {
      text: undefined,
    },

    xAxis: {
      min: 0,
      minRange: 4,
      gridLineDashStyle: 'Dash',
      title: {
        text:
          xAxisTitle ||
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Total weighted score'],
          ),
      },
      labels: {
        format: '{value}',
      },
    },

    yAxis: {
      min: 0,
      minRange: 4,
      startOnTick: false,
      endOnTick: false,
      title: {
        text:
          yAxisTitle ||
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Total findings'],
          ),
      },

      labels: {
        format: '{value}',
      },
      maxPadding: 0.2,
    },
    tooltip: {
      useHTML: true,
      headerFormat: '',
      pointFormat: '<div colspan="2">{point.name}</div>',
      footerFormat: '',
      followPointer: true,
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          // eslint-disable-next-line object-shorthand
          formatter: function (e) {
            const { key } = this;
            const label = key?.length > 6 ? `${key?.slice(0, 6)}...` : key;
            return label;
          },
        },
      },
      bubble: {
        minSize: 40,
        maxSize: 40,
      },
    },

    series: [{ data }],
    credits: false,
  };

  return (
    <div>
      {badges && (
        <div className={styles.badges}>
          {badges?.map((item) => (
            <div className={styles.badge} key={item.name}>
              <div className={styles.dot} style={{ background: item.color }} />
              <div className={styles.label}>{item.name}</div>
            </div>
          ))}
        </div>
      )}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BubbleChartCustom;
