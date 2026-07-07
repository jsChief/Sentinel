import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '@/views/OverviewPage.vue'
import MachineDetailPage from '@/views/MachineDetailPage.vue'
import AlertsPage from '@/views/AlertsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/overview',
    },
    {
      path: '/overview',
      name: 'overview',
      component: OverviewPage,
    },
    {
      path: '/machine/:id',
      name: 'machine-detail',
      component: MachineDetailPage,
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: AlertsPage,
    },
  ],
})

export default router
