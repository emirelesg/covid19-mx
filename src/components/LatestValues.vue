<template>
  <v-row>
    <v-col cols="12" sm="6" md="2" v-for="(v, i) in values" :key="`value-${i}`">
      <v-tooltip bottom max-width="350" :disabled="!v.help">
        <template v-slot:activator="{ on }">
          <v-hover v-slot:default="{ hover }" :disabled="!v.help">
            <v-card
              v-on="on"
              :elevation="hover ? 5 : 0"
              outlined
              :style="{ borderTop: `6px solid ${getColor(v)}` }"
            >
              <v-icon
                v-if="!!v.help"
                style="position: absolute; right: 10px; top: 10px"
                color="grey"
              >
                mdi-information-outline
              </v-icon>
              <v-list-item two-line class="text-center">
                <v-list-item-content class="py-4">
                  <v-list-item-title
                    class="display-1 mb-2"
                    :style="{ color: getColor(v) }"
                  >
                    {{ getValue(v) }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-uppercase subtitle-2">
                    {{ v.title }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-hover>
        </template>
        <span>{{ v.help }}</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
import colors from 'vuetify/es5/util/colors';
import { mapState } from 'vuex';

export default {
  name: 'LatestValues',
  props: {
    loaded: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      values: [
        {
          title: 'Confirmados',
          value: v => v.confirmed.value,
          color: colors.red.base
        },
        {
          title: 'Confirmados Hoy',
          value: v => v.confirmed.delta,
          color: colors.red.base,
          delta: true
        },
        {
          title: 'Casos Activos',
          value: v => v.active.value,
          color: colors.purple.base,
          help:
            'Número de personas que han presentado sintomas en los últimos 14 días.'
        },
        {
          title: 'Sospechosos',
          value: v => v.suspected.value,
          color: colors.orange.base,
          help:
            'Número de personas en espera del resultado de la prueba de COVID-19.'
        },
        {
          title: 'Fallecidos',
          value: v => v.deaths.value,
          color: colors.blueGrey.base
        },
        {
          title: 'Letalidad',
          value: v => v.deaths.letality,
          color: colors.blueGrey.base,
          help: 'Porcentaje de personas con COVID-19 que han fallecido.'
        }
      ]
    };
  },
  methods: {
    getValue(v) {
      if (this.loaded) {
        const val = v.value(this.latest);
        if (v.delta && val > 0) return `+${val}`;
        return val;
      }
      return '-';
    },
    getColor(v) {
      if (this.loaded) {
        if (v.delta)
          return v.value(this.latest) > 0 ? colors.red.base : colors.green.base;
        return v.color;
      }
      return colors.grey.base;
    }
  },
  computed: {
    ...mapState({
      latest: state => state.latest
    })
  }
};
</script>
