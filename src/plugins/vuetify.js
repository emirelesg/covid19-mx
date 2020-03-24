import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import es from 'vuetify/es5/locale/es';
import { colors } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { es },
    current: 'es'
  },
  theme: {
    themes: {
      light: {
        primary: {
          base: colors.deepPurple.accent4
        }
      }
    }
  }
});
