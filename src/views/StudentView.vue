<script setup>
import { ref, onMounted, computed } from 'vue';
import { Plus, Search } from '@element-plus/icons-vue'
import apis from '../apis';
import studentForm from '../components/forms/StudentForm.vue';
// import { useLanguageStore } from '../stores/language';

// const languageStore = useLanguageStore()

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

const searchInput = ref('')

const displayList = computed(() => {
  return studentList.value.filter(item => 
    item.first_name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.last_name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.phone_no.toString().includes(searchInput.value.toLowerCase()) ||
    item.email.toLowerCase().includes(searchInput.value.toLowerCase())
  ).slice((currentPage.value-1)*10, currentPage.value*10)
})

const currentPage = ref(1);

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
    <el-row type="flex" justify="end">
      <el-col :span="8">
        <el-input
          size="large"
          :placeholder="`${$t('student.firstName')}/${$t('student.lastName')}/${$t('student.phone')}/${$t('student.email')}`"
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