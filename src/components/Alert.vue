<template>
    <div class="redMessage alert" v-if="type === 'error'">
      <div />
      <h1>{{message}}</h1>
      <fa icon="close" /> 
    </div>
    <div class="yellowMessage alert" v-if="type === 'pending'">
      <div />
      <h1>{{message}}</h1>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns-xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#eed16c" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
        </circle>
      </svg>
    </div>
    <div class="greenMessage alert" v-if="type === 'success'">
      <div />
      <h1>{{message}}</h1>
      <fa icon="check" /> 
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },
  props: {
    message: String,
    type: String
  },
  setup(props) {



    return {

    };
  },
});
</script>

<style scoped></style>