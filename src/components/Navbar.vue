<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconCICSCL from './icons/IconCICSCL.vue'
import { useLanguageStore } from '../stores/language'
import { useProfileStore } from '../stores/profile'
import { User } from '@element-plus/icons-vue'

const langStore = useLanguageStore();
const lang = ref(langStore.lang);
const changeLang = () => {
  langStore.changeLang(lang.value);
}
onMounted(() => {
  changeLang()
})

const menuItems = ref([
  {
    label: 'courses',
    path: '/courses'
  },
]);
onMounted(() => {
  if (profileStore.loggedIn) {
    menuItems.value = [
      {
        label: 'courses',
        path: '/courses'
      },
      {
        label: 'registerRecord',
        path: '/record'
      },
      {
        label: 'student',
        path: '/student'
      }
    ]
  }
})

const profileStore = useProfileStore()
const loginDrawer = ref(false);
const drawerSize = ref("50%");
const loginForm = ref({
  username: "",
  password: "",
})
const cancelLogin = () => {
  loginForm.value = {
    username: "",
    password: "",
  };
}
const login = () => {
  profileStore.login(loginForm.value)
}
const logout = () => {
  profileStore.logout()
}
const handleResize = () => {
  if (window.innerWidth < 500) {
    drawerSize.value = "100%"
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

const usernameRef = ref()
const tryLogin = () => {
  usernameRef.value.focus()
}
</script>

<template>
  <div >
  <div class="nav-bar">
    <div class="nav-bar-language-radio">
      <el-radio-group fill="#c00" v-model="lang" @change="changeLang">
        <el-radio-button label="EN" value="en" />
        <el-radio-button label="繁" value="zh_Hant" />
        <el-radio-button label="简" value="zh" />
      </el-radio-group>
    </div>
    <el-row type="flex" justify="space-between" align="middle">
      <IconCICSCL />
      <el-button
        type="primary"
        :icon="User"
        @click="logout"
        v-if="profileStore.loggedIn"
      >
        {{ $t('operation.logout') }}
      </el-button>
      <el-button
        type="primary"
        :icon="User"
        @click="()=>loginDrawer=true"
        v-else
      >
        {{ $t('operation.adminLogin') }}
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
    :title="$t('operation.adminLogin')"
    direction="rtl"
    :size="drawerSize"
    @closed="cancelLogin"
    @opened="tryLogin"
  >
    <el-form label-width="auto" :model="loginForm">
      <el-form-item label="Username">
        <el-input ref="usernameRef" v-model="loginForm.username" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="loginForm.password" show-password />
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="()=>loginDrawer=false">Cancel</el-button> -->
        <el-button type="primary" native-type="submit" @click="login" :loading="profileStore.isLoading">
          Log In
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.flex-grow {
  flex-grow: 1;
}
.nav-bar {
  background: #fcbd12;
  padding: 2rem 2rem 0;
  
  &-language-radio {
    position: fixed;
    top: 1rem;
    right:2rem;
    z-index: 1000;
  }
}
</style>
