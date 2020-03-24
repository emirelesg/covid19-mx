<template>
  <v-footer padless>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card flat tile color="grey lighten-4" class="text-center">
          <v-card-text>
            <div class="caption">Compártelo en tus redes</div>
            <share/>
            <div class="mt-3">
              {{ new Date().getFullYear() }}
              —
              Hecho con
              <span
                class="red--text"
              >&#9829;</span>
              por
              <a href="https://github.com/emirelesg">@emirelesg</a>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import Share from '@/components/Share';
export default {
  name: 'AppFooter',
  components: {
    Share
  },
  data() {
    return {};
  }
};
</script>

