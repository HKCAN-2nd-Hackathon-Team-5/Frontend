<script setup>
import { onMounted, ref } from 'vue';
import apis from '../apis';
import { useLanguageStore } from '../stores/language';
import ApplicationForm from './forms/ApplicationForm.vue';

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

const languageStore = useLanguageStore()

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
  <div class="card-container" v-loading="loading">
    <el-card
      class="course-card"
      v-for="course in courseList"
      :key="course.form_id">
      <template #header>
        <div class="card-header">
          {{ course.title[languageStore.lang] }}
        </div>
      </template>
      {{ course.desc[languageStore.lang] }}
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

@media (min-width: 600px) {
  .card-container {
    justify-content: space-between;
  }
  .course-card {
    width: 40vw;
  }
}
</style>