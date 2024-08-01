<script setup>
import MemberForm from '../components/forms/MemberForm.vue';
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'

const memberList = ref([
  {
    "customer_id":1,
    "first_name":"Anson",
    "last_name":"Ng",
    "GENDER":"M",
    "DOB":null,
    "ADDRESS":null,
    "CITY":null,
    "POSTAL_CODE":null,
    "PHONE_NO":null,
    "EMAIL":null,
    "CREDIT_BALANCE":0
  }
]);

const currentPage = ref(1);

const isAdding = ref(false);
const isEditing = ref(false);
const memberData = ref({});
const newMember = (row)=>{
  memberData.value = {
    "first_name":"",
    "last_name":"",
    "GENDER":"",
    "DOB":null,
    "ADDRESS":null,
    "CITY":null,
    "POSTAL_CODE":null,
    "PHONE_NO":null,
    "EMAIL":null,
    "CREDIT_BALANCE":0
  };
  isAdding.value = true;
  isEditing.value = true;
};
const editMember = (row)=>{
  memberData.value = row;
  isAdding.value = false;
  isEditing.value = true;
};
const closeForm = () => {
  isEditing.value = false;
  isAdding.value = false;
}
</script>

<template>
  <el-table
    :data="memberList.slice((currentPage-1)*10, currentPage*10)"
    style="width: 100%"
    @row-click="editMember">
    <el-table-column prop="first_name" :label="$t('member.firstName')" />
    <el-table-column prop="last_name" :label="$t('member.lastName')" />
    <el-table-column prop="gender" :label="$t('member.gender')" />
    <el-table-column prop="PHONE_NO" :label="$t('member.phone')" />
    <el-table-column prop="EMAIL" :label="$t('member.email')" />
    <el-table-column prop="CREDIT_BALANCE" :label="$t('member.credit')" />
  </el-table>
  <el-pagination
    background
    v-model:current-page="currentPage"
    :total="memberList.length"
    layout="prev, pager, next, total" />
  <el-affix position="bottom" :offset="40" style="text-align: right;">
    <el-button :icon="Plus" size="large" circle @click="newMember"/>
  </el-affix>
  <member-form
    :is-show="isEditing"
    :is-new="isAdding"
    :form="memberData"
    @close-dialog="closeForm" />
</template>

<style scoped>

</style>