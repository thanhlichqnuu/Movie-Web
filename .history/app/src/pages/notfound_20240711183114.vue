<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useTheme } from "vuetify";
import {useRouter}

const theme = useTheme();
const originalTheme = theme.global.name.value;

onMounted(() => {
  theme.global.name.value = "light";
});

onBeforeUnmount(() => {
  theme.global.name.value = originalTheme;
});
</script>

<template>
  <v-container class="page_404 pt-13">
    <v-row>
      <v-col cols="12">
        <v-col cols="10" offset="1" class="text-center">
          <div class="image">
            <div class="text-h2 font-weight-medium">404</div>
          </div>
          <div class="mt-n8">
            <div class="text-h5">Looks Like You're Lost</div>
            <p>The page you are looking for is not available</p>
            <v-btn
              color="success mt-5"
              @click="$router.push({ name: 'Home' })"
            >
              Go to Home
            </v-btn>
          </div>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.image {
  background: url("../assets/bg.gif") no-repeat center;
  height: 400px;
}
</style>
