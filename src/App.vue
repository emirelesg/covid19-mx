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
.v-expansion-panel::before {
  /* https://stackoverflow.com/questions/57151611/how-can-i-remove-shadow-from-expansion-panel-vuetify */
  box-shadow: none !important;
}
.v-expansion-panels {
  /* border: 1px solid rgba(0, 0, 0, 0.12); */
}
.v-slide-group__prev {
  /* https://github.com/vuetifyjs/vuetify/issues/8875 */
  display: none !important;
}
</style>
