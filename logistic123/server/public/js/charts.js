// var gaugeOptions = {
//     chart: {
//         type: 'solidgauge',
//         height: 200,
//         width: 200
//     },

//     title: {
//         text: 'Vessel Potential Risk'
//     },

//     pane: {
//         // center: ['50%', '75%'],
//         // size: '140%',
//         startAngle: -90,
//         endAngle: 90,
//         background: {
//             backgroundColor:
//                 Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
//             innerRadius: '60%',
//             outerRadius: '100%',
//             shape: 'arc'
//         }
//     },
//     exporting: {
//         enabled: false
//       },

//     tooltip: {
//         enabled: false
//     },

//     // the value axis
//     yAxis: {
//         stops: [
//             [0.1, '#55BF3B'], // green
//             [0.5, '#DDDF0D'], // yellow
//             [0.9, '#DF5353'] // red
//         ],
//         lineWidth: 0,
//         tickWidth: 0,
//         minorTickInterval: null,
//         tickAmount: 1,
//         title: {
//             y: -70
//         },
//         labels: {
//             y: 16
//         }
//     },

//     plotOptions: {
//         solidgauge: {
//             dataLabels: {
//                 y: 5,
//                 borderWidth: 0,
//                 useHTML: true
//             }
//         }
//     }
// };

// The speed gauge
// var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
//     yAxis: {
//         min: 0,
//         max: 100,
//         // title: {
//         //     text: 'Speed'
//         // }
//     },
//     exporting: {
//         enabled: false
//       },
//     credits: {
//         enabled: false
//     },
//     series: [{
//         name: 'Speed',
//         data: [10,50,60],
//         // dataLabels: {
//         //     format:
//         //         '<div style="text-align:center">' +
//         //         '<span style="font-size:25px">{y}</span><br/>' +
//         //         '<span style="font-size:12px;opacity:0.4">km/h</span>' +
//         //         '</div>'
//         // },
//         // tooltip: {
//         //     valueSuffix: ' km/h'
//         // }
//     }]

// }));

// *****************************************************************************************************************************************
// main category overview
Highcharts.chart('container', {
  chart: {
    type: 'bubble',
    plotBorderWidth: 1,
    zoomType: 'xy',
    height: 300,
  },

  legend: {
    enabled: true,
  },

  title: {
    text: null,
  },
  // subtitle: {
  //     text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
  // },

  accessibility: {
    point: {
      valueDescriptionFormat:
        '{index}. {point.name}, fat: {point.x}g, sugar: {point.y}g, obesity: {point.z}%.',
    },
  },
  exporting: {
    enabled: false,
  },
  xAxis: {
    gridLineWidth: 1,
    title: {
      text: 'Total weight score',
    },
    labels: {
      format: '{value}',
    },
    // plotLines: [{
    //     color: 'black',
    //     // dashStyle: 'dot',
    //     width: 2,
    //     value: 65,
    //     // label: {
    //     //     rotation: 0,
    //     //     y: 15,
    //     //     style: {
    //     //         fontStyle: 'italic'
    //     //     },
    //     //     text: 'Safe fat intake 65g/day'
    //     // },
    //     zIndex: 3
    // }],
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
    labels: {
      format: '{value}',
    },
    maxPadding: 0.2,
    // plotLines: [{
    //     color: 'black',
    //     dashStyle: 'dot',
    //     width: 2,
    //     value: 50,
    //     label: {
    //         align: 'right',
    //         style: {
    //             fontStyle: 'italic'
    //         },
    //         text: 'Safe sugar intake 50g/day',
    //         x: -10
    //     },
    //     zIndex: 3
    // }],
    accessibility: {
      rangeDescription: 'Range: 0 to 160 grams.',
    },
  },

  tooltip: {
    useHTML: true,
    headerFormat: '<table>',
    pointFormat:
      '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
      '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
      '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
      '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
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

  series: [
    {
      data: [
        { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
        { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
        { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
        { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
        { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
        { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
        { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
      ],
    },
    {
      data: [
        { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
        { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
        { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
        { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
        { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
        { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
        { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' },
      ],
    },
  ],
});

// ****************************************************************************************************************************************************************
// polar
Highcharts.chart('container-polar', {
  exporting: {
    enabled: false,
  },
  chart: {
    polar: true,
    height: 300,
  },

  title: null,

  // pane: {
  //     startAngle: 0,
  //     endAngle: 360
  // },

  xAxis: {
    // tickInterval: 45,
    // min: 0,
    // max: 360,
    labels: {
      format: 'category',
    },
  },

  yAxis: {
    min: 10,
  },

  plotOptions: {
    series: {
      pointStart: 0,
      pointInterval: 45,
    },
    column: {
      pointPadding: 0,
      groupPadding: 0,
    },
  },

  series: [
    {
      type: 'line',
      name: 'Line',
      data: [10, 20, 30, 40, 50, 60],
    },
  ],
});

// *****************************************************************************************************************************************************************
// stackone
// Highcharts.chart('container-stackOne', {
//     chart: {
//         type: 'column',
//         height: 300
//     },
//     exporting: {
//         enabled: false
//       },
//     title: null,
//     xAxis: {
//         categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
//     },
//     yAxis: {
//         min: 0,
//         // title: {
//         //     text: 'Total fruit consumption'
//         // },
//         stackLabels: {
//             enabled: true,
//             style: {
//                 fontWeight: 'bold',
//                 color: ( // theme
//                     Highcharts.defaultOptions.title.style &&
//                     Highcharts.defaultOptions.title.style.color
//                 ) || 'gray'
//             }
//         }
//     },
//     legend: {
//         align: 'right',
//         x: -30,
//         verticalAlign: 'top',
//         y: 25,
//         floating: true,
//         backgroundColor:
//             Highcharts.defaultOptions.legend.backgroundColor || 'white',
//         borderColor: '#CCC',
//         borderWidth: 1,
//         shadow: false
//     },
//     tooltip: {
//         headerFormat: '<b>{point.x}</b><br/>',
//         pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
//     },
//     plotOptions: {
//         column: {
//             stacking: 'normal',
//             dataLabels: {
//                 enabled: true
//             }
//         }
//     },
//     series: [{
//         name: 'John',
//         data: [5, 3, 4, 7, 2]
//     }, {
//         name: 'Jane',
//         data: [2, 2, 3, 2, 1]
//     }, {
//         name: 'Joe',
//         data: [3, 4, 4, 2, 5]
//     }]
// });
