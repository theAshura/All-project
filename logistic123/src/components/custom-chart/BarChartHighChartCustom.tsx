import { FC } from 'react';
import Highcharts from 'highcharts/highstock';
import HcMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import './highchart-custom.scss';

interface Props {
  data?: any;
  colors?: string[];
  labels?: string[];
}

HcMore(Highcharts);

const BarChartHighChartCustom: FC<Props> = ({ data, colors, labels }) => {
  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: labels || [],
      gridLineWidth: 0,
      scrollbar: {
        enabled: true,
      },
      labels: {
        rotation: -25,
      },
    },
    yAxis: {
      gridLineDashStyle: 'Dash',
      gridLineWidth: 2,
      minRange: 4,
      min: 0,
      title: {
        text: undefined,
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'normal',
          color:
            // theme
            (Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color) ||
            'gray',
          textOutline: 'none',
        },
      },
    },

    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          formatter() {
            const { y } = this;
            return y || '';
          },
        },
      },
    },
    colors: colors || ['#E9453A', '#FF9F0A', '#FFD80A', '#30D158', '#8e8c94'],
    series: data || [],
    legend: false,
    credits: false,
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChartHighChartCustom;
