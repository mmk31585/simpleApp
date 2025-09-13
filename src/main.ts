import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import InstallAnt from "./plugins/antd"
import App from './App.vue'
import { router } from './router'
import './style.css'
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.use(router)
InstallAnt(app)
app.mount('#app')
