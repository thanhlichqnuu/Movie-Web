<script setup>
import { onMounted } from "vue";
import { useFacebookStore } from "@/stores/useFacebookStore";

const facebookStore = useFacebookStore();
const props = defineProps({
  href: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  facebookStore.initFacebookComments();
});
</script>

<template>
  <div>
    <div
      class="fb-comments"
      :data-href="href"
      data-width="100%"
      data-numposts="5"
    ></div>
  </div>
</template>

<style scoped>
.facebook-comments .fb-comments {
  background-color: white; /* Đặt màu nền cố định */
  color: black; /* Đặt màu chữ cố định */
  /* Thêm các kiểu dáng khác nếu cần */
}
</style>
