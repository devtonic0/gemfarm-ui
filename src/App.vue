<template>
  <div :class="isDarkMode ? `relative h-full min-h-screen darkMode` : `relative h-full min-h-screen lightMode`">
    <div class="mainWrapper">
      <TheNavBar @darkMode="handleDarkMode()" />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheNavBar from './components/TheNavBar.vue';
import TheFooter from './components/gem-farm/TheFooter.vue';
import { ref } from 'vue'
export default defineComponent({
  components: { TheFooter, TheNavBar },
  setup() {
    const isDarkMode = ref<boolean>(false)
    const handleDarkMode = function() {
      isDarkMode.value = !isDarkMode.value
      console.log(isDarkMode.value)
    }
    return {
      handleDarkMode,
      isDarkMode
    }
  }
});
</script>

<style>
* {
  font-family: system-ui;
}
input[type='radio']:checked + span {
  @apply text-black;
}
</style>
