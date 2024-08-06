import { ref } from 'vue'
import { defineStore } from 'pinia'
import apis from '../apis'
import { ElMessage } from "element-plus";

export const useProfileStore = defineStore('profile', () => {
  const username = ref(sessionStorage.getItem('username') || '')
  const password = ref(sessionStorage.getItem('password') || '')
  const loggedIn = ref(username.value !== '' && password.value !== '');
  const isLoading = ref(false)
  async function login(info) {
    isLoading.value = true
    let resp = await apis.login(info.username, info.password);
    console.log(resp)
    if (resp.status === 200) {
      username.value = info.username
      sessionStorage.setItem('username', username.value)
      password.value = info.password
      sessionStorage.setItem('password', password.value)
      loggedIn.value = true
      isLoading.value = false
      location.reload()
    } else {
      ElMessage.error('Log in failed.')
      isLoading.value = false
    }
  }
  function logout() {
    username.value = ''
    sessionStorage.removeItem('username')
    password.value = ''
    sessionStorage.removeItem('password')
    loggedIn.value = false
    location.reload()
  }

  return { username, password, loggedIn, isLoading, login, logout }
})