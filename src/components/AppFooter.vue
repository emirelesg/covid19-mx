<template>
  <v-footer color="grey lighten-3 py-2 px-4">
    <v-spacer></v-spacer>
    <div>
      {{ new Date().getFullYear() }}
      —
      Hecho con
      <span
        class="red--text"
      >&#9829;</span>
      por
      <a href="https://github.com/emirelesg">@emirelesg</a>
    </div>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {};
  }
};
</script>

