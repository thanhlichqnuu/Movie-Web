<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMovieStore } from "@/stores/useMovieStore";

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const movieStore = useMovieStore();

const movies = computed(() => movieStore.movies[props.apiKey] || []);

const navigateToDetail = (slug) => router.push({ name: "detail-route", params: { slugMovie: slug } });

onMounted(() => {
  movieStore.getMovies(props.apiKey);
});
</script>
