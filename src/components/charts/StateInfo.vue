<template>
  <v-card class="tooltip" color elevation="8" v-if="state">
    <v-card-title class="font-weight-regular pb-1">
      {{ state.name }}
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="red--text">{{ state.confirmed }}</td>
              <td>Confirmados</td>
            </tr>
            <tr>
              <td class="orange--text">{{ state.suspected }}</td>
              <td>Sospechosos</td>
            </tr>
            <tr>
              <td class="blue-grey--text text--darken-3">
                {{ state.deaths }}
              </td>
              <td>Fallecidos</td>
            </tr>
            <tr>
              <td class="purple--text">
                {{ state.active }}
              </td>
              <td>Activos</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'StateInfo',
  props: ['state'],
  data() {
    return {};
  }
};
</script>
