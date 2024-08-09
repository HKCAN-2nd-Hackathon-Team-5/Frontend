<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue';
import apis from '../../apis';

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

const studentForm = ref({});
const resetForm = () => {
  studentForm.value = {
    first_name:"",
    last_name:"",
    gender:"",
    dob: null,
    address:null,
    city: null,
    postal_code: null,
    phone_no: null,
    email:null,
    credit_balance:0
  }
}

const ruleFormRef = ref()
const updateStudent = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      apis.editStudent(studentForm.value)
      .then(res => {
        closeDialog()
      })
      .catch(err => console.log(err))
    } else {
      console.log('error submit!', fields)
    }
  })
}
const deleteStudent = () => {
  apis.deleteStudent(studentForm.value.student_id)
    .then(res => {
      closeDialog()
    })
    .catch(err => console.log(err))
};

const dialogVisible = ref(false);
const closeDialog = ()=>{
  emit('closeDialog');
}
watch(() => props.isShow, (newVisible, oldVisible) => {
  dialogVisible.value = newVisible;
  resetForm()
  if (dialogVisible.value) {
    nextTick(()=>ruleFormRef.value.clearValidate())
    if (!props.isNew) {
      studentForm.value = JSON.parse(JSON.stringify(props.form));
    }
  }
});
const dialogWidth = ref("50%");
const handleResize = () => {
  if (window.innerWidth < 500) {
    dialogWidth.value = "90%"
  } else {
    dialogWidth.value = "50%"
  }
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const genderOptions = [
  {
    value: 'M',
    label: 'male',
  },
  {
    value: 'F',
    label: 'female',
  },
  {
    value: 'Other',
    label: 'other',
  },
];

const rules = reactive({
  phone_no: [{
    required: true,
    message: 'Please input phone number',
    trigger: 'change'
  }, {
    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    message: 'Please input valid number',
    trigger: ['blur', 'change']
  }],
  email: [{
    type: 'email',
    required: true,
    message: 'Please input a valid email address',
    trigger: 'change',
  },],
  postal_code: [{
    required: true,
    pattern: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/,
    message: 'Please input valid postal code',
    trigger: ['blur', 'change']
  }]
});
</script>

<template>
  <el-dialog
    :title="props.isNew ? $t('student.addStudent') : $t('student.personalInfo')"
    v-model="dialogVisible"
    :width="dialogWidth"
    @closed="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    align-center>
    <el-form
      ref="ruleFormRef"
      :model="studentForm"
      :rules="rules"
      label-width="auto"
      scroll-to-error>
      <el-form-item prop="first_name" :label="$t('student.firstName')" required>
        <el-input v-model="studentForm.first_name" />
      </el-form-item>
      <el-form-item prop="last_name" :label="$t('student.lastName')" required>
        <el-input v-model="studentForm.last_name" />
      </el-form-item>
      <el-form-item prop="gender" :label="$t('student.gender')" required>
        <el-select
          v-model="studentForm.gender"
        >
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="$t('student.'+item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="dob" :label="$t('student.dob')" required>
        <el-date-picker
          v-model="studentForm.dob"
          type="date"
          placeholder="YYYY-MM-DD"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :editable="false"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item :label="$t('student.phone')" prop="PHONE_NO">
        <el-input v-model="studentForm.phone_no" />
      </el-form-item>
      <el-form-item :label="$t('student.email')" prop="EMAIL">
        <el-input v-model="studentForm.email" />
      </el-form-item>
      <el-form-item prop="address" :label="$t('student.address')" required>
        <el-input v-model="studentForm.address" />
      </el-form-item>
      <el-form-item prop="city" :label="$t('student.city')" required>
        <el-input v-model="studentForm.city" />
      </el-form-item>
      <el-form-item :label="$t('student.postal')" prop="POSTAL_CODE">
        <el-input v-model="studentForm.postal_code" />
      </el-form-item>
      <el-form-item prop="credit_balance" :label="$t('student.credit')" required>
        <el-input-number
          v-model="studentForm.credit_balance"
          :min="0" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="updateStudent(ruleFormRef)">{{ props.isNew?$t('operation.add'):$t('operation.update') }}</el-button>
        <el-button @click="closeDialog">{{ $t('operation.cancel') }}</el-button>
        <el-button v-if="!props.isNew" type="danger" @click="deleteStudent">{{ $t('operation.delete') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style>

</style>