<template>
  <v-card elevation="4">
    <v-card-title class="font-weight-regular headline">Entidades</v-card-title>
    <v-card-subtitle>Conoce los tipos de casos por entidad</v-card-subtitle>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12">
          <loading v-if="!loaded" height="400px" message="Cargando Datos..." />
          <v-data-table
            v-else
            class="fixed-footer-table"
            fixed-header
            hide-default-footer
            disable-pagination
            dense
            height="400px"
            sort-by="confirmed"
            :sort-desc="true"
            :headers="headers"
            :items="data"
            item-key="name"
          >
            <template v-slot:item.confirmedDelta="{ item }">
              <span
                v-if="item.confirmedDelta !== 0"
                :style="getDeltaStyle(item.confirmedDelta)"
                >{{ getDeltaLabel(item.confirmedDelta) }}</span
              >
            </template>
            <template v-slot:body.append>
              <tr v-show="$vuetify.breakpoint.smAndUp">
                <td class="font-weight-bold caption">Total</td>
                <td class="text-center font-weight-bold">
                  {{ stats.confirmed }}
                </td>
                <td class="text-center font-weight-bold">
                  {{ getDeltaLabel(stats.confirmedDelta) }}
                </td>
                <td class="text-center font-weight-bold">
                  {{ stats.suspected }}
                </td>
                <td class="text-center font-weight-bold">{{ stats.deaths }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import colors from 'vuetify/lib/util/colors';
import Loading from '@/components/Loading.vue';
import { mapState } from 'vuex';
export default {
  name: 'CasesBystateTable',
  components: {
    Loading
  },
  data() {
    return {
      headers: [
        { text: 'Entidad', value: 'name' },
        { text: 'Confirmados', value: 'confirmed', align: 'center' },
        {
          text: 'Nuevos Confirmados',
          value: 'confirmedDelta',
          align: 'center'
        },
        { text: 'Sospechosos', value: 'suspected', align: 'center' },
        { text: 'Fallecidos', value: 'deaths', align: 'center' }
      ]
    };
  },
  methods: {
    getDeltaLabel(val) {
      if (val > 0) return `+${val}`;
      return val;
    },
    getDeltaStyle(val) {
      return {
        padding: '0rem 0.75rem',
        borderRadius: '5px',
        backgroundColor:
          val > 0 ? colors.orange.lighten3 : colors.green.lighten3
      };
    }
  },
  computed: {
    ...mapState({
      loaded: state => state.stats.loaded,
      data: state => Object.values(state.stats.byState),
      stats: state => state.stats
    })
  }
};
</script>
