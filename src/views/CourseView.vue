<script setup>
import { ref } from 'vue';
import CourseTab from '../components/tabs/CourseTab.vue';
import ClassTab from '../components/tabs/ClassTab.vue';

const activeName = ref('course');

</script>

<template>
  <el-tabs tab-position="left" v-model="activeName">
    <el-tab-pane :label="$t('title.course')" name="course">
      <course-tab />
    </el-tab-pane>
    <el-tab-pane  :label="$t('title.class')" name="class">
      <class-tab />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>