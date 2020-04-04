<template>
  <v-card elevation="4" height="100%" width="100%">
    <div ref="title">
      <v-card-title class="font-weight-regular headline">
        {{ title }}
      </v-card-title>
      <v-card-subtitle class="pb-0">
        {{ subtitle }}
      </v-card-subtitle>
    </div>
    <v-card-text :style="style">
      <v-row class="fill-height" no-gutters align="center" justify="center">
        <v-col cols="12">
          <loading v-if="!loaded" :message="loadingMessage" />
          <slot v-else name="content"></slot>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Loading from '@/components/Loading';

export default {
  name: 'Card',
  props: {
    title: String,
    subtitle: String,
    loadingMessage: String,
    loaded: Boolean
  },
  components: {
    Loading
  },
  mounted() {
    this.resize();
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
  data() {
    return {
      cardTitleHeight: 0
    };
  },
  methods: {
    resize() {
      if (this.$refs.title.clientHeight) {
        this.cardTitleHeight = this.$refs.title.clientHeight;
      }
    }
  },
  computed: {
    style() {
      return {
        height: `calc(100% - ${this.cardTitleHeight}px)`
      };
    }
  }
};
</script>
