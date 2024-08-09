<script setup>
import { ref, onMounted, computed } from 'vue';
import { Plus, Search } from '@element-plus/icons-vue'
import apis from '../apis';
import { useLanguageStore } from '../stores/language';
import RecordForm from '../components/forms/RecordForm.vue';
import { ElMessage } from "element-plus";

const languageStore = useLanguageStore()

const loading = ref(false)

const filterOption = ref('application')

const recordList = ref([]);
const refreshRecordList = () => {
  loading.value = true;
  apis.getRecordList()
  .then(res => res.json())
  .then(json => {
    recordList.value = json.applications
    loading.value = false
  })
  .catch(err => {
    console.log(err)
    loading.value = false
  })
}
onMounted(() => {
  refreshRecordList()
})

const searchInput = ref('')

const displayList = computed(() => {
  return recordList.value
  .filter(item => 
    item.student.first_name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.student.last_name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.form.title.en.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.form.title.zh_Hant.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.form.title.zh.toLowerCase().includes(searchInput.value.toLowerCase())
  )
  .slice((currentPage.value-1)*10, currentPage.value*10)
})

const currentPage = ref(1);

const isEditing = ref(false);
const recordData = ref({});
const editRecord = (row)=>{
  recordData.value = row;
  isEditing.value = true;
};
const closeForm = () => {
  isEditing.value = false;
  refreshRecordList()
}

const sendInvoiceButtondisabled = (applicationDetail) => {
 return Object.keys(applicationDetail.payment).length > 0;
}
const sendInvoice = (applicationDetail) => {
  ElMessage('Send Invoice now...')
  apis.sendInvoice(applicationDetail.application_id)
  .then(res => {
    if (res.status === 200) {
      refreshRecordList()
    } else {
      ElMessage.error('Try again')
    }
  })
  .catch(err=>{
    ElMessage.error('Try again')
  })
}
</script>

<template>
  <div>
    <el-row type="flex" justify="end" align="middle">
      <!-- <el-col :span="7">
        <el-radio-group v-model="filterOption">
          <el-radio value="application">By application</el-radio>
          <el-radio value="student">By student</el-radio>
          <el-radio value="course">By course</el-radio>
        </el-radio-group>
      </el-col> -->
      <el-col :span="8">
        <el-input
          size="large"
          :placeholder="`${$t('student.firstName')}/${$t('student.lastName')}/${$t('course.courseTitle')}`"
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
      @row-click="editRecord">
      <!-- <el-table-column type="expand"></el-table-column> -->
      <el-table-column :label="$t('student.studentName')">
        <template #default="scope">
          {{ scope.row.student.first_name + ' ' + scope.row.student.last_name }}
        </template>
      </el-table-column>
      <el-table-column :prop="'form.title.'+languageStore.lang" :label="$t('course.courseTitle')" />
      <el-table-column prop="price" :label="$t('record.price')" />
      <el-table-column prop="submit_time" :label="$t('record.submittedTime')" />
      <el-table-column>
        <template #default="scope">
          <el-button
            @click.stop="sendInvoice(scope.row)"
            :disabled="sendInvoiceButtondisabled(scope.row)">
            Sent Invoice</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      v-model:current-page="currentPage"
      :total="recordList.length"
      layout="prev, pager, next, total" />
    <record-form
      :is-show="isEditing"
      :form="recordData"
      @close-dialog="closeForm" />
  </div>
</template>

<style scoped>

</style>