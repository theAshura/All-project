import { FC } from 'react';
import Highcharts from 'highcharts/highstock';
import HcMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';

interface Series {
  name: string;
  data: any;
  categories?: string[];
  color?: string;
}

interface Props {
  series?: Series[];
}

HcMore(Highcharts);

const RadarChartCustom: FC<Props> = ({ series }) => {
  const options = {
    chart: {
      polar: true,
      type: 'line',
    },
    title: {
      text: undefined,
    },

    pane: {
      size: '80%',
    },

    xAxis: {
      gridLineDashStyle: 'Dash',
      tickmarkPlacement: 'on',
      lineWidth: 0,
      gridLineWidth: 2,
      categories: series?.[0]?.categories || [],
      labels: {
        formatter(e) {
          const label = series?.[0]?.categories?.[e?.pos];
          const value = series?.[0]?.data?.[e?.pos];
          const labelPopulated =
            label?.length < 25 ? label : `${label?.slice(0, 25)}...`;
          return `<tspan style="font-size:16px">${value}</tspan><br/>
          <tspan  style="font-weight:400">${labelPopulated || ''}</tspan>`;
        },
        // align: 'center',
      },
    },

    yAxis: {
      gridLineDashStyle: 'Dash',
      gridLineInterpolation: 'polygon',
      dashWidth: 2,
      gridLineWidth: 2,
      lineWidth: 0,
      min: 0,
      labels: {
        formatter(e) {
          return `${e.value}`;
        },
      },
    },
    series: series || [],
    legend: false,
    credits: false,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RadarChartCustom;
