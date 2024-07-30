<script setup>
import { ref } from 'vue'
import IconCICSCL from './icons/IconCICSCL.vue'

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
</script>

<template>
  <IconCICSCL />
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
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
</template>

<style scoped>
.el-menu {
  height: 20%;
}
.el-menu-item {
  height: 100%;
}
.flex-grow {
  flex-grow: 1;
}

</style>
