<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
const props = defineProps({
  form: Object,
  isShow: {
    required: true,
    type: Boolean,
    default: false
  },
  isNew: {
    required: true,
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['closeDialog']);

const memberForm = ref({});
const updateMember = () => {

};
const deleteMember = () => {

};

const dialogVisible = ref(false);
const closeDialog = ()=>{
  emit('closeDialog');
}
watch(() => props.isShow, (newVisible, oldVisible) => {
  dialogVisible.value = newVisible;
  if (dialogVisible.value) {
    memberForm.value = {...props.form};
  }
});

const genderOptions = [
  {
    value: 'M',
    label: 'Male',
  },
  {
    value: 'F',
    label: 'Female',
  },
  {
    value: 'Other',
    label: 'Other',
  },
];

const rules = reactive({
  PHONE_NO: [{
    required: true,
    message: 'Please input phone number',
    trigger: 'change'
  }, {
    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    message: 'Please input valid number',
    trigger: ['blur', 'change']
  }],
  EMAIL: [{
    type: 'email',
    required: true,
    message: 'Please input a valid email address',
    trigger: 'change',
  },],
  POSTAL_CODE: [{
    required: true,
    pattern: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/,
    message: 'Please input valid postal code',
    trigger: ['blur', 'change']
  }]
});
</script>

<template>
  <el-dialog
    :title="props.isNew ? $t('member.addMember') : $t('member.personalInfo')"
    v-model="dialogVisible"
    top="5vh"
    @closed="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form :model="memberForm" :rules="rules" label-width="auto">
      <el-form-item :label="$t('member.firstName')" required>
        <el-input v-model="memberForm.first_name" />
      </el-form-item>
      <el-form-item :label="$t('member.lastName')" required>
        <el-input v-model="memberForm.last_name" />
      </el-form-item>
      <el-form-item :label="$t('member.gender')" required>
        <el-select
          v-model="memberForm.GENDER"
          placeholder="Select"
        >
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.dob')" required>
        <el-date-picker
          v-model="memberForm.DOB"
          type="date"
          placeholder="YYYY-MM-DD"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :editable="false"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item :label="$t('member.phone')" prop="PHONE_NO">
        <el-input v-model="memberForm.PHONE_NO" />
      </el-form-item>
      <el-form-item :label="$t('member.email')" prop="EMAIL">
        <el-input v-model="memberForm.EMAIL" />
      </el-form-item>
      <el-form-item :label="$t('member.address')" required>
        <el-input v-model="memberForm.ADDRESS" />
      </el-form-item>
      <el-form-item :label="$t('member.city')" required>
        <el-input v-model="memberForm.CITY" />
      </el-form-item>
      <el-form-item :label="$t('member.postal')" prop="POSTAL_CODE">
        <el-input v-model="memberForm.POSTAL_CODE" />
      </el-form-item>
      <el-form-item :label="$t('member.credit')" required>
        <el-input-number
          v-model="memberForm.CREDIT_BALANCE"
          :min="0" />
      </el-form-item>
      <el-form-item>
        <el-col :span="21">
          <el-button type="primary" @click="updateMember">{{ $t('operation.update') }}</el-button>
          <el-button @click="closeDialog">{{ $t('operation.cancel') }}</el-button>
        </el-col>
        <el-col :span="2">
          <el-button v-if="!props.isNew" type="danger" @click="deleteMember">{{ $t('operation.delete') }}</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style>

</style>