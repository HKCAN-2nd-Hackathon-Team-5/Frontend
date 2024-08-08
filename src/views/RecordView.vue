<script setup>
import { ref, onMounted, computed } from 'vue';
import { Plus, Search } from '@element-plus/icons-vue'
import apis from '../apis';
import { useLanguageStore } from '../stores/language';

const languageStore = useLanguageStore()

const loading = ref(false)

const filterOption = ref('name')

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
  // .filter(item => 
    // item.first_name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    // item.last_name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    // item.phone_no.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    // item.email.toLowerCase().includes(searchInput.value.toLowerCase())
  // )
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
</script>

<template>
  <div>
    <el-row type="flex" justify="end" align="middle">
      <el-col :span="7">
        <el-radio-group v-model="filterOption">
          <el-radio value="application">By application</el-radio>
          <el-radio value="student">By student</el-radio>
          <el-radio value="course">By course</el-radio>
        </el-radio-group>
      </el-col>
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
      @row-click="editRecord">
    </el-table>
    <el-pagination
      background
      v-model:current-page="currentPage"
      :total="recordList.length"
      layout="prev, pager, next, total" />
  </div>
</template>

<style scoped>

</style>