import { createRouter, createWebHistory, RouteLocationNormalizedGeneric, RouterOptions } from "vue-router";
import { getBoardByPath } from "../db/turso";
import AddBoardPage from "../pages/AddBoardPage.vue";
import BoardListPage from "../pages/BoardListPage.vue";
import BoardPage from "../pages/BoardPage.vue";

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
    name: "Boards",
    component: BoardListPage,
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
