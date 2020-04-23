<template>
  <card
    title="Preguntas Frecuentes"
    subtitle="Aquí puedes encontrar la información que buscas"
    :loaded="true"
  >
    <template v-slot:content>
      <v-expansion-panels accordion hover>
        <v-expansion-panel v-for="(question, i) in questions" :key="i">
          <v-expansion-panel-header class="body-2">
            {{ question.title }}
          </v-expansion-panel-header>
          <v-expansion-panel-content class="body-2 text--secondary">
            <span v-html="question.answer"></span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </card>
</template>

<script>
import Card from '@/components/Card.vue';

export default {
  name: 'Faq',
  components: {
    Card
  },
  data() {
    return {
      questions: [
        {
          title: '¿Dónde está el número de pruebas realizadas?',
          answer:
            'Estoy trabajando para obtener el número de una manera confiable.'
        },
        {
          title: '¿Cada cuándo se actualiza el sitio?',
          answer: 'Todos los días poco después de las 19 horas.'
        },
        {
          title: 'Los datos de mi estado están mal.',
          answer:
            'La Secretaría de Salud hace el corte de datos a las 13 horas y no considera los casos de hospitales privados. Aunque se hacen pruebas para verificar que los datos presentados en el sitio sean iguales a los de la Secretaría de Salud, puede haber una discrepancia. Si encuentras un error te agradezco me contactes para revisarlo lo antes posible. Los datos de contacto están en la pregunta sobre contacto.'
        },
        {
          title: '¿Cómo te puedo contactar?',
          answer:
            'Puedes enviarme un mensaje directo por Twitter a <a href="https://twitter.com/emirelesg">@emirelesg</a>.'
        }
      ]
    };
  }
};
</script>
