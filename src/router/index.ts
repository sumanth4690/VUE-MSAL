import { createRouter, createWebHistory } from 'vue-router'
import layOut from '../components/layOut.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    component: layOut
  }
  ]
})

export default router
