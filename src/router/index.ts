import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import WordWall from '../components/WordWall.vue'
import { WORD_GROUPS } from '../data/list'

type Writable<T> = { -readonly [P in keyof T]: T[P] };
const routes: Writable<RouterOptions['routes']> = Object.keys(WORD_GROUPS).map(key => ({
  path: `/board/${key}`,
  name: key,
  component: WordWall,
  props: { wordGroup: WORD_GROUPS[key] }
}))

routes.push({ path: '/', redirect: `/board/${Object.keys(WORD_GROUPS)[0]}` })

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router