import { defineStore } from 'pinia';

export const useLocaleStore = defineStore('localeStore', {
  state: () => ({
    locale: 'VI',
  }),
  actions: {
    setLocale(newLocale) {
      this.locale = newLocale;
      localStorage.setItem("localeKey", this.locale);
    }
  }
});
