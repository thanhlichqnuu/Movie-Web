import { defineStore } from "pinia";

export const useLocaleStore = defineStore("localeStore", {
  state: () => ({
    locale: localStorage.getItem('locale') || 'VI',
  }),
  actions: {
    setLocale(locale) {
      this.locale = locale;
      localStorage.setItem('locale', locale);
    }
  }
});
