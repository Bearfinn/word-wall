import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import WordWall from '../components/WordWall.vue'
import { WORD_GROUPS } from '../data/list'

type Writable<T> = { -readonly [P in keyof T]: T[P] };

const routes: Writable<RouterOptions['routes']> = [
  {
    path: '/board/:boardId',
    name: 'Board',
    component: WordWall,
    props: (route) => ({ 
      wordGroup: WORD_GROUPS[route.params.boardId as string] || []
    })
  },
  {
    path: '/',
    redirect: `/board/${Object.keys(WORD_GROUPS)[0]}`
  }
];

routes.push({ path: '/', redirect: `/board/${Object.keys(WORD_GROUPS)[0]}` })

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router