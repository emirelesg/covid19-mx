<template>
  <v-card elevation="4">
    <v-card-title class="font-weight-regular headline">Entidades</v-card-title>
    <v-card-subtitle>Conoce los tipos de casos por entidad</v-card-subtitle>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12">
          <loading v-if="!loaded" height="400px" message="Cargando Datos..."/>
          <v-data-table
            v-else
            class="fixed-footer-table"
            fixed-header
            hide-default-footer
            disable-pagination
            dense
            height="400px"
            sort-by="name"
            :headers="headers"
            :items="data"
            item-key="name"
          >
            <template v-slot:body.append>
              <tr v-show="$vuetify.breakpoint.smAndUp">
                <td class="font-weight-bold caption">Total</td>
                <td class="font-weight-bold">{{ confirmed }}</td>
                <td class="font-weight-bold">{{ recovered }}</td>
                <td class="font-weight-bold">{{ deaths }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
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
        { text: 'Confirmados', value: 'confirmed' },
        { text: 'Recuperados', value: 'recovered' },
        { text: 'Fallecidos', value: 'deaths' }
      ]
    };
  },
  computed: {
    ...mapState({
      loaded: state => state.stats.loaded,
      data: state => Object.values(state.stats.byState),
      confirmed: state => state.stats.confirmed,
      recovered: state => state.stats.recovered,
      deaths: state => state.stats.deaths
    })
  }
};
</script>
