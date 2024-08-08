import { createWebHistory, createRouter } from "vue-router";
import Index from "@/pages/index.vue";

const currentYear = new Date().getFullYear();

const routes = [
  {
    path: "/",
    name: "Home",
    component: Index,
  },
  {
    path: "/anime",
    name: "Anime",
    component: () => import("@/pages/anime.vue"),
    meta: {
      title: `Danh Sách Anime Đầy Đủ Nhất | Tổng Hợp Những Anime Hay | Anime Mới Nhất ${currentYear}`,
    },
  },
  {
    path: "/phim-le",
    name: "Movie",
    component: () => import("@/pages/singlemovie.vue"),
    meta: {
      title: `Danh Sách Phim Lẻ Đầy Đủ Nhất | Tổng Hợp Những Phim Lẻ Hay | Phim Lẻ Mới Nhất ${currentYear}`,
    },
  },
  {
    path: "/phim-bo",
    name: "Series",
    component: () => import("@/pages/seriesmovie.vue"),
    meta: {
      title: `Danh Sách Phim Bộ Đầy Đủ Nhất | Tổng Hợp Những Phim Bộ Hay | Phim Bộ Mới Nhất ${currentYear}`,
    },
  },
  {
    path: "/tv-show",
    name: "TV Show",
    component: () => import("@/pages/tvshow.vue"),
    meta: {
      title: `Danh Sách TV Show Đầy Đủ Nhất | Tổng Hợp Những TV Show Hay | TV Show Mới Nhất ${currentYear}`,
    },
  },
  {
    path: "/:slugMovie",
    name: "Detail",
    component: () => import("@/pages/detail.vue"),
    props: true,
  },
  {
    path: "/:slugMovie/:slugEpisode",
    name: "Player",
    component: () => import("@/pages/player.vue"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/pages/notfound.vue"),
    meta: {
      title: "404",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  document.title = to.meta?.title ?? "Ghiền Phim - ghienphim.fun";
});

export default router;
