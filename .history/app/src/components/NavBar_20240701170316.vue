<script setup>
import { useStateThemeStore } from "@/stores/useStateThemeStore";
import { useLocaleStore } from "@/stores/useLocaleStore";
import { ref, computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useTheme } from "vuetify";
import SearchBar from "./SearchBar.vue";

const themeStore = useStateThemeStore();
const localeStore = useLocaleStore();
const theme = useTheme();
const isShowDotMenu = ref(false)
const isShowSearchModal = ref(false)

const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 1024);

const toggleTheme = () => {
  themeStore.toggleTheme();
  theme.global.name.value = themeStore.isDark ? "light" : "dark";
};

const toggleDotMenu = () => {
  isShowDotMenu.value = !isShowDotMenu.value;
}

const toggleSearchModal = () => {
  isShowSearchModal.value = !isShowSearchModal.value
};

const closeSearchModal = () => {
  isShowSearchModal.value = false;
};

const changeLocale = (newLocale) => {
  localeStore.setLocale(newLocale);
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

      <router-link :to="{ name: 'Home' }" class="ml-3">
        <img src="../assets/logo.png" alt="logo" width="100%" height="100%" class="logo mt-1" />
      </router-link>

    
      <v-spacer />

      <template v-if="!isTabletAndMobile">
        <router-link :to="{ name: 'Anime' }" class="no-router-link-color">
          <v-btn>ANIME</v-btn>
        </router-link>
        <router-link
          :to="{ name: 'Movie' }"
          class="no-router-link-color"
        >
          <v-btn>{{ $t('singleMovie') }}</v-btn>
        </router-link>
        <router-link
          :to="{ name: 'Series' }"
          class="no-router-link-color"
        >
          <v-btn>{{ $t('seriesMovie') }}</v-btn>
        </router-link>
        <router-link
          :to="{ name: 'TV Show' }"
          class="no-router-link-color"
        >
          <v-btn>TV SHOW</v-btn>
        </router-link>
      </template>

      <v-btn icon id="btn-search" @click="toggleSearchModal">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon id="btn-theme" @click="toggleTheme">
        <v-icon>{{ themeStore.isDark ? "mdi-brightness-4" : "mdi-brightness-7" }}</v-icon>
      </v-btn>

      <v-btn v-if="localeStore.locale === 'EN'" @click="changeLocale('VI')"><img class="mr-1" src="../assets/flag_en.png" width="auto" height="20px" />EN</v-btn>  
      <v-btn v-if="localeStore.locale === 'VI'" @click="changeLocale('EN')"><img class="mr-1" src="../assets/flag_vi.png" width="auto" height="20px" />VI</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="isShowDotMenu" app temporary>
      <router-link
        :to="{ name: 'Anime' }"
        class="no-router-link-color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">ANIME</v-list-item-title>
        </v-list-item>
      </router-link>
      <router-link
        :to="{ name: 'Movie' }"
        class="no-router-link-color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">{{ $t('singleMovie') }}</v-list-item-title>
        </v-list-item>
      </router-link>
      <router-link
        :to="{ name: 'Series' }"
        class="no-router-link-color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">{{ $t('seriesMovie') }}</v-list-item-title>
        </v-list-item>
      </router-link>
      <router-link
        :to="{ name: 'TV Show' }"
        class="no-router-link-color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">TV SHOW</v-list-item-title>
        </v-list-item>
      </router-link>
    </v-navigation-drawer>

    <v-dialog v-model="isShowSearchModal" max-width="800px" opacity="0.1">
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
