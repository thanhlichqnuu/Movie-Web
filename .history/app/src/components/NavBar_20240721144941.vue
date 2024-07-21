<script setup>
import { ref, computed, watch, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router"
import { useWindowSize } from "@vueuse/core";
import { useTheme } from "vuetify";
import { useStateThemeStore } from "@/stores/useStateThemeStore";
import { useLocaleStore } from "@/stores/useLocaleStore";
import sr from "@/util/speechRecognition";

const route = useRoute()
const themeStore = useStateThemeStore();
const localeStore = useLocaleStore();
const theme = useTheme();
const isShowDotMenu = ref(false)
const SearchBar = defineAsyncComponent(() => import('@/components/SearchBar.vue'))
const FilterMovie = defineAsyncComponent(() => import('@/components/FilterMovie.vue'))
const isShowSearchModal = ref(false)
const isShowFilterModal = ref(false);

const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 1024);

theme.global.name.value = themeStore.isDark ? "dark" : "light";

const toggleTheme = () => {
  themeStore.toggleTheme();
  theme.global.name.value = themeStore.isDark ? "dark" : "light";
};

const toggleDotMenu = () => {
  isShowDotMenu.value = !isShowDotMenu.value;
}

const openSearchModal = () => {
  isShowSearchModal.value = true
};

const closeSearchModal = () => {
  isShowSearchModal.value = false;
};

const openFilterModal = () => {
  isShowFilterModal.value = true
};

const closeFilterModal = () => {
  isShowFilterModal.value = false;
};

const changeLocale = (newLocale) => {
  localeStore.setLocale(newLocale);
};

const routeStatus = computed(() => ({
  isOnSectionMovie: route.name === 'Home',
  isOnMovieDetail: route.name === 'Detail',
  isOnPlayerModal: route.name === 'Player'
}));

watch(isShowSearchModal, (newValue) => {
  if (!newValue) {
    sr.stop();
  }
});
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
        <img src="../assets/logo.png" alt="logo" width="100px" height="auto" class="mt-1" />
      </router-link>

    
      <v-spacer />

      <template v-if="!isTabletAndMobile">
        <router-link :to="{ name: 'Anime' }" class="no-router-link_color">
          <v-btn>ANIME</v-btn>
        </router-link>
        <router-link
          :to="{ name: 'Movie' }"
          class="no-router-link_color"
        >
          <v-btn>{{ $t('singleMovie') }}</v-btn>
        </router-link>
        <router-link
          :to="{ name: 'Series' }"
          class="no-router-link_color"
        >
          <v-btn>{{ $t('seriesMovie') }}</v-btn>
        </router-link>
        <router-link
          :to="{ name: 'TV Show' }"
          class="no-router-link_color"
        >
          <v-btn>TV SHOW</v-btn>
        </router-link>
      </template>

      <v-btn icon @click="openSearchModal">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ themeStore.isDark ? "mdi-brightness-4" : "mdi-brightness-7" }}</v-icon>
      </v-btn>

      <v-btn v-show="localeStore.locale === 'EN'" @click="changeLocale('VI')"><img class="mr-1" src="../assets/flag_en.png" alt="flag" width="auto" height="20px" />EN</v-btn>  
      <v-btn v-show="localeStore.locale === 'VI'" @click="changeLocale('EN')"><img class="mr-1" src="../assets/flag_vi.png" alt="flag" width="auto" height="20px" />VI</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="isShowDotMenu" app temporary>
      <router-link
        :to="{ name: 'Anime' }"
        class="no-router-link_color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">ANIME</v-list-item-title>
        </v-list-item>
      </router-link>
      <router-link
        :to="{ name: 'Movie' }"
        class="no-router-link_color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">{{ $t('singleMovie') }}</v-list-item-title>
        </v-list-item>
      </router-link>
      <router-link
        :to="{ name: 'Series' }"
        class="no-router-link_color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">{{ $t('seriesMovie') }}</v-list-item-title>
        </v-list-item>
      </router-link>
      <router-link
        :to="{ name: 'TV Show' }"
        class="no-router-link_color text-decoration-none"
      >
        <v-list-item>
          <v-list-item-title class="text-button">TV SHOW</v-list-item-title>
        </v-list-item>
      </router-link>
      <v-list-item v-if="!routeStatus.isOnSectionMovie && " @click="openFilterModal">
        <v-list-item-title class="text-button">{{ $t('filter') }}</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>

    <v-dialog v-model="isShowSearchModal" max-width="750px" opacity="0.1">
      <v-card>
        <v-card-title>
          <search-bar class="w-100" @closeSearchModal="closeSearchModal" />
        </v-card-title>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isShowFilterModal" max-width="80%" opacity="0.1">
      <v-card>
        <v-card-title class="mt-n10 pa-0">
          <filter-movie @closeFilterModal="closeFilterModal"/>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.no-router-link_color {
  color: inherit;
}
</style>