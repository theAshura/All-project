import HighchartsReact from 'highcharts-react-official';

const ChartWidget = ({ options, highcharts }) => (
  <div>
    <HighchartsReact
      highcharts={highcharts}
      constructorType="chart"
      options={options}
    />
  </div>
);

export default ChartWidget;
