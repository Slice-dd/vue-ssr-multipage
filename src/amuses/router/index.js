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
        path: '/amuses',
        component: () => import('../views/Noval.vue')
      }, {
        path: '/amuses/recommendPoetry',
        component: () => import('../views/RecommendPoetry.vue')
      }
      // },{
      //   path: '/music/dynasty',
      //   component: () => import('../views/DynastyPoetry.vue')
      // }
    ]
  })
}


