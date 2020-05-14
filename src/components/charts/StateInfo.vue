<template>
  <v-card class="tooltip" color elevation="8" v-if="state">
    <v-card-title class="font-weight-regular pb-1">
      {{ state.name }}
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <template v-slot:default>
          <tbody>
            <tr v-for="mode in modes" :key="mode.key">
              <td :style="{ color: mode.colorHex }">
                {{ state[mode.key].toLocaleString() }}
              </td>
              <td>{{ mode.title }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { modes } from '@/plugins/helper';

export default {
  name: 'StateInfo',
  props: ['state'],
  data() {
    return {
      modes
    };
  }
};
</script>
