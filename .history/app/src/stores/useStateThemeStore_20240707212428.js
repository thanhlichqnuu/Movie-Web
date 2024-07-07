import { defineStore } from "pinia";

export const useStateThemeStore = defineStore("stateTheme", {
  state: () => ({
    isDark: localStorage.getItem("theme") === "dark",
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem("theme", this.isDark ? "dark" : "light");
    },
    // Thêm một action để khởi tạo theme từ localStorage khi cần thiết
    initializeTheme() {
      this.isDark = localStorage.getItem("theme") === "dark";
    },
  },
});
