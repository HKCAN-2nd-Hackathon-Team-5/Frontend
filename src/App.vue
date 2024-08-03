<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from './stores/language'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import zhTw from 'element-plus/es/locale/lang/zh-tw'

const { locale } = useI18n();
if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'en');
}
const langStore = useLanguageStore();
langStore.changeLang(localStorage.getItem('language'));
const langPackage = computed(() => {
  locale.value = langStore.lang;
  switch(langStore.lang) {
    case 'en':
      return en;
    case 'zh-Hant':
      return zhTw;
    case 'zh':
      return zhCn;
    default:
  }
})

</script>

<template>
  <el-config-provider :locale="langPackage">
    <navbar />
    <router-view class="router-view-style"/>
  </el-config-provider>
</template>

<style scoped>
  .router-view-style {
    margin: 0 3vw;
    background: white;
    height: 60vh;
  }
</style>
