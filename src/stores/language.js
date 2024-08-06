import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  const lang = ref(localStorage.getItem('language') || 'en')
  function changeLang(newLang) {
    lang.value = newLang
    localStorage.setItem('language', lang.value)
  }

  return { lang, changeLang }
})
