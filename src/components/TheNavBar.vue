<template>
  <nav class="flex flex-row navbar">
    <div class="flex flex-row" >
      <img className="navLogo" @click="changeRoute()" src="../assets/logo.png" style="height: 100%" />
    </div>
    <div style="display: flex;align-items: center;justify-content: center">
      <ConfigPane />
    </div>
  </nav>
  <!-- <nav class="flex flex-row mobilePart">
    <div class="flex flex-row" >
      <h1 className="navLogo">Back We Go</h1>
    </div>
    <div style="display: flex;align-items: center;justify-content: center">
      <ConfigPane />
      <svg class="moon" version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344 344" width="30" height="30" @click="handleIt()">
        <path stroke="#6B53FF" id="Path 0" class="s0" d="m106.8 10c1.2 0 4.6 1.1 7.5 2.4 2.8 1.3 6.4 3.6 7.9 5.2 1.5 1.6 3.4 4.6 4.2 6.7 0.9 2 1.6 5.6 1.6 7.9 0 2.4-0.7 7.9-1.6 12.3-1.1 5.3-1.7 13.5-1.7 24.5-0.1 13.2 0.3 18.7 2.1 27.5 1.2 6 3.8 15.7 5.7 21.5 2 5.8 6.1 15.2 9.1 21 3.1 5.8 8.1 14.1 11.2 18.5 3.1 4.3 10.2 12.4 15.7 18 5.5 5.5 14.1 12.9 19 16.4 5 3.4 14.4 8.9 21 12.1 6.6 3.2 15.6 7 20 8.5 4.4 1.4 12.5 3.5 18 4.7 7.9 1.7 13.6 2.1 27 2.2 11.8 0 19.8-0.5 26.3-1.7 5-0.9 10.9-1.7 13-1.7 2 0 5.5 0.9 7.7 1.9 2.2 0.9 5.3 3.3 6.9 5.2 1.6 1.9 3.6 5 4.4 6.9 0.9 2.1 1.3 5.7 1.1 9.1-0.3 4.3-1.3 7-4.3 12-2.2 3.5-6.4 9.8-9.5 13.9-3 4.1-9.1 11.3-13.6 15.9-4.4 4.6-11.4 11.1-15.5 14.4-4.1 3.3-10.6 8-14.5 10.5-3.9 2.5-11.7 6.9-17.5 9.8-5.8 2.9-15.2 6.8-21 8.7-5.8 2-15.2 4.4-21 5.5-5.8 1.1-15.7 2.6-22 3.3-9.2 1-13.7 1-22.5 0-6.1-0.7-15.7-2.2-21.5-3.3-5.8-1.1-15.2-3.5-21-5.4-5.8-1.9-15.5-5.9-21.5-8.8-6-3-15-8.1-20-11.5-5-3.3-13.2-9.6-18.3-14-5-4.5-12.4-11.8-16.3-16.4-3.8-4.5-9.4-11.8-12.4-16.2-3-4.4-7.6-12.3-10.3-17.5-2.8-5.2-6.7-14-8.7-19.5-2-5.5-4.7-14.5-6-20-1.3-5.5-2.9-14.5-3.6-20-0.7-6-1-16.2-0.6-25.5 0.3-10 1.3-19.4 2.7-26.5 1.2-6 3.5-15 5.2-20 1.6-5 4.3-12.2 6-16 1.6-3.8 5.3-11 8.1-16 2.9-5 7.8-12.5 10.9-16.8 3.2-4.2 9.5-11.6 14.1-16.3 4.5-4.8 11.6-11.4 15.7-14.7 4.1-3.3 10.7-8.1 14.5-10.6 3.8-2.5 9-5.3 11.5-6.3 2.5-0.9 5.5-1.7 6.8-1.8z"/>
      </svg>
      <svg class="sun" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="30" height="30"
        viewBox="0 0 24 24"
        @click="handleIt()">
        <circle cx="50%" cy="50%" r="6" fill="#6B53FF" />
        <path d="M 11 0 L 11 3 L 13 3 L 13 0 L 11 0 z M 4.2226562 2.8085938 L 2.8085938 4.2226562 L 4.9296875 6.34375 L 6.34375 4.9296875 L 4.2226562 2.8085938 z M 19.777344 2.8085938 L 17.65625 4.9296875 L 19.070312 6.34375 L 21.191406 4.2226562 L 19.777344 2.8085938 z M 12 5 C 8.1458514 5 5 8.1458514 5 12 C 5 15.854149 8.1458514 19 12 19 C 15.854149 19 19 15.854149 19 12 C 19 8.1458514 15.854149 5 12 5 z M 12 7 C 14.773268 7 17 9.2267316 17 12 C 17 14.773268 14.773268 17 12 17 C 9.2267316 17 7 14.773268 7 12 C 7 9.2267316 9.2267316 7 12 7 z M 0 11 L 0 13 L 3 13 L 3 11 L 0 11 z M 21 11 L 21 13 L 24 13 L 24 11 L 21 11 z M 4.9296875 17.65625 L 2.8085938 19.777344 L 4.2226562 21.191406 L 6.34375 19.070312 L 4.9296875 17.65625 z M 19.070312 17.65625 L 17.65625 19.070312 L 19.777344 21.191406 L 21.191406 19.777344 L 19.070312 17.65625 z M 11 21 L 11 24 L 13 24 L 13 21 L 11 21 z"></path>
      </svg>
      <div
        :class="`buttonWrapper ${dropdown ? 'open' : 'closed'}`"
        @click="dropdown = !dropdown"
      >
        <div className="hamburger"></div>
      </div>
      <div class="dropdownMenu" :style="dropdown ? {height: '50vh', opacity: '1', pointerEvents: 'all'} : {height: '0px', opacity: '0', pointerEvents: 'none'}">
        <NavButton
          v-for="i in menu"
          :key="i.name"
          :title="i.name"
          :url="i.url"
          :class="{ active: path === i.url }"
        />
      </div>
    </div>
  </nav>
  <nav class="flex flex-row mobilePartBottom">
      <ConfigPane />
      <svg class="moon" version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344 344" width="30" height="30" @click="handleIt()">
        <path stroke="#6B53FF" id="Path 0" class="s0" d="m106.8 10c1.2 0 4.6 1.1 7.5 2.4 2.8 1.3 6.4 3.6 7.9 5.2 1.5 1.6 3.4 4.6 4.2 6.7 0.9 2 1.6 5.6 1.6 7.9 0 2.4-0.7 7.9-1.6 12.3-1.1 5.3-1.7 13.5-1.7 24.5-0.1 13.2 0.3 18.7 2.1 27.5 1.2 6 3.8 15.7 5.7 21.5 2 5.8 6.1 15.2 9.1 21 3.1 5.8 8.1 14.1 11.2 18.5 3.1 4.3 10.2 12.4 15.7 18 5.5 5.5 14.1 12.9 19 16.4 5 3.4 14.4 8.9 21 12.1 6.6 3.2 15.6 7 20 8.5 4.4 1.4 12.5 3.5 18 4.7 7.9 1.7 13.6 2.1 27 2.2 11.8 0 19.8-0.5 26.3-1.7 5-0.9 10.9-1.7 13-1.7 2 0 5.5 0.9 7.7 1.9 2.2 0.9 5.3 3.3 6.9 5.2 1.6 1.9 3.6 5 4.4 6.9 0.9 2.1 1.3 5.7 1.1 9.1-0.3 4.3-1.3 7-4.3 12-2.2 3.5-6.4 9.8-9.5 13.9-3 4.1-9.1 11.3-13.6 15.9-4.4 4.6-11.4 11.1-15.5 14.4-4.1 3.3-10.6 8-14.5 10.5-3.9 2.5-11.7 6.9-17.5 9.8-5.8 2.9-15.2 6.8-21 8.7-5.8 2-15.2 4.4-21 5.5-5.8 1.1-15.7 2.6-22 3.3-9.2 1-13.7 1-22.5 0-6.1-0.7-15.7-2.2-21.5-3.3-5.8-1.1-15.2-3.5-21-5.4-5.8-1.9-15.5-5.9-21.5-8.8-6-3-15-8.1-20-11.5-5-3.3-13.2-9.6-18.3-14-5-4.5-12.4-11.8-16.3-16.4-3.8-4.5-9.4-11.8-12.4-16.2-3-4.4-7.6-12.3-10.3-17.5-2.8-5.2-6.7-14-8.7-19.5-2-5.5-4.7-14.5-6-20-1.3-5.5-2.9-14.5-3.6-20-0.7-6-1-16.2-0.6-25.5 0.3-10 1.3-19.4 2.7-26.5 1.2-6 3.5-15 5.2-20 1.6-5 4.3-12.2 6-16 1.6-3.8 5.3-11 8.1-16 2.9-5 7.8-12.5 10.9-16.8 3.2-4.2 9.5-11.6 14.1-16.3 4.5-4.8 11.6-11.4 15.7-14.7 4.1-3.3 10.7-8.1 14.5-10.6 3.8-2.5 9-5.3 11.5-6.3 2.5-0.9 5.5-1.7 6.8-1.8z"/>
      </svg>
      <svg class="sun" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="30" height="30"
        viewBox="0 0 24 24"
        @click="handleIt()">
        <circle cx="50%" cy="50%" r="6" fill="#6B53FF" />
        <path d="M 11 0 L 11 3 L 13 3 L 13 0 L 11 0 z M 4.2226562 2.8085938 L 2.8085938 4.2226562 L 4.9296875 6.34375 L 6.34375 4.9296875 L 4.2226562 2.8085938 z M 19.777344 2.8085938 L 17.65625 4.9296875 L 19.070312 6.34375 L 21.191406 4.2226562 L 19.777344 2.8085938 z M 12 5 C 8.1458514 5 5 8.1458514 5 12 C 5 15.854149 8.1458514 19 12 19 C 15.854149 19 19 15.854149 19 12 C 19 8.1458514 15.854149 5 12 5 z M 12 7 C 14.773268 7 17 9.2267316 17 12 C 17 14.773268 14.773268 17 12 17 C 9.2267316 17 7 14.773268 7 12 C 7 9.2267316 9.2267316 7 12 7 z M 0 11 L 0 13 L 3 13 L 3 11 L 0 11 z M 21 11 L 21 13 L 24 13 L 24 11 L 21 11 z M 4.9296875 17.65625 L 2.8085938 19.777344 L 4.2226562 21.191406 L 6.34375 19.070312 L 4.9296875 17.65625 z M 19.070312 17.65625 L 17.65625 19.070312 L 19.777344 21.191406 L 21.191406 19.777344 L 19.070312 17.65625 z M 11 21 L 11 24 L 13 24 L 13 21 L 11 21 z"></path>
      </svg>
  </nav> -->
</template>

<script lang="ts">
import ConfigPane from '@/components/ConfigPane.vue';
import { defineComponent, computed, ref, onMounted, defineEmits } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavButton from '@/components/NavButton.vue';

export default defineComponent({
  components: { NavButton, ConfigPane },
  setup(props, {emit}) {
    const route = useRoute();
    const path = computed(() => route.path);

    const menu = [
      { name: 'Dashboard', url: '/' },
      { name: 'Time Pass', url: 'https://google.com' },
      { name: 'Leaderboard', url: '/leaderboard' },
      { name: 'Community', url: '/community' },
      { name: 'Shop', url: 'https://google.com' },
      { name: 'Profile', url: '/profile' },
    ];

    const darkMode = ref<boolean>(true)
    const dropdown = ref<boolean>(false)

    const handleIt = () => {
      darkMode.value = !darkMode.value
      emit('darkMode', "hi")
    }

    const router = useRouter()
    const changeRoute = () => {
      router.push('/')
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }

    return {
      menu,
      path,
      darkMode,
      handleIt,
      dropdown,
      changeRoute
    };
  },
});
</script>
