<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useLanguageStore } from '../../stores/language';
import apis from '../../apis';
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
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
});
const emit = defineEmits(['closeDialog']);

const scroll = ref()

const courseDetail = ref({})

const recordForm = ref({});
const ruleFormRef = ref()
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
const resetForm = () => {
  recordForm.value = {
    "application_id": null,
    "student": {
      "student_id": null,
      "first_name": null,
      "last_name": null,
      "gender": null,
      "dob": null,
      "address": null,
      "city": null,
      "postal_code": null,
      "phone_no": null,
      "email": null,
      "credit_balance": null,
      "held_credit": null
    },
    "form": {
      "form_id": null,
      "title": {
        "en": null,
        "zh_Hant": null,
        "zh": null
      },
      "desc": {
        "en": null,
        "zh_Hant": null,
        "zh": null
      },
      "start_date": null,
      "end_date": null,
      "is_kid_form": null,
      "early_bird": {
        "end_date": null,
        "discount": null
      },
      "ig_discount": null,
      "return_discount": null,
      "add_questions": {
        "q1": {
          "en": null,
          "zh_Hant": null,
          "zh": null
        },
        "q2": {
          "en": null,
          "zh_Hant": null,
          "zh": null
        },
        "q3": {
          "en": null,
          "zh_Hant": null,
          "zh": null
        },
        "q4": {
          "en": null,
          "zh_Hant": null,
          "zh": null
        },
        "q5": {
          "en": null,
          "zh_Hant": null,
          "zh": null
        }
      }
    },
    "course_ids": [],
    "lang": null,
    "special": null,
    "parent_name": null,
    "parent_relation": null,
    "emergency_name": null,
    "emergency_relation": null,
    "emergency_phone_no": null,
    "self_leave_name": null,
    "self_leave_phone_no": null,
    "residency_status": null,
    "residency_origin": null,
    "residency_stay": null,
    "ig_username": null,
    "add_answers_1": null,
    "add_answers_2": null,
    "add_answers_3": null,
    "add_answers_4": null,
    "add_answers_5": null,
    "consent_name": null,
    "consent_phone_no": null,
    "remark": null,
    "submit_time": null,
    "has_early_bird_discount": null,
    "has_ig_discount": null,
    "has_return_discount": null,
    "used_credit": null,
    "price": null,
    "payment": {}
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
          apis.addApplication(recordForm.value)
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
  emit('closeDialog');
}
watch(() => props.isShow, (newVisible, oldVisible) => {
  dialogVisible.value = newVisible;
  resetForm()
  if (dialogVisible.value) {
    recordForm.value = JSON.parse(JSON.stringify(props.form));
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
    :title="recordForm.form?.title[languageStore.lang]"
    v-model="dialogVisible"
    :width="dialogWidth"
    @closed="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    align-center>
    <el-scrollbar ref="scroll" max-height="70vh">
      <el-form
        ref="ruleFormRef"
        label-position="top"
        :model="recordForm"
        :rules="rules"
        label-width="auto"
        scroll-to-error>
        <el-form-item :label="$t('student.firstName')">
          <el-input v-model="recordForm.student.first_name" disabled />
        </el-form-item>
        <el-form-item :label="$t('student.lastName')">
          <el-input v-model="recordForm.student.last_name" disabled />
        </el-form-item>
        <el-form-item :label="$t('student.gender')">
          <el-select
            v-model="recordForm.student.gender"
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
            v-model="recordForm.student.dob"
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
          <el-input v-model="recordForm.student.phone_no" disabled />
        </el-form-item>
        <el-form-item :label="$t('student.email')">
          <el-input v-model="recordForm.student.email" disabled/>
        </el-form-item>
        <el-form-item :label="$t('student.address')">
          <el-input v-model="recordForm.student.address" disabled />
        </el-form-item>
        <el-form-item :label="$t('student.city')">
          <el-select
            v-model="recordForm.student.city"
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
          <el-input v-model="recordForm.student.postal_code" disabled/>
        </el-form-item>
        <el-form-item :label="$t('application.special')">
          <el-input type="textarea" v-model="recordForm.special" disabled/>
        </el-form-item>

        <!-- <el-form-item>
          <template #label>
            {{ $t('title.class') }}
            <el-popover placement="right" :width="500">
              <template #reference>
                <el-icon><QuestionFilled /></el-icon>
              </template>
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
            </el-popover>
          </template>
          <el-select
            v-model="recordForm.application.course_ids"
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
        </el-form-item> -->
        <el-form-item
          v-for="(question, key, index) in recordForm.form?.add_questions"
          :label="question[languageStore.lang]"
          v-show="checkAdditional(question)">
          <el-input type="textarea" v-model="recordForm[`add_answers_${index+1}`]" disabled />
        </el-form-item>
        <div v-if="recordForm.form.is_kid_form">
          <el-form-item :label="$t('application.contactInfo')" >
            <el-col :span="14">
              <el-form-item :label="$t('application.parentName')">
                <el-input v-model="recordForm.parent_name" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('application.relationshipToStudent')">
                <el-select v-model="recordForm.parent_relation" disabled>
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
                <el-input v-model="recordForm.emergency_name" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('application.relationship')">
                <el-select v-model="recordForm.emergency_relation" disabled>
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
              <el-input v-model="recordForm.emergency_phone_no" disabled/>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <template #label>
              <div v-html="$t('application.pickUp')"></div>
            </template>
          </el-form-item>
          <el-form-item :label="$t('application.emergencyName')">
            <el-input v-model="recordForm.self_leave_name" disabled/>
          </el-form-item>
          <el-form-item :label="$t('application.emergencyPhone')">
            <el-input v-model="recordForm.self_leave_phone_no" disabled />
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item :label="$t('application.residencyStatus')">
            <el-select v-model="recordForm.residency_status" disabled>
              <el-option
                v-for="item in residencyOptions"
                :key="item.value"
                :label="$t('application.'+item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('application.placeOfOrigin')">
            <el-input v-model="recordForm.residency_origin" disabled/>
          </el-form-item>
          <el-form-item :label="$t('application.stayedYear')">
            <el-select v-model="recordForm.residency_stay" disabled>
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
          <el-input v-model="recordForm.ig_username" disabled/>
        </el-form-item>
        <el-form-item :label="$t('application.remarks')">
          <el-input v-model="recordForm.remark" disabled/>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <!-- <div class="application-steps">
      <el-button v-show="active>0" @click="back">{{ $t('application.back') }}</el-button>
      <span v-show="active===0"></span>
      <div>
        <el-button v-show="active<4" @click="next">{{ $t('application.next') }}</el-button>
        <el-button @click="closeDialog">{{ $t('operation.cancel') }}</el-button>
        <el-button v-show="active===4" type="success" @click="submit()">{{ $t('operation.submit') }}</el-button>
      </div>
    </div> -->
  </el-dialog>
</template>

<style scoped>
</style>