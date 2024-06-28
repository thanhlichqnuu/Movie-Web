<script setup>
import { useStateThemeStore } from "@/stores/useStateThemeStore";
import { ref, computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useTheme } from "vuetify";
import SearchBar from "./SearchBar.vue";

const store = useStateThemeStore();
const theme = useTheme();
const isShowDotMenu = ref(false)
const isShowSearchModal = ref(false)

const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 768);
const isMobile = computed(() => windowWidth.value < 640);

const toggleTheme = () => {
  store.toggleTheme();
  theme.global.name.value = store.isDark ? "light" : "dark";
};

const toggleDotMenu = () => {
  isShowDotMenu.value = !isShowDotMenu.value;
}

const toggleSearchModal = () => {
  isShowSearchModal.value = !isShowSearchModal;
};

const closeSearchModal = () => {
  this.isShowSearchModal = false;
};
</script>

<template>
  <div>
    <v-app-bar
      class="nav"
      density="compact"
      style="position: absolute"
      color="transparent"
      app
    >
      <v-app-bar-nav-icon
        v-if="isTabletAndMobile"
        class="mr-n5"
        @click="toggleDotMenu"
      />

      <router-link :to="{ name: 'home-route' }" class="ml-3">
        <img src="../assets/logo.png" class="logo mt-1" />
      </router-link>

      <router-link
        v-if="!isMobile"
        :to="{ name: 'home-route' }"
        class="no-router-link-color text-decoration-none ml-n3"
      >
        <v-toolbar-title class="text-subtitle-1">Mọt Phim Mới</v-toolbar-title>
      </router-link>
      <v-spacer />

      <template v-if="!isTabletAndMobile">
        <router-link :to="{ name: 'anime-route' }" class="no-router-link-color">
          <v-btn>ANIME</v-btn>
        </router-link>
        <router-link
          :to="{ name: 'singleMovie-route' }"
          class="no-router-link-color"
        >
          <v-btn>PHIM LẺ</v-btn>
        </router-link>
        <router-link
          :to="{ name: 'seriesMovie-route' }"
          class="no-router-link-color"
        >
          <v-btn>PHIM BỘ</v-btn>
        </router-link>
      </template>

      <v-btn icon @click="toggleSearchModal">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ store.isDark ? "mdi-brightness-4" : "mdi-brightness-7" }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="isShowDotMenu" app temporary>
      <router-link
        :to="{ name: 'anime-route' }"
        class="no-router-link-color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">ANIME</v-list-item-title>
        </v-list-item>
      </router-link>
      <router-link
        :to="{ name: 'singleMovie-route' }"
        class="no-router-link-color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">PHIM LẺ</v-list-item-title>
        </v-list-item>
      </router-link>
      <router-link
        :to="{ name: 'seriesMovie-route' }"
        class="no-router-link-color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">PHIM BỘ</v-list-item-title>
        </v-list-item>
      </router-link>
    </v-navigation-drawer>

    <v-dialog v-model="store.isShowSearchModal" max-width="800px" opacity="0.1">
      <v-card>
        <v-card-title>
          <search-bar class="w-100" @close-modal="closeSearchModal" />
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.no-router-link-color {
  color: inherit;
}

.logo {
  width: 100px;
  height: auto;
}
</style
