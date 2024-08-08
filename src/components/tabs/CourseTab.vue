<script setup>
import { onMounted, ref, computed } from 'vue';
import { Plus, Search } from '@element-plus/icons-vue'
import CourseForm from '../forms/CourseForm.vue';
import apis from '../../apis';
import { useLanguageStore } from '../../stores/language';

const languageStore = useLanguageStore()

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

const searchInput = ref('')

const displayList = computed(() => {
  return courseList.value.filter(item => 
    item.title.en.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.title.zh_Hant.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.title.zh.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.desc.en.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.desc.zh_Hant.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.desc.zh.toLowerCase().includes(searchInput.value.toLowerCase())
  ).slice((currentPage.value-1)*10, currentPage.value*10)
})

const currentPage = ref(1);

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
  <el-row type="flex" justify="end">
    <el-col :span="8">
      <el-input
        size="large"
        :placeholder="`${$t('course.courseTitle')}/${$t('course.description')}`"
        v-model="searchInput">
        <template #prepend>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
    </el-col>
  </el-row>
  <el-table
    v-loading="loading"
    :data="displayList"
    max-height="48vh"
    style="width: 100%"
    @row-click="editCourse">
    <el-table-column type="expand">
      <template #default="props">
        <el-table :data="props.row.courses" border>
          <el-table-column :prop="'course_name.'+languageStore.lang" :label="$t('class.className')" />
          <el-table-column prop="tutor_name" :label="$t('class.tutorName')" />
          <el-table-column prop="venue" :label="$t('class.venue')" />
          <el-table-column :label="$t('class.date')">
            <template #default="scope">
              {{ scope.row.start_date }} - {{ scope.row.end_date }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('class.weekday')">
            <template #default="scope">
              {{ scope.row.weekday.toString() }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('class.exceptedDate')">
            <template #default="scope">
              {{ scope.row.except_date?.toString() }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('class.time')">
            <template #default="scope">
              {{ scope.row.start_time }} - {{ scope.row.end_time }}
            </template>
          </el-table-column>
          <el-table-column prop="min_attendance" :label="$t('class.minAttendance')" />
          <el-table-column prop="capacity" :label="$t('class.capacity')" />
          <el-table-column :label="$t('class.age')">
            <template #default="scope">
              {{ scope.row.age_min }} - {{ scope.row.age_max }}
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="$t('class.price')" />
        </el-table>
      </template>
    </el-table-column>
    <el-table-column :prop="'title.'+languageStore.lang" :label="$t('course.courseTitle')" />
    <el-table-column :label="$t('course.openDate')">
      <template #default="scope">
        {{ scope.row.start_date }} - {{ scope.row.end_date }}
      </template>
    </el-table-column>
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