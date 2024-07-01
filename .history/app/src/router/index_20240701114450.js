import { createWebHistory, createRouter } from "vue-router";
import Index from "@/pages/index.vue";
import Anime from "@/pages/anime.vue";
import SingleMovie from "@/pages/singlemovie.vue";
import Detail from "@/pages/detail.vue";
import NotFound from "@/pages/notfound.vue";
import Player from "@/pages/player.vue";
import SeriesMovie from "@/pages/seriesmovie.vue";
import TvShow from "@/pages/tvshow.vue"

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
    component: Anime,
    meta: {
      title: `Danh Sách Anime Đầy Đủ Nhất | Tổng Hợp Những Anime Hay | Anime Mới Nhất ${currentYear}`
    }
  },
  {
    path: "/phim-le",
    name: "Movie",
    component: SingleMovie,
    meta: {
      title: `Danh Sách Phim Lẻ Đầy Đủ Nhất | Tổng Hợp Những Phim Lẻ Hay | Phim Lẻ Mới Nhất ${currentYear}`
    }
  },
  {
    path: "/phim-bo",
    name: "Series",
    component: SeriesMovie,
    meta: {
      title: `Danh Sách Phim Bộ Đầy Đủ Nhất | Tổng Hợp Những Phim Bộ Hay | Phim Bộ Mới Nhất ${currentYear}`
    }
  },
  {
    path: "/tv-show",
    name: "TV Show",
    component: TvShow,
    meta: {
      title: `Danh Sách TV Show Đầy Đủ Nhất | Tổng Hợp Những TV Show Hay | TV Show Mới Nhất ${currentYear}`
    }
  },
  {
    path: "/phim/:slugMovie",
    name: "Detail",
    component: Detail,
    props: true,
  },
  {
    path: "/phim/:slugMovie/:slugEpisode",
    name: "Player",
    component: Player,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404-route",
    component: NotFound,
    meta: {
      title: "404"
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  document.title = to.meta?.title ?? 'Mọt Phim Mới - motphimmoi.com'
})

export default router;
