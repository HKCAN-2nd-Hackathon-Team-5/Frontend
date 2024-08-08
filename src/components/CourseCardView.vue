<script setup>
import { onMounted, ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue'
import apis from '../apis';
import { useLanguageStore } from '../stores/language';
import ApplicationForm from './forms/ApplicationForm.vue';

const languageStore = useLanguageStore()

const loading = ref(false)

const courseList = ref([]);
const refreshCourseList = () => {
  loading.value = true;
  apis.getCourseList('cicspublic', 'cicspublic')
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
  )
})

const isRegistering = ref(false);
const courseData = ref({});
const registerCourse = (course)=>{
  courseData.value = course;
  isRegistering.value = true;
};
const closeForm = () => {
  isRegistering.value = false;
  // refreshCourseList()
}
</script>

<template>
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
  <div class="card-container" v-loading="loading">
    <el-card
      class="course-card"
      v-for="course in displayList"
      :key="course.form_id">
      <template #header>
        <div class="card-header">
          {{ course.title[languageStore.lang] }}
        </div>
      </template>
      <div class="card-body">
        {{ course.desc[languageStore.lang] }}
      </div>
      <template #footer>
        <el-button type="primary" @click="registerCourse(course)">{{ $t('application.register') }}</el-button>
      </template>
    </el-card>
    <application-form 
      :is-show="isRegistering"
      :form="courseData"
      @close-dialog="closeForm" />
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 2vh 5vw;
}
.course-card {
  width: 65vw;
  margin: 1vh 1vw;
}
.card-header {
  font-weight: 800;
}
.card-body {
  height: 15vh;
  overflow-y: auto;
}

@media (min-width: 600px) {
  .card-container {
    justify-content: space-between;
  }
  .course-card {
    width: 37vw;
  }
}
</style>