import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import pdfIndex from '@/views/pdf/index.vue'
import enclosureList from '@/views/enclosure/index.vue'
import enclosureDetailed from '@/views/enclosure/detailed.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/pdfIndex',
      name: 'pdfIndex',
      component: pdfIndex
    },
    {
      path: '/enclosureList',
      name: 'enclosureList',
      component: enclosureList
    },
    {
      path: '/enclosureDetailed',
      name: 'enclosureDetailed',
      component: enclosureDetailed
    }
  ]
})
