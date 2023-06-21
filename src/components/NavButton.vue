<template>
  <router-link v-if="url?.charAt(0) === '/'" :to="url" class="nav-button">
    {{ title }}
  </router-link>
  <a v-else :href="url" class="nav-button">
    {{ title }}
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: String,
    url: String,
  },
  setup() {
    return {};
  },
});
</script>