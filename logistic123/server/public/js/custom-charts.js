// bouble chart
function bubbleChart() {
  Highcharts.chart('category-overview-chart', {
    chart: {
      type: 'bubble',
      plotBorderWidth: 0,
      zoomType: 'xy',
      marginTop: 40,
      // width: 500,
      // height: 270,
      marginRight: 0,
    },

    legend: {
      align: 'right',
      verticalAlign: 'top',
      x: 0,
      y: -10,
      rtl: false,
      borderRadius: 0,
    },

    title: null,

    credits: {
      enabled: false,
    },

    accessibility: {
      point: {
        valueDescriptionFormat:
          '{index}. {point.name}, fat: {point.x}g, sugar: {point.y}g, obesity: {point.z}%.',
      },
    },

    xAxis: {
      gridLineWidth: 1,
      title: {
        text: 'Total Weighted Score',
      },

      tickInterval: 10,
      gridLineWidth: 0,
      minorGridLineWidth: 0,

      accessibility: {
        rangeDescription: 'Range: 60 to 100 grams.',
      },
    },

    yAxis: {
      startOnTick: false,
      endOnTick: false,
      title: {
        text: 'Total Findings',
      },
      tickInterval: 1,

      maxPadding: 0.2,
      accessibility: {
        rangeDescription: 'Range: 0 to 160 grams.',
      },
    },

    tooltip: {
      useHTML: true,
      headerFormat: '<table>',
      pointFormat:
        '<tr><th>Weighted:</th><td>{point.x}</td></tr>' +
        '<tr><th>Findings:</th><td>{point.y}</td></tr>',
      footerFormat: '</table>',
      followPointer: true,
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.name}',
        },
      },
    },

    exporting: {
      enabled: false,
    },

    series: [
      {
        name: 'Main Category',
        data: buble_main_cat,
        marker: {
          fillColor: '#5ebe64',
        },
      },
      {
        name: '1st Sub Category',
        data: buble_sub_cat,
        marker: {
          fillColor: '#f7a45e ',
        },
      },
      {
        name: 'Location',
        data: buble_loc_cat,
        marker: {
          fillColor: '#457b9d ',
        },
      },
    ],
  });
}

// number of finding -> main category
function main_polar() {
  Highcharts.chart('num-of-mc-chart', {
    credits: {
      enabled: false,
    },

    chart: {
      polar: true,
      // width: 280,
      // height: 300
    },

    accessibility: {
      description: 'accessibility description comes here',
    },

    title: null,

    pane: {
      size: '80%',
    },

    xAxis: {
      categories: polar_main_cat,
      tickmarkPlacement: 'on',
      lineWidth: 0,
      gridLineColor: '#00000038',
      gridLineWidth: 1,
      labels: {
        // align: 'center',
        // reserveSpace: true,
        // format: '<p>{value}<p>',
        // useHTML: true,
        style: {
          fontSize: '7.5px',
        },
      },
    },

    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      gridLineColor: '#00000038',
      gridLineWidth: 1,
      min: -1,
    },

    tooltip: {
      shared: true,
      pointFormat:
        '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>',
    },

    legend: true,

    exporting: {
      enabled: false,
    },

    series: [
      {
        name: 'Main category',
        data: polar_main_data,
        pointPlacement: 'on',
        color: '#507c95',
      },
    ],
  });
}

// number of finding -> sub category
function first_sub_findings() {
  Highcharts.chart('num-of-sc-chart', {
    chart: {
      type: 'column',
      // width: 400,
      // height: 300
    },
    title: null,
    xAxis: {
      categories: sub_findings_cat,
    },

    credits: {
      enabled: false,
    },

    yAxis: {
      min: 0,
      title: null,
      gridLineColor: '#00000038',
      gridLineWidth: 1,
      allowDecimals: false,
    },
    legend: false,
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: '#000000',
          style: {
            fontWeight: 'bold',
          },
          formatter: function () {
            if (this.y != 0) {
              return this.y;
            } else {
              return null;
            }
          },
        },
      },
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        name: 'High',
        data: sub_findings_high,
        color: '#ff7882',
      },
      {
        name: 'Medium',
        data: sub_findings_med,
        color: '#ffc371',
      },
      {
        name: 'low',
        data: sub_findings_low,
        color: '#70ffb1',
      },
    ],
  });
}

// number of finding -> location wise
function loc_findings() {
  Highcharts.chart('num-of-lw-chart', {
    chart: {
      type: 'column',
      // width: 400,
      // height: 300
    },
    title: null,
    xAxis: {
      categories: loc_findings_cat,
      labels: {
        style: {
          fontSize: '0.8em',
        },
      },
    },

    credits: {
      enabled: false,
    },

    yAxis: {
      min: 0,
      title: null,
      gridLineColor: '#00000038',
      gridLineWidth: 1,
      allowDecimals: false,
    },

    legend: false,

    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },
    exporting: {
      enabled: false,
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: '#000000',
          style: {
            fontWeight: 'bold',
          },
          formatter: function () {
            if (this.y != 0) {
              return this.y;
            } else {
              return null;
            }
          },
        },
      },
    },

    series: [
      {
        name: 'High',
        data: loc_findings_count_high,
        color: '#ff7882',
      },
      {
        name: 'Medium',
        data: loc_findings_count_med,
        color: '#ffc371',
      },
      {
        name: 'low',
        data: loc_findings_count_low,
        color: '#70ffb1',
      },
    ],
  });
}

// WEIGHTED -> main category
function main_cat_weigh() {
  Highcharts.chart('weighted-mc-chart', {
    credits: {
      enabled: false,
    },

    chart: {
      polar: true,
      // width: 280,
      // height: 300
    },

    accessibility: {
      description: 'accessibility description comes here',
    },

    title: null,

    pane: {
      size: '80%',
    },

    xAxis: {
      categories: polar_main_weigh_cat,
      tickmarkPlacement: 'on',
      lineWidth: 0,
      gridLineColor: '#00000038',
      gridLineWidth: 1,
      labels: {
        style: {
          fontSize: '9px',
        },
      },
    },

    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      gridLineColor: '#00000038',
      gridLineWidth: 1,
      min: -1,
    },
    exporting: {
      enabled: false,
    },

    tooltip: {
      shared: true,
      pointFormat:
        '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>',
    },

    legend: false,

    series: [
      {
        name: 'Main category',
        data: main_weigh_data,
        pointPlacement: 'on',
        color: '#507c95',
      },
    ],
  });
}

// WEIGHTED -> sub category
function first_sub_weigh() {
  Highcharts.chart('weighted-sc-chart', {
    chart: {
      type: 'column',
      // width: 280,
      // height: 300
    },
    title: null,
    xAxis: {
      categories: sub_findings_cat,
    },

    credits: {
      enabled: false,
    },

    exporting: {
      enabled: false,
    },

    yAxis: {
      min: 0,
      title: null,
      gridLineColor: '#00000038',
      gridLineWidth: 1,
      allowDecimals: false,
    },
    legend: false,
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: '#000000',
          style: {
            fontWeight: 'bold',
          },
          formatter: function () {
            if (this.y != 0) {
              return this.y;
            } else {
              return null;
            }
          },
        },
      },
    },
    series: [
      {
        name: 'High',
        data: sub_weigh_high,
        color: '#e63946',
      },
      {
        name: 'Medium',
        data: sub_weigh_med,
        color: '#ff9f1c',
      },
      {
        name: 'low',
        data: sub_weigh_low,
        color: '#00b050',
      },
    ],
  });
}

// WEIGHTED -> location wise
function loc_weigh() {
  Highcharts.chart('weighted-lw-chart', {
    chart: {
      type: 'column',
      // width: 280,
      // height: 300
    },
    title: null,
    xAxis: {
      categories: loc_findings_cat,
      labels: {
        style: {
          fontSize: '0.8em',
        },
      },
    },
    exporting: {
      enabled: false,
    },

    credits: {
      enabled: false,
    },

    yAxis: {
      min: 2,
      title: null,
      gridLineColor: '#00000038',
      gridLineWidth: 1,
      allowDecimals: false,
    },

    legend: false,

    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: '#000000',
          allowOverlap: true,
          style: {
            fontWeight: 'bold',
          },
          formatter: function () {
            if (this.y != 0) {
              return this.y;
            } else {
              return null;
            }
          },
        },
      },
    },

    series: [
      {
        name: 'High',
        data: loc_weigh_count_high,
        color: '#e63946',
      },
      {
        name: 'Medium',
        data: loc_weigh_count_med,
        color: '#ff9f1c',
      },
      {
        name: 'low',
        data: loc_weigh_count_low,
        color: '#00b050',
      },
    ],
  });
}

// gauge chart
function gaugeChart() {
  const $chart = $('.container-gauge');
  const width = 350;
  const height = 350;
  const radius = height / 2;
  const ringInset = 20;
  const ringWidth = 40;
  const degrees = 180;
  const minAngle = -90;
  const maxAngle = 90;
  const range = maxAngle - minAngle;
  const labelInset = -5;
  const pointerLineHeight = -radius * 0.8;
  const pointerLineData = [
    [1.5, 0],
    [1.5, pointerLineHeight],
    [0, pointerLineHeight - 5],
    [-1.5, pointerLineHeight],
    [-1.5, 0],
  ];
  const data = [
    { value: gauge_Data, label: gauge_Data_label },
    { min: 0, max: 19, color: '#00b050' },
    { min: 20, max: 49, color: '#ff9f1c' },
    { min: 50, max: 100, color: '#e63946' },
  ];

  const value = data.find((item) => item.hasOwnProperty('value')) || {
    value: 0,
  };
  const ranges = data.reduce((filtered, item) => {
    if (item.hasOwnProperty('min') && item.hasOwnProperty('max')) {
      filtered.push(item);
    }
    return filtered;
  }, []);

  const deg2rad = (deg) => (deg * Math.PI) / 180;
  const centerTx = () => `translate(${radius + 5}, ${radius})`;

  const scale = d3.scale
    .linear()
    .range([0, 1])
    .domain([
      Math.min(...ranges.map((range) => range.min)),
      Math.max(...ranges.map((range) => range.max)),
    ]);

  const ticks = scale.ticks(ranges.length);
  const tickData = d3.range(ranges.length).map(() => 1 / ranges.length);

  const arc = d3.svg
    .arc()
    .innerRadius(radius - ringWidth - ringInset)
    .outerRadius(radius - ringInset)
    .startAngle((d, i) => deg2rad(minAngle + d * i * degrees))
    .endAngle((d, i) => deg2rad(minAngle + d * (i + 1) * degrees));

  const svg = d3
    .select('.container-gauge')
    .append('svg')
    .attr('class', 'gauge')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr(
      'viewBox',
      '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height),
    )
    .attr('preserveAspectRatio', 'xMinYMin');

  const arcs = svg
    .append('g')
    .attr('class', 'arc')
    // .attr('transform', centerTx);
    .attr(
      'transform',
      'translate(' +
        Math.min(width, height) / 2 +
        ',' +
        Math.min(width, height) / 2 +
        ')',
    );

  arcs
    .selectAll('path')
    .data(tickData)
    .enter()
    .append('path')
    .attr('fill', (_, i) => ranges[i].color)
    .attr('d', arc)
    .attr('id', (_, i) => `arc-${i}`);

  arcs
    .selectAll('text.label')
    .data(ticks)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('dy', labelInset)
    .append('textPath')
    .attr('href', (_, i) => `#arc-${i}`)
    .text((d, i) => {
      const item = data.find(
        (item) => d === item.min && item.hasOwnProperty('label'),
      );
      if (item) {
        return item.label;
      }
    });

  arcs
    .selectAll('text.description')
    .data(ticks)
    .enter()
    .append('text')
    .attr('class', 'description')
    .attr('dy', labelInset - 15)
    .append('textPath')
    .attr('href', (_, i) => `#arc-${i}`)
    .text((d, i) => {
      const item = data.find(
        (item) => d === item.min && item.hasOwnProperty('description'),
      );
      if (item) {
        return item.description;
      }
    });

  const pointerGroup = svg
    .append('g')
    .data([pointerLineData])
    .attr('class', 'pointer')
    .attr('transform', centerTx);

  const pointerLine = d3.svg.line();

  pointerGroup
    .append('path')
    .attr('d', pointerLine)
    .attr('transform', `rotate(${minAngle})`)
    .transition()
    .duration(3000)
    .ease('elastic')
    .attr('transform', `rotate(${minAngle + scale(value.value) * range})`);

  pointerGroup.append('circle').attr('r', 7);

  const mainLegendGroup = svg
    .append('g')
    .attr('class', 'main-label')
    .attr('transform', `translate(10, ${radius + 10})`);

  mainLegendGroup
    .append('text')
    .attr('class', 'label')
    .attr('y', 35)
    .attr('x', radius)
    .attr('text-anchor', 'middle')
    .text(value.label || value.value);

  mainLegendGroup
    .append('text')
    .attr('class', 'description')
    .attr('y', 55)
    .attr('x', radius)
    .attr('text-anchor', 'middle')
    .text(value.description);

  mainLegendGroup
    .append('text')
    .attr('class', 'description-gauge')
    .attr('y', 55)
    .attr('x', radius)
    .attr('text-anchor', 'middle')
    .text('(Total Finding Weighted Score)');
}

function windRoseMain() {
  // Parse the data from an inline table using the Highcharts Data plugin
  Highcharts.chart('container-main', {
    data: {
      table: 'freq',
      startRow: 1,
      endRow: 60,
      endColumn: 2,
    },

    chart: {
      polar: true,
      type: 'column',
    },

    colors: ['#5ebe64', '#999'],

    title: {
      text: 'Main Category',
      align: 'left',
      useHTML: true,
      style: {
        fontWeight: 'bolder',
        fontSize: '14px',
        textTransform: 'uppercase',
        fontFamily: 'sans-serif',
      },
    },

    // subtitle: {
    //     text: 'Source: or.water.usgs.gov'
    // },

    pane: {
      size: '75%',
      background: {
        outerRadius: '100%',
        backgroundColor: '#fff',
      },
      center: ['40%'],
    },
    exporting: false,

    legend: {
      align: 'left',
      verticalAlign: 'top',
      y: 50,
      itemMarginBottom: 20,
      // layout: 'vertical'
    },

    xAxis: {
      tickmarkPlacement: 'on',
      labels: {
        style: {
          fontSize: '7px',
        },
      },
    },

    yAxis: {
      min: 0,
      endOnTick: true,
      showLastLabel: true,
      // title: {
      //     text: 'Frequency (%)'
      // },
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      reversedStacks: false,
    },

    // tooltip: {
    //     valueSuffix: '%'
    // },

    plotOptions: {
      series: {
        stacking: 'normal',
        shadow: false,
        groupPadding: 0,
        pointPlacement: 'on',
        // dataLabels: {
        //   enabled: true,
        //   color: '#000000',
        //   inside: false,
        // }
      },
    },
  });
}

function windRoseLoc() {
  // Parse the data from an inline table using the Highcharts Data plugin
  Highcharts.chart('container-loc', {
    data: {
      table: 'freq1',
      startRow: 1,
      endRow: 60,
      endColumn: 2,
      // useHTML: true,
    },

    chart: {
      polar: true,
      type: 'column',
      // width: 305,
      // height: 335,
    },

    colors: ['#457B9D', '#999'],

    title: {
      text: 'Location',
      align: 'left',
      useHTML: true,
      style: {
        fontWeight: 'bolder',
        fontSize: '14px',
        textTransform: 'uppercase',
        fontFamily: 'sans-serif',
      },
    },

    // subtitle: {
    //     text: 'Source: or.water.usgs.gov'
    // },

    pane: {
      size: '75%',
      background: {
        outerRadius: '100%',
        backgroundColor: '#fff',
      },
      center: ['40%'],
    },
    exporting: false,

    legend: {
      align: 'left',
      verticalAlign: 'top',
      y: 50,
      itemMarginBottom: 20,
      // layout: 'vertical'
    },

    xAxis: {
      tickmarkPlacement: 'on',
      labels: {
        style: {
          fontSize: '7px',
        },
      },
    },

    yAxis: {
      min: 0,
      endOnTick: false,
      showLastLabel: true,
      // title: {
      //     text: 'Frequency (%)'
      // },
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      reversedStacks: false,
    },

    // tooltip: {
    //     valueSuffix: '%'
    // },

    plotOptions: {
      series: {
        stacking: 'normal',
        shadow: false,
        groupPadding: 0,
        pointPlacement: 'on',
        // dataLabels: {
        //   enabled: true,
        //   color: '#000000',
        //   inside: false,
        // }
      },
    },
  });
}

function windRoseSub() {
  // Parse the data from an inline table using the Highcharts Data plugin
  Highcharts.chart('container-sub', {
    data: {
      table: 'freq2',
      startRow: 1,
      endRow: 80,
      endColumn: 5,
    },

    chart: {
      polar: true,
      type: 'column',
      // width: 305,
      // height: 335,
    },

    colors: ['#F7A45E', '#999'],

    title: {
      text: '1st Sub Category',
      align: 'left',
      useHTML: true,
      style: {
        fontWeight: 'bolder',
        fontSize: '14px',
        textTransform: 'uppercase',
        fontFamily: 'sans-serif',
      },
    },

    pane: {
      size: '75%',
      background: {
        outerRadius: '100%',
        backgroundColor: '#fff',
      },
      center: ['40%'],
    },
    exporting: false,

    legend: {
      align: 'left',
      verticalAlign: 'top',
      y: 50,
      itemMarginBottom: 20,
      // layout: 'vertical',
      // useHTML: true,
      // style: {
      //   'fontWeight': '100'
      // }
    },

    xAxis: {
      tickmarkPlacement: 'on',
      labels: {
        style: {
          fontSize: '7px',
        },
      },
    },

    yAxis: {
      min: 0,
      endOnTick: false,
      showLastLabel: true,
      // title: {
      //     text: 'Frequency (%)'
      // },
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      reversedStacks: false,
    },

    // tooltip: {
    //     valueSuffix: '%'
    // },

    plotOptions: {
      series: {
        stacking: 'normal',
        shadow: false,
        groupPadding: 0,
        pointPlacement: 'on',
        // color: '#777'
        // dataLabels: {
        //   enabled: true,
        //   color: '#000000',
        // }
      },
    },
  });
}
