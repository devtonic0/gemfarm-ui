<template>
  <div class="confirmalert">
    <div class="confirmalert-window">
    <h1>{{message}}</h1>
    <h2>{{submessage}}</h2>
    <div>
      <a href="https://mmr-claim.vercel.app/">
        <button class="submit">Claim</button>
      </a>
      <button @click="no!()" class="cancel">No Thanks</button>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },
  props: {
    message: String,
    submessage: String,
    no: Function

  },
  setup(props) {



    return {

    };
  },
});
</script>

<style scoped></style>