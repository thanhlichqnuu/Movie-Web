import { createWebHistory, createRouter } from "vue-router";
import Index from "@/pages/index.vue";
import Anime from "@/pages/anime.vue";
import SingleMovie from "@/pages/singlemovie.vue";
import Detail from "@/pages/detail.vue";
import NotFound from "@/pages/notfound.vue";
import Player from "@/pages/player.vue";
import SeriesMovie from "@/pages/seriesmovie.vue";

const routes = [
  {
    path: "/",
    name: "home-route",
    component: Index,
  },
  {
    path: "/anime",
    name: "anime-route",
    component: Anime,
  },
  {
    path: "/phim-le",
    name: "singleMovie-route",
    component: SingleMovie,
  },
  {
    path: "/phim-bo",
    name: "seriesMovie-route",
    component: SeriesMovie,
  },
  {
    path: "/:slugMovie",
    name: "detail-route",
    component: Detail,
    props: true,
  },
  {
    path: "/:slugMovie/:slugEpisode",
    name: "player-route",
    component: Player,
    props: true,
    beforeEnter: (to, from, next) => {
      const slugEpisode = to.params.slugEpisode;
      if (!slugEpisode.includes("tap")) {
        to.params.slugEpisode = `tap-${slugEpisode}`;
      }
      next();
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404-route",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
