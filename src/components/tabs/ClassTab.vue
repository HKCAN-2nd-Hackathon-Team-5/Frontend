<script setup>
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'

const classList = ref([
]);

const currentPage = ref(1);

const isAdding = ref(false);
const isEditing = ref(false);
const classData = ref({});
const newClass = (row)=>{
  classData.value = {
  };
  isAdding.value = true;
  isEditing.value = true;
};
const editClass = (row)=>{
  classData.value = row;
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
    :data="classList.slice((currentPage-1)*10, currentPage*10)"
    style="width: 100%"
    @row-click="editClass">
  </el-table>
  <el-pagination
    background
    v-model:current-page="currentPage"
    :total="classList.length"
    layout="prev, pager, next, total" />
  <el-affix position="bottom" :offset="40" style="text-align: right;">
    <el-button :icon="Plus" size="large" circle @click="newClass"/>
  </el-affix>
</template>

<style scoped>

</style>