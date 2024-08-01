<script setup>
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'

const courseList = ref([
]);

const currentPage = ref(1);

const isAdding = ref(false);
const isEditing = ref(false);
const courseData = ref({});
const newCourse = (row)=>{
  courseData.value = {
  };
  isAdding.value = true;
  isEditing.value = true;
};
const editCourse = (row)=>{
  courseData.value = row;
  isAdding.value = false;
  isEditing.value = true;
};
const closeForm = () => {
  isEditing.value = false;
  isAdding.value = false;
}
</script>

<template>
  <el-table
    :data="courseList.slice((currentPage-1)*10, currentPage*10)"
    style="width: 100%"
    @row-click="editCourse">
  </el-table>
  <el-pagination
    background
    v-model:current-page="currentPage"
    :total="courseList.length"
    layout="prev, pager, next, total" />
  <el-affix position="bottom" :offset="40" style="text-align: right;">
    <el-button :icon="Plus" size="large" circle @click="newCourse"/>
  </el-affix>
</template>

<style scoped>

</style>