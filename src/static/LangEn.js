const localization = {
  title: {
    courses: 'Courses',
    course: 'Course',
    class: "Class",
    registerRecord: 'Register Record',
    student: 'Student'
  },
  operation: {
    adminLogin: 'Log In as Admin',
    username: 'Username',
    password: 'Password',
    login: 'Log In',
    logout: 'Log Out',
    update: 'Update',
    delete: 'Delete',
    cancel: 'Cancel',
    add: 'Add',
    submit: 'Submit'
  },
  course: {
    courseDetail: 'Course Detail',
    createCourse: 'Create Course',
    courseTitle: 'Course Title',
    description: 'Description',
    openDate: 'Date Range of Opening for Registration',
    startOpenDate: 'Start Date of Opening for Registration',
    endOpenDate: 'End Date of Opening for Registration',
    forKids: 'For Kids',
    earlyBird: 'Early Bird',
    endDate: 'End Date',
    discount: 'Discount',
    igDiscount: 'Instagram Follower Discount',
    returnDiscount: 'Returning Student Discount',
    additionalQuestion: 'Additional Question',
  },
  class: {
    classDetail: 'Class Detail',
    createClass: 'Create Class',
    className: 'Class Name',
    tutorName: 'Tutor Name',
    venue: 'Venue',
    date: 'Date',
    startDate: 'Start Date',
    endDate: 'End Date',
    weekday: 'Weekday',
    exceptedDate: 'Excepted Date',
    time: 'Time',
    startTime: 'Start Time',
    endTime: 'End time',
    capacity: 'Capacity',
    price: 'Price',
    age: 'Age',
    maxAge: 'Max Age',
    minAge: 'Min Age',
    minAttendance: 'Min Attendance'
  },
  student: {
    personalInfo: 'Personal Information',
    addstudent: "Add Student",
    studentName: 'Student Name',
    firstName: 'First Name',
    lastName: 'Last Name',
    gender: 'Gender',
    dob: "Date of Birth",
    phone: 'Phone No.',
    email: 'Email',
    address: 'Address',
    city: 'City',
    postal: 'Postal Code',
    credit: 'Credit Balance',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    markham: 'Markham',
    richmondHill: 'Richmond Hill',
    scarborough: 'Scarborough',
    cityOfToronto: 'City of Toronto',
    northYork: 'North York',
    others: 'Others'
  },
  application: {
    register: 'Register',
    consent: 'Consent',
    review: 'Review',
    next: 'Next',
    back: 'Back',
    special: 'Does the participant have any special needs, allergies, food restriction, or requires an Epi-Pen, asthma inhaler, or other?',
    contactInfo: 'Parent/Guardian & Emergency Contact Information',
    parentName: "Parent/Guardian's Full Name",
    relationshipToStudent: 'Relationship to Student',
    relatives: 'Relatives',
    grandparents: 'Grandparents',
    siblings: 'Siblings',
    parents: 'Parents',
    guardians: 'Guardians',
    others: 'Others',
    emergencyName: 'Emergency Contact Name',
    relationship: 'Relationship',
    emergencyPhone: 'Emergency Contact Phone',
    pickUp: "Pick Up Arrangements<br>In order to ensure participants' safety, parents or authorized adults must pick-up their child(ren) in the designated area.<br><br>If the participant is 14 years of age or older, please sign the following if you (parent/guardian) authorize the participant to leave the program by himself/herself. CICS will not be responsible for the participant's safety, once he/she leaves the centre.",
    nameForConsent: 'Full Name/Emergency Contact Name',
    phoneForConsent: 'Your Phone/Emergency Contact Phone',
    residencyStatus: 'Residency Status',
    visitor:'Visitor',
    workPermit:'Work Permit',
    permanentResident: 'Permanent Resident',
    citizen: 'Citizen',
    refugeeClaimant: 'Refugee Claimant',
    conventionRefugee: 'Convention Refugee',
    placeOfOrigin: 'Place of Origin',
    stayedYear: 'Stayed year',
    lessThanOne: 'Less than 1 year',
    oneToThree: '1-3 years',
    threeToFive: '3-5 years',
    fiveToTen: '5-10 years',
    tenOrMore: '10 years or more',
    igName: 'Instagram name',
    remarks: 'Remarks',
    payment: 'Payment Method<br>Upon submission of this registration form, you will receive an invoice within 2 business days via PayPal to complete payment by credit card. A PayPal account is not required. Please check your Spam/Junk email folder.<br/><br/>Course fees are non-refundable. However, if the minimum number of participants are not reached, the course will be cancelled and the fee will be refund.'
  },
  record: {
    price: 'Price',
    submittedTime: 'Submitted Time'
  },
  formRule: {
    course: {
      title: 'Title has to be input in three languages.',
      description: 'Description has to be input in three languages.',
      startOpenDate: 'Please select start date of opening.',
      endOpenDate: 'Please select end date of opening.',
      validEarlyBird: 'Early bird discount must be number.',
      earlyBirdEndDate: 'Early bird end date must be provide if discount is not $0.',
      validIgDiscount: 'Instagram follower discount must be number.',
      validReturnDiscount: 'Returning student discount must be number.',
    },
    class: {
      className: 'Class name has to be input in three languages.',
      tutorName: 'Please input tutor name.',
      venue: 'Please input venue.',
      startDate: 'Please select start date.',
      endDate: 'Please select end date.',
      weekday: 'Please select at least one weekday.',
      startTime: 'Please select start time.',
      endTime: 'Please select end time.',
      capacity: 'Capacity cannot be empty.',
      validCapacity: 'Capacity must be number.',
      price: 'Price cannot be empty.',
      validPrice: 'Price must be number.',
      maxAge: 'Max age cannot be empty.',
      validMaxAge: 'Max age must be number.',
      minAge: 'Min age cannot be empty.',
      validMinAge: 'Min age must be number.',
      minAttendance: 'Min attendance cannot be empty.',
      validMinAttendance: 'Min attendance must be number.',
    },
    student: {
      firstName: 'Please input first name.',
      lastName: 'Please input last name.',
      gender: 'Please select gender.',
      dob: 'Please select date of birth.',
      phone: 'Please input phone number.',
      validPhone: 'Please input valid number.',
      email: 'Please input an email address.',
      validEmail: 'Please input a valid email address.',
      address: 'Please input address.',
      city: 'Please select city.',
      postal: 'Please input postal code',
      validPostal: 'Please input valid postal code',
      credit: 'Credit balance cannot be empty.',
      validCredit: 'Credit balance must be number.'
    },
    application: {
      class: 'Please select at least one class.',
      classAge: 'Out of range of age for class: ',
      parentName: "Please input parent/guardian's full name.",
      relationshipToStudent: 'Please select the relationship to student.',
      emergencyName: 'Please input name for emergency contact.',
      emergencyPhone: '',
      validEmergencyPhone: '',
      residencyStatus: 'Please select residency status.',
      placeOfOrigin: 'Please input place of origin.',
      stayedYear: 'Please select an option of stayed year.',
      nameForConsent: 'Please input a name for consent.'
    }
  }
};

export default localization;