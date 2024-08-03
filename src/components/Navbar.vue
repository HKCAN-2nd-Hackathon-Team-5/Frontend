<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconCICSCL from './icons/IconCICSCL.vue'
import { useLanguageStore } from '../stores/language'
import { User } from '@element-plus/icons-vue'

const langStore = useLanguageStore();
const lang = ref(localStorage.getItem('language'));
const changeLang = () => {
  langStore.changeLang(lang.value);
}

const menuItems = ref([
  {
    label: 'courses',
    path: '/courses'
  },
  {
    label: 'registerRecord',
    path: '/record'
  },
  {
    label: 'member',
    path: '/member'
  }
]);

const loginDrawer = ref(false);
const drawerSize = ref("50%");
const loginForm = ref({
  userName: "",
  password: "",
})
const cancelLogin = () => {
  loginForm.value = {
    userName: "",
    password: "",
  };
}
const login = () => {
  
}
const handleResize = () => {
  if (window.innerWidth < 500) {
    drawerSize.value = "90%"
  } else {
    drawerSize.value = "50%"
  }
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="nav-bar">
    <el-affix :offset="20" style="text-align: right;">
      <el-radio-group fill="#c00" v-model="lang" @change="changeLang">
        <el-radio-button label="EN" value="en" />
        <el-radio-button label="繁" value="zh-Hant" />
        <el-radio-button label="简" value="zh" />
      </el-radio-group>
    </el-affix>
    <el-row type="flex" justify="space-between" align="middle">
      <IconCICSCL />
      <el-button
        type="primary"
        :icon="User"
        @click="()=>loginDrawer=true"
      >
        Log In as Admin 
      </el-button>
    </el-row>
  </div>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#fcbd12"
    :default-active="$route.path"
    router
    :ellipsis="false"
  >
    <div class="flex-grow" />
    <el-menu-item
      v-for="item in menuItems"
      :key="item.path"
      :index="item.path">{{ $t('title.'+item.label) }}</el-menu-item>
  </el-menu>
  <el-drawer
    v-model="loginDrawer"
    title="Admin Log In"
    direction="rtl"
    :size="drawerSize"
    @closed="cancelLogin"
  >
    <div>
      <el-form label-width="auto" :model="loginForm">
        <el-form-item label="User Name">
          <el-input v-model="loginForm.userName" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input type="password" v-model="loginForm.password" />
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="()=>loginDrawer=false">Cancel</el-button>
        <el-button type="primary" @click="login">
          Log In
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
.nav-bar {
  background: #fcbd12;
  padding: 0 2rem;
}
</style>
