<template>
  <card
    title="Apoya el Proyecto"
    subtitle="Esto no sería posible sin tu ayuda"
    :loaded="true"
  >
    <template v-slot:content>
      <p>
        COVID-19 en México es un proyecto open source bajo la
        <a target="_blank" :href="licenseUrl">licencia MIT</a>. Es y será un
        proyecto gratuito para su uso. Sin embargo, el tiempo y la dedicación
        que toma mantener el sitio actualizado y seguir desarrollando
        funcionalidades no es sostenible sin apoyo económico.
      </p>
      <p>
        Tu puedes apoyar el proyecto haciendo una pequeña donación única a
        través de PayPal (clic en la imagen):
      </p>
      <v-row align="center" justify="center" class="mb-2">
        <a href="https://www.paypal.me/emirelesg" target="_blank">
          <v-img
            alt="Logo Paypal"
            width="100"
            contain
            src="@/assets/paypal.png"
          />
        </a>
      </v-row>
    </template>
  </card>
</template>

<script>
import Card from '@/components/Card.vue';

export default {
  name: 'Donations',
  components: {
    Card
  },
  data() {
    return {
      licenseUrl: 'https://github.com/emirelesg/covid19-mx/blob/master/LICENSE'
    };
  }
};
</script>
