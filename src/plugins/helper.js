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

export const barColor = (color, shade) => ({
  borderColor: colors[color][shade || 'base'],
  backgroundColor: hex2rgba(colors[color][shade || 'base'], 0.3)
});

export const baseBarOptions = (color, shade, label) => ({
  label,
  type: 'bar',
  barPercentage: 0.7,
  categoryPercentage: 0.8,
  borderWidth: 1,
  data: [],
  ...barColor(color, shade)
});

export const lineColor = (color, shade) => ({
  borderColor: colors[color][shade || 'base'],
  backgroundColor: 'rgba(0, 0, 0, 0)',
  pointBackgroundColor: colors[color][shade || 'base']
});

export const baseLineOptions = (color, shade, dashed, label) => ({
  label,
  type: 'line',
  borderWidth: 2,
  borderDash: dashed ? [4, 4] : [0, 0],
  pointHitRadius: 10,
  pointHoverRadius: 4,
  data: [],
  ...lineColor(color, shade)
});

export const baseChartOptions = (xLabel, yLabel, xOffset, yStart, legend) => ({
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: !!legend
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
          tooltipFormat: 'LL',
          displayFormats: {
            distribution: 'series'
          }
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
          min: yStart,
          callback: (value, _, values) => {
            if (Math.max(...values) >= 1e4 && Math.abs(value) >= 1e3)
              return `${value / 1e3}K`;
            return value;
          }
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

function getValue(latest, prev, prop) {
  if (prev[prop] === 0) {
    return {
      value: latest[prop],
      delta: 0,
      growthFactor: 0
    };
  }
  return {
    value: latest[prop],
    delta: latest[prop] - prev[prop],
    growthFactor: round(latest[prop] / prev[prop], 4)
  };
}

export const processTimeseriesBySymptoms = timeseries =>
  timeseries.map(data => ({
    ...data,
    date: moment(data.date)
  }));

export const processTimeseries = timeseries => {
  // Timeseries is an array, where each element is an object with the following properties:
  // date, confirmed, deaths, suspected
  // The goal is to make an analysis on the timeseries, the resulting data is used by several components.

  // Convert the date to a moment object.
  // Add deltas and growth factors.
  const extendedTimeseries = timeseries.map((data, i) => {
    const prev = timeseries[i > 0 ? i - 1 : i];
    return {
      ...data,
      date: moment(data.date),
      confirmed: getValue(data, prev, 'confirmed'),
      suspected: getValue(data, prev, 'suspected'),
      active: getValue(data, prev, 'active'),
      deaths: {
        ...getValue(data, prev, 'deaths'),
        letality: `${round((data.deaths / data.confirmed) * 100, 1)}%`
      },
      tests: getValue(data, prev, 'tests')
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

export const modes = [
  {
    title: 'Confirmados',
    key: 'confirmed',
    colorHex: colors.red.base,
    colorStr: 'red',
    colorShade: 'base',
    prediction: true,
    filterStartOfData: false
  },
  {
    title: 'Sospechosos',
    key: 'suspected',
    colorHex: colors.orange.base,
    colorStr: 'orange',
    colorShade: 'base',
    prediction: false,
    filterStartOfData: false
  },
  {
    title: 'Fallecidos',
    key: 'deaths',
    colorHex: colors.blueGrey.base,
    colorStr: 'blueGrey',
    colorShade: 'base',
    prediction: true,
    filterStartOfData: false
  },
  {
    title: 'Activos',
    key: 'active',
    colorHex: colors.purple.base,
    colorStr: 'purple',
    colorShade: 'base',
    prediction: false,
    filterStartOfData: true
  },
  {
    title: 'Pruebas',
    key: 'tests',
    colorHex: colors.cyan.darken1,
    colorStr: 'cyan',
    colorShade: 'darken1',
    prediction: false,
    filterStartOfData: true
  }
];

function getModeColor(key) {
  return modes.find(mode => mode.key === key).colorHex;
}

export const values = [
  {
    title: 'Confirmados',
    value: v => v.confirmed.value,
    color: getModeColor('confirmed')
  },
  {
    title: 'Confirmados Hoy',
    value: v => v.confirmed.delta,
    delta: true
  },
  {
    title: 'Activos',
    value: v => v.active.value,
    color: getModeColor('active'),
    help:
      'Personas estimadas que iniciaron con sintomas en los últimos 14 días.'
  },
  {
    title: 'Recuperados',
    value: v => v.confirmed.value - v.active.value - v.deaths.value,
    color: colors.green.base,
    help:
      'Personas estimadas que presentaron sintomas hace más de 14 días. Es igual a confirmados - activos - fallecidos.'
  },
  {
    title: 'Fallecidos',
    value: v => v.deaths.value,
    color: getModeColor('deaths')
  },
  {
    title: 'Letalidad',
    value: v => v.deaths.letality,
    color: getModeColor('deaths'),
    help: 'Porcentaje de personas con COVID-19 que han fallecido.'
  },
  {
    title: 'Sospechosos',
    value: v => v.suspected.value,
    color: getModeColor('suspected'),
    help: 'Personas en espera del resultado de la prueba de COVID-19.'
  },
  {
    title: 'Pruebas',
    value: v => v.tests.value,
    color: getModeColor('tests'),
    help: 'Personas que han hecho la prueba de COVID-19.'
  }
];

export const labels = {
  totalCases: {
    title: {
      confirmed: 'Acumulado de Confirmados',
      suspected: 'Acumulado de Sospechosos',
      deaths: 'Acumulado de Fallecidos',
      active: 'Acumulado de Activos',
      tests: 'Acumulado de Pruebas'
    },
    subtitle: {
      confirmed: 'Total de casos confirmados reportado',
      suspected: 'Total de casos sospechosos reportado',
      deaths: 'Total de casos fallecidos reportado',
      active:
        'Total de personas que presentaron sintomas en los últimos 14 días',
      tests: ' Total de personas estudiadas'
    },
    yLabel: {
      confirmed: '# de Confirmados',
      suspected: '# de Sospechosos',
      deaths: '# de Fallecidos',
      active: '# de Activos',
      tests: '# de Pruebas'
    }
  },
  dailyIncrease: {
    title: {
      confirmed: 'Confirmados por Día',
      suspected: 'Sospechosos por Día',
      deaths: 'Fallecidos por Día',
      active: 'Activos por Día',
      tests: 'Pruebas por Día'
    },
    subtitle: {
      confirmed: 'El incremento de los casos confirmados por día',
      suspected: 'El incremento de los casos sospechosos por día',
      deaths: 'El incremento de fallecidos por día',
      active: 'El incremento de casos activos por día',
      tests: 'El incremento de pruebas por día'
    },
    yLabel: {
      confirmed: '# de Confirmados',
      suspected: '# de Sospechosos',
      deaths: '# de Fallecidos',
      active: '# de Activos',
      tests: '# de Pruebas'
    }
  },
  map: {
    title: {
      confirmed: 'Confirmados por Entidad',
      suspected: 'Sospechosos por Entidad',
      deaths: 'Fallecidos por Entidad',
      active: 'Activos por Entidad',
      tests: 'Pruebas por Entidad'
    }
  }
};
