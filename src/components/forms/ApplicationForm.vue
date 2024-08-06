<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useLanguageStore } from '../../stores/language';
import apis from '../../apis';

const props = defineProps({
  form: Object,
  isShow: {
    required: true,
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['closeDialog']);

const active = ref(0);
const back = () => {
  active.value--
}
const next = () => {
  active.value++
}

const languageStore = useLanguageStore()

const courseDetail = ref({})

const applicationForm = ref({});
const resetForm = () => {
  applicationForm.value = {
    student: {
      first_name: "",
      last_name: "",
      gender: "",
      dob: null,
      address: null,
      city: null,
      postal_code: null,
      phone_no: null,
      email: null
    },
    application: {
      form_id: null,
      course_ids: [],
      lang: null,
      special: null,
      parent_name: "",
      parent_relation: null,
      emergency_name: "",
      emergency_relation: null,
      emergency_phone_no: null,
      self_leave_name: "",
      self_leave_phone_no: null,
      residency_status: null,
      residency_origin: null,
      residency_stay: null,
      ig_username: "",
      add_answers_1: null,
      add_answers_2: null,
      add_answers_3: null,
      add_answers_4: null,
      add_answers_5: null,
      consent_name: "",
      consent_phone_no: null,
      remark: null
    }
  }
}

const ruleFormRef = ref()
const submit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      apis.editStudent(applicationForm.value)
      .then(res => {
        closeDialog()
      })
      .catch(err => console.log(err))
    } else {
      console.log('error submit!', fields)
    }
  })
}

const dialogVisible = ref(false);
const closeDialog = ()=>{
  emit('closeDialog');
}
watch(() => props.isShow, (newVisible, oldVisible) => {
  dialogVisible.value = newVisible;
  resetForm()
  if (dialogVisible.value) {
    nextTick(()=>ruleFormRef.value.clearValidate())
    courseDetail.value = JSON.parse(JSON.stringify(props.form));
  }
});
const dialogWidth = ref("50%");
const handleResize = () => {
  if (window.innerWidth < 500) {
    dialogWidth.value = "90%"
  } else {
    dialogWidth.value = "60%"
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
  'student.phone_no': [{
    required: true,
    message: 'Please input phone number',
    trigger: 'change'
  }, {
    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    message: 'Please input valid number',
    trigger: ['blur', 'change']
  }],
  'student.email': [{
    type: 'email',
    required: true,
    message: 'Please input a valid email address',
    trigger: 'change',
  },],
  'student.postal_code': [{
    required: true,
    pattern: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/,
    message: 'Please input valid postal code',
    trigger: ['blur', 'change']
  }]
});
</script>

<template>
  <el-dialog
    :title="$t('application.register')"
    v-model="dialogVisible"
    top="5vh"
    :width="dialogWidth"
    @closed="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-container v-show="active === 0">
      <el-header>
        {{ courseDetail.title[languageStore.lang] }}
      </el-header>
      <el-main>
        <div>{{ courseDetail.desc[languageStore.lang] }}</div>
        <div>{{ courseDetail.start_date }} - {{ courseDetail.end_date }}</div>
        <div>{{ courseDetail.early_bird.end_date }}</div>
        <div>{{ courseDetail.early_bird.discount }}</div>
        <div>{{ courseDetail.ig_discount }}</div>
        <el-table :data="courseDetail.courses">
          <el-table-column :prop="'course_name.'+languageStore.lang" :label="$t('class.className')" />
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
        </el-table>
      </el-main>
    </el-container>
    <el-form ref="ruleFormRef" :model="applicationForm" :rules="rules" label-width="auto" v-show="active !== 0">
      <div v-show="active === 1">
      <el-form-item prop="student.first_name" :label="$t('student.firstName')" required>
        <el-input v-model="applicationForm.student.first_name" />
      </el-form-item>
      <el-form-item prop="student.last_name" :label="$t('student.lastName')" required>
        <el-input v-model="applicationForm.student.last_name" />
      </el-form-item>
      <el-form-item prop="gender" :label="$t('student.gender')" required>
        <el-select
          v-model="applicationForm.gender"
        >
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="$t('student.'+item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="student.dob" :label="$t('student.dob')" required>
        <el-date-picker
          v-model="applicationForm.student.dob"
          type="date"
          placeholder="YYYY-MM-DD"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :editable="false"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item prop="student.phone_no" :label="$t('student.phone')">
        <el-input v-model="applicationForm.student.phone_no" />
      </el-form-item>
      <el-form-item prop="student.email" :label="$t('student.email')">
        <el-input v-model="applicationForm.student.email" />
      </el-form-item>
      <el-form-item prop="student.address" :label="$t('student.address')" required>
        <el-input v-model="applicationForm.student.address" />
      </el-form-item>
      <el-form-item prop="student.city" :label="$t('student.city')" required>
        <el-input v-model="applicationForm.student.city" />
      </el-form-item>
      <el-form-item prop="student.postal_code" :label="$t('student.postal')" required>
        <el-input v-model="applicationForm.student.postal_code" />
      </el-form-item>
      </div>
      <el-form-item>
        <el-button type="success" @click="submit(ruleFormRef)">{{ $t('operation.add') }}</el-button>
        <el-button @click="closeDialog">{{ $t('operation.cancel') }}</el-button>
      </el-form-item>
    </el-form>
    <el-steps :active="active" finish-status="success" align-center>
      <el-step :title="$t('course.courseDetail')" />
      <el-step :title="$t('student.personalInfo')" />
      <el-step :title="$t('application.register')" />
      <el-step :title="$t('application.consent')" />
    </el-steps>
    <div class="application-steps">
      <el-button v-show="active>0" @click="back">{{ $t('application.back') }}</el-button>
      <span v-show="active===0"></span>
      <el-button v-show="active<3" @click="next">{{ $t('application.next') }}</el-button>
    </div>
  </el-dialog>
</template>

<style>
.application-steps {
  display: flex;
  justify-content: space-between;
}
</style>