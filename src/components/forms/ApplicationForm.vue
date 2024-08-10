<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useLanguageStore } from '../../stores/language';
import apis from '../../apis';
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { DateTime } from 'luxon'

const languageStore = useLanguageStore()
const { t } = useI18n()
const props = defineProps({
  form: Object,
  isShow: {
    required: true,
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['closeDialog']);

const scroll = ref()

const active = ref(0);
const back = () => {
  active.value--
}
const next = async() => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      active.value++
      scroll.value.setScrollTop(0)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const courseDetail = ref({})

const applicationForm = ref({});
const ruleFormRef = ref()
const rules = computed(() => ({
  'student.first_name': [{
    required: true,
    message: t('formRule.student.firstName'),
    trigger: 'blur'
  }],
  'student.last_name': [{
    required: true,
    message: t('formRule.student.lastName'),
    trigger: 'blur'
  }],
  'student.gender': [{
    required: true,
    message: t('formRule.student.gender'),
    trigger: 'change'
  }],
  'student.dob': [{
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
  'student.email': [{
    required: true,
    message: t('formRule.student.email'),
    trigger: 'blur'
  }, {
    type: 'email',
    message: t('formRule.student.validEmail'),
    trigger: 'change',
  },],
  'student.address': [{
    required: true,
    message: t('formRule.student.address'),
    trigger: 'blur'
  }],
  'student.city': [{
    required: true,
    message: t('formRule.student.city'),
    trigger: 'change'
  }],
  'student.postal_code': [{
    required: true,
    message: t('formRule.student.postal'),
    trigger: 'blur'
  }, {
    pattern: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/,
    message: t('formRule.student.validPostal'),
    trigger: 'change'
  }],
  'application.course_ids': [{
    validator: checkClassAvailability,
    trigger: 'change'
  }],
  'application.parent_name': [{
    required: true,
    message: t('formRule.application.parentName'),
    trigger: 'blur'
  }],
  relation: [{
    required: true,
    message: t('formRule.application.relationshipToStudent'),
    trigger: 'change'
  }],
  'application.emergency_name': [{
    required: true,
    message: t('formRule.application.emergencyName'),
    trigger: 'blur'
  }],
  'application.self_leave_phone_no': [{
    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    message: t('formRule.student.validPhone'),
    trigger: 'change'
  }],
  'application.residency_status': [{
    required: true,
    message: t('formRule.application.residencyStatus'),
    trigger: 'change'
  }],
  'application.residency_origin': [{
    required: true,
    message: t('formRule.application.placeOfOrigin'),
    trigger: 'blur'
  }],
  'application.residency_stay': [{
    required: true,
    message: t('formRule.application.stayedYear'),
    trigger: 'change'
  }],
  "application.consent_name": [{
    required: true,
    message: t('formRule.application.nameForConsent'),
    trigger: 'blur'
  }]
}));
const checkClassAvailability = (rule, value, callback) => {
  if (value.length === 0) {
    return callback(new Error(t('formRule.application.class')))
  }
  value.forEach(item => {
    let classItem = courseDetail.value.courses.find((ele)=>ele.course_id===item)
    let age = DateTime.now().diff(DateTime.fromISO(applicationForm.value.student.dob), 'years').toObject().years
    if (age < classItem.age_min || age > classItem.age_max) {
      callback(new Error(`${t('formRule.application.classAge')}${classItem.course_name[languageStore.lang]}`))
    }
  })
}
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
const submit = async () => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      ElMessageBox.confirm(t('application.payment'), 
      {
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          apis.addApplication(applicationForm.value)
          .then(res => {
            if (res.status < 400) {
              closeDialog()
            } else {
              ElMessage.error('Try again.')
            }
          })
          .catch(err => {
            console.log(err)
            ElMessage.error('Try again later.')
          })
        })
        .catch(() => {
          // catch error
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const dialogVisible = ref(false);
const closeDialog = ()=>{
  active.value = 0
  emit('closeDialog');
}
watch(() => props.isShow, (newVisible, oldVisible) => {
  dialogVisible.value = newVisible;
  resetForm()
  if (dialogVisible.value) {
    nextTick(()=>ruleFormRef.value.clearValidate())
    courseDetail.value = JSON.parse(JSON.stringify(props.form));
    applicationForm.value.application.form_id = courseDetail.value.form_id
    applicationForm.value.application.lang = languageStore.lang
  }
});
const dialogWidth = ref("50%");
const popoverWidth = ref(300)
const handleResize = () => {
  if (window.innerWidth < 500) {
    dialogWidth.value = "90%"
    popoverWidth.value = 300
  } else {
    dialogWidth.value = "60%"
    popoverWidth.value = 700
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

const relationshipOptions = [
  {
    value: 'relatives',
    label: 'relatives',
  },
  {
    value: 'grandparents',
    label: 'grandparents',
  },
  {
    value: 'siblings',
    label: 'siblings',
  },
  {
    value: 'parents',
    label: 'parents',
  },
  {
    value: 'guardians',
    label: 'guardians',
  },
  {
    value: 'others',
    label: 'others',
  },
]

const residencyOptions = [
  {
    value: 'visitor',
    label: 'visitor',
  },
  {
    value: 'workPermit',
    label: 'workPermit',
  },
  {
    value: 'permanentResident',
    label: 'permanentResident',
  },
  {
    value: 'citizen',
    label: 'citizen',
  },
  {
    value: 'refugeeClaimant',
    label: 'refugeeClaimant',
  },
  {
    value: 'conventionRefugee',
    label: 'conventionRefugee',
  },
]

const residencyYearOptions = [
  {
    value: 'lessThanOne',
    label: 'lessThanOne',
  },
  {
    value: 'oneToThree',
    label: 'oneToThree',
  },
  {
    value: 'threeToFive',
    label: 'threeToFive',
  },
  {
    value: 'fiveToTen',
    label: 'fiveToTen',
  },
  {
    value: 'tenOrMore',
    label: 'tenOrMore',
  },
]

const checkAdditional = (question) => {
  return question.en && question.zh && question.zh_Hant;
}

</script>

<template>
  <el-dialog
    :title="$t('application.register')"
    v-model="dialogVisible"
    :width="dialogWidth"
    @closed="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    align-center>
    <el-container v-show="active === 0">
      <el-header height="30px">
        <h3>
        {{ courseDetail.title[languageStore.lang] }}
        </h3>
      </el-header>
      <el-main>
        <div>{{ courseDetail.desc[languageStore.lang] }}</div>
        <el-row>
          <el-col class="label" :span="8">
            {{ $t('course.earlyBird') }} - {{ $t('course.endDate') }}
          </el-col>
          <el-col class="content" :span="10">
            {{ courseDetail.early_bird.end_date }}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="label" :span="8">
            {{ $t('course.earlyBird') }} - {{ $t('course.discount') }}
          </el-col>
          <el-col class="content" :span="10">
            ${{ courseDetail.early_bird.discount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="label" :span="8">
            {{ $t('course.igDiscount') }}
          </el-col>
          <el-col class="content" :span="10">
            ${{ courseDetail.ig_discount  }}
          </el-col>
        </el-row>
        <el-table :data="courseDetail.courses"
        max-height="48vh">
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
    <el-scrollbar ref="scroll" max-height="70vh">
      <el-form
        ref="ruleFormRef"
        label-position="top"
        :model="applicationForm"
        :rules="rules"
        label-width="auto"
        v-show="active !== 0"
        scroll-to-error>
        <div v-if="active === 1">
          <el-form-item prop="student.first_name" :label="$t('student.firstName')">
            <el-input v-model="applicationForm.student.first_name" />
          </el-form-item>
          <el-form-item prop="student.last_name" :label="$t('student.lastName')">
            <el-input v-model="applicationForm.student.last_name" />
          </el-form-item>
          <el-form-item prop="student.gender" :label="$t('student.gender')">
            <el-select
              v-model="applicationForm.student.gender"
            >
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="$t('student.'+item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="student.dob" :label="$t('student.dob')">
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
          <el-form-item prop="student.phone_no" :label="$t('student.phone')" :rules="rules.phone_no">
            <el-input v-model="applicationForm.student.phone_no" />
          </el-form-item>
          <el-form-item prop="student.email" :label="$t('student.email')">
            <el-input v-model="applicationForm.student.email" />
          </el-form-item>
          <el-form-item prop="student.address" :label="$t('student.address')">
            <el-input v-model="applicationForm.student.address" />
          </el-form-item>
          <el-form-item prop="student.city" :label="$t('student.city')">
            <el-select
              v-model="applicationForm.student.city"
            >
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="$t('student.'+item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="student.postal_code" :label="$t('student.postal')">
            <el-input v-model="applicationForm.student.postal_code" />
          </el-form-item>
          <el-form-item prop="application.special" :label="$t('application.special')">
            <el-input type="textarea" v-model="applicationForm.application.special" />
          </el-form-item>
        </div>
        <div v-else-if="active === 2">
          <el-form-item prop="application.course_ids" required>
            <template #label>
              {{ $t('title.class') }}
              <el-popover placement="bottom" :width="popoverWidth">
                <template #reference>
                  <el-icon><QuestionFilled /></el-icon>
                </template>
                <el-table :data="courseDetail.courses" 
                max-height="48vh">
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
              </el-popover>
            </template>
            <el-select
              v-model="applicationForm.application.course_ids"
              multiple
            >
              <el-option
                v-for="item in courseDetail.courses"
                :key="item.course_id"
                :label="item.course_name[languageStore.lang]"
                :value="item.course_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(question, key, index) in courseDetail.add_questions"
            :label="question[languageStore.lang]"
            v-show="checkAdditional(question)">
            <el-input type="textarea" v-model="applicationForm.application[`add_answers_${index+1}`]" />
          </el-form-item>
          <div v-if="courseDetail.is_kid_form">
            <el-form-item :label="$t('application.contactInfo')" />
            <el-form-item
              prop="application.parent_name"
              :label="$t('application.parentName')">
              <el-input v-model="applicationForm.application.parent_name" />
            </el-form-item>
            <el-form-item
              prop="application.parent_relation"
              :label="$t('application.relationshipToStudent')"
              :rules="rules.relation">
              <el-select v-model="applicationForm.application.parent_relation">
                <el-option
                  v-for="item in relationshipOptions"
                  :key="item.value"
                  :label="$t('application.'+item.label)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="application.emergency_name"
              :label="$t('application.emergencyName')">
              <el-input v-model="applicationForm.application.emergency_name" />
            </el-form-item>
            <el-form-item
              prop="application.emergency_relation"
              :label="$t('application.relationship')"
              :rules="rules.relation">
              <el-select v-model="applicationForm.application.emergency_relation">
                <el-option
                  v-for="item in relationshipOptions"
                  :key="item.value"
                  :label="$t('application.'+item.label)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="application.emergency_phone_no"
              :label="$t('application.emergencyPhone')"
              :rules="rules.phone_no">
              <el-input v-model="applicationForm.application.emergency_phone_no" />
            </el-form-item>
            <el-form-item>
              <template #label>
                <div v-html="$t('application.pickUp')"></div>
              </template>
            </el-form-item>
            <el-form-item
              prop="application.self_leave_name"
              :label="$t('application.emergencyName')">
              <el-input v-model="applicationForm.application.self_leave_name" />
            </el-form-item>
            <el-form-item
              prop="application.self_leave_phone_no"
              :label="$t('application.emergencyPhone')">
              <el-input v-model="applicationForm.application.self_leave_phone_no" />
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item
              prop="application.residency_status"
              :label="$t('application.residencyStatus')">
              <el-select v-model="applicationForm.application.residency_status">
                <el-option
                  v-for="item in residencyOptions"
                  :key="item.value"
                  :label="$t('application.'+item.label)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="application.residency_origin"
              :label="$t('application.placeOfOrigin')">
              <el-input v-model="applicationForm.application.residency_origin" />
            </el-form-item>
            <el-form-item
              prop="application.residency_stay"
              :label="$t('application.stayedYear')">
              <el-select v-model="applicationForm.application.residency_stay">
                <el-option
                  v-for="item in residencyYearOptions"
                  :key="item.value"
                  :label="$t('application.'+item.label)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item
            prop="application.ig_username"
            :label="$t('application.igName')">
            <el-input v-model="applicationForm.application.ig_username" />
          </el-form-item>
          <el-form-item
            prop="application.remark"
            :label="$t('application.remarks')">
            <el-input v-model="applicationForm.application.remark" />
          </el-form-item>
        </div>
        <div v-else-if="active === 3">
          <el-form-item :label="$t('application.consent')">
            I give my permission for the use of photographs, films, slides, video taken during the program for the promotional purposes of the Centre for Immigrant and Community Services (CICS). I understand that there will not be any compensation for photographs or videos taken of the participant in the program.
            <br>
            I give permission to CICS to deliver agency information to my email address and understand I can withdraw my consent at any time.
            <br>
            Please read the Consent : <el-link href="https://bit.ly/CICSCentreforLearningConsentForm" target="_blank">https://bit.ly/CICSCentreforLearningConsentForm</el-link>
            <br>
            In case of emergency, I authorize CICS staff to administer first aid, or call an ambulance.  I understand that should such an emergency arise, I, or my emergency contact (when I cannot be reached), will be notified immediately.  I agree that any cost incurred for such services shall be my responsibility. 
            <br>
            By signing below, I have read and agree to the above.  By participating in the program, I release Centre for Immigrant and Community Services, its employees, and volunteers from any claims, actions, liabilities, losses and injuries to any person or property while participating in the program. 
          </el-form-item>
          <el-form-item
            prop="application.consent_name"
            :label="$t('application.nameForConsent')">
            <el-input v-model="applicationForm.application.consent_name" />
          </el-form-item>
          <el-form-item
            prop="application.consent_phone_no"
            :label="$t('application.phoneForConsent')"
            :rules="rules.phone_no">
            <el-input v-model="applicationForm.application.consent_phone_no" />
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item :label="$t('student.firstName')">
            <el-input v-model="applicationForm.student.first_name" disabled />
          </el-form-item>
          <el-form-item :label="$t('student.lastName')">
            <el-input v-model="applicationForm.student.last_name" disabled />
          </el-form-item>
          <el-form-item :label="$t('student.gender')">
            <el-select
              v-model="applicationForm.student.gender"
              disabled
            >
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="$t('student.'+item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('student.dob')">
            <el-date-picker
              v-model="applicationForm.student.dob"
              type="date"
              placeholder="YYYY-MM-DD"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :editable="false"
              :clearable="false"
              disabled
            />
          </el-form-item>
          <el-form-item :label="$t('student.phone')">
            <el-input v-model="applicationForm.student.phone_no" disabled />
          </el-form-item>
          <el-form-item :label="$t('student.email')">
            <el-input v-model="applicationForm.student.email" disabled/>
          </el-form-item>
          <el-form-item :label="$t('student.address')">
            <el-input v-model="applicationForm.student.address" disabled />
          </el-form-item>
          <el-form-item :label="$t('student.city')">
            <el-select
              v-model="applicationForm.student.city"
              disabled
            >
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="$t('student.'+item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('student.postal')">
            <el-input v-model="applicationForm.student.postal_code" disabled/>
          </el-form-item>
          <el-form-item :label="$t('application.special')">
            <el-input type="textarea" v-model="applicationForm.application.special" disabled/>
          </el-form-item>

          <el-form-item :label="$t('title.class')">
            <el-select
              v-model="applicationForm.application.course_ids"
              multiple
              disabled
            >
              <el-option
                v-for="item in courseDetail.courses"
                :key="item.course_id"
                :label="item.course_name[languageStore.lang]"
                :value="item.course_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(question, key, index) in courseDetail.add_questions"
            :label="question[languageStore.lang]"
            v-show="checkAdditional(question)">
            <el-input type="textarea" v-model="applicationForm.application[`add_answers_${index+1}`]" disabled />
          </el-form-item>
          <div v-if="courseDetail.is_kid_form">
            <el-form-item :label="$t('application.contactInfo')" >
              <el-col :span="14">
                <el-form-item :label="$t('application.parentName')">
                  <el-input v-model="applicationForm.application.parent_name" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item :label="$t('application.relationshipToStudent')">
                  <el-select v-model="applicationForm.application.parent_relation" disabled>
                    <el-option
                      v-for="item in relationshipOptions"
                      :key="item.value"
                      :label="$t('application.'+item.label)"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item :label="$t('application.emergencyName')">
                  <el-input v-model="applicationForm.application.emergency_name" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item :label="$t('application.relationship')">
                  <el-select v-model="applicationForm.application.emergency_relation" disabled>
                    <el-option
                      v-for="item in relationshipOptions"
                      :key="item.value"
                      :label="$t('application.'+item.label)"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-form-item :label="$t('application.emergencyPhone')">
                <el-input v-model="applicationForm.application.emergency_phone_no" disabled/>
              </el-form-item>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div v-html="$t('application.pickUp')"></div>
              </template>
            </el-form-item>
            <el-form-item :label="$t('application.emergencyName')">
              <el-input v-model="applicationForm.application.self_leave_name" disabled/>
            </el-form-item>
            <el-form-item :label="$t('application.emergencyPhone')">
              <el-input v-model="applicationForm.application.self_leave_phone_no" disabled />
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item :label="$t('application.residencyStatus')">
              <el-select v-model="applicationForm.application.residency_status" disabled>
                <el-option
                  v-for="item in residencyOptions"
                  :key="item.value"
                  :label="$t('application.'+item.label)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('application.placeOfOrigin')">
              <el-input v-model="applicationForm.application.residency_origin" disabled/>
            </el-form-item>
            <el-form-item :label="$t('application.stayedYear')">
              <el-select v-model="applicationForm.application.residency_stay" disabled>
                <el-option
                  v-for="item in residencyYearOptions"
                  :key="item.value"
                  :label="$t('application.'+item.label)"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item :label="$t('application.igName')">
            <el-input v-model="applicationForm.application.ig_username" disabled/>
          </el-form-item>
          <el-form-item :label="$t('application.remarks')">
            <el-input v-model="applicationForm.application.remark" disabled/>
          </el-form-item>
          <el-form-item :label="$t('application.consent')">
            I give my permission for the use of photographs, films, slides, video taken during the program for the promotional purposes of the Centre for Immigrant and Community Services (CICS). I understand that there will not be any compensation for photographs or videos taken of the participant in the program.
            <br>
            I give permission to CICS to deliver agency information to my email address and understand I can withdraw my consent at any time.
            <br>
            Please read the Consent : <el-link href="https://bit.ly/CICSCentreforLearningConsentForm" target="_blank">https://bit.ly/CICSCentreforLearningConsentForm</el-link>
            <br>
            In case of emergency, I authorize CICS staff to administer first aid, or call an ambulance.  I understand that should such an emergency arise, I, or my emergency contact (when I cannot be reached), will be notified immediately.  I agree that any cost incurred for such services shall be my responsibility. 
            <br>
            By signing below, I have read and agree to the above.  By participating in the program, I release Centre for Immigrant and Community Services, its employees, and volunteers from any claims, actions, liabilities, losses and injuries to any person or property while participating in the program. 
          </el-form-item>
          <el-form-item :label="$t('application.nameForConsent')">
            <el-input v-model="applicationForm.application.consent_name" disabled/>
          </el-form-item>
          <el-form-item :label="$t('application.phoneForConsent')">
            <el-input v-model="applicationForm.application.consent_phone_no" disabled />
          </el-form-item>
        </div>
        <!-- <el-form-item>
          <el-button type="success" @click="submit(ruleFormRef)">{{ $t('operation.submit') }}</el-button>
          <el-button @click="closeDialog">{{ $t('operation.cancel') }}</el-button>
        </el-form-item> -->
      </el-form>
    </el-scrollbar>
    <el-steps :active="active" finish-status="success" align-center>
      <el-step :title="$t('course.courseDetail')" />
      <el-step :title="$t('student.personalInfo')" />
      <el-step :title="$t('application.register')" />
      <el-step :title="$t('application.consent')" />
      <el-step :title="$t('application.review')" />
    </el-steps>
    <div class="application-steps">
      <el-button v-show="active>0" @click="back">{{ $t('application.back') }}</el-button>
      <span v-show="active===0"></span>
      <div>
        <el-button v-show="active<4" @click="next">{{ $t('application.next') }}</el-button>
        <!-- <el-button @click="closeDialog">{{ $t('operation.cancel') }}</el-button> -->
        <el-button v-show="active===4" type="success" @click="submit()">{{ $t('operation.submit') }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.application-steps {
  display: flex;
  justify-content: space-between;
}

:deep(.el-step__title) {
  font-size: 12px;
  line-height: 23px;
}

.label {
  font-weight: 600;
}
</style>