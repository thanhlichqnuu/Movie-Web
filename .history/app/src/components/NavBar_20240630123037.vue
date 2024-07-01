<script setup>
import { useStateThemeStore } from "@/stores/useStateThemeStore";
import { ref, computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";
import SearchBar from "./SearchBar.vue";

const store = useStateThemeStore();
const theme = useTheme();
const isShowDotMenu = ref(false)
const isShowSearchModal = ref(false)
const { t, locale } = useI18n();
const currentLanguage = ref
const { width: windowWidth } = useWindowSize();
const isTabletAndMobile = computed(() => windowWidth.value < 768);

const toggleTheme = () => {
  store.toggleTheme();
  theme.global.name.value = store.isDark ? "light" : "dark";
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

const changeLanguage = (lang) => {
  locale.value = lang;
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

    
      <v-spacer />

      <template v-if="!isTabletAndMobile">
        <router-link :to="{ name: 'anime-route' }" class="no-router-link-color">
          <v-btn>{{ t('anime') }}</v-btn>
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
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <img :src="currentLanguage === 'VI' ? '../assets/flag_vi.png' : '../assets/flag_en.png'" alt="flag" class="flag-icon" />
            <span>{{ currentLanguage }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="changeLanguage('EN')">
            <v-list-item-title>
              <img src="../assets/flag_en.png" alt="English Flag" class="flag-icon" />
              English
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="changeLanguage('VI')">
            <v-list-item-title>
              <img src="../assets/flag_vi.png" alt="Vietnamese Flag" class="flag-icon" />
              Tiếng Việt
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
