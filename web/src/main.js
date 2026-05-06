import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import EditorView from './views/EditorView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: EditorView },
    { path: '/editor/:id', component: EditorView }
  ]
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.mount('#app');
