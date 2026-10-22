import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.css'
import { initTheme } from './composables/useTheme'

initTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')
