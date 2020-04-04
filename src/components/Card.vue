<template>
  <v-card elevation="4" height="100%">
    <v-card-title class="font-weight-regular headline">
      {{ title }}
    </v-card-title>
    <v-card-subtitle>
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text id="container">
      <loading v-if="!loaded" :message="loadingMessage" height="400px" />
      <v-row v-show="loaded" no-gutters>
        <v-col cols="12">
          <slot name="content"></slot>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Loading from '@/components/Loading';

export default {
  name: 'Card',
  props: ['title', 'subtitle', 'loaded', 'loadingMessage'],
  components: {
    Loading
  },
  data() {
    return {};
  }
};
</script>
