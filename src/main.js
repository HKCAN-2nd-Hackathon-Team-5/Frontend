import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import LangEn from './static/LangEn'
import LangZhHant from './static/LangZhHant'
import LangZh from './static/LangZh'

const i18n = createI18n({
  locale: localStorage.getItem("language")||'en',
  legacy: false,
  globalInjection: true,
  messages: {
    'en': LangEn,
    'zh': LangZh,
    'zh-Hant': LangZhHant
  }
})
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElementPlus)

app.mount('#app')
