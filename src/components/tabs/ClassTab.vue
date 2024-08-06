<script setup>
import { onMounted, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import ClassForm from '../forms/ClassForm.vue';
import apis from '../../apis';
import { useLanguageStore } from '../../stores/language';

const loading = ref(false)
const classList = ref([]);
const refreshClassList = () => {
  loading.value = true;
  apis.getClassList()
  .then(res => res.json())
  .then(json => {
    classList.value = json.courses
    loading.value = false
  })
  .catch(err => {
    console.log(err)
    loading.value = false
  })
}
onMounted(() => {
  refreshClassList()
})

const currentPage = ref(1);

const languageStore = useLanguageStore()

const isAdding = ref(false);
const isEditing = ref(false);
const classData = ref({});
const newClass = ()=>{
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
  refreshClassList()
}
</script>

<template>
  <el-table
    v-loading="loading"
    :data="classList.slice((currentPage-1)*10, currentPage*10)"
    max-height="55vh"
    style="width: 100%"
    @row-click="editClass">
    <el-table-column :prop="'course_name.'+languageStore.lang" :label="$t('class.className')" />
    <el-table-column prop="tutor_name" :label="$t('class.tutorName')" />
    <el-table-column prop="venue" :label="$t('class.venue')" />
    <el-table-column prop="start_date" :label="$t('class.startDate')" />
    <el-table-column prop="end_date" :label="$t('class.endDate')" />
    <el-table-column prop="start_time" :label="$t('class.startTime')" />
    <el-table-column prop="end_time" :label="$t('class.endTime')" />
    <el-table-column prop="capacity" :label="$t('class.capacity')" />
  </el-table>
  <el-pagination
    background
    v-model:current-page="currentPage"
    :total="classList.length"
    layout="prev, pager, next, total" />
  <el-affix position="bottom" :offset="40" style="text-align: right;">
    <el-button :icon="Plus" size="large" circle @click="newClass"/>
  </el-affix>
  <class-form
    :is-show="isEditing"
    :is-new="isAdding"
    :form="classData"
    @close-dialog="closeForm" />
</template>

<style scoped>

</style>