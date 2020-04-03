<template>
  <v-app>
    <app-header />
    <v-content class="pb-5">
      <router-view></router-view>
    </v-content>
    <app-footer />
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppHeader
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['loadData'])
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style>
svg {
  vertical-align: top;
}
a {
  text-decoration: none;
}
.fixed-footer-table table tr:nth-last-child(2) td {
  border-bottom: none !important;
}
.fixed-footer-table table tr:last-child,
.fixed-footer-table table tr:last-child td {
  border-top: thin solid rgba(0, 0, 0, 0.12);
  border-collapse: separate;
  background: #efefef;
  position: -webkit-sticky;
  position: sticky;
  bottom: 0px !important;
  z-index: 2;
}
.tooltip {
  right: 20px;
  position: absolute;
}
.tooltip tr td {
  padding: 0 0.5rem;
}
.tooltip tr td:first-child {
  font-weight: bold;
}
.legendAxis {
  font-size: 12px;
}
.v-slide-group__prev {
  /* https://github.com/vuetifyjs/vuetify/issues/8875 */
  display: none !important;
}
</style>
