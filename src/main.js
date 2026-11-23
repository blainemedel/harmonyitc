// Gene - Nov, 23, 2026: Application entry point importing modular design system CSS and mounting Vue Router
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/motion.css';

createApp(App).use(router).mount('#app');
