import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CourseView from '../views/CourseView.vue'
import RecordView from '../views/RecordView.vue'
import MemberView from '../views/MemberView.vue'

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
      path: '/member',
      name: 'member',
      component: MemberView
    },
  ]
})

export default router
