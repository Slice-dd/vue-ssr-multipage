import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/poetry',
        component: () => import('../views/SignlePoetry.vue')
      }, {
        path: '/poetry/recommendPoetry',
        component: () => import('../views/RecommendPoetry.vue')
      },{
        path: '/poetry/dynasty',
        component: () => import('../views/DynastyPoetry.vue')
      }
    ]
  })
}
