import { createWebHistory, createRouter } from "vue-router";
import Index from "@/pages/index.vue";
import Anime from "@/pages/anime.vue";
import SingleMovie from "@/pages/singlemovie.vue";
import Detail from "@/pages/detail.vue";
import NotFound from "@/pages/notfound.vue";
import Player from "@/pages/player.vue";
import SeriesMovie from "@/pages/seriesmovie.vue";
import { addTapPrefixToEpisode } from "@/router/middleware";

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
    path: "/phim/:slugMovie/:slugEpisode",
    name: "player-route",
    component: Player,
    beforeEnter: addTapPrefixToEpisode,
    props: true
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
