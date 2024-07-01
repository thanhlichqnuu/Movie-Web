<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import TrailerModal from "../components/TrailerModal";
import { toast } from "vue3-toastify";
import sanitizeHtml from "sanitize-html";
import { useFacebookStore } from "@/stores/useFacebookStore";
import { get, set } from "idb-keyval";

const route = useRoute();
const router = useRouter();
const facebookStore = useFacebookStore();
const movie = ref(null);
const isShowTrailer = ref(false);

const getMovieDetail = async (slugMovie) => {
  try {
    const cacheKey = `movie_detail_${slugMovie}`;
    const cachedMovie = await get(cacheKey);
    if (cachedMovie) {
      movie.value = cachedMovie;
      return;
    }

    const { data } = await axios.get(`https://ophim1.com/phim/${slugMovie}`);
    data.movie.content = sanitizeHtml(data.movie.content, {
      allowedTags: [],
      allowedAttributes: {},
    });
    movie.value = data;
    set(cacheKey, data);
  } catch {
    toast.error("Không thể tải thông tin phim!");
  }
};

watch(
  () => route.params.slugMovie,
  async (newSlugMovie) => {
    movie.value = null;
    await getMovieDetail(newSlugMovie);
    window.scrollTo({ top: 0, behavior: "instant" });
  },
  { immediate: true }
);

const loadTrailer = () => {
  if (!movie.value.movie?.trailer_url) {
    toast.error("Trailer hiện không có sẵn!");
    return;
  }
  isShowTrailer.value = true;
};

const loadMovie = () => {
  const first_episode = movie.value.episodes?.[0]?.server_data?.[0];
  if (!first_episode) {
    toast.error("Tập phim hiện không có sẵn!");
    return;
  }

  router.push({
    name: "player-route",
    params: {
      slugMovie: movie.value.movie.slug,
      slugEpisode: first_episode.slug,
    },
  });
};

watch(
  movie,
  (newMovie) => {
    if (newMovie?.movie.name && newMovie?.movie.origin_name) {
      document.title = `${newMovie.movie.name} - ${newMovie.movie.origin_name}`;
    }
  },
  { immediate: true }
);

onMounted(facebookStore.initFacebookComments);
</script>


.text-green-light {
  color: #b5e745;
}

.text-dim-gray {
  color: #e0e0e0;
}
</style>
