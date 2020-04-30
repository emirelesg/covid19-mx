<template>
  <card
    title="Entidades"
    subtitle="Compara la situación actual por entidades"
    loadingMessage="Cargando Datos..."
    :loaded="loaded"
  >
    <template v-slot:content>
      <v-data-table
        class="fixed-footer-table mb-2"
        fixed-header
        hide-default-footer
        disable-pagination
        dense
        height="370px"
        sort-by="confirmed"
        :sort-desc="true"
        :headers="headers"
        :items="data"
        item-key="name"
      >
        <template v-slot:item.name="{ item }">
          <router-link
            :to="{
              name: 'State',
              params: { stateKey: item.key.toLowerCase() }
            }"
            >{{ item.name }}</router-link
          >
        </template>
        <template v-slot:item.confirmedDelta="{ item }">
          <span
            v-if="isFinite(item.confirmedDelta) && item.confirmedDelta !== 0"
            :style="getDeltaStyle(item.confirmedDelta)"
            >{{ getDeltaLabel(item.confirmedDelta) }}</span
          >
        </template>
        <template v-slot:body.append>
          <tr
            v-show="$vuetify.breakpoint.smAndUp"
            class="text-center font-weight-bold"
          >
            <td class="text-left">Total</td>
            <td>
              {{ latest.confirmed.value }}
            </td>
            <td>
              {{ getDeltaLabel(latest.confirmed.delta) }}
            </td>
            <td>
              {{ latest.active.value }}
            </td>
            <td>
              {{ latest.suspected.value }}
            </td>
            <td>
              {{ latest.deaths.value }}
            </td>
            <td>
              {{ latest.tests.value }}
            </td>
            <td>
              -
            </td>
          </tr>
        </template>
      </v-data-table>
      <div>
        Fuente para población:
        <a
          target="_blank"
          href="http://cuentame.inegi.org.mx/poblacion/habitantes.aspx"
        >
          INEGI (2015)
        </a>
      </div>
    </template>
  </card>
</template>

<script>
import Card from '@/components/Card';
import colors from 'vuetify/lib/util/colors';
import { mapState } from 'vuex';

export default {
  name: 'CasesBystateTable',
  components: {
    Card
  },
  props: {
    loaded: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'Entidad', value: 'name' },
        { text: 'Confirmados', value: 'confirmed', align: 'center' },
        {
          text: 'Confirmados Hoy',
          value: 'confirmedDelta',
          align: 'center'
        },
        {
          text: 'Activos',
          value: 'active',
          align: 'center'
        },
        { text: 'Sospechosos', value: 'suspected', align: 'center' },
        { text: 'Fallecidos', value: 'deaths', align: 'center' },
        { text: 'Pruebas', value: 'tests', align: 'center' },
        {
          text: 'Pruebas / 10 mil Hab.',
          value: 'testsRatio',
          align: 'center'
        }
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
      latest: state => state.latest,
      data: state => state.stats.statesAsArray
    })
  }
};
</script>
