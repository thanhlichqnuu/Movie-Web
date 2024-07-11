<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useStateThemeStore } from "@/stores/useStateThemeStore";
import { useMovieStore } from "@/stores/useMovieStore";

const { t } = useI18n();
const movieLabel = computed(() => t("singleMovie"));
const seriesLabel = computed(() => t("seriesMovie"));
const themeStore = useStateThemeStore();
const movieStore = useMovieStore();
const isLoading = ref(false);

const tabs = ref([
  {
    name: "Anime",
    key: "animes",
  },
  {
    name: movieLabel,
    key: "singleMovies",
  },
  {
    name: seriesLabel,
    key: "seriesMovies",
  },
  {
    name: "TV Show",
    key: "tvShows",
  },
]);

const router = useRouter();
const currentTab = ref(tabs.value[0].name);
const movies = ref([]);

const getMovies = async (key) => {
  isLoading.value = true;
  await movieStore.fetchMoviesIfNotExist(key);
  movies.value = movieStore.movies[key];
  isLoading.value = false;
};

getMovies(tabs.value[0].key);

const changeTab = (tab) => {
  currentTab.value = tab.name;
  tabs.value.forEach((t) => (t.isActive = t.name === tab.name));
  getMovies(tab.key);
};

const navigateToDetail = (slug) => {
  router.push({ name: "Detail", params: { slugMovie: slug } });
};
</script>
