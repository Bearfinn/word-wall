import { createRouter, createWebHistory, RouteLocationNormalizedGeneric, RouterOptions } from "vue-router";
import BoardPage from "../components/BoardPage.vue";
import { BOARDS } from "../data/list";

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
    props: (route) => ({
      board: BOARDS.find(
        (board) => board.path === (route.params.boardId as string)
      ),
    }),
    meta: {
      setTitle: (route: RouteLocationNormalizedGeneric) => {
        const boardId = route.params.boardId as string;
        return `Word Wall - ${boardId.charAt(0).toUpperCase() + boardId.slice(1).replace(/-/g, ' ')}`;
      }
    },
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
