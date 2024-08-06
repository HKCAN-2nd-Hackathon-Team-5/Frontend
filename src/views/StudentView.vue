<script setup>
import { ref, onMounted } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import apis from '../apis';
import studentForm from '../components/forms/StudentForm.vue';
import { useLanguageStore } from '../stores/language';

const loading = ref(false)

const studentList = ref([]);
const refreshStudentList = () => {
  loading.value = true;
  apis.getStudentList()
  .then(res => res.json())
  .then(json => {
    studentList.value = json.students
    loading.value = false
  })
  .catch(err => {
    console.log(err)
    loading.value = false
  })
}
onMounted(() => {
  refreshStudentList()
})

const currentPage = ref(1);

const languageStore = useLanguageStore()

const isAdding = ref(false);
const isEditing = ref(false);
const studentData = ref({});
const newStudent = ()=>{
  isAdding.value = true;
  isEditing.value = true;
};
const editStudent = (row)=>{
  studentData.value = row;
  isAdding.value = false;
  isEditing.value = true;
};
const closeForm = () => {
  isEditing.value = false;
  isAdding.value = false;
  refreshStudentList()
}
</script>

<template>
  <div>
    <el-table
      v-loading="loading"
      :data="studentList.slice((currentPage-1)*10, currentPage*10)"
      max-height="55vh"
      style="width: 100%"
      @row-click="editStudent">
      <el-table-column fixed prop="first_name" :label="$t('student.firstName')" />
      <el-table-column fixed prop="last_name" :label="$t('student.lastName')" />
      <el-table-column prop="gender" :label="$t('student.gender')" />
      <el-table-column prop="phone_no" :label="$t('student.phone')" />
      <el-table-column prop="email" :label="$t('student.email')" />
      <el-table-column prop="credit_balance" :label="$t('student.credit')" />
    </el-table>
    <el-pagination
      background
      v-model:current-page="currentPage"
      :total="studentList.length"
      layout="prev, pager, next, total" />
    <!-- <el-affix position="bottom" :offset="40" style="text-align: right;">
      <el-button :icon="Plus" size="large" circle @click="newStudent"/>
    </el-affix> -->
    <student-form
      :is-show="isEditing"
      :is-new="isAdding"
      :form="studentData"
      @close-dialog="closeForm" />
  </div>
</template>

<style scoped>

</style>