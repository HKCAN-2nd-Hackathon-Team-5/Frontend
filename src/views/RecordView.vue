<script setup>
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'

const recordList = ref([
]);

const currentPage = ref(1);

const isEditing = ref(false);
const recordData = ref({});
const editRecord = (row)=>{
  recordData.value = row;
  isEditing.value = true;
};
const closeForm = () => {
  isEditing.value = false;
}
</script>

<template>
  <el-table
    :data="recordList.slice((currentPage-1)*10, currentPage*10)"
    style="width: 100%"
    @row-click="editRecord">
  </el-table>
  <el-pagination
    background
    v-model:current-page="currentPage"
    :total="recordList.length"
    layout="prev, pager, next, total" />
</template>

<style scoped>

</style>