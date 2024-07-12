<script setup>
import { onMounted, ref } from "vue";
import { useFacebookStore } from "@/stores/useFacebookStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const facebookStore = useFacebookStore();
const props = defineProps({
  href: {
    type: String,
    required: true,
  },
});

const contentReady = ref(false);

onMounted(async () => {
  await facebookStore.initFacebookComments();
  contentReady.value = true;
});
</script>

<template>
  <div :class="{ 'content-hidden': !contentReady }">
    <div>
      <h3 class="d-flex justify-start animate-charcter">
        {{ t('QA') }}
      </h3>
      <div class="line" />
    </div>
    <div class="fb-comments" :data-href="href" data-width="100%" data-numposts="5"></div>
  </div>
</template>

<style scoped>
.content-hidden {
  display: none;
}
.line {
  border: 1px solid #b5e745;
  width: 100%;
}
</style>
