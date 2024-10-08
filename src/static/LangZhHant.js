const localization = {
  title: {
    courses: '課程',
    course: '課程',
    class: "興趣班",
    registerRecord: '報名紀錄',
    student: '學生'
  },
  operation: {
    adminLogin: '管理員登入',
    username: '使用者名稱',
    password: '密碼',
    login: '登入',
    logout: '登出',
    update: '更新',
    delete: '刪除',
    cancel: '取消',
    add: '新增',
    submit: '提交'
  },
  course: {
    courseDetail: '課程詳情',
    createCourse: '新增課程',
    courseTitle: '課程標題',
    description: '描述',
    openDate: '開放報名日期',
    startOpenDate: '開放報名開始日期',
    endOpenDate: '開放報名完結日期',
    forKids: '兒童活動',
    earlyBird: '早鳥優惠',
    endDate: '完結日期',
    discount: '折扣',
    igDiscount: 'Instagram粉絲折扣',
    returnDiscount: '舊生優惠',
    additionalQuestion: '附加問題'
  },
  class: {
    classDetail: '興趣班詳情',
    createClass: '新增興趣班',
    className: '興趣班名稱',
    tutorName: '導師名稱',
    venue: '地點',
    date: '日期',
    startDate: '開始日期',
    endDate: '完結日期',
    weekday: '逢星期',
    exceptedDate: '除外日期',
    time: '時間',
    startTime: '開始時間',
    endTime: '完結時間',
    capacity: '人數',
    price: '費用',
    age: '年齡',
    maxAge: '年齡上限',
    minAge: '年齡下限',
    minAttendance: '最少出席日數'
  },
  student: {
    personalInfo: '個人資料',
    addStudent: "新增學生",
    studentName: '學生全名',
    firstName: '名',
    lastName: '姓',
    gender: '性別',
    dob: "出生日期",
    phone: '電話號碼',
    email: '電子郵件地址',
    address: '地址',
    city: '城市',
    postal: '郵區編號',
    credit: '餘額',
    male: '男',
    female: '女',
    other: '其他',
    markham: '萬錦市',
    richmondHill: '列治文山',
    scarborough: '士嘉堡',
    cityOfToronto: '多倫多市',
    northYork: '北約克',
    others: '其他'
  },
  application: {
    register: '報名',
    consent: '同意',
    review: '檢查',
    next: '下一步',
    back: '上一步',
    special: '是否有任何特別需要、過敏、食物限制，或需要使用Epi-Pen、喉喘藥或其他藥物？',
    contactInfo: '家長/監護人資料',
    parentName: '家長/監護人名字',
    relationshipToStudent: '與學生的關係',
    relatives: '親戚',
    grandparents: '祖父母',
    siblings: '兄弟姐妹',
    parents: '父母',
    guardians: '監護人',
    others: '其他',
    emergencyName: '緊急聯絡人',
    relationship: '關係',
    emergencyPhone: '緊急聯絡電話',
    pickUp: "接送安排<br>In order to ensure participants' safety, parents or authorized adults must pick-up their child(ren) in the designated area.<br><br>If the participant is 14 years of age or older, please sign the following if you (parent/guardian) authorize the participant to leave the program by himself/herself. CICS will not be responsible for the participant's safety, once he/she leaves the centre.",
    nameForConsent: '你的全名/緊急聯絡人',
    phoneForConsent: '你的電話/緊急聯絡人電話',
    residencyStatus: '現時加拿大身份',
    visitor:'旅客',
    workPermit:'工作簽証',
    permanentResident:'永久居民',
    citizen: '公民',
    refugeeClaimant:'難民申請人',
    conventionRefugee:'公約難民',
    placeOfOrigin: '原居地',
    stayedYear: '在加居住年期',
    lessThanOne: '少於1年',
    oneToThree: '1-3年',
    threeToFive: '3-5年',
    fiveToTen: '5-10年',
    tenOrMore: '10年或以上',
    igName: '如果您追蹤了 Center for Learning 的 IG，請寫下您的 IG 名稱，以獲取額外折扣。',
    remarks: '備註',
    payment: '付款方式<br>提交此報名表後，您將於 2 個工作天內收到由 PayPal 所發出的連結，以完成信用卡付款。 您不需要 PayPal 的帳戶。 請檢查您的垃圾郵件箱。'
  },
  record: {
    price: '價錢',
    submittedTime: '提交時間'
  },
  formRule: {
    course: {
      title: '課程標題必須以三種語言輸入。',
      description: '課程描述必須以三種語言輸入。',
      startOpenDate: '請選擇開放報名開始日期。',
      endOpenDate: '請選擇開放報名完結日期。',
      validEarlyBird: '早鳥優惠折扣必須為數字。',
      earlyBirdEndDate: '如早鳥優惠折扣不為＄0，完結日期必須提供。',
      validIgDiscount: 'Instagram粉絲折扣必須為數字。',
      validReturnDiscount: '舊生優惠必須為數字。',
    },
    class: {
      className: '興趣班名稱必須以三種語言輸入。',
      tutorName: '請輸入導師名稱。',
      venue: '請輸入地點。',
      startDate: '請選擇開始日期。',
      endDate: '請選擇完結日期。',
      weekday: '請選擇至少一日。',
      startTime: '請選擇開始時間。',
      endTime: '請選擇完結時間。',
      capacity: '人數不可為空。',
      validCapacity: '人數必須為數字。',
      price: '費用不可為空。',
      validPrice: '費用必須為數字。',
      maxAge: '年齡上限不可為空。',
      validMaxAge: '年齡上限必須為數字。',
      minAge: '年齡下限不可為空。',
      validMinAge: '年齡下限必須為數字。',
      minAttendance: '最少出席日數不可為空。',
      validMinAttendance: '最少出席日數必須為數字。',
    },
    student: {
      firstName: '請輸入名字。',
      lastName: '請輸入姓氏',
      gender: '請選擇性別。',
      dob: '請選擇出生日期。',
      phone: '請輸入電話號碼。',
      validPhone: '請輸入正確格式之電話號碼。',
      email: '請輸入電子郵件地址。',
      validEmail: '請輸入正確格式之電子郵件地址。',
      address: '請輸入地址。',
      city: '請選擇現居城市。',
      postal: '請輸入郵區編號。',
      validPostal: '請輸入正確格式之郵區編號。',
      credit: '餘額不可為空。',
      validCredit: '餘額必須為數字。'
    },
    application: {
      class: '請選擇至少一個興趣班。',
      classAge: '超出一興趣班年齡限制：',
      parentName: "請輸入家長/監護人全名。",
      relationshipToStudent: '請選擇與學生的關係。',
      emergencyName: '請輸入緊急聯絡人姓名',
      emergencyPhone: '',
      validEmergencyPhone: '',
      residencyStatus: '請選擇現時加拿大身份。',
      placeOfOrigin: '請輸入原居地。',
      stayedYear: '請選擇代表在加居住年期之選項。',
      nameForConsent: '請輸入一名字以表示同意。'
    }
  }
};

export default localization;