import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'

library.add(fas)

createApp(App).component("fa", FontAwesomeIcon).use(router).mount('#app');
