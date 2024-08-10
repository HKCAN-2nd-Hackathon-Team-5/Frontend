<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import MultiLangInput from './MultiLangInput.vue';
import apis from '../../apis';
import { useLanguageStore } from '../../stores/language';
import { useI18n } from 'vue-i18n';

const languageStore = useLanguageStore()
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

const courseForm = ref({});
const resetForm = () => {
  courseForm.value = {
    title: {
      en: "",
      zh_Hant: "",
      zh: ""
    },
    desc: {
      en: "",
      zh_Hant: "",
      zh: ""
    },
    start_date: "",
    end_date: "",
    courses: [],
    is_kid_form: false,
    early_bird: {
      discount: 0,
      end_date: ''
    },
    ig_discount: 0,
    return_discount: 0,
    add_questions: {
      q1: {
        en: "",
        zh_Hant: "",
        zh: ""
      },
      q2: {
        en: "",
        zh_Hant: "",
        zh: ""
      },
      q3: {
        en: "",
        zh_Hant: "",
        zh: ""
      },
      q4: {
        en: "",
        zh_Hant: "",
        zh: ""
      },
      q5: {
        en: "",
        zh_Hant: "",
        zh: ""
      },
    }
  }
}

const loading = ref(false)
const classList = ref([]);
const classTableRef = ref()
const refreshClassList = () => {
  loading.value = true;
  apis.getClassList()
  .then(res => res.json())
  .then(json => {
    classList.value = json.courses
    nextTick(() => {
      classList.value.forEach(row => {
        courseForm.value.courses.forEach(course => {
          if (row.course_id === course.course_id) {
            classTableRef.value.toggleRowSelection(row, true)
          }
        })
      })
    })
    loading.value = false
  })
  .catch(err => {
    console.log(err)
    loading.value = false
  })
}
const handleCourseSelectionChange = (val) => {
  if (classList.value.length > 1) {
    courseForm.value.courses = val
  }
}

const ruleFormRef = ref()
const rules = computed(() => ({
  title: [{
    required: true,
    message: t('formRule.course.title'),
    trigger: 'blur'
  }],
  description: [{
    required: true,
    message: t('formRule.course.description'),
    trigger: 'blur'
  }],
  start_date: [{
    required: true,
    message: t('formRule.course.startOpenDate'),
    trigger: 'change'
  }],
  end_date: [{
    required: true,
    message: t('formRule.course.endOpenDate'),
    trigger: 'change'
  }],
  'early_bird.discount': [{
    type: 'number',
    message: t('formRule.course.validEarlyBird'),
    trigger: 'change'
  }],
  'early_bird.end_date': [{
    validator: checkEndDateNeedy,
    trigger: 'change'
  }],
  ig_discount: [{
    type: 'number',
    message: t('formRule.course.validIgDiscount'),
    trigger: 'change'
  }],
  return_discount: [{
    type: 'number',
    message: t('formRule.course.validReturnDiscount'),
    trigger: 'change'
  }],
}))
const checkEndDateNeedy = (rule, value, callback) => {
  if ((value === '' || !value) && courseForm.value.early_bird.discount !== 0) {
    return callback(new Error(t('formRule.course.earlyBirdEndDate')))
  }
}
const submit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (props.isNew) {
        apis.addCourse(courseForm.value)
        .then(res => {
          closeDialog()
        })
        .catch(err => console.log(err))
      } else {
        apis.editCourse(courseForm.value)
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
const deleteCourse = () => {
  apis.deleteCourse(courseForm.value.form_id)
    .then(res => {
      closeDialog()
    })
    .catch(err => console.log(err))
};

const dialogVisible = ref(false);
const closeDialog = ()=>{
  classList.value = []
  emit('closeDialog');
}
watch(() => props.isShow, (newVisible, oldVisible) => {
  dialogVisible.value = newVisible;
  resetForm()
  if (dialogVisible.value) {
    nextTick(()=>ruleFormRef.value.clearValidate())
    if (!props.isNew) {
      courseForm.value = JSON.parse(JSON.stringify(props.form));
    }
    refreshClassList()
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
    :title="props.isNew ? $t('course.createCourse') : $t('course.courseDetail')"
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
        :model="courseForm"
        label-width="auto"
        :rules="rules"
        scroll-to-error>
        <el-form-item :label="$t('course.courseTitle')" required />
        <multi-lang-input
          prop-name="title"
          v-model="courseForm.title"
          :rules="rules.title" />
        <el-form-item :label="$t('course.description')" required/>
        <multi-lang-input
          isTextarea
          prop-name="desc"
          v-model="courseForm.desc"
          :rules="rules.description" />
        <el-form-item prop="start_date" :label="$t('course.startOpenDate')" required>
          <el-date-picker
            v-model="courseForm.start_date"
            type="date"
            placeholder="YYYY-MM-DD"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item prop="end_date" :label="$t('course.endOpenDate')" required>
          <el-date-picker
            v-model="courseForm.end_date"
            type="date"
            placeholder="YYYY-MM-DD"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item :label="$t('title.class')">
          <el-table
            ref="classTableRef"
            v-loading="loading"
            :data="classList"
            max-height="40vh"
            style="width: 100%"
            @selection-change="handleCourseSelectionChange">
            <el-table-column type="selection" />
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
        </el-form-item>
        <el-form-item prop="is_kid_form" :label="$t('course.forKids')">
          <el-switch v-model="courseForm.is_kid_form" />
        </el-form-item>
        <el-form-item prop="early_bird.discount" :label="$t('course.earlyBird')">
          <el-form-item :label="$t('course.discount')">
            <el-input-number
              v-model="courseForm.early_bird.discount"
              :min="0" />
          </el-form-item>
          <el-form-item prop="early_bird.end_date" :label="$t('course.endDate')">
            <el-date-picker
              v-model="courseForm.early_bird.end_date"
              type="date"
              placeholder="YYYY-MM-DD"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item prop="ig_discount" :label="$t('course.igDiscount')">
          <el-input-number
            v-model="courseForm.ig_discount"
            :min="0" />
        </el-form-item>
        <el-form-item prop="return_discount" :label="$t('course.returnDiscount')">
          <el-input-number
            v-model="courseForm.return_discount"
            :min="0" />
        </el-form-item>
        <el-form-item :label="$t('course.additionalQuestion')" />
        <div v-for="i in 5">
          <el-form-item :label="`Q${i}`" />
          <multi-lang-input isTextarea :prop-name="`add_questions.q${i}`" v-model="courseForm.add_questions[`q${i}`]" />
        </div>
        <el-form-item>
          <el-button type="success" @click="submit(ruleFormRef)">{{ props.isNew?$t('operation.add'):$t('operation.update') }}</el-button>
          <el-button @click="closeDialog">{{ $t('operation.cancel') }}</el-button>
          <el-button v-if="!props.isNew" type="danger" @click="deleteCourse">{{ $t('operation.delete') }}</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </el-dialog>
</template>

<style>

</style>