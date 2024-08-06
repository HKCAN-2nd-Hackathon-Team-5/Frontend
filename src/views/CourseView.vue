<script setup>
import { ref } from 'vue';
import { useProfileStore } from '../stores/profile';
import CourseTab from '../components/tabs/CourseTab.vue';
import ClassTab from '../components/tabs/ClassTab.vue';
import CourseCardView from '../components/CourseCardView.vue';

const profileStore = useProfileStore();
const activeName = ref('course');

</script>

<template>
  <div>
    <el-tabs tab-position="left" v-model="activeName" v-if="profileStore.loggedIn">
      <el-tab-pane :label="$t('title.course')" name="course">
      </el-tab-pane>
      <el-tab-pane  :label="$t('title.class')" name="class">
      </el-tab-pane>
      <course-tab v-if="activeName==='course'" />
      <class-tab v-if="activeName==='class'" />
    </el-tabs>
    <course-card-view v-else/>
  </div>
</template>

<style scoped>

</style>