<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import apis from '../../apis';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
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

const cityOptions = [
  {
    value: 'markham',
    label: 'markham',
  },
  {
    value: 'richmondHill',
    label: 'richmondHill',
  },
  {
    value: 'scarborough',
    label: 'scarborough',
  },
  {
    value: 'cityOfToronto',
    label: 'cityOfToronto',
  },
  {
    value: 'northYork',
    label: 'northYork',
  },
  {
    value: 'others',
    label: 'others',
  },
]

const rules = computed(() => ({
  first_name: [{
    required: true,
    message: t('formRule.student.firstName'),
    trigger: 'blur'
  }],
  last_name: [{
    required: true,
    message: t('formRule.student.lastName'),
    trigger: 'blur'
  }],
  gender: [{
    required: true,
    message: t('formRule.student.gender'),
    trigger: 'change'
  }],
  dob: [{
    required: true,
    message: t('formRule.student.dob'),
    trigger: 'change'
  }],
  phone_no: [{
    required: true,
    message: t('formRule.student.phone'),
    trigger: 'blur'
  }, {
    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    message: t('formRule.student.validPhone'),
    trigger: 'change'
  }],
  email: [{
    required: true,
    message: t('formRule.student.email'),
    trigger: 'blur'
  }, {
    type: 'email',
    message: t('formRule.student.validEmail'),
    trigger: 'change',
  },],
  address: [{
    required: true,
    message: t('formRule.student.address'),
    trigger: 'blur'
  }],
  city: [{
    required: true,
    message: t('formRule.student.city'),
    trigger: 'change'
  }],
  postal_code: [{
    required: true,
    message: t('formRule.student.postal'),
    trigger: 'blur'
  }, {
    pattern: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/,
    message: t('formRule.student.validPostal'),
    trigger: 'change'
  }],
  credit_balance: [{
    required: true,
    message: t('formRule.student.credit'),
    trigger: 'blur'
  }, {
    type: 'number',
    message: t('formRule.student.validCredit'),
    trigger: 'change'
  }]
}));
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
      <el-form-item prop="first_name" :label="$t('student.firstName')">
        <el-input v-model="studentForm.first_name" />
      </el-form-item>
      <el-form-item prop="last_name" :label="$t('student.lastName')">
        <el-input v-model="studentForm.last_name" />
      </el-form-item>
      <el-form-item prop="gender" :label="$t('student.gender')">
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
      <el-form-item prop="dob" :label="$t('student.dob')">
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
      <el-form-item :label="$t('student.phone')" prop="phone_no">
        <el-input v-model="studentForm.phone_no" />
      </el-form-item>
      <el-form-item :label="$t('student.email')" prop="email">
        <el-input v-model="studentForm.email" />
      </el-form-item>
      <el-form-item prop="address" :label="$t('student.address')">
        <el-input v-model="studentForm.address" />
      </el-form-item>
      <el-form-item prop="city" :label="$t('student.city')">
        <el-select
          v-model="studentForm.city"
        >
          <el-option
            v-for="item in cityOptions"
            :key="item.value"
            :label="$t('student.'+item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('student.postal')" prop="postal_code">
        <el-input v-model="studentForm.postal_code" />
      </el-form-item>
      <el-form-item prop="credit_balance" :label="$t('student.credit')">
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