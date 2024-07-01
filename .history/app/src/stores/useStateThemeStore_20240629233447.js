import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStateThemeStore = defineStore('stateTheme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark');

  const setDarkTheme = () => {
    isDark.value = true;
    localStorage.setItem('theme', 'dark');
  };

  const setLightTheme = () => {
    isDark.value = false;
    localStorage.setItem('theme', 'light');
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  };

  return {
    isDark,
    setDarkTheme,
    setLightTheme,
    toggleTheme,
  };
});
