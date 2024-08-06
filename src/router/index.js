import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CourseView from '../views/CourseView.vue'
import RecordView from '../views/RecordView.vue'
import StudentView from '../views/StudentView.vue'
import { useProfileStore } from '../stores/profile'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect:'/courses'
    },
    {
      path: '/courses',
      name: 'courses',
      component: CourseView
    },
    {
      path: '/record',
      name: 'record',
      component: RecordView
    },
    {
      path: '/student',
      name: 'student',
      component: StudentView
    },
  ]
})

router.beforeEach(async (to, from) => {
  const profileStore = useProfileStore()
  if (
    !profileStore.loggedIn &&
    to.name !== 'courses'
  ) {
    return { name: 'courses' }
  }
})

export default router
