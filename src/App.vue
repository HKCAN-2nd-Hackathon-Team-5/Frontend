<script setup>
import { computed, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import zhTw from 'element-plus/es/locale/lang/zh-tw'

const { locale } = useI18n();
if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'en');
}
locale.value = localStorage.getItem('language');
const lang = ref(localStorage.getItem('language'));
const changeLang = () => {
  localStorage.setItem('language', lang.value);
  locale.value = localStorage.getItem('language');
}
const langPackage = computed(() => {
  switch(lang.value) {
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
    <el-affix :offset="20" style="text-align: right;">
      <el-radio-group v-model="lang" @change="changeLang">
        <el-radio-button label="EN" value="en" />
        <el-radio-button label="繁" value="zh-Hant" />
        <el-radio-button label="简" value="zh" />
      </el-radio-group>
    </el-affix>
    <Navbar />
    <router-view />
  </el-config-provider>
</template>

<style scoped>

</style>
