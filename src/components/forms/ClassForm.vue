<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import MultiLangInput from './MultiLangInput.vue';
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

const weekdayOptions = [
  {
    value: 1,
    label: 'Mon',
  },
  {
    value: 2,
    label: 'Tue',
  },
  {
    value: 3,
    label: 'Wed',
  },
  {
    value: 4,
    label: 'Thu',
  },
  {
    value: 5,
    label: 'Fri',
  },
  {
    value: 6,
    label: 'Sat',
  },
  {
    value: 7,
    label: 'Sun',
  },
]

const disabledDate = (time) => {
  return time.getTime() > new Date(classForm.value.end_date).getTime()+8.64e7
    || time.getTime() < new Date(classForm.value.start_date).getTime()
}

const classForm = ref({});
const resetForm = () => {
  classForm.value = {
    course_name: {
      en: "",
      zh_Hant: "",
      zh: ""
    },
    tutor_name: "",
    venue: "",
    start_date: "",
    end_date: "",
    weekday: [],
    except_date: [],
    start_time: "",
    end_time: "",
    capacity: null,
    price: null,
    age_min: null,
    age_max: null,
    min_attendance: null
  }
}

const ruleFormRef = ref()
const rules = computed(() => ({
  courseName: [{
    required: true,
    message: t('formRule.class.className'),
    trigger: 'blur'
  }],
  tutor_name: [{
    required: true,
    message: t('formRule.class.tutorName'),
    trigger: 'blur'
  }],
  venue: [{
    required: true,
    message: t('formRule.class.venue'),
    trigger: 'blur'
  }],
  start_date: [{
    required: true,
    message: t('formRule.class.startDate'),
    trigger: 'change'
  }],
  end_date: [{
    required: true,
    message: t('formRule.class.endDate'),
    trigger: 'change'
  }],
  weekday: [{
    type: 'array',
    required: true,
    message: t('formRule.class.weekday'),
    trigger: 'change',
  }],
  start_time: [{
    required: true,
    message: t('formRule.class.startTime'),
    trigger: 'change'
  }],
  end_time: [{
    required: true,
    message: t('formRule.class.endTime'),
    trigger: 'change'
  }],
  capacity: [{
    required: true,
    message: t('formRule.class.capacity'),
    trigger: 'blur'
  }, {
    type: 'number',
    message: t('formRule.class.validCapacity'),
    trigger: 'change'
  }],
  price: [{
    required: true,
    message: t('formRule.class.price'),
    trigger: 'blur'
  }, {
    type: 'number',
    message: t('formRule.class.validPrice'),
    trigger: 'change'
  }],
  age_min: [{
    required: true,
    message: t('formRule.class.minAge'),
    trigger: 'blur'
  }, {
    type: 'number',
    message: t('formRule.class.validMinAge'),
    trigger: 'change'
  }],
  age_max: [{
    required: true,
    message: t('formRule.class.maxAge'),
    trigger: 'blur'
  }, {
    type: 'number',
    message: t('formRule.class.validMaxAge'),
    trigger: 'change'
  }],
  min_attendance: [{
    required: true,
    message: t('formRule.class.minAttendance'),
    trigger: 'blur'
  }, {
    type: 'number',
    message: t('formRule.class.validMinAttendance'),
    trigger: 'change'
  }],
}))
const submit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (props.isNew) {
        apis.addClass(classForm.value)
        .then(res => {
          closeDialog()
        })
        .catch(err => console.log(err))
      } else {
        apis.editClass(classForm.value)
        .then(res => {
          closeDialog()
        })
        .catch(err => console.log(err))
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const deleteClass = () => {
  apis.deleteClass(classForm.value.course_id)
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
      classForm.value = JSON.parse(JSON.stringify(props.form));
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

</script>

<template>
  <el-dialog
    :title="props.isNew ? $t('class.createClass') : $t('class.classDetail')"
    v-model="dialogVisible"
    :width="dialogWidth"
    @closed="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    align-center>
    <el-scrollbar ref="scroll" max-height="70vh">
      <el-form
        label-position="top"
        ref="ruleFormRef"
        :model="classForm"
        label-width="auto"
        scroll-to-error
        :rules="rules">
        <el-form-item :label="$t('class.className')" required />
        <multi-lang-input
          prop-name="course_name"
          v-model="classForm.course_name"
          :rules="rules.courseName"/>
        <el-form-item prop="tutor_name" :label="$t('class.tutorName')">
          <el-input v-model="classForm.tutor_name" />
        </el-form-item>
        <el-form-item prop="venue" :label="$t('class.venue')">
          <el-input v-model="classForm.venue" />
        </el-form-item>
        <el-form-item prop="start_date" :label="$t('class.startDate')">
          <el-date-picker
            v-model="classForm.start_date"
            type="date"
            placeholder="YYYY-MM-DD"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item prop="end_date" :label="$t('class.endDate')">
          <el-date-picker
            v-model="classForm.end_date"
            type="date"
            placeholder="YYYY-MM-DD"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item prop="weekday" :label="$t('class.weekday')">
          <el-select
            v-model="classForm.weekday"
            multiple
          >
            <el-option
              v-for="item in weekdayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('class.exceptedDate')">
          <el-date-picker
            v-model="classForm.except_date"
            type="dates"
            placeholder="YYYY-MM-DD"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :editable="false"
            :clearable="false"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item prop="start_time" :label="$t('class.startTime')">
          <el-time-picker
            v-model="classForm.start_time"
            value-format="HH:mm:ss"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item prop="end_time" :label="$t('class.endTime')">
          <el-time-picker
            v-model="classForm.end_time"
            value-format="HH:mm:ss"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item prop="capacity" :label="$t('class.capacity')">
          <el-input-number
            v-model="classForm.capacity"
            :min="0" />
        </el-form-item>
        <el-form-item prop="price" :label="$t('class.price')">
          <el-input v-model="classForm.price" />
        </el-form-item>
        <el-form-item prop="age_min" :label="$t('class.minAge')">
          <el-input-number
            v-model="classForm.age_min"
            :min="0" />
        </el-form-item>
        <el-form-item prop="age_max" :label="$t('class.maxAge')">
          <el-input-number
            v-model="classForm.age_max"
            :min="0" />
        </el-form-item>
        <el-form-item prop="min_attendance" :label="$t('class.minAttendance')">
          <el-input-number
            v-model="classForm.min_attendance"
            :min="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submit(ruleFormRef)">{{ props.isNew?$t('operation.add'):$t('operation.update') }}</el-button>
          <el-button @click="closeDialog">{{ $t('operation.cancel') }}</el-button>
          <el-button v-if="!props.isNew" type="danger" @click="deleteClass">{{ $t('operation.delete') }}</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </el-dialog>
</template>

<style>

</style>