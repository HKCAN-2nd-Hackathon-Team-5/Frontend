<script setup>
import { onMounted, ref, computed } from 'vue';
import { Plus, Search } from '@element-plus/icons-vue'
import ClassForm from '../forms/ClassForm.vue';
import apis from '../../apis';
import { useLanguageStore } from '../../stores/language';
import * as XLSX from 'xlsx';
import { ElMessage } from "element-plus";

const languageStore = useLanguageStore()

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

const searchInput = ref('')

const displayList = computed(() => {
  return classList.value.filter(item => 
    item.course_name.en.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.course_name.zh_Hant.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.course_name.zh.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.tutor_name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    item.venue.toLowerCase().includes(searchInput.value.toLowerCase())
  ).slice((currentPage.value-1)*10, currentPage.value*10)
})

const currentPage = ref(1);

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

const exportClassPaidStudent = (classDetail) => {
  ElMessage('Exporting...')
  apis.exportClassPaidStudent(classDetail.course_id)
  .then(res => res.json())
  .then(json => {
    let dataList = JSON.parse(JSON.stringify(json.students));
    dataList = dataList.map((x)=> {
      return {
        'Student First name': x.first_name,
        'Student Last Name': x.last_name,
        'Gender': x.gender,
        'Date of Birth': x.dob,
        'Address': x.address,
        'City': x.city,
        'Postal Code': x.postal_code,
        'Phone No.': x.phone_no,
        'Email': x.email
      };
    });
    let ws = XLSX.utils.json_to_sheet(dataList);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "sheet");
    let buf = XLSX.write(wb, {bookType:'xlsx', type:'buffer'}); // generate a nodejs buffer
    let str = XLSX.write(wb, {bookType:'xlsx', type:'binary'}); // generate a binary string in web browser
    XLSX.writeFile(wb, `${classDetail.course_name.en}_Participant_List.xlsx`);
  })
  .catch(err=>{
    ElMessage.error('Try again')
  })
}
</script>

<template>
  <el-row type="flex" justify="end">
    <el-col :span="8">
      <el-input
        size="large"
        :placeholder="`${$t('class.className')}/${$t('class.tutorName')}/${$t('class.venue')}`"
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
    table-layout="auto"
    @row-click="editClass">
    <el-table-column fixed :prop="'course_name.'+languageStore.lang" :label="$t('class.className')" />
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
    <el-table-column fixed="right" :width="170">
      <template #default="scope">
        <el-button size="small" @click.stop="exportClassPaidStudent(scope.row)">Export Participant List</el-button>
      </template>
    </el-table-column>
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