import { FC } from 'react';
import Highcharts from 'highcharts/highstock';
import cx from 'classnames';
import HcMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import styles from './chart.module.scss';

interface Series {
  name: string;
  data: any;
  color: string;
}

interface Props {
  series: Series[];
  badges?: any;
}

HcMore(Highcharts);

export const mockDataWindRose = [
  {
    name: '< 0.5 m/s',
    data: [
      ['CER', 10],
      ['DMT', 0],
      ['CPY', 0],
      ['ENE', 0.59],
      ['E', 0.62],
      ['ESE', 1.22],
      ['SE', 5],
      ['SSE', 2.04],
      ['S', 2.66],
      ['SSW', 2.96],
      ['SW', 2.53],
      ['WSW', 1.97],
      ['W', 1.64],
      ['WNW', 1.32],
      ['NW', 1.58],
      ['NNW', 1.51],
    ],
    color: '#0A84FF',
  },
  {
    name: '0.5-2 m/s',
    data: [
      ['CER', 1],
      ['DMT', 1],
      ['CPY', 0],
      ['ENE', 0.59],
      ['E', 2.2],
      ['ESE', 2.01],
      ['SE', 3.06],
      ['SSE', 3.42],
      ['S', 4.74],
      ['SSW', 4.14],
      ['SW', 1],
      ['WSW', 1],
      ['W', 1.71],
      ['WNW', 2.4],
      ['NW', 1],
      ['NNW', 1],
    ],
    color: '#5E5CE6',
  },
];

const WindRoseChartCustom: FC<Props> = ({ series, badges }) => {
  const options = {
    series,

    chart: {
      polar: true,
      type: 'column',
    },

    title: {
      text: undefined,
    },

    pane: {
      size: '85%',
    },

    legend: false,

    xAxis: {
      tickmarkPlacement: 'on',
      labels: {
        formatter(e) {
          const index = Number(e?.value);
          const label = series?.[0]?.data?.[index]?.[0];

          const values = series?.map((item) => item?.data?.[index]?.[1]);
          const color1 = series[0]?.color;
          const color2 = series[1]?.color;

          return `<tspan style="font-size:12px">${label}</tspan><br/> (<tspan style="font-size:12px" fill=${color1}>${values[0]}</tspan>, <tspan style="font-size:12px" fill=${color2}>${values[1]}</tspan>)`;
        },
      },
    },

    yAxis: {
      min: 0,
      endOnTick: false,
      showLastLabel: true,
      // title: {
      //   text: 'Frequency (%)',
      // },
      // labels: {
      //   formatter() {
      //     return `${this.value}`;
      //   },
      // },
      reversedStacks: false,
    },

    // tooltip: {
    //   pointFormat:
    //     '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.yValue:.2f}</b><br/>',
    // },

    plotOptions: {
      series: {
        stacking: 'normal',
        shadow: false,
        groupPadding: 0,
        pointPlacement: 'on',
      },
    },
    credits: false,
  };

  return (
    <div>
      {badges && (
        <div className={cx('mb-3', styles.badges)}>
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

export default WindRoseChartCustom;
