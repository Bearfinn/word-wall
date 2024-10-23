import { createRouter, createWebHistory, RouteLocationNormalizedGeneric, RouterOptions } from "vue-router";
import BoardPage from "../pages/BoardPage.vue";
import AddBoardPage from "../pages/AddBoardPage.vue";
import { BOARDS } from "../data/list";
import { getBoardByPath } from "../db/turso";

declare module 'vue-router' {
  interface RouteMeta {
    setTitle: (route: RouteLocationNormalizedGeneric) => string;
  }
}

type Writable<T> = { -readonly [P in keyof T]: T[P] };

const routes: Writable<RouterOptions["routes"]> = [
  {
    path: "/board/:boardId",
    name: "Board",
    component: BoardPage,
    props: async (route) => ({
      board: await getBoardByPath(route.params.boardId as string),
    }),
    meta: {
      setTitle: (route: RouteLocationNormalizedGeneric) => {
        const boardId = route.params.boardId as string;
        return `Word Wall - ${boardId.charAt(0).toUpperCase() + boardId.slice(1).replace(/-/g, ' ')}`;
      }
    },
  },
  {
    path: "/board/add",
    name: "Add Board",    
    component: AddBoardPage
  },
  {
    path: "/",
    redirect: `/board/${BOARDS[0].path}`,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.setTitle) {
    document.title = to.meta.setTitle(to);
  } else {
    document.title = 'Word Wall';
  }
  next();
})

export default router;
