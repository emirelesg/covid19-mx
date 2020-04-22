module.exports = {
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://covid19.newtondreams.com',
        changeOrigin: true
      },
      '^/static': {
        target: 'https://covid19.newtondreams.com',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'COVID-19 en México';
      args[0].meta = {
        'twitter:card': 'summary',
        'twitter:creator': '@emirelesg',
        'og:title': `${args[0].title}`,
        'og:type': 'product',
        'og:url': 'https://covid19.newtondreams.com/',
        'og:description':
          'Herramienta para ver la situación actual del COVID-19 en México con gráficas interactivas.'
      };
      return args;
    });
  }
};
