<script setup>
import { onMounted, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import CourseForm from '../forms/CourseForm.vue';
import apis from '../../apis';
import { useLanguageStore } from '../../stores/language';

const loading = ref(false)

const courseList = ref([]);
const refreshCourseList = () => {
  loading.value = true;
  apis.getCourseList()
  .then(res => res.json())
  .then(json => {
    courseList.value = json
    loading.value = false
  })
  .catch(err => {
    console.log(err)
    loading.value = false
  })
}
onMounted(() => {
  refreshCourseList()
})

const currentPage = ref(1);

const languageStore = useLanguageStore()

const isAdding = ref(false);
const isEditing = ref(false);
const courseData = ref({});
const newCourse = ()=>{
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
  refreshCourseList()
}
</script>

<template>
  <el-table
    v-loading="loading"
    :data="courseList.slice((currentPage-1)*10, currentPage*10)"
    max-height="55vh"
    style="width: 100%"
    @row-click="editCourse">
    <el-table-column type="expand">
      <template #default="props">
        <el-table :data="props.row.courses">
          <el-table-column :prop="'course_name.'+languageStore.lang" :label="$t('class.className')" />
          <el-table-column prop="tutor_name" :label="$t('class.tutorName')" />
          <el-table-column prop="venue" :label="$t('class.venue')" />
          <el-table-column prop="start_date" :label="$t('class.startDate')" />
          <el-table-column prop="end_date" :label="$t('class.endDate')" />
          <el-table-column prop="start_time" :label="$t('class.startTime')" />
          <el-table-column prop="end_time" :label="$t('class.endTime')" />
          <el-table-column prop="capacity" :label="$t('class.capacity')" />
        </el-table>
      </template>
    </el-table-column>
    <el-table-column :prop="'title.'+languageStore.lang" :label="$t('course.courseTitle')" />
    <el-table-column prop="start_date" :label="$t('course.startDate')" />
    <el-table-column prop="end_date" :label="$t('course.endDate')" />
    <el-table-column prop="is_kid_form" :label="$t('course.forKids')" />
    <el-table-column :label="$t('course.earlyBird')">
      <el-table-column prop="early_bird.end_date" :label="$t('course.endDate')" />
      <el-table-column prop="early_bird.discount" :label="$t('course.discount')" />
    </el-table-column>
    <el-table-column prop="ig_discount" :label="$t('course.igDiscount')" />
  </el-table>
  <el-pagination
    background
    v-model:current-page="currentPage"
    :total="courseList.length"
    layout="prev, pager, next, total" />
  <el-affix position="bottom" :offset="40" style="text-align: right;">
    <el-button :icon="Plus" size="large" circle @click="newCourse"/>
  </el-affix>
  <course-form
    :is-show="isEditing"
    :is-new="isAdding"
    :form="courseData"
    @close-dialog="closeForm" />
</template>

<style scoped>

</style>