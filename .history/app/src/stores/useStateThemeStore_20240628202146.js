// useStateThemeStore.js
import { defineStore } from "pinia";

export const useStateThemeStore = defineStore("stateTheme", {
  state: () => ({
    isDark: false,
    isShowSearchModal: false,
    isShowDotMenu: false,
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
    },
    toggleSearchModal() {
      this.isShowSearchModal = !this.isShowSearchModal;
    },
    closeSearchModal() {
      this.isShowSearchModal = false;
    },
    toggleDotMenu() {
      this.isShowDotMenu = !this.isShowDotMenu;
    },
  },
});
