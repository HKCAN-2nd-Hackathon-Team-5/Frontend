import { useProfileStore } from "../stores/profile"

const BASE_URL = 'https://backend-68xz.onrender.com/api/v1'
const api = ({method, url, body, username, password}) => {
  const profileStore = useProfileStore()
  let admin = {
    username: username || profileStore.username,
    password: password || profileStore.password
  }
  return fetch(BASE_URL + url, {
    method: method,
    headers: {
      'Content-type': 'application/json',
      'Authorization': 'Basic ' + btoa(admin.username+':'+admin.password)
    },
    body: JSON.stringify(body)
  })
}

export default {
  /* ----login---- */
  login(username, password) {
    return api({
      method: 'GET',
      url: '/userAuth',
      username: username,
      password: password
    })
  },

  /* ----course---- */
  getCourseList(username, password) {
    return api({
      method: 'GET',
      url: '/form',
      username: username,
      password: password
    })
  },
  addCourse(body) {
    return api({
      method: 'POST',
      url: '/form/create',
      body: body
    })
  },
  editCourse(body) {
    return api({
      method: 'PUT',
      url: '/form/edit',
      body: body
    })
  },
  deleteCourse(id) {
    return api({
      method: 'DELETE',
      url: '/form/delete/'+id,
    })
  },
  
  /* ----class---- */
  getClassList() {
    return api({
      method: 'GET',
      url: '/course',
    })
  },
  addClass(body) {
    return api({
      method: 'POST',
      url: '/course/create',
      body: body
    })
  },
  editClass(body) {
    return api({
      method: 'PUT',
      url: '/course/edit',
      body: body
    })
  },
  deleteClass(id) {
    return api({
      method: 'DELETE',
      url: '/course/delete/'+id,
    })
  },

  /* ----student---- */
  getStudentList() {
    return api({
      method: 'GET',
      url: '/student',
    })
  },
  editStudent(body) {
    return api({
      method: 'PUT',
      url: '/student/'+body.student_id,
      body: body
    })
  },
  deleteStudent(id) {
    return api({
      method: 'DELETE',
      url: '/student/delete/'+id,
    })
  },
}