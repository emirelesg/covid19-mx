import colors from 'vuetify/lib/util/colors';

export const hex2rgba = (hex, opacity) => {
  const parsedHex = hex.replace('#', '');
  const r = parseInt(parsedHex.substring(0, 2), 16);
  const g = parseInt(parsedHex.substring(2, 4), 16);
  const b = parseInt(parsedHex.substring(4, 6), 16);
  const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  return result;
};

export const baseBarOptions = color => ({
  type: 'bar',
  barPercentage: 0.7,
  borderWidth: 1,
  borderColor: colors[color].accent3,
  backgroundColor: hex2rgba(colors[color].accent4, 0.3),
  data: []
});

export const baseLineOptions = (color, shade, dashed) => ({
  type: 'line',
  borderDash: dashed ? [4, 4] : [0, 0],
  borderColor: colors[color][shade || 'base'],
  backgroundColor: hex2rgba(colors[color][shade || 'base'], 0.1),
  pointBackgroundColor: colors[color][shade || 'base'],
  pointHitRadius: 20,
  borderWidth: 2,
  data: []
});

export const baseChartOptions = (xLabel, yLabel, xOffset, yStart) => ({
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false
  },
  tooltips: {
    enabled: true
  },
  elements: {
    point: {
      pointStyle: 'circle',
      radius: 3
    },
    line: {
      tension: 0
    }
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        offset: xOffset || false,
        time: {
          tooltipFormat: 'LL'
        },
        scaleLabel: {
          display: true,
          labelString: xLabel
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: yStart === undefined,
          min: yStart
        },
        scaleLabel: {
          display: true,
          labelString: yLabel
        }
      }
    ]
  }
});
