<script setup>
import { ref } from 'vue';
import CourseTab from '../components/tabs/CourseTab.vue';

const activeName = ref('course');

</script>

<template>
  <el-tabs type="card" tab-position="left" v-model="activeName">
    <el-tab-pane :label="$t('title.course')" name="course">
      <course-tab />
    </el-tab-pane>
    <el-tab-pane  :label="$t('title.class')" name="class">

    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>