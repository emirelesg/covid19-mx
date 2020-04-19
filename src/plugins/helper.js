import colors from 'vuetify/lib/util/colors';
import moment from 'moment';

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
  borderWidth: 2,
  borderDash: dashed ? [4, 4] : [0, 0],
  borderColor: colors[color][shade || 'base'],
  backgroundColor: 'rgba(0, 0, 0, 0)',
  pointBackgroundColor: colors[color][shade || 'base'],
  pointHitRadius: 10,
  pointHoverRadius: 4,
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
  hover: {
    axis: 'xy',
    animationDuration: 0
  },
  elements: {
    point: {
      pointStyle: 'circle',
      radius: 2
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
        gridLines: {
          color: 'rgba(0,0,0,0)'
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

export const afterBuildTicks = chart => {
  const ticks = [1, 10, 100, 1000, 10000, 100000, 1000000];
  chart.ticks.splice(0, chart.ticks.length);
  chart.ticks.push(...ticks);
};

export const readableLog = value => {
  if (value === 1000000) return '1M';
  if (value === 100000) return '100K';
  if (value === 10000) return '10K';
  if (value === 1000) return '1K';
  if (value === 100) return '100';
  if (value === 10) return '10';
  if (value === 0) return '0';
  return null;
};

export const round = (num, dec) => +(Math.round(num + `e+${dec}`) + `e-${dec}`);

export const processTimeseries = timeseries => {
  // Timeseries is an array, where each element is an object with the following properties:
  // date, confirmed, deaths, suspected
  // The goal is to make an analysis on the timeseries, the resulting data is used by several components.

  // Convert the date to a moment object.
  // Add deltas and growth factors.
  const extendedTimeseries = timeseries.map((data, i) => {
    const prevConfirmed = timeseries[i > 0 ? i - 1 : i].confirmed;
    return {
      ...data,
      date: moment(data.date),
      confirmedDelta: data.confirmed - prevConfirmed,
      confirmedGrowthFactor: round(data.confirmed / prevConfirmed, 4)
    };
  });

  // The last object of the timeseries is the latest data.
  // Also change the hour to 13h since at that hour the data is updated.
  const latest = extendedTimeseries[extendedTimeseries.length - 1];
  latest.updateDate = moment(latest.date)
    .add('13', 'hour')
    .fromNow();

  return {
    timeseries: extendedTimeseries,
    latest
  };
};

export const stateNames = {
  bs: 'Baja California Sur',
  cdmx: 'Ciudad de México',
  bc: 'Baja California',
  sl: 'San Luis Potosí',
  ag: 'Aguascalientes',
  qr: 'Quintana Roo',
  gj: 'Guanajuato',
  nl: 'Nuevo León',
  tm: 'Tamaulipas',
  ch: 'Chihuahua',
  mi: 'Michoacán',
  qt: 'Querétaro',
  za: 'Zacatecas',
  cm: 'Campeche',
  co: 'Coahuila',
  gr: 'Guerrero',
  tl: 'Tlaxcala',
  ve: 'Veracruz',
  cs: 'Chiapas',
  dg: 'Durango',
  hg: 'Hidalgo',
  ja: 'Jalisco',
  mo: 'Morelos',
  na: 'Nayarit',
  si: 'Sinaloa',
  tb: 'Tabasco',
  yu: 'Yucatán',
  cl: 'Colima',
  mx: 'México',
  oa: 'Oaxaca',
  pu: 'Puebla',
  so: 'Sonora'
};
